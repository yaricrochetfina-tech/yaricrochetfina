import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/** Límite de peticiones distribuido (función SQL `check_rate_limit`). Si falla la base de datos, se deja pasar. */
export const checkRateLimit = async (
  supabaseUrl: string,
  supabaseKey: string,
  identifier: string,
  action: string,
  maxRequests: number,
  windowSeconds: number
): Promise<RateLimitResult> => {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_identifier: identifier,
      p_action_type: action,
      p_max_requests: maxRequests,
      p_window_seconds: windowSeconds,
    });

    if (error || !data) {
      console.error('Rate limit check error:', error);
      return { allowed: true, remaining: maxRequests, resetAt: 0 };
    }

    return { allowed: data.allowed, remaining: data.remaining, resetAt: data.reset_at };
  } catch (err) {
    console.error('Rate limit check exception:', err);
    return { allowed: true, remaining: maxRequests, resetAt: 0 };
  }
};

export const getClientIp = (req: Request): string =>
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  req.headers.get('x-real-ip') ||
  'unknown';
