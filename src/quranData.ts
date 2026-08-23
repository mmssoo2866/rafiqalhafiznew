export interface MurtagaInfo {
  id: number;
  name: string;
  endSurahId: number; // The target Surah to reach the Mastery Phase
  startSurahId: number; // The beginning of the Murtaga
}

export const MURTAGAS: MurtagaInfo[] = [
  { id: 1, name: "مرتقى الملك", startSurahId: 114, endSurahId: 67 },
  { id: 2, name: "مرتقى ق", startSurahId: 66, endSurahId: 50 },
  { id: 3, name: "مرتقى الزمر", startSurahId: 49, endSurahId: 39 },
  { id: 4, name: "مرتقى النمل", startSurahId: 38, endSurahId: 27 },
  { id: 5, name: "مرتقى الكهف", startSurahId: 26, endSurahId: 18 },
  { id: 6, name: "مرتقى يونس", startSurahId: 17, endSurahId: 10 },
  { id: 7, name: "مرتقى المائدة", startSurahId: 9, endSurahId: 5 },
  { id: 8, name: "مرتقى الفاتحة", startSurahId: 4, endSurahId: 1 }
];

export interface SurahInfo {
  id: number;
  name: string;
  english: string;
  ayahs: number;
  startPage: number;
}

export const SURAHS: SurahInfo[] = [
  { id: 1, name: "الفاتحة", english: "Al-Fatihah", ayahs: 7, startPage: 1 },
  { id: 2, name: "البقرة", english: "Al-Baqarah", ayahs: 286, startPage: 2 },
  { id: 3, name: "آل عمران", english: "Al-Imran", ayahs: 200, startPage: 50 },
  { id: 4, name: "النساء", english: "An-Nisa'", ayahs: 176, startPage: 77 },
  { id: 5, name: "المائدة", english: "Al-Ma'idah", ayahs: 120, startPage: 106 },
  { id: 6, name: "الأنعام", english: "Al-An'am", ayahs: 165, startPage: 128 },
  { id: 7, name: "الأعراف", english: "Al-A'raf", ayahs: 206, startPage: 151 },
  { id: 8, name: "الأنفال", english: "Al-Anfal", ayahs: 75, startPage: 177 },
  { id: 9, name: "التوبة", english: "At-Tawbah", ayahs: 129, startPage: 187 },
  { id: 10, name: "يونس", english: "Yunus", ayahs: 109, startPage: 208 },
  { id: 11, name: "هود", english: "Hud", ayahs: 123, startPage: 221 },
  { id: 12, name: "يوسف", english: "Yusuf", ayahs: 111, startPage: 235 },
  { id: 13, name: "الرعد", english: "Ar-Ra'd", ayahs: 43, startPage: 249 },
  { id: 14, name: "إبراهيم", english: "Ibrahim", ayahs: 52, startPage: 255 },
  { id: 15, name: "الحجر", english: "Al-Hijr", ayahs: 99, startPage: 262 },
  { id: 16, name: "النحل", english: "An-Nahl", ayahs: 128, startPage: 267 },
  { id: 17, name: "الإسراء", english: "Al-Isra'", ayahs: 111, startPage: 282 },
  { id: 18, name: "الكهف", english: "Al-Kahf", ayahs: 110, startPage: 293 },
  { id: 19, name: "مريم", english: "Maryam", ayahs: 98, startPage: 305 },
  { id: 20, name: "طه", english: "Ta-Ha", ayahs: 135, startPage: 312 },
  { id: 21, name: "الأنبياء", english: "Al-Anbiya'", ayahs: 112, startPage: 322 },
  { id: 22, name: "الحج", english: "Al-Hajj", ayahs: 78, startPage: 332 },
  { id: 23, name: "المؤمنون", english: "Al-Mu'minun", ayahs: 118, startPage: 342 },
  { id: 24, name: "النور", english: "An-Nur", ayahs: 64, startPage: 350 },
  { id: 25, name: "الفرقان", english: "Al-Furqan", ayahs: 77, startPage: 359 },
  { id: 26, name: "الشعراء", english: "Ash-Shu'ara'", ayahs: 227, startPage: 367 },
  { id: 27, name: "النمل", english: "An-Naml", ayahs: 93, startPage: 377 },
  { id: 28, name: "القصص", english: "Al-Qasas", ayahs: 88, startPage: 385 },
  { id: 29, name: "العنكبوت", english: "Al-Ankabut", ayahs: 69, startPage: 396 },
  { id: 30, name: "الروم", english: "Ar-Rum", ayahs: 60, startPage: 404 },
  { id: 31, name: "لقمان", english: "Luqman", ayahs: 34, startPage: 411 },
  { id: 32, name: "السجدة", english: "As-Sajdah", ayahs: 30, startPage: 415 },
  { id: 33, name: "الأحزاب", english: "Al-Ahzab", ayahs: 73, startPage: 418 },
  { id: 34, name: "سبأ", english: "Saba'", ayahs: 54, startPage: 428 },
  { id: 35, name: "فاطر", english: "Fatir", ayahs: 45, startPage: 434 },
  { id: 36, name: "يس", english: "Ya-Sin", ayahs: 83, startPage: 440 },
  { id: 37, name: "الصافات", english: "As-Saffat", ayahs: 182, startPage: 446 },
  { id: 38, name: "ص", english: "Sad", ayahs: 88, startPage: 453 },
  { id: 39, name: "الزمر", english: "Az-Zumar", ayahs: 75, startPage: 458 },
  { id: 40, name: "غافر", english: "Ghafir", ayahs: 85, startPage: 467 },
  { id: 41, name: "فصلت", english: "Fussilat", ayahs: 54, startPage: 477 },
  { id: 42, name: "الشورى", english: "Ash-Shura", ayahs: 53, startPage: 483 },
  { id: 43, name: "الزخرف", english: "Az-Zukhruf", ayahs: 89, startPage: 489 },
  { id: 44, name: "الدخان", english: "Ad-Dukhan", ayahs: 59, startPage: 496 },
  { id: 45, name: "الجاثية", english: "Al-Jathiyah", ayahs: 37, startPage: 499 },
  { id: 46, name: "الأحقاف", english: "Al-Ahqaf", ayahs: 35, startPage: 502 },
  { id: 47, name: "محمد", english: "Muhammad", ayahs: 38, startPage: 507 },
  { id: 48, name: "الفتح", english: "Al-Fath", ayahs: 29, startPage: 511 },
  { id: 49, name: "الحجرات", english: "Al-Hujurat", ayahs: 18, startPage: 515 },
  { id: 50, name: "ق", english: "Qaf", ayahs: 45, startPage: 518 },
  { id: 51, name: "الذاريات", english: "Adh-Dhariyat", ayahs: 60, startPage: 520 },
  { id: 52, name: "الطور", english: "At-Tur", ayahs: 49, startPage: 523 },
  { id: 53, name: "النجم", english: "An-Najm", ayahs: 62, startPage: 525 },
  { id: 54, name: "القمر", english: "Al-Qamar", ayahs: 55, startPage: 528 },
  { id: 55, name: "الرحمن", english: "Ar-Rahman", ayahs: 78, startPage: 531 },
  { id: 56, name: "الواقعة", english: "Al-Waqi'ah", ayahs: 96, startPage: 534 },
  { id: 57, name: "الحديد", english: "Al-Hadid", ayahs: 29, startPage: 537 },
  { id: 58, name: "المجادلة", english: "Al-Mujadilah", ayahs: 22, startPage: 542 },
  { id: 59, name: "الحشر", english: "Al-Hashr", ayahs: 24, startPage: 545 },
  { id: 60, name: "الممتحنة", english: "Al-Mumtahanah", ayahs: 13, startPage: 549 },
  { id: 61, name: "الصف", english: "As-Saff", ayahs: 14, startPage: 551 },
  { id: 62, name: "الجمعة", english: "Al-Jumu'ah", ayahs: 11, startPage: 553 },
  { id: 63, name: "المنافقون", english: "Al-Munafiqun", ayahs: 11, startPage: 554 },
  { id: 64, name: "التغابن", english: "At-Taghabun", ayahs: 18, startPage: 556 },
  { id: 65, name: "الطلاق", english: "At-Talaq", ayahs: 12, startPage: 558 },
  { id: 66, name: "التحريم", english: "At-Tahrim", ayahs: 12, startPage: 560 },
  { id: 67, name: "الملك", english: "Al-Mulk", ayahs: 30, startPage: 562 },
  { id: 68, name: "القلم", english: "Al-Qalam", ayahs: 52, startPage: 564 },
  { id: 69, name: "الحاقة", english: "Al-Haqqah", ayahs: 52, startPage: 566 },
  { id: 70, name: "المعارج", english: "Al-Ma'arij", ayahs: 44, startPage: 568 },
  { id: 71, name: "نوح", english: "Nuh", ayahs: 28, startPage: 570 },
  { id: 72, name: "الجن", english: "Al-Jinn", ayahs: 28, startPage: 572 },
  { id: 73, name: "المزمل", english: "Al-Muzzammil", ayahs: 20, startPage: 574 },
  { id: 74, name: "المدثر", english: "Al-Muddaththir", ayahs: 56, startPage: 575 },
  { id: 75, name: "القيامة", english: "Al-Qiyamah", ayahs: 40, startPage: 577 },
  { id: 76, name: "الإنسان", english: "Al-Insan", ayahs: 31, startPage: 578 },
  { id: 77, name: "المرسلات", english: "Al-Mursalat", ayahs: 50, startPage: 580 },
  { id: 78, name: "النبأ", english: "An-Naba'", ayahs: 40, startPage: 582 },
  { id: 79, name: "النازعات", english: "An-Nazi'at", ayahs: 46, startPage: 585 },
  { id: 80, name: "عبس", english: "Abasa", ayahs: 42, startPage: 587 },
  { id: 81, name: "التكوير", english: "At-Takwir", ayahs: 29, startPage: 589 },
  { id: 82, name: "الانفطار", english: "Al-Infitar", ayahs: 19, startPage: 590 },
  { id: 83, name: "المطففين", english: "Al-Mutaffifin", ayahs: 36, startPage: 591 },
  { id: 84, name: "الانشقاق", english: "Al-Inshiqaq", ayahs: 25, startPage: 593 },
  { id: 85, name: "البروج", english: "Al-Buruj", ayahs: 22, startPage: 594 },
  { id: 86, name: "الطارق", english: "At-Tariq", ayahs: 17, startPage: 595 },
  { id: 87, name: "الأعلى", english: "Al-A'la", ayahs: 19, startPage: 596 },
  { id: 88, name: "الغاشية", english: "Al-Ghashiyah", ayahs: 26, startPage: 597 },
  { id: 89, name: "الفجر", english: "Al-Fajr", ayahs: 30, startPage: 597 },
  { id: 90, name: "البلد", english: "Al-Balad", ayahs: 20, startPage: 599 },
  { id: 91, name: "الشمس", english: "Ash-Shams", ayahs: 15, startPage: 601 },
  { id: 92, name: "الليل", english: "Al-Layl", ayahs: 21, startPage: 601 },
  { id: 93, name: "الضحى", english: "Ad-Duha", ayahs: 11, startPage: 602 },
  { id: 94, name: "الشرح", english: "Ash-Sharh", ayahs: 8, startPage: 602 },
  { id: 95, name: "التين", english: "At-Tin", ayahs: 8, startPage: 603 },
  { id: 96, name: "العلق", english: "Al-Alaq", ayahs: 19, startPage: 603 },
  { id: 97, name: "القدر", english: "Al-Qadr", ayahs: 5, startPage: 604 },
  { id: 98, name: "البينة", english: "Al-Bayyinah", ayahs: 8, startPage: 604 },
  { id: 99, name: "الزلزلة", english: "Az-Zalzalah", ayahs: 8, startPage: 604 },
  { id: 100, name: "العاديات", english: "Al-Adiyat", ayahs: 11, startPage: 604 },
  { id: 101, name: "القارعة", english: "Al-Qari'ah", ayahs: 11, startPage: 604 },
  { id: 102, name: "التكاثر", english: "At-Taka-thur", ayahs: 8, startPage: 604 },
  { id: 103, name: "العصر", english: "Al-Asr", ayahs: 3, startPage: 604 },
  { id: 104, name: "الهمزة", english: "Al-Humazah", ayahs: 9, startPage: 604 },
  { id: 105, name: "الفيل", english: "Al-Fil", ayahs: 5, startPage: 604 },
  { id: 106, name: "قريش", english: "Quraysh", ayahs: 4, startPage: 604 },
  { id: 107, name: "الماعون", english: "Al-Ma'un", ayahs: 7, startPage: 604 },
  { id: 108, name: "الكوثر", english: "Al-Kawthar", ayahs: 3, startPage: 604 },
  { id: 109, name: "الكافرون", english: "Al-Kafirun", ayahs: 6, startPage: 604 },
  { id: 110, name: "النصر", english: "An-Nasr", ayahs: 3, startPage: 604 },
  { id: 111, name: "المسد", english: "Al-Masad", ayahs: 5, startPage: 604 },
  { id: 112, name: "الإخلاص", english: "Al-Ikhlas", ayahs: 4, startPage: 604 },
  { id: 113, name: "الفلق", english: "Al-Falaq", ayahs: 5, startPage: 604 },
  { id: 114, name: "الناس", english: "An-Nas", ayahs: 6, startPage: 604 }
];

