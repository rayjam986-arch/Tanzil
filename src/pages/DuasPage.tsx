import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Heart, Star } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { duasData, duaCategoryLabels, DuaCategory } from '@/data/duas';
import { cn } from '@/lib/utils';

const categoryConfig: { key: DuaCategory; icon: typeof BookOpen; colorClass: string }[] = [
  { key: 'quranic', icon: BookOpen, colorClass: 'bg-accent/15 text-accent' },
  { key: 'prophetic', icon: Star, colorClass: 'bg-primary/15 text-primary' },
  { key: 'general', icon: Heart, colorClass: 'bg-secondary text-secondary-foreground' },
];

const DuasPage = () => {
  const { lang, isRtl } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<DuaCategory | null>(null);

  if (activeCategory) {
    const duas = duasData[activeCategory];
    const label = duaCategoryLabels[activeCategory];
    const BackIcon = isRtl ? ArrowRight : ArrowLeft;

    return (
      <div className="px-4 pt-6 pb-24 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setActiveCategory(null)}
            className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <BackIcon className="h-4 w-4 text-secondary-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">{lang === 'ar' ? label.ar : label.en}</h1>
        </div>

        {duas.map((dua) => (
          <div key={dua.id} className="bg-card rounded-2xl border border-border/50 p-5 space-y-3">
            <p className="font-quran text-lg text-foreground leading-[2.2] text-right" dir="rtl">
              {dua.textAr}
            </p>
            <div className="border-t border-border/30 pt-2">
              <p className="text-xs text-muted-foreground text-end" dir="rtl">{dua.reference}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-24 space-y-4">
      <h1 className="text-xl font-bold text-foreground mb-6">
        {lang === 'ar' ? 'الأدعية' : 'Duas'}
      </h1>

      <div className="grid grid-cols-1 gap-3">
        {categoryConfig.map(({ key, icon: Icon, colorClass }) => {
          const label = duaCategoryLabels[key];
          const count = duasData[key].length;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border/50 hover:border-accent/30 transition-colors text-start"
            >
              <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center', colorClass)}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{lang === 'ar' ? label.ar : label.en}</p>
                <p className="text-sm text-muted-foreground">{count} {lang === 'ar' ? 'دعاء' : 'duas'}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DuasPage;
