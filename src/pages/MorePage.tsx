import { useLanguage } from '@/i18n/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Globe, Moon, Sun, Info, Download, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MorePage = () => {
  const { t, lang, toggleLang } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="px-4 pt-6 space-y-4">
      <h1 className="text-xl font-bold text-foreground mb-6">{t.nav.more}</h1>

      <button
        onClick={toggleLang}
        className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border/50"
      >
        <Globe className="h-5 w-5 text-accent" />
        <div className="flex-1 text-start">
          <p className="font-medium text-foreground">{t.settings.language}</p>
          <p className="text-sm text-muted-foreground">{lang === 'ar' ? t.settings.arabic : t.settings.english}</p>
        </div>
      </button>

      <button
        onClick={toggleTheme}
        className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border/50"
      >
        {isDark ? <Sun className="h-5 w-5 text-accent" /> : <Moon className="h-5 w-5 text-accent" />}
        <div className="flex-1 text-start">
          <p className="font-medium text-foreground">{t.settings.darkMode}</p>
          <p className="text-sm text-muted-foreground">{isDark ? 'ON' : 'OFF'}</p>
        </div>
      </button>

      <button
        onClick={() => navigate('/downloads')}
        className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border/50"
      >
        <Download className="h-5 w-5 text-accent" />
        <div className="flex-1 text-start">
          <p className="font-medium text-foreground">{t.downloads.title}</p>
          <p className="text-sm text-muted-foreground">{lang === 'ar' ? 'تحميل السور للاستماع بدون إنترنت' : 'Download surahs for offline listening'}</p>
        </div>
      </button>

      <button
        onClick={() => navigate('/duas')}
        className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border/50"
      >
        <BookOpen className="h-5 w-5 text-accent" />
        <div className="flex-1 text-start">
          <p className="font-medium text-foreground">{lang === 'ar' ? 'الأدعية' : 'Duas'}</p>
          <p className="text-sm text-muted-foreground">{lang === 'ar' ? 'أدعية قرآنية ونبوية وعامة' : 'Quranic, Prophetic & General Duas'}</p>
        </div>
      </button>

      <div className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border/50">
        <Info className="h-5 w-5 text-accent" />
        <div className="flex-1 text-start">
          <p className="font-medium text-foreground">{t.app.name}</p>
          <p className="text-sm text-muted-foreground">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default MorePage;
