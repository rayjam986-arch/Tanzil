export type Language = 'ar' | 'en';

type Translations = Record<Language, {
  app: { name: string; tagline: string };
  nav: { home: string; quran: string; azkar: string; prayer: string; more: string; qibla: string };
  home: { greeting: string; dailyVerse: string; dailyDhikr: string; nextPrayer: string; quickAccess: string; morningAzkar: string; eveningAzkar: string; readQuran: string; prayerTimes: string; tasbih: string; bookmarks: string };
  prayers: { fajr: string; dhuhr: string; asr: string; maghrib: string; isha: string; sunrise: string };
  quran: { title: string; search: string; verses: string; surah: string; juz: string; page: string; meccan: string; medinan: string };
  azkar: { title: string; morning: string; evening: string; afterPrayer: string; sleep: string; wakeup: string; general: string; repeat: string; repeats: string; completed: string; counter: string };
  settings: { language: string; arabic: string; english: string; darkMode: string };
  downloads: { title: string; download: string; downloading: string };
  qibla: { title: string; direction: string; permissionNeeded: string; notSupported: string; loading: string; north: string; south: string; east: string; west: string };
}>;

export const translations: Translations = {
  ar: {
    app: { name: 'وحي', tagline: 'رفيقك الإسلامي اليومي' },
    nav: { home: 'الرئيسية', quran: 'القرآن', azkar: 'الأذكار', prayer: 'الصلاة', more: 'المزيد', qibla: 'القبلة' },
    home: {
      greeting: 'السلام عليكم',
      dailyVerse: 'آية اليوم',
      dailyDhikr: 'ذكر اليوم',
      nextPrayer: 'الصلاة القادمة',
      quickAccess: 'الوصول السريع',
      morningAzkar: 'أذكار الصباح',
      eveningAzkar: 'أذكار المساء',
      readQuran: 'قراءة القرآن',
      prayerTimes: 'أوقات الصلاة',
      tasbih: 'التسبيح',
      bookmarks: 'الإشارات المرجعية',
    },
    prayers: {
      fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر',
      maghrib: 'المغرب', isha: 'العشاء', sunrise: 'الشروق',
    },
    quran: {
      title: 'القرآن الكريم',
      search: 'ابحث عن سورة...',
      verses: 'آيات',
      surah: 'سورة',
      juz: 'جزء',
      page: 'صفحة',
      meccan: 'مكية',
      medinan: 'مدنية',
    },
    azkar: {
      title: 'الأذكار',
      morning: 'أذكار الصباح',
      evening: 'أذكار المساء',
      afterPrayer: 'أذكار بعد الصلاة',
      sleep: 'أذكار النوم',
      wakeup: 'أذكار الاستيقاظ',
      general: 'أدعية متنوعة',
      repeat: 'مرة',
      repeats: 'مرات',
      completed: 'مكتمل',
      counter: 'العداد',
    },
    settings: {
      language: 'اللغة',
      arabic: 'العربية',
      english: 'English',
      darkMode: 'الوضع الداكن',
    },
    downloads: { title: 'التنزيلات', download: 'تحميل', downloading: 'جاري التحميل...' },
    qibla: {
      title: 'بوصلة القبلة',
      direction: 'اتجاه القبلة من الشمال',
      permissionNeeded: 'يرجى السماح بالوصول إلى الموقع الجغرافي لتحديد اتجاه القبلة',
      notSupported: 'بوصلة الجهاز غير مدعومة في هذا المتصفح. الزاوية المعروضة هي اتجاه القبلة من الشمال.',
      loading: 'جارٍ تحديد الموقع...',
      north: 'ش', south: 'ج', east: 'شر', west: 'غ',
    },
  },
  en: {
    app: { name: 'Wahy', tagline: 'Your Daily Islamic Companion' },
    nav: { home: 'Home', quran: 'Quran', azkar: 'Azkar', prayer: 'Prayer', more: 'More', qibla: 'Qibla' },
    home: {
      greeting: 'Assalamu Alaikum',
      dailyVerse: 'Verse of the Day',
      dailyDhikr: 'Dhikr of the Day',
      nextPrayer: 'Next Prayer',
      quickAccess: 'Quick Access',
      morningAzkar: 'Morning Azkar',
      eveningAzkar: 'Evening Azkar',
      readQuran: 'Read Quran',
      prayerTimes: 'Prayer Times',
      tasbih: 'Tasbih',
      bookmarks: 'Bookmarks',
    },
    prayers: {
      fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr',
      maghrib: 'Maghrib', isha: 'Isha', sunrise: 'Sunrise',
    },
    quran: {
      title: 'The Holy Quran',
      search: 'Search for a surah...',
      verses: 'verses',
      surah: 'Surah',
      juz: 'Juz',
      page: 'Page',
      meccan: 'Meccan',
      medinan: 'Medinan',
    },
    azkar: {
      title: 'Azkar',
      morning: 'Morning Azkar',
      evening: 'Evening Azkar',
      afterPrayer: 'After Prayer Azkar',
      sleep: 'Sleep Azkar',
      wakeup: 'Wakeup Azkar',
      general: 'General Duas',
      repeat: 'time',
      repeats: 'times',
      completed: 'Completed',
      counter: 'Counter',
    },
    settings: {
      language: 'Language',
      arabic: 'العربية',
      english: 'English',
      darkMode: 'Dark Mode',
    },
    downloads: { title: 'Downloads', download: 'Download', downloading: 'Downloading...' },
    qibla: {
      title: 'Qibla Compass',
      direction: 'Qibla direction from North',
      permissionNeeded: 'Please allow location access to determine Qibla direction',
      notSupported: 'Device compass is not supported in this browser. The angle shown is the Qibla bearing from North.',
      loading: 'Detecting location...',
      north: 'N', south: 'S', east: 'E', west: 'W',
    },
  },
} as const;
