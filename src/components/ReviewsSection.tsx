import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Camera, Loader2, Star, Upload } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

type Review = {
  id: string;
  author_name: string;
  comment: string;
  photo_url: string | null;
  rating: number;
  created_at: string;
};

const fetchReviews = async (): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, author_name, comment, photo_url, rating, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
};

const StarRating = ({
  value,
  onChange,
  readOnly = false,
}: {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}) => (
  <div className="flex gap-1" role={readOnly ? 'img' : 'radiogroup'} aria-label={`${value} / 5`}>
    {Array.from({ length: 5 }, (_, index) => {
      const star = index + 1;
      const icon = (
        <Star
          className={`h-5 w-5 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/40'}`}
          aria-hidden="true"
        />
      );
      if (readOnly) return <span key={star}>{icon}</span>;
      return (
        <button key={star} type="button" onClick={() => onChange?.(star)} aria-label={`${star}`}>
          {icon}
        </button>
      );
    })}
  </div>
);

export const ReviewsSection = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [authorName, setAuthorName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [photo, setPhoto] = useState<File | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!photo) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
    staleTime: 1000 * 30,
  });

  const schema = z.object({
    authorName: z.string().trim().min(2, t('reviews.nameMin')).max(80, t('reviews.nameMax')),
    comment: z.string().trim().min(10, t('reviews.commentMin')).max(600, t('reviews.commentMax')),
    rating: z.number().int().min(1).max(5),
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting || honeypot) return;

    const parsed = schema.safeParse({ authorName, comment, rating });
    if (!parsed.success) {
      toast.error(t('reviews.validationTitle'), { description: parsed.error.errors[0].message });
      return;
    }
    if (photo && (!ALLOWED_TYPES.includes(photo.type) || photo.size > MAX_PHOTO_BYTES)) {
      toast.error(t('reviews.photoError'));
      return;
    }

    setIsSubmitting(true);
    try {
      let photoUrl: string | null = null;
      if (photo) {
        const extension = photo.name.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from('review-photos').upload(path, photo, {
          contentType: photo.type,
          upsert: false,
        });
        if (uploadError) throw uploadError;
        photoUrl = supabase.storage.from('review-photos').getPublicUrl(path).data.publicUrl;
      }

      const { error } = await supabase.from('reviews').insert([
        {
          author_name: parsed.data.authorName,
          comment: parsed.data.comment,
          rating: parsed.data.rating,
          photo_url: photoUrl,
        },
      ]);
      if (error) throw error;

      toast.success(t('reviews.success'));
      setAuthorName('');
      setComment('');
      setRating(5);
      setPhoto(null);
      await queryClient.invalidateQueries({ queryKey: ['reviews'] });
    } catch (error) {
      console.error('Review submit error:', error);
      toast.error(t('reviews.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="resenas" className="bg-texture-warm py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center animate-fade-in-up">
          <h2 className="text-section-title">{t('reviews.title')}</h2>
          <p className="mx-auto max-w-2xl text-lg text-warm">{t('reviews.subtitle')}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card-warm mx-auto mb-16 max-w-2xl hover:!translate-y-0"
          noValidate
        >
          <h3 className="mb-6 font-playfair text-2xl font-semibold">{t('reviews.formTitle')}</h3>
          <div className="hidden" aria-hidden="true">
            <label>
              website
              <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </label>
          </div>

          <div className="mb-4 space-y-2">
            <label htmlFor="review-name" className="text-sm font-medium">
              {t('reviews.name')}
            </label>
            <Input
              id="review-name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              maxLength={80}
              required
            />
          </div>

          <div className="mb-4 space-y-2">
            <span className="text-sm font-medium">{t('reviews.rating')}</span>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div className="mb-4 space-y-2">
            <label htmlFor="review-comment" className="text-sm font-medium">
              {t('reviews.comment')}
            </label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={600}
              rows={4}
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 flex cursor-pointer items-center gap-2 text-sm font-medium text-primary">
              <Camera className="h-4 w-4" aria-hidden="true" />
              {t('reviews.photo')}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              />
            </label>
            <p className="text-xs text-muted-foreground">{t('reviews.photoHint')}</p>
            {previewUrl && (
              <img src={previewUrl} alt="" className="mt-3 h-32 w-32 rounded-lg object-cover" />
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="btn-hero w-full hover:!scale-100">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                {t('reviews.sending')}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" aria-hidden="true" />
                {t('reviews.submit')}
              </>
            )}
          </Button>
        </form>

        {isLoading ? (
          <div className="flex justify-center py-8 text-warm">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            {t('reviews.loading')}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-lg text-warm">{t('reviews.empty')}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <article key={review.id} className="card-warm overflow-hidden p-0 hover:!translate-y-0">
                {review.photo_url && (
                  <img
                    src={review.photo_url}
                    alt={t('reviews.photoAlt', { name: review.author_name })}
                    className="h-56 w-full object-cover"
                  />
                )}
                <div className="p-5">
                  <StarRating value={review.rating} readOnly />
                  <p className="mt-3 text-warm">{review.comment}</p>
                  <p className="mt-4 font-semibold text-foreground">{review.author_name}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
