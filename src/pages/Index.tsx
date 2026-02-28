import { BookOpen, Moon, Sun, Clock, Globe, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';

const dailyVerseAr = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ';
const dailyVerseEn = 'In the name of Allah, the Most Gracious, the Most Merciful. All praise is due to Allah, Lord of the worlds.';
const dailyDhikrAr = 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ';
const dailyDhikrEn = 'Glory be to Allah and praise Him, Glory be to Allah the Almighty';

const Index = () => {
  const { t, lang, toggleLang, isRtl } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { nextPrayerKey, countdown, prayers } = usePrayerTimes();

  const prayerNameMap: Record<string, { ar: string; en: string }> = {
    Fajr: { ar: 'الفجر', en: 'Fajr' }, Sunrise: { ar: 'الشروق', en: 'Sunrise' },
    Dhuhr: { ar: 'الظهر', en: 'Dhuhr' }, Asr: { ar: 'العصر', en: 'Asr' },
    Maghrib: { ar: 'المغرب', en: 'Maghrib' }, Isha: { ar: 'العشاء', en: 'Isha' },
  };
  const nextName = nextPrayerKey ? prayerNameMap[nextPrayerKey]?.[lang] || nextPrayerKey : '';
  const nextTime = nextPrayerKey ? prayers.find(p => p.key === nextPrayerKey)?.time || '' : '';

  const quickLinks = [
    { icon: Sun, label: t.home.morningAzkar, path: '/azkar', color: 'from-amber-500/20 to-yellow-500/10' },
    { icon: Moon, label: t.home.eveningAzkar, path: '/azkar', color: 'from-indigo-500/20 to-blue-500/10' },
    { icon: BookOpen, label: t.home.readQuran, path: '/quran', color: 'from-emerald-500/20 to-green-500/10' },
    { icon: Clock, label: t.home.prayerTimes, path: '/prayer', color: 'from-rose-500/20 to-pink-500/10' },
    { icon: Heart, label: t.home.tasbih, path: '/azkar', color: 'from-purple-500/20 to-violet-500/10' },
    { icon: Globe, label: t.home.bookmarks, path: '/quran', color: 'from-cyan-500/20 to-teal-500/10' },
  ];

  return (
    <div className="px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient-gold">{t.app.name}</h1>
          <p className="text-sm text-muted-foreground">{t.app.tagline}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            {lang === 'ar' ? 'En' : 'ع'}
          </button>
          <button
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Greeting */}
      <div className="gradient-emerald rounded-2xl p-5 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative">
          <p className="text-lg font-semibold">{t.home.greeting} 👋</p>
          <p className="text-sm opacity-90 mt-1">
            {t.home.nextPrayer}: {nextName ? `${nextName} - ${nextTime}` : (lang === 'ar' ? 'جارٍ التحميل...' : 'Loading...')}
          </p>
        </div>
      </div>

      {/* Daily Verse */}
      <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">{t.home.dailyVerse}</h2>
        <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm">
          <p className={cn('font-quran text-xl leading-loose text-foreground', isRtl ? 'text-right' : 'text-left')}>
            {lang === 'ar' ? dailyVerseAr : dailyVerseEn}
          </p>
          {lang === 'ar' && (
            <p className="text-xs text-muted-foreground mt-3 text-right">سورة الفاتحة - الآيات 1-2</p>
          )}
        </div>
      </section>

      {/* Daily Dhikr */}
      <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">{t.home.dailyDhikr}</h2>
        <div className="gradient-gold rounded-2xl p-5 shadow-sm">
          <p className={cn('font-quran text-lg leading-relaxed text-accent-foreground font-bold', isRtl ? 'text-right' : 'text-left')}>
            {lang === 'ar' ? dailyDhikrAr : dailyDhikrEn}
          </p>
        </div>
      </section>

      {/* Quick Access */}
      <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">{t.home.quickAccess}</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickLinks.map(({ icon: Icon, label, path, color }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/30 bg-gradient-to-br transition-all duration-200 hover:scale-[1.03] active:scale-95',
                color
              )}
            >
              <Icon className="h-6 w-6 text-foreground" />
              <span className="text-xs font-medium text-foreground text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
