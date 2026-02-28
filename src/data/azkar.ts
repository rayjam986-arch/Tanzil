export type AzkarCategory = 'morning' | 'evening' | 'afterPrayer' | 'sleep' | 'wakeup';

export interface Dhikr {
  id: number;
  textAr: string;
  textEn: string;
  repeat: number;
  reference: string;
  referenceEn: string;
}

export interface AzkarGroup {
  category: AzkarCategory;
  azkar: Dhikr[];
}

export const azkarData: Record<AzkarCategory, Dhikr[]> = {
  morning: [
    {
      id: 1,
      textAr: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      textEn: 'We have entered a new day and with it all the dominion which belongs to Allah. Praise is to Allah. None has the right to be worshipped but Allah alone, who has no partner. To Allah belongs the dominion, and to Him is the praise and He is Able to do all things.',
      repeat: 1,
      reference: 'أبو داود',
      referenceEn: 'Abu Dawud',
    },
    {
      id: 2,
      textAr: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
      textEn: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.',
      repeat: 1,
      reference: 'الترمذي',
      referenceEn: 'At-Tirmidhi',
    },
    {
      id: 3,
      textAr: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
      textEn: 'Glory is to Allah and praise is to Him.',
      repeat: 100,
      reference: 'مسلم',
      referenceEn: 'Muslim',
    },
    {
      id: 4,
      textAr: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      textEn: 'None has the right to be worshipped but Allah alone, who has no partner. His is the dominion and His is the praise, and He is Able to do all things.',
      repeat: 10,
      reference: 'البخاري ومسلم',
      referenceEn: 'Al-Bukhari & Muslim',
    },
    {
      id: 5,
      textAr: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي',
      textEn: 'O Allah, I ask You for well-being in this world and the Hereafter. O Allah, I ask You for pardon and well-being in my religion, my worldly affairs, my family and my wealth.',
      repeat: 1,
      reference: 'ابن ماجه',
      referenceEn: 'Ibn Majah',
    },
    {
      id: 6,
      textAr: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
      textEn: 'In the Name of Allah, with whose Name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
      repeat: 3,
      reference: 'أبو داود والترمذي',
      referenceEn: 'Abu Dawud & At-Tirmidhi',
    },
    {
      id: 7,
      textAr: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
      textEn: 'I seek refuge in the Perfect Words of Allah from the evil of what He has created.',
      repeat: 3,
      reference: 'مسلم',
      referenceEn: 'Muslim',
    },
    {
      id: 8,
      textAr: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ',
      textEn: 'O Allah, grant my body health. O Allah, grant my hearing health. O Allah, grant my sight health. None has the right to be worshipped but You.',
      repeat: 3,
      reference: 'أبو داود',
      referenceEn: 'Abu Dawud',
    },
    {
      id: 9,
      textAr: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
      textEn: 'Allah is sufficient for me. There is none worthy of worship but Him. I have placed my trust in Him, and He is Lord of the Majestic Throne.',
      repeat: 7,
      reference: 'أبو داود',
      referenceEn: 'Abu Dawud',
    },
    {
      id: 10,
      textAr: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
      textEn: 'I seek the forgiveness of Allah and repent to Him.',
      repeat: 100,
      reference: 'البخاري ومسلم',
      referenceEn: 'Al-Bukhari & Muslim',
    },
  ],
  evening: [
    {
      id: 101,
      textAr: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      textEn: 'We have entered a new evening and with it all the dominion which belongs to Allah. Praise is to Allah. None has the right to be worshipped but Allah alone, who has no partner.',
      repeat: 1,
      reference: 'أبو داود',
      referenceEn: 'Abu Dawud',
    },
    {
      id: 102,
      textAr: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
      textEn: 'O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return.',
      repeat: 1,
      reference: 'الترمذي',
      referenceEn: 'At-Tirmidhi',
    },
    {
      id: 103,
      textAr: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
      textEn: 'Glory is to Allah and praise is to Him.',
      repeat: 100,
      reference: 'مسلم',
      referenceEn: 'Muslim',
    },
    {
      id: 104,
      textAr: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
      textEn: 'I seek refuge in the Perfect Words of Allah from the evil of what He has created.',
      repeat: 3,
      reference: 'مسلم',
      referenceEn: 'Muslim',
    },
    {
      id: 105,
      textAr: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
      textEn: 'In the Name of Allah, with whose Name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
      repeat: 3,
      reference: 'أبو داود والترمذي',
      referenceEn: 'Abu Dawud & At-Tirmidhi',
    },
    {
      id: 106,
      textAr: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ',
      textEn: 'O Allah, grant my body health. O Allah, grant my hearing health. O Allah, grant my sight health. None has the right to be worshipped but You.',
      repeat: 3,
      reference: 'أبو داود',
      referenceEn: 'Abu Dawud',
    },
    {
      id: 107,
      textAr: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
      textEn: 'Allah is sufficient for me. There is none worthy of worship but Him. I have placed my trust in Him, and He is Lord of the Majestic Throne.',
      repeat: 7,
      reference: 'أبو داود',
      referenceEn: 'Abu Dawud',
    },
    {
      id: 108,
      textAr: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      textEn: 'None has the right to be worshipped but Allah alone, who has no partner. His is the dominion and His is the praise, and He is Able to do all things.',
      repeat: 10,
      reference: 'البخاري ومسلم',
      referenceEn: 'Al-Bukhari & Muslim',
    },
  ],
  afterPrayer: [
    {
      id: 201,
      textAr: 'أَسْتَغْفِرُ اللَّهَ',
      textEn: 'I seek the forgiveness of Allah.',
      repeat: 3,
      reference: 'مسلم',
      referenceEn: 'Muslim',
    },
    {
      id: 202,
      textAr: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
      textEn: 'O Allah, You are Peace and from You is peace. Blessed are You, O Possessor of Majesty and Honour.',
      repeat: 1,
      reference: 'مسلم',
      referenceEn: 'Muslim',
    },
    {
      id: 203,
      textAr: 'سُبْحَانَ اللَّهِ',
      textEn: 'Glory is to Allah.',
      repeat: 33,
      reference: 'مسلم',
      referenceEn: 'Muslim',
    },
    {
      id: 204,
      textAr: 'الْحَمْدُ لِلَّهِ',
      textEn: 'Praise is to Allah.',
      repeat: 33,
      reference: 'مسلم',
      referenceEn: 'Muslim',
    },
    {
      id: 205,
      textAr: 'اللَّهُ أَكْبَرُ',
      textEn: 'Allah is the Greatest.',
      repeat: 33,
      reference: 'مسلم',
      referenceEn: 'Muslim',
    },
    {
      id: 206,
      textAr: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      textEn: 'None has the right to be worshipped but Allah alone, who has no partner. His is the dominion and His is the praise and He is Able to do all things.',
      repeat: 1,
      reference: 'مسلم',
      referenceEn: 'Muslim',
    },
  ],
  sleep: [
    {
      id: 301,
      textAr: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
      textEn: 'In Your Name, O Allah, I die and I live.',
      repeat: 1,
      reference: 'البخاري',
      referenceEn: 'Al-Bukhari',
    },
    {
      id: 302,
      textAr: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
      textEn: 'O Allah, save me from Your punishment on the Day You resurrect Your servants.',
      repeat: 3,
      reference: 'أبو داود والترمذي',
      referenceEn: 'Abu Dawud & At-Tirmidhi',
    },
    {
      id: 303,
      textAr: 'سُبْحَانَ اللَّهِ',
      textEn: 'Glory is to Allah.',
      repeat: 33,
      reference: 'البخاري ومسلم',
      referenceEn: 'Al-Bukhari & Muslim',
    },
    {
      id: 304,
      textAr: 'الْحَمْدُ لِلَّهِ',
      textEn: 'Praise is to Allah.',
      repeat: 33,
      reference: 'البخاري ومسلم',
      referenceEn: 'Al-Bukhari & Muslim',
    },
    {
      id: 305,
      textAr: 'اللَّهُ أَكْبَرُ',
      textEn: 'Allah is the Greatest.',
      repeat: 34,
      reference: 'البخاري ومسلم',
      referenceEn: 'Al-Bukhari & Muslim',
    },
  ],
  wakeup: [
    {
      id: 401,
      textAr: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
      textEn: 'Praise is to Allah who gave us life after He caused us to die, and to Him is the resurrection.',
      repeat: 1,
      reference: 'البخاري',
      referenceEn: 'Al-Bukhari',
    },
    {
      id: 402,
      textAr: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
      textEn: 'None has the right to be worshipped but Allah alone, who has no partner. His is the dominion and His is the praise, and He is Able to do all things. Glory is to Allah. Praise is to Allah. None has the right to be worshipped but Allah. Allah is the Greatest. There is no power and no might except with Allah, the Most High, the Most Great.',
      repeat: 1,
      reference: 'البخاري',
      referenceEn: 'Al-Bukhari',
    },
  ],
};

export const categoryIcons: Record<AzkarCategory, string> = {
  morning: '🌅',
  evening: '🌙',
  afterPrayer: '🕌',
  sleep: '🌜',
  wakeup: '☀️',
};
