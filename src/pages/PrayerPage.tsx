import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { Clock, MapPin, Sun, Sunrise, Sunset, Moon, CloudSun, Search, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const prayerIcons: Record<string, React.ReactNode> = {
  Fajr: <Sunrise className="h-5 w-5" />,
  Sunrise: <Sun className="h-5 w-5" />,
  Dhuhr: <CloudSun className="h-5 w-5" />,
  Asr: <Sun className="h-5 w-5" />,
  Maghrib: <Sunset className="h-5 w-5" />,
  Isha: <Moon className="h-5 w-5" />,
};

const prayerNameMap: Record<string, { ar: string; en: string }> = {
  Fajr: { ar: 'الفجر', en: 'Fajr' },
  Sunrise: { ar: 'الشروق', en: 'Sunrise' },
  Dhuhr: { ar: 'الظهر', en: 'Dhuhr' },
  Asr: { ar: 'العصر', en: 'Asr' },
  Maghrib: { ar: 'المغرب', en: 'Maghrib' },
  Isha: { ar: 'العشاء', en: 'Isha' },
};

const CALC_METHODS = [
  { id: '4', ar: 'أم القرى', en: 'Umm Al-Qura' },
  { id: '5', ar: 'الهيئة المصرية', en: 'Egyptian General Authority' },
  { id: '2', ar: 'ISNA', en: 'ISNA (North America)' },
  { id: '1', ar: 'كراتشي', en: 'University of Islamic Sciences, Karachi' },
  { id: '3', ar: 'رابطة العالم الإسلامي', en: 'Muslim World League' },
  { id: '7', ar: 'طهران', en: 'Institute of Geophysics, Tehran' },
  { id: '0', ar: 'Shia Ithna-Ashari', en: 'Shia Ithna-Ashari' },
];

const PrayerPage = () => {
  const { lang } = useLanguage();
  const isRtl = lang === 'ar';
  const [calcMethod, setCalcMethod] = useState('4');
  const {
    prayers, nextPrayerKey, countdown, dateInfo,
    isLoading, error, locationStatus, requestLocation, setManualCity,
  } = usePrayerTimes(Number(calcMethod));

  const [cityInput, setCityInput] = useState('');
  const [countryInput, setCountryInput] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleManualSubmit = () => {
    if (cityInput.trim() && countryInput.trim()) {
      setManualCity(cityInput.trim(), countryInput.trim());
      setShowManual(false);
    }
  };

  const nextPrayerName = nextPrayerKey ? prayerNameMap[nextPrayerKey]?.[lang] || nextPrayerKey : '';

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl gradient-emerald flex items-center justify-center">
          <Clock className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground flex-1">
          {lang === 'ar' ? 'أوقات الصلاة' : 'Prayer Times'}
        </h1>
        <button onClick={() => setShowSettings(!showSettings)} className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
          <Settings2 className="h-4 w-4 text-secondary-foreground" />
        </button>
      </div>

      {/* Calculation Method Selector */}
      {showSettings && (
        <div className="bg-card rounded-2xl border border-border/50 p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">
            {lang === 'ar' ? 'طريقة الحساب' : 'Calculation Method'}
          </p>
          <Select value={calcMethod} onValueChange={setCalcMethod}>
            <SelectTrigger className="bg-secondary border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CALC_METHODS.map(m => (
                <SelectItem key={m.id} value={m.id}>
                  {lang === 'ar' ? m.ar : m.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Hijri / Gregorian Date */}
      {dateInfo && (
        <div className="text-center space-y-0.5">
          <p className="text-sm font-semibold text-foreground">
            {dateInfo.hijri.day} {dateInfo.hijri.month.ar} {dateInfo.hijri.year} هـ
          </p>
          <p className="text-xs text-muted-foreground">
            {dateInfo.gregorian.day} {dateInfo.gregorian.month.en} {dateInfo.gregorian.year}
          </p>
        </div>
      )}

      {/* Next Prayer Card */}
      {prayers.length > 0 && nextPrayerKey && (
        <div className="gradient-emerald rounded-2xl p-6 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 islamic-pattern opacity-20" />
          <div className="relative text-center space-y-2">
            <p className="text-sm opacity-90">
              {lang === 'ar' ? 'الصلاة القادمة' : 'Next Prayer'}
            </p>
            <p className="text-2xl font-bold">{nextPrayerName}</p>
            <p className="text-4xl font-mono font-bold tracking-wider">{countdown}</p>
            <p className="text-xs opacity-75">
              {lang === 'ar' ? 'الوقت المتبقي' : 'Time Remaining'}
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full rounded-2xl" />
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Location Permission / Manual Entry */}
      {(locationStatus === 'denied' || locationStatus === 'idle') && !isLoading && (
        <div className="bg-card rounded-2xl border border-border/50 p-6 text-center space-y-4">
          <MapPin className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {lang === 'ar'
              ? 'نحتاج إذن الموقع لتحديد أوقات الصلاة'
              : 'We need location permission to determine prayer times'}
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={requestLocation} className="gradient-emerald text-primary-foreground">
              <MapPin className="h-4 w-4" />
              {lang === 'ar' ? 'السماح بالموقع' : 'Allow Location'}
            </Button>
            <Button variant="outline" onClick={() => setShowManual(true)}>
              <Search className="h-4 w-4" />
              {lang === 'ar' ? 'إدخال المدينة يدوياً' : 'Enter City Manually'}
            </Button>
          </div>
        </div>
      )}

      {/* Manual City Input */}
      {showManual && (
        <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-3">
          <Input
            placeholder={lang === 'ar' ? 'المدينة (مثال: الرياض)' : 'City (e.g. Riyadh)'}
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            dir={isRtl ? 'rtl' : 'ltr'}
          />
          <Input
            placeholder={lang === 'ar' ? 'الدولة (مثال: السعودية)' : 'Country (e.g. Saudi Arabia)'}
            value={countryInput}
            onChange={(e) => setCountryInput(e.target.value)}
            dir={isRtl ? 'rtl' : 'ltr'}
          />
          <Button onClick={handleManualSubmit} className="w-full gradient-emerald text-primary-foreground">
            {lang === 'ar' ? 'بحث' : 'Search'}
          </Button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 rounded-2xl p-4 text-center">
          <p className="text-sm text-destructive">
            {lang === 'ar' ? 'خطأ في جلب أوقات الصلاة. حاول مرة أخرى.' : 'Error fetching prayer times. Please try again.'}
          </p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowManual(true)}>
            {lang === 'ar' ? 'إدخال المدينة يدوياً' : 'Enter City Manually'}
          </Button>
        </div>
      )}

      {/* Prayer List */}
      {prayers.length > 0 && (
        <div className="space-y-2">
          {prayers.map(({ key, time }) => {
            const isNext = key === nextPrayerKey;
            const name = prayerNameMap[key]?.[lang] || key;
            return (
              <div
                key={key}
                className={cn(
                  'flex items-center justify-between p-4 rounded-xl border transition-all',
                  isNext
                    ? 'gradient-gold border-transparent shadow-md'
                    : 'bg-card border-border/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'h-9 w-9 rounded-lg flex items-center justify-center',
                    isNext ? 'bg-primary-foreground/20' : 'bg-secondary'
                  )}>
                    <span className={isNext ? 'text-accent-foreground' : 'text-muted-foreground'}>
                      {prayerIcons[key]}
                    </span>
                  </div>
                  <span className={cn(
                    'font-semibold text-sm',
                    isNext ? 'text-accent-foreground' : 'text-foreground'
                  )}>
                    {name}
                  </span>
                </div>
                <span className={cn(
                  'font-mono text-sm font-bold',
                  isNext ? 'text-accent-foreground' : 'text-foreground'
                )}>
                  {time}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Change City Button */}
      {prayers.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowManual(!showManual)}
          className="w-full text-muted-foreground"
        >
          <MapPin className="h-4 w-4" />
          {lang === 'ar' ? 'تغيير المدينة' : 'Change City'}
        </Button>
      )}
    </div>
  );
};

export default PrayerPage;
