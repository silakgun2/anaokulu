import type { Classroom, Student, VideoLesson, WatchLog, GameActivity, LessonCategory } from '../types';

export interface CategoryMeta {
  id: LessonCategory;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  badgeColor: string;
  bgGradient: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'turkce',
    name: 'Okul Öncesi Türkçe & Masallar',
    shortName: 'Türkçe & Masal',
    icon: '📚',
    color: 'text-pink-600',
    badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
    bgGradient: 'from-pink-100/80 via-pink-50 to-white',
    description: 'Harfleri tanıma, ses bilgisi, tekerlemeler ve sevimli eğitici masallar.'
  },
  {
    id: 'ingilizce',
    name: 'Okul Öncesi İngilizce & Şarkılar',
    shortName: 'Neşeli İngilizce',
    icon: '🇬🇧',
    color: 'text-sky-600',
    badgeColor: 'bg-sky-100 text-sky-700 border-sky-200',
    bgGradient: 'from-sky-100/80 via-sky-50 to-white',
    description: 'Renkli şarkılarla hayvanlar, renkler, sayılar ve ilk İngilizce kelimeler.'
  },
  {
    id: 'matematik',
    name: 'Okul Öncesi Eğlenceli Matematik',
    shortName: 'Eğlenceli Matematik',
    icon: '🔢',
    color: 'text-amber-600',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    bgGradient: 'from-amber-100/80 via-amber-50 to-white',
    description: '1-10 arası nesne sayma, temel geometrik şekiller, büyük-küçük kavramları.'
  },
  {
    id: 'zeka_oyunlari',
    name: 'Zeka & Dikkat Geliştirici Oyunlar',
    shortName: 'Zeka & Mantık',
    icon: '🧩',
    color: 'text-purple-600',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    bgGradient: 'from-purple-100/80 via-purple-50 to-white',
    description: 'Görsel hafıza, eşleştirme, örüntü tamamlama ve problem çözme egzersizleri.'
  },
  {
    id: 'degerler_egitimi',
    name: 'Okul Öncesi Değerler Eğitimi',
    shortName: 'Değerler Eğitimi',
    icon: '💖',
    color: 'text-rose-600',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    bgGradient: 'from-rose-100/80 via-rose-50 to-white',
    description: 'Paylaşma, sihirli nezaket sözcükleri, doğa ve hayvan sevgisi, yardımlaşma.'
  }
];

