import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from "adhan";
import { UserProfile } from "./storage";
import { ScheduledTask } from "./scheduler";
import { getSurahName, getSurahForPage, getPageForAyah } from "./quranData";

export interface PrayerTimeInfo {
  name: string;
  arabicName: string;
  time: Date;
  status: "past" | "upcoming" | "current";
}

export interface DistributedSlot {
  id: string;
  parentPrayer: "الفجر" | "الضحى" | "الظهر" | "العصر" | "المغرب" | "العشاء";
  prayerName: string;
  prayerType: "fard" | "sunnah" | "qiyam";
  rakahNumber: number;
  assignedContent: string; // The part of the review allocated to this rakah
}

/**
 * Calculates current day's prayer times based on user latitude & longitude.
 */
export function calculateTodayPrayers(profile: UserProfile): PrayerTimeInfo[] {
  const coords = new Coordinates(profile.lat, profile.lng);
  const params = CalculationMethod.UmmAlQura();
  params.madhab = Madhab.Shafi; // Standard Shafi calculation, can default to Shafi/Hanafi
  const prayerTimes = new PrayerTimes(coords, new Date(), params);

  const rawPrayers = [
    { name: "Fajr", arabic: "الفجر", time: prayerTimes.fajr },
    { name: "Dhuhr", arabic: "الظهر", time: prayerTimes.dhuhr },
    { name: "Asr", arabic: "العصر", time: prayerTimes.asr },
    { name: "Maghrib", arabic: "المغرب", time: prayerTimes.maghrib },
    { name: "Isha", arabic: "العشاء", time: prayerTimes.isha }
  ];

  const now = new Date();
  
  // Find which prayer is closest
  return rawPrayers.map((p, idx) => {
    let status: "past" | "upcoming" | "current" = "upcoming";
    const pTime = new Date(p.time);
    
    if (now > pTime) {
      status = "past";
    }
    
    // Simple state highlighting first upcoming or last past
    return {
      name: p.name,
      arabicName: p.arabic,
      time: pTime,
      status
    };
  });
}

/**
 * Builds the chronological sequence of prayer slots based on user profile settings
 * and rotates them according to the selected start point.
 */