/**
 * Standard 604-page Madinah Mushaf (King Fahd Complex) page start mapping.
 * Each entry is [surahId, ayahNum] representing the FIRST ayah on that page.
 * Index 0 corresponds to Page 1, Index 603 corresponds to Page 604.
 */
export const PAGE_START_AYAH: [number, number][] = [
  [1, 1], [2, 1], [2, 6], [2, 17], [2, 25], [2, 30], [2, 38], [2, 49], [2, 58], [2, 62],
  [2, 66], [2, 70], [2, 77], [2, 84], [2, 89], [2, 94], [2, 102], [2, 106], [2, 113], [2, 120],
  [2, 127], [2, 135], [2, 142], [2, 146], [2, 154], [2, 164], [2, 170], [2, 177], [2, 182], [2, 187],
  [2, 191], [2, 197], [2, 203], [2, 211], [2, 216], [2, 225], [2, 231], [2, 234], [2, 238], [2, 246],
  [2, 249], [2, 253], [2, 257], [2, 260], [2, 265], [2, 271], [2, 275], [2, 282], [2, 283], [3, 1],
  [3, 10], [3, 16], [3, 23], [3, 30], [3, 38], [3, 46], [3, 53], [3, 62], [3, 71], [3, 78],
  [3, 84], [3, 93], [3, 101], [3, 109], [3, 116], [3, 122], [3, 133], [3, 141], [3, 149], [3, 154],
  [3, 158], [3, 166], [3, 174], [3, 181], [3, 187], [3, 195], [4, 1], [4, 7], [4, 12], [4, 15],
  [4, 20], [4, 24], [4, 27], [4, 34], [4, 38], [4, 45], [4, 52], [4, 60], [4, 66], [4, 75],
  [4, 80], [4, 87], [4, 92], [4, 95], [4, 102], [4, 106], [4, 114], [4, 122], [4, 128], [4, 135],
  [4, 141], [4, 148], [4, 155], [4, 163], [4, 171], [5, 1], [5, 3], [5, 6], [5, 10], [5, 14],
  [5, 18], [5, 24], [5, 32], [5, 37], [5, 42], [5, 46], [5, 51], [5, 58], [5, 65], [5, 71],
  [5, 77], [5, 83], [5, 90], [5, 96], [5, 104], [5, 109], [5, 114], [6, 1], [6, 9], [6, 19],
  [6, 28], [6, 36], [6, 45], [6, 53], [6, 60], [6, 69], [6, 74], [6, 82], [6, 91], [6, 95],
  [6, 102], [6, 111], [6, 119], [6, 125], [6, 132], [6, 138], [6, 143], [6, 147], [6, 152], [6, 158],
  [7, 1], [7, 12], [7, 23], [7, 31], [7, 38], [7, 44], [7, 52], [7, 58], [7, 68], [7, 74],
  [7, 82], [7, 88], [7, 96], [7, 105], [7, 117], [7, 121], [7, 131], [7, 138], [7, 142], [7, 150],
  [7, 156], [7, 160], [7, 164], [7, 171], [7, 179], [7, 188], [7, 196], [8, 1], [8, 9], [8, 17],
  [8, 26], [8, 34], [8, 41], [8, 46], [8, 53], [8, 62], [8, 70], [9, 1], [9, 7], [9, 14],
  [9, 21], [9, 27], [9, 32], [9, 37], [9, 41], [9, 48], [9, 55], [9, 62], [9, 69], [9, 73],
  [9, 80], [9, 87], [9, 94], [9, 100], [9, 107], [9, 112], [9, 118], [9, 123], [10, 1], [10, 7],
  [10, 15], [10, 21], [10, 26], [10, 34], [10, 43], [10, 54], [10, 62], [10, 71], [10, 79], [10, 89],
  [10, 98], [10, 107], [11, 1], [11, 6], [11, 13], [11, 20], [11, 29], [11, 38], [11, 46], [11, 54],
  [11, 63], [11, 72], [11, 82], [11, 89], [11, 98], [11, 109], [11, 118], [12, 1], [12, 5], [12, 15],
  [12, 23], [12, 31], [12, 38], [12, 44], [12, 53], [12, 64], [12, 70], [12, 79], [12, 87], [12, 96],
  [12, 104], [13, 1], [13, 6], [13, 14], [13, 19], [13, 29], [13, 35], [13, 43], [14, 1], [14, 6],
  [14, 11], [14, 19], [14, 25], [14, 34], [14, 43], [15, 1], [15, 16], [15, 32], [15, 52], [15, 71],
  [15, 91], [16, 1], [16, 7], [16, 15], [16, 27], [16, 35], [16, 43], [16, 55], [16, 65], [16, 73],
  [16, 80], [16, 88], [16, 94], [16, 103], [16, 111], [16, 119], [17, 1], [17, 8], [17, 18], [17, 28],
  [17, 39], [17, 50], [17, 59], [17, 67], [17, 76], [17, 87], [17, 97], [17, 105], [18, 1], [18, 5],
  [18, 16], [18, 21], [18, 28], [18, 35], [18, 46], [18, 55], [18, 62], [18, 75], [18, 84], [18, 98],
  [19, 1], [19, 12], [19, 26], [19, 39], [19, 52], [19, 65], [19, 77], [19, 96], [20, 1], [20, 13],
  [20, 38], [20, 52], [20, 65], [20, 77], [20, 88], [20, 105], [20, 114], [20, 126], [21, 1], [21, 11],
  [21, 25], [21, 36], [21, 45], [21, 58], [21, 73], [21, 82], [21, 91], [21, 102], [21, 112], [22, 1], [22, 6],
  [22, 16], [22, 24], [22, 31], [22, 39], [22, 47], [22, 56], [22, 65], [22, 73], [23, 1], [23, 18],
  [23, 28], [23, 45], [23, 60], [23, 75], [23, 90], [23, 105], [24, 1], [24, 11], [24, 21], [24, 28],
  [24, 32], [24, 37], [24, 44], [24, 54], [24, 59], [25, 1], [25, 3], [25, 12], [25, 21], [25, 33],
  [25, 44], [25, 56], [25, 68], [26, 1], [26, 20], [26, 40], [26, 61], [26, 84], [26, 112], [26, 137],
  [26, 160], [26, 184], [26, 207], [27, 1], [27, 14], [27, 23], [27, 36], [27, 45], [27, 56], [27, 64],
  [27, 77], [27, 89], [28, 1], [28, 6], [28, 14], [28, 22], [28, 29], [28, 36], [28, 44], [28, 51],
  [28, 60], [28, 71], [28, 78], [29, 1], [29, 7], [29, 15], [29, 24], [29, 31], [29, 39], [29, 46],
  [29, 53], [29, 64], [30, 1], [30, 6], [30, 16], [30, 25], [30, 33], [30, 42], [30, 51], [31, 1],
  [31, 12], [31, 20], [31, 29], [32, 1], [32, 12], [32, 23], [33, 1], [33, 7], [33, 16], [33, 23],
  [33, 31], [33, 36], [33, 44], [33, 51], [33, 60], [33, 63], [34, 1], [34, 8], [34, 15], [34, 23],
  [34, 32], [34, 40], [35, 1], [35, 4], [35, 12], [35, 19], [35, 31], [35, 39], [36, 1], [36, 13],
  [36, 28], [36, 41], [36, 55], [36, 71], [37, 1], [37, 25], [37, 52], [37, 77], [37, 103], [37, 127],
  [37, 154], [38, 1], [38, 17], [38, 27], [38, 43], [38, 62], [38, 84], [39, 1], [39, 6], [39, 11],
  [39, 22], [39, 32], [39, 41], [39, 48], [39, 57], [39, 68], [39, 75], [40, 1], [40, 8], [40, 17],
  [40, 26], [40, 34], [40, 41], [40, 50], [40, 59], [40, 67], [40, 78], [41, 1], [41, 12], [41, 21],
  [41, 30], [41, 39], [41, 47], [42, 1], [42, 11], [42, 16], [42, 23], [42, 32], [42, 45], [43, 1],
  [43, 11], [43, 23], [43, 34], [43, 48], [43, 61], [43, 74], [44, 1], [44, 19], [44, 40], [45, 1],
  [45, 14], [45, 23], [45, 33], [46, 1], [46, 6], [46, 15], [46, 21], [46, 29], [47, 1], [47, 12],
  [47, 20], [47, 30], [48, 1], [48, 10], [48, 16], [48, 24], [49, 1], [49, 5], [49, 12], [50, 1],
  [50, 16], [50, 31], [51, 1], [51, 31], [51, 52], [52, 1], [52, 15], [52, 32], [53, 1], [53, 27],
  [53, 45], [54, 1], [54, 7], [54, 23], [54, 41], [55, 1], [55, 17], [55, 41], [55, 68], [56, 1],
  [56, 17], [56, 51], [56, 77], [57, 1], [57, 12], [57, 19], [57, 25], [58, 1], [58, 7], [58, 12],
  [58, 22], [59, 1], [59, 4], [59, 10], [59, 18], [60, 1], [60, 6], [61, 1], [61, 6], [62, 1],
  [62, 9], [63, 1], [63, 5], [64, 1], [64, 10], [65, 1], [65, 6], [66, 1], [66, 8], [67, 1],
  [67, 13], [67, 27], [68, 1], [68, 16], [68, 43], [69, 1], [69, 9], [69, 35], [70, 1], [70, 11],
  [70, 40], [71, 1], [71, 11], [71, 21], [72, 1], [72, 14], [72, 20], [73, 1], [73, 20], [74, 1],
  [74, 18], [74, 32], [74, 48], [75, 1], [75, 20], [76, 1], [76, 6], [76, 26], [77, 1], [77, 20],
  [77, 41], [78, 1], [78, 31], [79, 1], [79, 16], [80, 1], [80, 24], [81, 1], [82, 1], [83, 1],
  [83, 7], [83, 21], [84, 1], [85, 1], [86, 1], [87, 1], [88, 1], [89, 1], [89, 14], [90, 1],
  [91, 1], [92, 1], [93, 1], [94, 1], [95, 1], [96, 1], [96, 9], [97, 1], [98, 1], [99, 1],
  [100, 1], [100, 10], [101, 1], [102, 1], [103, 1], [104, 1], [105, 1], [106, 1], [107, 1], [108, 1],
  [109, 1], [110, 1], [111, 1], [112, 1], [113, 1], [114, 1]
];