export const INITIAL_CLASSES: Classroom[] = [
  {
    id: 'cls-1',
    name: '🌸 Minik Kelebekler Sınıfı',
    color: 'bg-pink-100 text-pink-800 border-pink-300',
    icon: '🦋',
    ageGroup: '3-4 Yaş',
    description: 'Küçük yaş grubu için duyusal algı, renkler ve temel motor becerileri.',
    createdAt: '2026-01-10'
  },
  {
    id: 'cls-2',
    name: '⭐ Parlayan Yıldızlar Sınıfı',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: '⭐',
    ageGroup: '4-5 Yaş',
    description: 'Orta yaş grubu için harf farkındalığı, sayma ve sosyal değerler.',
    createdAt: '2026-01-12'
  },
  {
    id: 'cls-3',
    name: '🚀 Neşeli Kaşifler Sınıfı',
    color: 'bg-sky-100 text-sky-800 border-sky-300',
    icon: '🚀',
    ageGroup: '5-6 Yaş',
    description: 'İlkokula hazırlık, mantık oyunları, İngilizce kelimeler ve problem çözme.',
    createdAt: '2026-01-15'
  },
  {
    id: 'cls-4',
    name: '🎨 Renkli Kalemler Sınıfı',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: '🎨',
    ageGroup: '4-6 Yaş (Karma)',
    description: 'Sanat, müzik, ritim ve yaratıcı drama etkinlik grubu.',
    createdAt: '2026-02-01'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    name: 'Ayşe Yılmaz',
    age: 4,
    parentName: 'Merve Yılmaz',
    parentPhone: '0532 111 22 33',
    email: 'ayse@anaokulu.com',
    password: '123',
    classId: 'cls-1',
    className: '🌸 Minik Kelebekler Sınıfı',
    avatar: '🐰',
    registeredAt: '2026-02-10',
    starsCount: 18,
    teacherNote: 'Ayşe hayvan sesleri oyununda çok başarılı. Masal saatlerini pür dikkat dinliyor.',
    badges: [
      { id: 'b1', title: 'Hayvan Dostu 🐶', icon: '🐾', awardedAt: '2026-02-15', reason: 'Tüm hayvan seslerini doğru bildi' },
      { id: 'b2', title: 'Kitap Kurdu 📖', icon: '⭐', awardedAt: '2026-02-18', reason: 'Türkçe masal videolarını tamamladı' }
    ]
  },
  {
    id: 'std-2',
    name: 'Can Demir',
    age: 5,
    parentName: 'Ahmet Demir',
    parentPhone: '0544 222 33 44',
    email: 'can@anaokulu.com',
    password: '123',
    classId: 'cls-2',
    className: '⭐ Parlayan Yıldızlar Sınıfı',
    avatar: '🦁',
    registeredAt: '2026-02-12',
    starsCount: 24,
    teacherNote: 'Can matematik sayı eşleştirmede harikalar yaratıyor. 1-10 arası saymayı çok iyi pekiştirdi.',
    badges: [
      { id: 'b3', title: 'Sayı Şampiyonu 🔢', icon: '🏆', awardedAt: '2026-02-16', reason: '1-10 Meyve Sayma oyununu 100 puanla bitirdi' },
      { id: 'b4', title: 'Zeka Ustası 🧩', icon: '💡', awardedAt: '2026-02-20', reason: 'Hafıza kartlarında rekor kırdı' }
    ]
  },
  {
    id: 'std-3',
    name: 'Zeynep Kaya',
    age: 5,
    parentName: 'Fatma Kaya',
    parentPhone: '0555 333 44 55',
    email: 'zeynep@anaokulu.com',
    password: '123',
    classId: 'cls-3',
    className: '🚀 Neşeli Kaşifler Sınıfı',
    avatar: '🦄',
    registeredAt: '2026-02-14',
    starsCount: 30,
    teacherNote: 'İngilizce şarkılara neşeyle eşlik ediyor. Değerler eğitimi konularında çok duyarlı.',
    badges: [
      { id: 'b5', title: 'İngilizce Yıldızı 🇬🇧', icon: '🌟', awardedAt: '2026-02-19', reason: 'Colors & Animals şarkısını eksiksiz izledi' },
      { id: 'b6', title: 'Nezaket Elçisi 💖', icon: '💐', awardedAt: '2026-02-22', reason: 'Sihirli sözcükler dersinde örnek oldu' }
    ]
  },
  {
    id: 'std-4',
    name: 'Kerem Şahin',
    age: 4,
    parentName: 'Emre Şahin',
    parentPhone: '0505 444 55 66',
    email: 'kerem@anaokulu.com',
    password: '123',
    classId: 'cls-1',
    className: '🌸 Minik Kelebekler Sınıfı',
    avatar: '🐼',
    registeredAt: '2026-02-18',
    starsCount: 12,
    teacherNote: 'Kerem derse yeni başladı, renk ve şekil oyunlarını çok seviyor.',
    badges: [
      { id: 'b7', title: 'İlk Adım ⭐', icon: '🎉', awardedAt: '2026-02-19', reason: 'İlk ders videosunu heyecanla tamamladı' }
    ]
  }
];

