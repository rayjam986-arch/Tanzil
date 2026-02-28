import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { surahs, type Surah } from '@/data/surahs';
import { getSurahStartPage } from '@/data/mushafData';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'meccan' | 'medinan';

const QuranPage = () => {
  const { t, lang, isRtl } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = useMemo(() => {
    return surahs.filter(s => {
      const matchesSearch = search === '' ||
        s.nameAr.includes(search) ||
        s.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        s.translationEn.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toString() === search;
      const matchesFilter = filter === 'all' || s.revelationType === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: 'all', label: lang === 'ar' ? 'الكل' : 'All' },
    { key: 'meccan', label: t.quran.meccan },
    { key: 'medinan', label: t.quran.medinan },
  ];

  const handleSurahPress = (surah: Surah) => {
    navigate(`/mushaf/${getSurahStartPage(surah.id)}`);
  };

  return (
    <div className="px-4 pt-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-emerald flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t.quran.title}</h1>
            <p className="text-xs text-muted-foreground">114 {t.quran.surah}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={cn(
          'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
          isRtl ? 'right-3' : 'left-3'
        )} />
        <input
          type="text"
          placeholder={t.quran.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={cn(
            'w-full h-11 rounded-xl border border-border bg-card text-foreground text-sm outline-none focus:ring-2 focus:ring-ring transition-all',
            isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
          )}
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {filterButtons.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              filter === key
                ? 'gradient-gold text-accent-foreground shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Surah list */}
      <div className="space-y-2 pb-4">
        {filtered.map(surah => (
          <SurahCard
            key={surah.id}
            surah={surah}
            lang={lang}
            isRtl={isRtl}
            versesLabel={t.quran.verses}
            showPage={true}
            onPress={() => handleSurahPress(surah)}
          />
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              {lang === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SurahCard = ({ surah, lang, isRtl, versesLabel, showPage, onPress }: {
  surah: Surah; lang: string; isRtl: boolean; versesLabel: string; showPage?: boolean; onPress: () => void;
}) => {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center gap-3 p-3 bg-card rounded-xl border border-border/50 hover:border-accent/50 hover:shadow-sm transition-all active:scale-[0.98] text-start"
    >
      {/* Number */}
      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-secondary-foreground">{surah.id}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-foreground truncate">
            {lang === 'ar' ? surah.nameAr : surah.nameEn}
          </p>
          <p className="font-quran text-lg text-foreground flex-shrink-0">
            {lang !== 'ar' && surah.nameAr}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={cn(
            'text-[10px] px-1.5 py-0.5 rounded font-medium',
            surah.revelationType === 'meccan'
              ? 'bg-emerald/10 text-emerald'
              : 'bg-accent/20 text-accent-foreground'
          )}>
            {surah.revelationType === 'meccan'
              ? (lang === 'ar' ? 'مكية' : 'Meccan')
              : (lang === 'ar' ? 'مدنية' : 'Medinan')
            }
          </span>
          <span className="text-xs text-muted-foreground">
            {surah.versesCount} {versesLabel}
          </span>
          {showPage && (
            <span className="text-[10px] text-muted-foreground">
              • {lang === 'ar' ? 'ص' : 'p.'}{getSurahStartPage(surah.id)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default QuranPage;
