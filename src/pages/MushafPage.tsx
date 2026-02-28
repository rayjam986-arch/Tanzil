import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Loader2, Play, Pause, SkipBack, SkipForward,
  Volume2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, BookOpen
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useQuranAudio } from '@/hooks/useQuranAudio';
import { surahs } from '@/data/surahs';
import {
  getPageImageUrl, getSurahsOnPage, getPrimarySurahOnPage,
  getJuzForPage, getSurahStartPage, TOTAL_PAGES
} from '@/data/mushafData';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const MushafPage = () => {
  const { page: pageParam } = useParams<{ page: string }>();
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();

  const initialPage = Math.max(1, Math.min(TOTAL_PAGES, Number(pageParam) || 1));
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoom, setZoom] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Get surah info for current page
  const surahIds = getSurahsOnPage(currentPage);
  const primarySurahId = getPrimarySurahOnPage(currentPage);
  const primarySurah = surahs.find(s => s.id === primarySurahId);
  const juzNumber = getJuzForPage(currentPage);

  // Audio for the primary surah on current page
  const audio = useQuranAudio(primarySurahId);

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < TOTAL_PAGES;

  // Navigate to page and update URL
  const goToPage = useCallback((page: number) => {
    const p = Math.max(1, Math.min(TOTAL_PAGES, page));
    setCurrentPage(p);
    setImageLoaded(false);
    setImageError(false);
    navigate(`/mushaf/${p}`, { replace: true });
  }, [navigate]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPage(currentPage - 1);
      else if (e.key === 'ArrowRight') goToPage(currentPage + 1);
      else if (e.key === '+' || e.key === '=') setZoom(z => Math.min(3, z + 0.25));
      else if (e.key === '-') setZoom(z => Math.max(0.5, z - 0.25));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentPage, goToPage]);

  // Touch/swipe navigation
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartRef.current.x - endX;
    if (Math.abs(diff) > 60) {
      // In RTL mushaf: swipe left = next page (higher number), swipe right = prev
      if (diff > 0) goToPage(currentPage + 1);
      else goToPage(currentPage - 1);
    }
    touchStartRef.current = null;
  };

  // Prefetch adjacent pages
  useEffect(() => {
    const prefetch = (page: number) => {
      if (page >= 1 && page <= TOTAL_PAGES) {
        const img = new Image();
        img.src = getPageImageUrl(page);
      }
    };
    prefetch(currentPage + 1);
    prefetch(currentPage - 1);
  }, [currentPage]);

  // Sync URL param
  useEffect(() => {
    const p = Number(pageParam);
    if (p && p !== currentPage && p >= 1 && p <= TOTAL_PAGES) {
      setCurrentPage(p);
      setImageLoaded(false);
      setImageError(false);
    }
  }, [pageParam]);

  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const surahNames = surahIds.map(id => {
    const s = surahs.find(s => s.id === id);
    return lang === 'ar' ? s?.nameAr : s?.nameEn;
  }).join(' • ');

  return (
    <div
      className="flex flex-col min-h-[calc(100vh-4rem)] select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' } as React.CSSProperties}
      onContextMenu={e => e.preventDefault()}
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/quran')}
            className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors flex-shrink-0"
          >
            {isRtl ? <ArrowRight className="h-4 w-4 text-secondary-foreground" /> : <ArrowLeft className="h-4 w-4 text-secondary-foreground" />}
          </button>
          <div className="flex-1 min-w-0 text-center">
            <p className="text-sm font-bold text-foreground truncate">{surahNames}</p>
            <p className="text-[10px] text-muted-foreground">
              {lang === 'ar' ? `صفحة ${currentPage}` : `Page ${currentPage}`} • {lang === 'ar' ? `الجزء ${juzNumber}` : `Juz ${juzNumber}`}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
              className="h-7 w-7 rounded bg-secondary flex items-center justify-center text-secondary-foreground"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] text-muted-foreground w-8 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(z => Math.min(3, z + 0.25))}
              className="h-7 w-7 rounded bg-secondary flex items-center justify-center text-secondary-foreground"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mushaf Page Image */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto pb-40"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex justify-center p-2" style={{ minHeight: '60vh' }}>
          {/* Islamic decorative frame */}
          <div className={cn(
            'relative mushaf-frame rounded-lg overflow-hidden transition-transform duration-200',
            'border-4 border-accent/30 shadow-lg bg-card'
          )} style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
            {/* Decorative corner ornaments */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/50 rounded-tl-sm z-10" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent/50 rounded-tr-sm z-10" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent/50 rounded-bl-sm z-10" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/50 rounded-br-sm z-10" />

            {/* Dark mode overlay */}
            <div className="dark:absolute dark:inset-0 dark:bg-background/15 dark:z-[5] dark:pointer-events-none hidden dark:block" />

            {/* Loading state */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-card z-20">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            )}

            {/* Error state */}
            {imageError && (
              <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground text-center">
                  {lang === 'ar' ? 'تعذّر تحميل الصفحة' : 'Failed to load page'}
                </p>
                <button
                  onClick={() => { setImageError(false); setImageLoaded(false); }}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm"
                >
                  {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                </button>
              </div>
            )}

            {/* Page image */}
            <img
              key={currentPage}
              src={getPageImageUrl(currentPage)}
              alt={`Quran Page ${currentPage}`}
              className={cn(
                'max-w-full h-auto block transition-opacity duration-300',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              style={{
                maxHeight: 'calc(100vh - 12rem)',
                pointerEvents: 'none',
                WebkitTouchCallout: 'none',
              } as React.CSSProperties}
              loading="lazy"
              draggable={false}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />

            {/* Page number badge */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-0.5 rounded-full border border-border/50 z-10">
              <span className="text-[10px] text-muted-foreground font-medium">{currentPage}</span>
            </div>
          </div>
        </div>

        {/* Page navigation arrows (floating) */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={!hasPrev}
          className={cn(
            'fixed top-1/2 -translate-y-1/2 z-30 h-12 w-8 rounded-r-lg bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center transition-all',
            hasPrev ? 'hover:bg-secondary' : 'opacity-30',
            'left-0'
          )}
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={!hasNext}
          className={cn(
            'fixed top-1/2 -translate-y-1/2 z-30 h-12 w-8 rounded-l-lg bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center transition-all',
            hasNext ? 'hover:bg-secondary' : 'opacity-30',
            'right-0'
          )}
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* Fixed Audio Player */}
      <div className="fixed bottom-[60px] left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-40 px-4 py-2 space-y-1.5 safe-area-bottom">
        {/* Reciter selector + surah selector */}
        <div className="flex items-center gap-2">
          <Volume2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <Select
            value={audio.reciterId.toString()}
            onValueChange={v => audio.setReciterId(Number(v))}
          >
            <SelectTrigger className="h-7 text-[11px] flex-1 bg-secondary border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {audio.reciters.map(r => (
                <SelectItem key={r.id} value={r.id.toString()}>
                  <span className="font-medium">{lang === 'ar' ? r.nameAr : r.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Surah selector for current page */}
          {surahIds.length > 1 && (
            <Select
              value={primarySurahId.toString()}
              onValueChange={v => {
                const page = getSurahStartPage(Number(v));
                goToPage(page);
              }}
            >
              <SelectTrigger className="h-7 text-[11px] w-28 bg-secondary border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {surahIds.map(id => {
                  const s = surahs.find(s => s.id === id);
                  return (
                    <SelectItem key={id} value={id.toString()}>
                      {lang === 'ar' ? s?.nameAr : s?.nameEn}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={!hasPrev}
            className="text-muted-foreground disabled:opacity-30"
          >
            <SkipBack className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={audio.togglePlay}
            disabled={audio.isLoading}
            className="h-9 w-9 rounded-full gradient-gold flex items-center justify-center shadow-md flex-shrink-0"
          >
            {audio.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-accent-foreground" />
            ) : audio.isPlaying ? (
              <Pause className="h-4 w-4 text-accent-foreground" />
            ) : (
              <Play className="h-4 w-4 text-accent-foreground ml-0.5" />
            )}
          </button>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={!hasNext}
            className="text-muted-foreground disabled:opacity-30"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </button>

          <div className="flex-1 flex items-center gap-1.5">
            <span className="text-[9px] text-muted-foreground w-7 text-right tabular-nums">
              {formatTime(audio.progress)}
            </span>
            <Slider
              value={[audio.progress]}
              max={audio.duration || 100}
              step={0.5}
              onValueChange={([v]) => audio.seek(v)}
              className="flex-1"
            />
            <span className="text-[9px] text-muted-foreground w-7 tabular-nums">
              {formatTime(audio.duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MushafPage;