export const INITIAL_VIDEOS: VideoLesson[] = [
  // 1. TÜRKÇE
  {
    id: 'vid-tr-1',
    title: 'Ali Baba’nın Çiftliği & Sevimli Harfler Ormanı',
    category: 'turkce',
    durationSeconds: 240,
    videoUrl: 'https://www.youtube.com/embed/1BskZzF-6x4',
    description: 'Ali Baba\'nın çiftliğindeki hayvanları ziyaret ediyoruz ve alfabenin ilk seslerini neşeyle öğreniyoruz.',
    targetAge: '3-5 Yaş',
    thumbnail: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&auto=format&fit=crop&q=80',
    lyricsOrNotes: 'Ali Baba\'nın bir çiftliği var, çiftliğinde kuzuları var! "Mee mee" diye bağırır, çiftliğinde Ali Baba\'nın!',
    teacherName: 'Sıla Öğretmen',
    addedAt: '2026-02-10'
  },
  {
    id: 'vid-tr-2',
    title: 'Kırmızı Başlıklı Kız Masalı & Yeni Kelimeler',
    category: 'turkce',
    durationSeconds: 310,
    videoUrl: 'https://www.youtube.com/embed/N4M24i_93yI',
    description: 'Büyüleyici çizimlerle Kırmızı Başlıklı Kız masalı. Hikayedeki önemli kelimeler ve anlamları.',
    targetAge: '4-6 Yaş',
    thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    lyricsOrNotes: 'Ormanın içinden geçen patika yolda büyükannenin evine giden sevimli küçük kız...',
    teacherName: 'Sıla Öğretmen',
    addedAt: '2026-02-12'
  },
  {
    id: 'vid-tr-3',
    title: 'Alfabeyi Şarkılarla Öğreniyorum (A\'dan Z\'ye)',
    category: 'turkce',
    durationSeconds: 210,
    videoUrl: 'https://www.youtube.com/embed/n4q93v7bC6M',
    description: 'Renkli animasyon karakterleriyle okul öncesi ses farkındalığı ve alfabe şarkısı.',
    targetAge: '4-6 Yaş',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
    lyricsOrNotes: 'A - Arı vız vız, B - Balık yüzer, C - Ceviz çıtır, Ç - Çiçek güzel...',
    teacherName: 'Sıla Öğretmen',
    addedAt: '2026-02-15'
  },

  // 2. İNGİLİZCE
  {
    id: 'vid-en-1',
    title: 'Animals Song - Learn Farm & Wild Animals',
    category: 'ingilizce',
    durationSeconds: 220,
    videoUrl: 'https://www.youtube.com/embed/pWepfJ-8XU0',
    description: 'Cat, Dog, Cow, Lion, Monkey ve daha fazlası! Sevimli İngilizce hayvan şarkısı.',
    targetAge: '3-6 Yaş',
    thumbnail: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=600&auto=format&fit=crop&q=80',
    lyricsOrNotes: 'The cat says Meow, the dog says Woof! Old MacDonald had a farm, E-I-E-I-O!',
    teacherName: 'Sıla Öğretmen',
    addedAt: '2026-02-11'
  },
  {
    id: 'vid-en-2',
    title: 'Rainbow Colors Song - Red, Blue, Yellow, Pink',
    category: 'ingilizce',
    durationSeconds: 190,
    videoUrl: 'https://www.youtube.com/embed/zxIpA5nF_LY',
    description: 'Gökkuşağının tüm renklerini İngilizce telaffuzları ve eğlenceli çizimlerle tanıyoruz.',
    targetAge: '3-5 Yaş',
    thumbnail: 'https://images.unsplash.com/photo-1500462818028-56e5197bb991?w=600&auto=format&fit=crop&q=80',
    lyricsOrNotes: 'Red and yellow and pink and green, purple and orange and blue! I can sing a rainbow!',
    teacherName: 'Sıla Öğretmen',
    addedAt: '2026-02-14'
  },
  {
    id: 'vid-en-3',
    title: 'Numbers Song 1 to 10 - Let\'s Count Together!',
    category: 'ingilizce',
    durationSeconds: 200,
    videoUrl: 'https://www.youtube.com/embed/ea5-SIe5l7M',
    description: 'One, Two, Three, Four, Five! Parmaklarımızla saymayı İngilizce öğreniyoruz.',
    targetAge: '4-6 Yaş',
    thumbnail: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80',
    lyricsOrNotes: '1, 2, 3, 4, 5, Once I caught a fish alive! 6, 7, 8, 9, 10, Then I let it go again!',
    teacherName: 'Sıla Öğretmen',
    addedAt: '2026-02-17'
  },

  // 3. MATEMATİK
  {
    id: 'vid-math-1',
    title: '1\'den 10\'a Sevimli Meyveleri Sayıyoruz!',
    category: 'matematik',
    durationSeconds: 260,
    videoUrl: 'https://www.youtube.com/embed/D0Ajq682yrA',
    description: 'Sepete düşen elma, çilek ve portakalları tek tek sayarak sayı kavramını pekiştiriyoruz.',
    targetAge: '3-5 Yaş',
    thumbnail: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80',
    lyricsOrNotes: 'Bir elma dalda, iki çilek tabakta, üç portakal sepette!',
    teacherName: 'Sıla Öğretmen',
    addedAt: '2026-02-08'
  },
  {
    id: 'vid-math-2',
    title: 'Temel Geometrik Şekiller: Daire, Kare, Üçgen',
    category: 'matematik',
    durationSeconds: 230,
    videoUrl: 'https://www.youtube.com/embed/TJhFIW3b5pE',
    description: 'Güneş bir daire, ev bir kare, çatı ise üçgen! Çevremizdeki şekilleri keşfediyoruz.',
    targetAge: '3-6 Yaş',
    thumbnail: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80',
    lyricsOrNotes: 'Daire yuvarlak dönüyor, kare dört köşesiyle duruyor, üçgen ise dağ gibi yükseliyor!',
    teacherName: 'Sıla Öğretmen',
    addedAt: '2026-02-13'
  },
  {
    id: 'vid-math-3',
    title: 'Büyük - Küçük ve Az - Çok Karşılaştırmaları',
    category: 'matematik',
    durationSeconds: 215,
    videoUrl: 'https://www.youtube.com/embed/5T8_3g4oVjQ',
    description: 'Büyük fil ile küçük fare, dolu kavanoz ile boş kavanoz. Temel miktar ve boyut kavramları.',
    targetAge: '4-6 Yaş',
    thumbnail: 'https://images.unsplash.com/photo-1566378246598-5b11a0d486cc?w=600&auto=format&fit=crop&q=80',
    lyricsOrNotes: 'Fil çok büyük, karınca minicik! Çok şeker az tuz...',
    teacherName: 'Sıla Öğretmen',
    addedAt: '2026-02-16'
  },

  // 4. ZEKA OYUNLARI
  {
    id: 'vid-brain-1',
    title: 'Dedektif Tilki ile 5 Farkı Bulalım!',
    category: 'zeka_oyunlari',
    durationSeconds: 280,
    videoUrl: 'https://www.youtube.com/embed/V1bFr2SWP1I',
    description: 'Dikkat ve odaklanma egzersizleri. İki renkli resim arasındaki farkları birlikte buluyoruz.',
    targetAge: '4-6 Yaş',
    thumbnail: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80',
    lyricsOrNotes: 'Gözlerimizi dört açalım, resimdeki küçük sürprizleri hemen yakalayalım!',
    teacherName: 'Sıla Öğretmen',
    addedAt: '2026-02-09'
  },
  {
    id: 'vid-brain-2',
    title: 'Örüntü ve Sıralama Macerası (Kare - Daire - Kare - ?)',
    category: 'zeka_oyunlari',
    durationSeconds: 240,
    videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
    description: 'Sıradaki şekil veya renk hangisi olmalı? Çocuklarda analitik düşünmeyi geliştiren eğlenceli örüntüler.',
    targetAge: '4-6 Yaş',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=600&auto=format&fit=crop&q=80',
    lyricsOrNotes: 'Kırmızı, Mavi, Kırmızı, Mavi... Sıradaki renk hangisi?',
    teacherName: 'Sıla Öğretmen',
    addedAt: '2026-02-14'
  },

  // 5. DEĞERLER EĞİTİMİ
  {
    id: 'vid-val-1',
    title: 'Paylaşmak Çok Güzeldir: Paylaşımcı Ayıcık Hikayesi',
    category: 'degerler_egitimi',
    durationSeconds: 290,
    videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
    description: 'Oyuncağını arkadaşıyla paylaşan sevimli ayıcığın mutluluğu. Paylaşmanın ve dostluğun önemi.',
    targetAge: '3-6 Yaş',
    thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    lyricsOrNotes: 'Paylaşınca çoğalır neşemiz, birlikte oynayınca güler yüzümüz!',
    teacherName: 'Sıla Öğretmen',
    addedAt: '2026-02-07'
  },
  {
    id: 'vid-val-2',
    title: 'Sihirli Nezaket Sözcükleri: Lütfen ve Teşekkür Ederim',
    category: 'degerler_egitimi',
    durationSeconds: 220,
    videoUrl: 'https://www.youtube.com/embed/RgKAFK5djSk',
    description: 'Nezaket sözcükleri kapıları açan anahtarlardır. Günlük hayatta lütfen, rica ederim ve özür dilerim demek.',
    targetAge: '3-6 Yaş',
    thumbnail: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=600&auto=format&fit=crop&q=80',
    lyricsOrNotes: 'Bir şey isterken "Lütfen", alınca "Teşekkür ederim" deriz!',
    teacherName: 'Sıla Öğretmen',
    addedAt: '2026-02-12'
  },
  {
    id: 'vid-val-3',
    title: 'Doğayı ve Minik Hayvanları Seviyoruz!',
    category: 'degerler_egitimi',
    durationSeconds: 250,
    videoUrl: 'https://www.youtube.com/embed/fLexgOxsZu0',
    description: 'Ağaçları sulayan, kuşlara yem veren minik kahramanlarımızın çevre sevgisi yolculuğu.',
    targetAge: '3-6 Yaş',
    thumbnail: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80',
    lyricsOrNotes: 'Bir tohum ektim toprağa, yeşersin büyüsün ağaç olsun!',
    teacherName: 'Sıla Öğretmen',
    addedAt: '2026-02-16'
  }
];