export function buildPrayerSlots(profile: UserProfile): {
  parentPrayer: "الفجر" | "الضحى" | "الظهر" | "العصر" | "المغرب" | "العشاء";
  prayerName: string;
  type: "fard" | "sunnah" | "qiyam";
  rakah: number;
}[] {
  const useSunnah = profile.useSunnah ?? true;
  const groups: Record<string, {
    parentPrayer: "الفجر" | "الضحى" | "الظهر" | "العصر" | "المغرب" | "العشاء";
    prayerName: string;
    type: "fard" | "sunnah" | "qiyam";
    rakah: number;
  }[]> = {
    duha: [],
    sunnah_fajr: [],
    fajr: [],
    sunnah_dhuhr_before: [],
    dhuhr: [],
    sunnah_dhuhr_after: [],
    sunnah_asr: [],
    asr: [],
    maghrib: [],
    sunnah_maghrib: [],
    isha: [],
    sunnah_isha: [],
    qiyam: []
  };

  // 1. Fajr
  if (useSunnah) {
    groups.sunnah_fajr.push(
      { parentPrayer: "الفجر", prayerName: "سنة الفجر القبلية", type: "sunnah", rakah: 1 },
      { parentPrayer: "الفجر", prayerName: "سنة الفجر القبلية", type: "sunnah", rakah: 2 }
    );
  }
  groups.fajr.push(
    { parentPrayer: "الفجر", prayerName: "صلاة الفجر (الفرض - الركعة الأولى)", type: "fard", rakah: 1 },
    { parentPrayer: "الفجر", prayerName: "صلاة الفجر (الفرض - الركعة الثانية)", type: "fard", rakah: 2 }
  );

  // 2. Duha
  const duhaRakats = profile.duhaRakats ?? 0;
  if (useSunnah && duhaRakats > 0) {
    for (let d = 1; d <= duhaRakats; d++) {
      groups.duha.push({ parentPrayer: "الضحى", prayerName: `سنة الضحى (الركعة ${d})`, type: "sunnah", rakah: d });
    }
  }

  // 3. Dhuhr
  if (useSunnah) {
    groups.sunnah_dhuhr_before.push(
      { parentPrayer: "الظهر", prayerName: "سنة الظهر القبلية (الشفع الأول)", type: "sunnah", rakah: 1 },
      { parentPrayer: "الظهر", prayerName: "سنة الظهر القبلية (الشفع الأول)", type: "sunnah", rakah: 2 },
      { parentPrayer: "الظهر", prayerName: "سنة الظهر القبلية (الشفع الثاني)", type: "sunnah", rakah: 3 },
      { parentPrayer: "الظهر", prayerName: "سنة الظهر القبلية (الشفع الثاني)", type: "sunnah", rakah: 4 }
    );
  }
  groups.dhuhr.push(
    { parentPrayer: "الظهر", prayerName: "صلاة الظهر (الفرض - الركعة الأولى)", type: "fard", rakah: 1 },
    { parentPrayer: "الظهر", prayerName: "صلاة الظهر (الفرض - الركعة الثانية)", type: "fard", rakah: 2 }
  );
  if (useSunnah) {
    groups.sunnah_dhuhr_after.push(
      { parentPrayer: "الظهر", prayerName: "سنة الظهر البعدية", type: "sunnah", rakah: 1 },
      { parentPrayer: "الظهر", prayerName: "سنة الظهر البعدية", type: "sunnah", rakah: 2 }
    );
  }

  // 4. Asr
  groups.asr.push(
    { parentPrayer: "العصر", prayerName: "صلاة العصر (الفرض - الركعة الأولى)", type: "fard", rakah: 1 },
    { parentPrayer: "العصر", prayerName: "صلاة العصر (الفرض - الركعة الثانية)", type: "fard", rakah: 2 }
  );

  // 5. Maghrib
  groups.maghrib.push(
    { parentPrayer: "المغرب", prayerName: "صلاة المغرب (الفرض - الركعة الأولى)", type: "fard", rakah: 1 },
    { parentPrayer: "المغرب", prayerName: "صلاة المغرب (الفرض - الركعة الثانية)", type: "fard", rakah: 2 }
  );
  if (useSunnah) {
    groups.sunnah_maghrib.push(
      { parentPrayer: "المغرب", prayerName: "سنة المغرب البعدية", type: "sunnah", rakah: 1 },
      { parentPrayer: "المغرب", prayerName: "سنة المغرب البعدية", type: "sunnah", rakah: 2 }
    );
  }

  // 6. Isha
  groups.isha.push(
    { parentPrayer: "العشاء", prayerName: "صلاة العشاء (الفرض - الركعة الأولى)", type: "fard", rakah: 1 },
    { parentPrayer: "العشاء", prayerName: "صلاة العشاء (الفرض - الركعة الثانية)", type: "fard", rakah: 2 }
  );
  if (useSunnah) {
    groups.sunnah_isha.push(
      { parentPrayer: "العشاء", prayerName: "سنة العشاء البعدية", type: "sunnah", rakah: 1 },
      { parentPrayer: "العشاء", prayerName: "سنة العشاء البعدية", type: "sunnah", rakah: 2 }
    );
  }

  // 7. Qiyam
  const qiyamRakats = profile.nightPrayerRakats ?? 0;
  if (qiyamRakats > 0) {
    for (let q = 1; q <= qiyamRakats; q++) {
      groups.qiyam.push({ parentPrayer: "العشاء", prayerName: `صلاة الوتر وقيام الليل (الركعة ${q})`, type: "qiyam", rakah: q });
    }
  }

  // The master chronological order as requested in v2.1.2
  // Structure: Prayer + its following sunnahs
  const groupOrder = [
    "fajr", "sunnah_fajr", "duha", "dhuhr", "sunnah_dhuhr_after", "sunnah_dhuhr_before",
    "asr", "sunnah_asr", "maghrib", "sunnah_maghrib", "isha", "sunnah_isha", "qiyam"
  ];

  // Logic: "كل صلاة الحق بها السنة اللتي تتبعها"
  // Note: Standard Sunnah Mu'akkadah:
  // Fajr: 2 before. Dhuhr: 4 before, 2 after. Maghrib: 2 after. Isha: 2 after.
  // To strictly follow "حق بها السنة اللتي تتبعها", we arrange them in blocks.

  const blocks: Record<string, string[]> = {
    fajr: ["sunnah_fajr", "fajr"], // Sunnah is before but belongs to Fajr block
    duha: ["duha"],
    dhuhr: ["sunnah_dhuhr_before", "dhuhr", "sunnah_dhuhr_after"],
    asr: ["sunnah_asr", "asr"],
    maghrib: ["maghrib", "sunnah_maghrib"],
    isha: ["isha", "sunnah_isha"],
    qiyam: ["qiyam"]
  };

  const blockOrder = ["fajr", "duha", "dhuhr", "asr", "maghrib", "isha", "qiyam"];

  // Logic: "للمستخدم حرية اختيار الصلوات وتجاوز مالا يريد المراجعة بها"
  // We use the enabledPrayers array from the profile.
  const enabledPrayers = profile.enabledPrayers || blockOrder;
  const finalOrder = blockOrder.filter(p => enabledPrayers.includes(p));

  const slots: {
    parentPrayer: "الفجر" | "الضحى" | "الظهر" | "العصر" | "المغرب" | "العشاء";
    prayerName: string;
    type: "fard" | "sunnah" | "qiyam";
    rakah: number
  }[] = [];

  finalOrder.forEach(blockKey => {
    blocks[blockKey].forEach(groupKey => {
      const groupSlots = groups[groupKey];
      // Logic: If user is Maamoom, they don't read in Fard of Loud prayers (Fajr, Maghrib, Isha)
      const filtered = groupSlots.filter(s => {
        if (profile.prayerRole === 'maamoom' && s.type === 'fard') {
          if (['الفجر', 'المغرب', 'العشاء'].includes(s.parentPrayer)) return false;
        }
        return true;
      });
      slots.push(...filtered);
    });
  });

  return slots;
}

