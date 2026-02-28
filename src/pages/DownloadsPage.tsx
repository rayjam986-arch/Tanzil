import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { surahs } from '@/data/surahs';
import { RECITERS, type Reciter } from '@/data/reciters';
import { Download, Check, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const QURAN_API = 'https://api.quran.com/api/v4';

function getAudioUrl(reciter: Reciter, surahId: number): string {
  if (reciter.apiSource === 'mp3quran' && reciter.server) {
    return `${reciter.server}${surahId.toString().padStart(3, '0')}.mp3`;
  }
  // For quran.com reciters, we need to fetch the URL
  return '';
}

const DownloadsPage = () => {
  const { lang, isRtl } = useLanguage();
  const navigate = useNavigate();
  const [reciterId, setReciterId] = useState(7);
  const [downloading, setDownloading] = useState<Set<number>>(new Set());

  const reciter = RECITERS.find(r => r.id === reciterId) || RECITERS[0];

  const handleDownload = async (surahId: number) => {
    setDownloading(prev => new Set(prev).add(surahId));

    try {
      let url = getAudioUrl(reciter, surahId);

      // For quran.com reciters, fetch the actual URL first
      if (!url) {
        const res = await fetch(`${QURAN_API}/chapter_recitations/${reciter.id}/${surahId}`);
        const data = await res.json();
        url = data.audio_file?.audio_url;
      }

      if (url) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `${surahId.toString().padStart(3, '0')}_${reciter.name}.mp3`;
        a.target = '_blank';
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (e) {
      console.error('Download failed:', e);
    } finally {
      setDownloading(prev => {
        const next = new Set(prev);
        next.delete(surahId);
        return next;
      });
    }
  };

  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/more')} className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
            <BackIcon className="h-4 w-4 text-secondary-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">
            {lang === 'ar' ? 'التنزيلات' : 'Downloads'}
          </h1>
        </div>

        {/* Reciter selector */}
        <div className="mt-3">
          <Select value={reciterId.toString()} onValueChange={v => setReciterId(Number(v))}>
            <SelectTrigger className="h-10 bg-secondary border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RECITERS.map(r => (
                <SelectItem key={r.id} value={r.id.toString()}>
                  <span className="font-medium">{lang === 'ar' ? r.nameAr : r.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Surah list */}
      <div className="flex-1 px-4 py-3 space-y-2 pb-24">
        {surahs.map(surah => {
          const isDownloading = downloading.has(surah.id);
          return (
            <div
              key={surah.id}
              className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border/50"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              <span className="h-8 w-8 rounded-full bg-accent/15 flex items-center justify-center text-xs font-bold text-accent">
                {surah.id}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">
                  {lang === 'ar' ? surah.nameAr : surah.nameEn}
                </p>
                <p className="text-xs text-muted-foreground">
                  {surah.versesCount} {lang === 'ar' ? 'آية' : 'verses'}
                </p>
              </div>
              <button
                onClick={() => handleDownload(surah.id)}
                disabled={isDownloading}
                className={cn(
                  'h-9 w-9 rounded-full flex items-center justify-center transition-all',
                  isDownloading ? 'bg-muted' : 'gradient-gold'
                )}
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <Download className="h-4 w-4 text-accent-foreground" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DownloadsPage;
