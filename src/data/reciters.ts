/**
 * Unified reciter data with dual-source audio support
 * - quran.com API: provides timestamps for verse tracking
 * - mp3quran.net: direct MP3 links without timestamps
 */
export interface Reciter {
  id: number;
  name: string;
  nameAr: string;
  riwayah: string;
  style?: string;
  apiSource: 'quran.com' | 'mp3quran';
  server?: string; // mp3quran.net server URL
}

export const RECITERS: Reciter[] = [
  // === quran.com API reciters (with verse timestamps) ===
  { id: 7, name: 'Mishari Rashid al-Afasy', nameAr: 'مشاري راشد العفاسي', riwayah: 'حفص عن عاصم', apiSource: 'quran.com' },
  { id: 3, name: 'Abdul Rahman Al-Sudais', nameAr: 'عبدالرحمن السديس', riwayah: 'حفص عن عاصم', apiSource: 'quran.com' },
  { id: 10, name: 'Saud Al-Shuraim', nameAr: 'سعود الشريم', riwayah: 'حفص عن عاصم', apiSource: 'quran.com' },
  { id: 2, name: 'Abdul Basit Abdul Samad', nameAr: 'عبدالباسط عبدالصمد', riwayah: 'حفص عن عاصم', style: 'مرتل', apiSource: 'quran.com' },
  { id: 6, name: 'Mahmoud Khalil Al-Hussary', nameAr: 'محمود خليل الحصري', riwayah: 'حفص عن عاصم', apiSource: 'quran.com' },

  // === mp3quran.net reciters (no verse timestamps) ===
  { id: 101, name: 'Ali Al-Hudhaify', nameAr: 'علي الحذيفي', riwayah: 'حفص عن عاصم', apiSource: 'mp3quran', server: 'https://server9.mp3quran.net/hthfi/' },
  { id: 102, name: 'Muhammad Ayyub', nameAr: 'محمد أيوب', riwayah: 'حفص عن عاصم', apiSource: 'mp3quran', server: 'https://server8.mp3quran.net/ayyub/' },
  { id: 103, name: 'Maher Al Muaiqly', nameAr: 'ماهر المعيقلي', riwayah: 'حفص عن عاصم', apiSource: 'mp3quran', server: 'https://server12.mp3quran.net/maher/' },
  { id: 104, name: 'Yasser Al-Dosari', nameAr: 'ياسر الدوسري', riwayah: 'حفص عن عاصم', apiSource: 'mp3quran', server: 'https://server11.mp3quran.net/yasser/' },
  { id: 105, name: 'Khalid Al-Jaleel', nameAr: 'خالد الجليل', riwayah: 'حفص عن عاصم', apiSource: 'mp3quran', server: 'https://server10.mp3quran.net/jleel/' },
];

export function getReciterById(id: number): Reciter | undefined {
  return RECITERS.find(r => r.id === id);
}