export const INITIAL_WATCH_LOGS: WatchLog[] = [
  {
    id: 'wl-1',
    studentId: 'std-1',
    studentName: 'Ayşe Yılmaz',
    videoId: 'vid-tr-1',
    videoTitle: 'Ali Baba’nın Çiftliği & Sevimli Harfler Ormanı',
    category: 'turkce',
    watchSeconds: 240,
    totalDurationSeconds: 240,
    completedPercent: 100,
    lastWatchedAt: '2026-02-24 14:30'
  },
  {
    id: 'wl-2',
    studentId: 'std-1',
    studentName: 'Ayşe Yılmaz',
    videoId: 'vid-val-1',
    videoTitle: 'Paylaşmak Çok Güzeldir: Paylaşımcı Ayıcık Hikayesi',
    category: 'degerler_egitimi',
    watchSeconds: 210,
    totalDurationSeconds: 290,
    completedPercent: 72,
    lastWatchedAt: '2026-02-25 11:15'
  },
  {
    id: 'wl-3',
    studentId: 'std-2',
    studentName: 'Can Demir',
    videoId: 'vid-math-1',
    videoTitle: '1\'den 10\'a Sevimli Meyveleri Sayıyoruz!',
    category: 'matematik',
    watchSeconds: 260,
    totalDurationSeconds: 260,
    completedPercent: 100,
    lastWatchedAt: '2026-02-25 16:45'
  },
  {
    id: 'wl-4',
    studentId: 'std-2',
    studentName: 'Can Demir',
    videoId: 'vid-brain-1',
    videoTitle: 'Dedektif Tilki ile 5 Farkı Bulalım!',
    category: 'zeka_oyunlari',
    watchSeconds: 255,
    totalDurationSeconds: 280,
    completedPercent: 91,
    lastWatchedAt: '2026-02-26 09:20'
  },
  {
    id: 'wl-5',
    studentId: 'std-3',
    studentName: 'Zeynep Kaya',
    videoId: 'vid-en-1',
    videoTitle: 'Animals Song - Learn Farm & Wild Animals',
    category: 'ingilizce',
    watchSeconds: 220,
    totalDurationSeconds: 220,
    completedPercent: 100,
    lastWatchedAt: '2026-02-25 18:00'
  },
  {
    id: 'wl-6',
    studentId: 'std-3',
    studentName: 'Zeynep Kaya',
    videoId: 'vid-val-2',
    videoTitle: 'Sihirli Nezaket Sözcükleri: Lütfen ve Teşekkür Ederim',
    category: 'degerler_egitimi',
    watchSeconds: 220,
    totalDurationSeconds: 220,
    completedPercent: 100,
    lastWatchedAt: '2026-02-26 10:10'
  }
];