export function getSurahById(id: number): SurahInfo | undefined {
  return SURAHS.find((s) => s.id === id);
}

export function getSurahName(id: number): string {
  const s = getSurahById(id);
  return s ? s.name : "غير معروف";
}

export function getPageForAyah(surahId: number, ayahNum: number): number {
  const current = getSurahById(surahId);
  if (!current) return 1;

  // Clamp ayahNum to valid range [1, current.ayahs]
  const safeAyahNum = Math.max(1, Math.min(current.ayahs, ayahNum));

  // Binary search for the highest page index where PAGE_START_AYAH[index] <= [surahId, safeAyahNum]
  let low = 0;
  let high = PAGE_START_AYAH.length - 1;
  let resultPageIndex = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const [startSurah, startAyah] = PAGE_START_AYAH[mid];

    if (startSurah < surahId || (startSurah === surahId && startAyah <= safeAyahNum)) {
      resultPageIndex = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  // Page number is index + 1
  return resultPageIndex + 1;
}

export function getSurahForPage(page: number): string {
  // Use mapping for the core 604 pages
  if (page >= 1 && page <= 604) {
    const [surahId] = PAGE_START_AYAH[page - 1];
    return getSurahName(surahId);
  }

  // Fallback for extra pages (605-604)
  const pageNum = Math.max(1, Math.min(604, page));
  let found = SURAHS[0];
  for (let i = 0; i < SURAHS.length; i++) {
    if (SURAHS[i].startPage <= pageNum) {
      found = SURAHS[i];
    } else {
      break;
    }
  }
  return found.name;
}