/**
 * Core engine to distribute any array of content strings across available prayer slots.
 * Uses a fair chunking algorithm to ensure even distribution.
 */
function distributeContentToSlots(
  contentItems: string[],
  profile: UserProfile,
  idPrefix: string
): DistributedSlot[] {
  const slots = buildPrayerSlots(profile);
  if (slots.length === 0 || contentItems.length === 0) return [];

  const distributed: DistributedSlot[] = [];

  // Sequential distribution: Fill slots one by one starting from the first available slot.
  // This ensures we don't skip the first Rakahs if content is limited.
  contentItems.forEach((content, index) => {
    // If we have more items than slots, we wrap around (or we could chunk,
    // but sequential filling is usually what users expect for prayers)
    const slotIdx = index % slots.length;
    const slot = slots[slotIdx];

    // If a slot already has content (during wrap-around), we append it
    const existing = distributed.find(d => d.id === `${idPrefix}-${slotIdx}`);
    if (existing) {
      existing.assignedContent += ` + ${content}`;
    } else {
      distributed.push({
        id: `${idPrefix}-${slotIdx}`,
        parentPrayer: slot.parentPrayer,
        prayerName: slot.prayerName,
        prayerType: slot.type,
        rakahNumber: slot.rakah,
        assignedContent: content
      });
    }
  });

  // Re-sort distributed items based on their original slot order to maintain chronological view
  return distributed.sort((a, b) => {
    const aIdx = parseInt(a.id.split('-').pop() || "0");
    const bIdx = parseInt(b.id.split('-').pop() || "0");
    return aIdx - bIdx;
  });
}

/**
 * Distributes today's available reviews across the allowed Rak'ahs.
 */
export function distributeReviewsToPrayers(
  reviewTasks: ScheduledTask[],
  profile: UserProfile
): DistributedSlot[] {
  const activeReviews = reviewTasks.filter(t => t.type === "review" && !t.isCompleted);
  if (activeReviews.length === 0) return [];

  const reviewPartitions: string[] = [];
  activeReviews.forEach(t => {
    const sName = getSurahName(t.block.surahId);
    const totalAyats = t.block.toAyah - t.block.fromAyah + 1;

    if (totalAyats > 10) {
      const mid = Math.floor((t.block.fromAyah + t.block.toAyah) / 2);
      reviewPartitions.push(`سورة ${sName} (${t.block.fromAyah}-${mid})`);
      reviewPartitions.push(`سورة ${sName} (${mid + 1}-${t.block.toAyah})`);
    } else {
      reviewPartitions.push(`سورة ${sName} (${t.block.fromAyah}-${t.block.toAyah})`);
    }
  });

  return distributeContentToSlots(reviewPartitions, profile, "rev-dist");
}

/**
 * Distributes today's Khatmah Review (Track 2) across daily prayers.
 */
export function distributeKhatmahReviewToPrayers(profile: UserProfile): DistributedSlot[] {
  const pageItems: string[] = [];

  if (profile.reviewOnlyDailyAmountType === "surah_ayah") {
    const surahId = profile.reviewOnlySurahId || 2;
    const fromAyah = profile.reviewOnlyFromAyah || 1;
    const toAyah = profile.reviewOnlyToAyah || 100;
    pageItems.push(`سورة ${getSurahName(surahId)} (الآيات ${fromAyah} - ${toAyah})`);
  } else {
    const startPage = profile.reviewOnlyCurrentPage || 1;
    const amount = profile.reviewOnlyDailyAmountValue || 20;
    const direction = profile.reviewOnlyDirection || "forward";

    for (let i = 0; i < amount; i++) {
      let p = direction === "forward" ? startPage + i : startPage - i;
      if (p > 604) p = ((p - 1) % 604) + 1;
      if (p < 1) p = 604 + (p % 604);

      const sName = getSurahForPage(p);
      pageItems.push(`ص ${p} (${sName})`);
    }
  }

  return distributeContentToSlots(pageItems, profile, "khatmah-dist");
}