export const INITIAL_GAME_ACTIVITIES: GameActivity[] = [
  {
    id: 'ga-1',
    studentId: 'std-1',
    studentName: 'Ayşe Yılmaz',
    gameId: 'animal_sounds',
    gameTitle: '🦁 Hayvanlar ve Sesleri',
    score: 100,
    maxScore: 100,
    starsAwarded: 3,
    playedAt: '2026-02-24 15:00'
  },
  {
    id: 'ga-2',
    studentId: 'std-2',
    studentName: 'Can Demir',
    gameId: 'number_match',
    gameTitle: '🔢 Meyve Sayma & Sayı Eşleştirme',
    score: 100,
    maxScore: 100,
    starsAwarded: 3,
    playedAt: '2026-02-25 17:10'
  },
  {
    id: 'ga-3',
    studentId: 'std-2',
    studentName: 'Can Demir',
    gameId: 'memory_cards',
    gameTitle: '🃏 Sevimli Hafıza Kartları',
    score: 90,
    maxScore: 100,
    starsAwarded: 2,
    playedAt: '2026-02-25 17:30'
  },
  {
    id: 'ga-4',
    studentId: 'std-3',
    studentName: 'Zeynep Kaya',
    gameId: 'animal_sounds',
    gameTitle: '🦁 Hayvanlar ve Sesleri',
    score: 100,
    maxScore: 100,
    starsAwarded: 3,
    playedAt: '2026-02-26 10:30'
  }
];

export const AVATAR_OPTIONS = [
  { emoji: '🐰', label: 'Tavşancık' },
  { emoji: '🐻', label: 'Ayıcık' },
  { emoji: '🦁', label: 'Aslancık' },
  { emoji: '🐼', label: 'Pandacık' },
  { emoji: '🦄', label: 'Tekboynuz' },
  { emoji: '🐱', label: 'Kediciğin' },
  { emoji: '🐶', label: 'Köpecik' },
  { emoji: '🐥', label: 'Civciv' },
  { emoji: '🐸', label: 'Kurbağacık' },
  { emoji: '🦊', label: 'Tilkicik' },
  { emoji: '🐨', label: 'Koalacık' },
  { emoji: '🦋', label: 'Kelebek' },
];
