import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { normalizeLanguage } from '@/i18n/config';

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const activeCode = normalizeLanguage(i18n.resolvedLanguage || i18n.language);
  const currentLanguage = languages.find((lang) => lang.code === activeCode) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 px-2"
          aria-label={`${t('header.language')} (${currentLanguage.name})`}
        >
          <Languages className="h-5 w-5" aria-hidden="true" />
          <span aria-hidden="true">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border-border z-50">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => i18n.changeLanguage(language.code)}
            lang={language.code}
            className={`cursor-pointer ${activeCode === language.code ? 'bg-accent text-accent-foreground' : ''}`}
          >
            <span className="mr-2" aria-hidden="true">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
