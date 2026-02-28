import { useState, useCallback } from 'react';
import { Moon, Sun, Sunrise, BookOpen, BedDouble, RotateCcw, Check, Minus, Plus } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { azkarData, type AzkarCategory, type Dhikr } from '@/data/azkar';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const categoryConfig: { key: AzkarCategory; icon: typeof Sun; colorClass: string }[] = [
  { key: 'morning', icon: Sunrise, colorClass: 'gradient-gold' },
  { key: 'evening', icon: Moon, colorClass: 'gradient-emerald' },
  { key: 'afterPrayer', icon: BookOpen, colorClass: 'gradient-gold' },
  { key: 'sleep', icon: BedDouble, colorClass: 'gradient-emerald' },
  { key: 'wakeup', icon: Sun, colorClass: 'gradient-gold' },
];

type ViewMode = 'categories' | 'azkar' | 'tasbih';

const AzkarPage = () => {
  const { t, lang } = useLanguage();
  const [view, setView] = useState<ViewMode>('categories');
  const [activeCategory, setActiveCategory] = useState<AzkarCategory>('morning');
  const [counters, setCounters] = useState<Record<number, number>>({});
  const [tasbihCount, setTasbihCount] = useState(0);
  const [tasbihTarget, setTasbihTarget] = useState(33);
  const [tasbihText, setTasbihText] = useState<'subhan' | 'alhamd' | 'allahu'>('subhan');

  const tasbihOptions = {
    subhan: { ar: 'سُبْحَانَ اللَّهِ', en: 'SubhanAllah' },
    alhamd: { ar: 'الْحَمْدُ لِلَّهِ', en: 'Alhamdulillah' },
    allahu: { ar: 'اللَّهُ أَكْبَرُ', en: 'Allahu Akbar' },
  };

  const getCount = (id: number) => counters[id] || 0;

  const increment = useCallback((id: number) => {
    setCounters(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const resetCounter = useCallback((id: number) => {
    setCounters(prev => ({ ...prev, [id]: 0 }));
  }, []);

  const resetAll = useCallback(() => {
    setCounters({});
  }, []);

  const openCategory = (cat: AzkarCategory) => {
    setActiveCategory(cat);
    setView('azkar');
  };

  const getCategoryLabel = (key: AzkarCategory) => {
    const labels: Record<AzkarCategory, string> = {
      morning: t.azkar.morning,
      evening: t.azkar.evening,
      afterPrayer: t.azkar.afterPrayer,
      sleep: t.azkar.sleep,
      wakeup: t.azkar.wakeup,
    };
    return labels[key];
  };

  const azkarList = azkarData[activeCategory];
  const completedCount = azkarList?.filter(d => getCount(d.id) >= d.repeat).length || 0;
  const totalCount = azkarList?.length || 0;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Categories view
  if (view === 'categories') {
    return (
      <div className="px-4 pt-6 pb-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-gold flex items-center justify-center">
            <Moon className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t.azkar.title}</h1>
            <p className="text-xs text-muted-foreground">
              {lang === 'ar' ? 'اختر نوع الأذكار' : 'Choose azkar category'}
            </p>
          </div>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 gap-3">
          {categoryConfig.map(({ key, icon: Icon, colorClass }) => (
            <button
              key={key}
              onClick={() => openCategory(key)}
              className="bg-card rounded-2xl border border-border/50 p-5 text-center hover:border-accent/50 hover:shadow-md transition-all active:scale-[0.97] space-y-3"
            >
              <div className={cn('h-12 w-12 rounded-xl mx-auto flex items-center justify-center', colorClass)}>
                <Icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <p className="font-semibold text-foreground text-sm">{getCategoryLabel(key)}</p>
              <p className="text-xs text-muted-foreground">
                {azkarData[key].length} {lang === 'ar' ? 'ذكر' : 'adhkar'}
              </p>
            </button>
          ))}

          {/* Tasbih counter card */}
          <button
            onClick={() => setView('tasbih')}
            className="bg-card rounded-2xl border border-border/50 p-5 text-center hover:border-accent/50 hover:shadow-md transition-all active:scale-[0.97] space-y-3 col-span-2"
          >
            <div className="h-12 w-12 rounded-xl mx-auto gradient-emerald flex items-center justify-center">
              <span className="text-2xl">📿</span>
            </div>
            <p className="font-semibold text-foreground text-sm">{t.azkar.counter}</p>
            <p className="text-xs text-muted-foreground">
              {lang === 'ar' ? 'عداد التسبيح الرقمي' : 'Digital Tasbeeh Counter'}
            </p>
          </button>
        </div>
      </div>
    );
  }

  // Tasbih counter view
  if (view === 'tasbih') {
    const currentTasbih = tasbihOptions[tasbihText];
    const tasbihProgress = tasbihTarget > 0 ? Math.min((tasbihCount / tasbihTarget) * 100, 100) : 0;
    const isComplete = tasbihCount >= tasbihTarget;

    return (
      <div className="px-4 pt-6 pb-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('categories')}
            className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <RotateCcw className="h-4 w-4 text-secondary-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">{t.azkar.counter}</h1>
        </div>

        {/* Tasbih selector */}
        <div className="flex gap-2">
          {(Object.keys(tasbihOptions) as Array<keyof typeof tasbihOptions>).map(key => (
            <button
              key={key}
              onClick={() => { setTasbihText(key); setTasbihCount(0); }}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                tasbihText === key
                  ? 'gradient-gold text-accent-foreground shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {lang === 'ar' ? tasbihOptions[key].ar.split(' ').slice(0, 2).join(' ') : tasbihOptions[key].en}
            </button>
          ))}
        </div>

        {/* Target selector */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setTasbihTarget(prev => Math.max(1, prev - 1))}
            className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center"
          >
            <Minus className="h-4 w-4 text-secondary-foreground" />
          </button>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">{lang === 'ar' ? 'الهدف' : 'Target'}</p>
            <p className="text-lg font-bold text-foreground">{tasbihTarget}</p>
          </div>
          <button
            onClick={() => setTasbihTarget(prev => prev + 1)}
            className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center"
          >
            <Plus className="h-4 w-4 text-secondary-foreground" />
          </button>
        </div>

        {/* Main counter */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            {/* Circular progress ring */}
            <svg className="w-56 h-56 -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100" cy="100" r="88"
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth="8"
              />
              <circle
                cx="100" cy="100" r="88"
                fill="none"
                stroke={isComplete ? 'hsl(var(--emerald))' : 'hsl(var(--accent))'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - tasbihProgress / 100)}
                className="transition-all duration-300"
              />
            </svg>
            {/* Center button */}
            <button
              onClick={() => setTasbihCount(prev => prev + 1)}
              className={cn(
                'absolute inset-0 m-auto w-44 h-44 rounded-full flex flex-col items-center justify-center transition-all active:scale-95',
                isComplete ? 'bg-emerald/10' : 'bg-card border-2 border-border/50 hover:border-accent/50'
              )}
            >
              {isComplete && <Check className="h-8 w-8 text-emerald mb-1" />}
              <p className="font-quran text-lg text-foreground leading-tight px-4 text-center">
                {lang === 'ar' ? currentTasbih.ar : currentTasbih.en}
              </p>
              <p className="text-3xl font-bold text-accent mt-2">{tasbihCount}</p>
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={() => setTasbihCount(0)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            {lang === 'ar' ? 'إعادة تعيين' : 'Reset'}
          </button>
        </div>
      </div>
    );
  }

  // Azkar list view
  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setView('categories')}
          className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          <RotateCcw className="h-4 w-4 text-secondary-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-foreground truncate">{getCategoryLabel(activeCategory)}</h1>
          <p className="text-xs text-muted-foreground">
            {completedCount}/{totalCount} {t.azkar.completed}
          </p>
        </div>
        <button
          onClick={resetAll}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded bg-secondary"
        >
          {lang === 'ar' ? 'إعادة' : 'Reset'}
        </button>
      </div>

      {/* Progress bar */}
      <Progress value={progressPercent} className="h-2" />

      {/* Dhikr cards */}
      <div className="space-y-3">
        {azkarList.map(dhikr => (
          <DhikrCard
            key={dhikr.id}
            dhikr={dhikr}
            count={getCount(dhikr.id)}
            lang={lang}
            onIncrement={() => increment(dhikr.id)}
            onReset={() => resetCounter(dhikr.id)}
            repeatLabel={t.azkar.repeat}
            repeatsLabel={t.azkar.repeats}
          />
        ))}
      </div>
    </div>
  );
};

interface DhikrCardProps {
  dhikr: Dhikr;
  count: number;
  lang: string;
  onIncrement: () => void;
  onReset: () => void;
  repeatLabel: string;
  repeatsLabel: string;
}

const DhikrCard = ({ dhikr, count, lang, onIncrement, onReset, repeatLabel, repeatsLabel }: DhikrCardProps) => {
  const isComplete = count >= dhikr.repeat;
  const remaining = Math.max(0, dhikr.repeat - count);

  return (
    <div
      className={cn(
        'bg-card rounded-2xl border p-4 space-y-3 transition-all',
        isComplete ? 'border-emerald/40 opacity-70' : 'border-border/50'
      )}
    >
      {/* Arabic text */}
      <p className="font-quran text-lg leading-[2.2] text-foreground text-right" dir="rtl">
        {dhikr.textAr}
      </p>

      {/* English translation */}
      <p className="text-xs leading-relaxed text-muted-foreground border-t border-border/30 pt-2" dir="ltr">
        {dhikr.textEn}
      </p>

      {/* Counter row */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">
            {lang === 'ar' ? dhikr.reference : dhikr.referenceEn}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {dhikr.repeat} {dhikr.repeat > 1 ? repeatsLabel : repeatLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isComplete ? (
            <div className="flex items-center gap-1 text-emerald">
              <Check className="h-4 w-4" />
              <button onClick={onReset} className="text-[10px] text-muted-foreground hover:text-foreground">
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <>
              <span className="text-sm font-bold text-accent tabular-nums">
                {remaining}
              </span>
              <button
                onClick={onIncrement}
                className="h-9 w-9 rounded-full gradient-gold flex items-center justify-center shadow-sm active:scale-90 transition-transform"
              >
                <Plus className="h-4 w-4 text-accent-foreground" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AzkarPage;
