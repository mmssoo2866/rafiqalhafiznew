import { SURAHS } from "./quranData";

export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getLocalDateKey(): string {
  return formatDateKey(new Date());
}

export interface UserProfile {
  name: string;
  gender: "male" | "female";
  prayerRole: "imam" | "maamoom";
  nightPrayerRakats: number;
  lat: number;
  lng: number;
  useSunnah: boolean;
  memorizationDirection: "forward" | "backward";
  autoOpenMushaf: boolean;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  enableNotifications?: boolean;
  notifyPrayerTimes?: boolean;
  notifyReviewReminder?: boolean;
  notifyPrayerReviewBefore?: boolean;
  prayerReminderOffsetMinutes?: number;
  prayerReminderOffsets?: {
    fajr?: number;
    dhuhr?: number;
    asr?: number;
    maghrib?: number;
    isha?: number;
  };
  mushafNightMode?: boolean;
  duhaRakats?: number;
  appTrack?: "hifz_and_review" | "review_only";
  reviewOnlyDirection?: "forward" | "backward";
  reviewOnlyDailyAmountType?: "pages" | "hizb" | "juz" | "surah_ayah";
  reviewOnlyDailyAmountValue?: number;
  reviewOnlySurahId?: number;
  reviewOnlyFromAyah?: number;
  reviewOnlyToAyah?: number;
  reviewOnlyCurrentPage?: number;
  reviewOnlyCompletedDates?: string[];
  mainReviewStartSurahId?: number;
  mainReviewEndSurahId?: number;
  mainReviewDailyAmountValue?: number;
  mainReviewProgressPages?: number;
  reviewStartPoint: string;
  enabledPrayers?: string[];
  currentMurtagaId?: number;
  masteredMurtagaIds?: number[];
  isInMasteryPhase?: boolean;
  activeDays?: number[];
  previousHifzAyahsCount?: number;
}

export interface MemorizationBlock {
  id: string;
  surahId: number;
  fromAyah: number;
  toAyah: number;
  repetitionTarget: number;
  startDate: string; // YYYY-MM-DD
  status: "active" | "completed";
}

export interface RepetitionState {
  [blockId: string]: number;
}

export interface CompletedReviews {
  [dateStr: string]: string[];
}

export interface AppState {
  profile: UserProfile | null;
  blocks: MemorizationBlock[];
  completedReviews: CompletedReviews;
  repetitions: RepetitionState;
  mushafCache: number[];
  activityLog: { id: string; timestamp: string; title: string; desc: string }[];
  onboardingCompleted: boolean;
  reviewProgress: { [date: string]: number };
  fullReviewDates: string[];
}

const STORAGE_KEY = "rafiq_alhafiz_state_v2_1";

export const DEFAULT_PROFILE: UserProfile = {
  name: "الاسم",
  gender: "male",
  prayerRole: "imam",
  nightPrayerRakats: 8,
  lat: 21.4225,
  lng: 39.8262,
  useSunnah: true,
  memorizationDirection: "forward",
  autoOpenMushaf: true,
  streakDays: 0,
  lastActiveDate: getLocalDateKey(),
  enableNotifications: true,
  notifyPrayerTimes: true,
  notifyReviewReminder: true,
  notifyPrayerReviewBefore: true,
  prayerReminderOffsetMinutes: 15,
  prayerReminderOffsets: { fajr: 15, dhuhr: 15, asr: 15, maghrib: 15, isha: 15 },
  duhaRakats: 4,
  appTrack: "hifz_and_review",
  reviewOnlyDirection: "forward",
  reviewOnlyDailyAmountType: "juz",
  reviewOnlyDailyAmountValue: 20,
  reviewOnlySurahId: 2,
  reviewOnlyFromAyah: 1,
  reviewOnlyToAyah: 100,
  reviewOnlyCurrentPage: 1,
  reviewOnlyCompletedDates: [],
  mainReviewStartSurahId: 114,
  mainReviewEndSurahId: 18,
  mainReviewDailyAmountValue: 10,
  mainReviewProgressPages: 0,
  reviewStartPoint: 'fajr',
  enabledPrayers: ['fajr', 'duha', 'dhuhr', 'asr', 'maghrib', 'isha', 'qiyam'],
  activeDays: [0, 1, 2, 3, 4, 5, 6],
  currentMurtagaId: 1,
  masteredMurtagaIds: [],
  isInMasteryPhase: false
};

export function loadAppState(): AppState {
  try {
    const v2serialized = localStorage.getItem(STORAGE_KEY);
    let state: AppState;
    if (v2serialized) {
      state = JSON.parse(v2serialized) as AppState;
    } else {
      return {
        profile: null,
        blocks: [],
        completedReviews: {},
        repetitions: {},
        mushafCache: [],
        activityLog: [],
        onboardingCompleted: false,
        reviewProgress: {},
        fullReviewDates: []
      };
    }
    return state;
  } catch (error) {
    return {
      profile: null,
      blocks: [],
      completedReviews: {},
      repetitions: {},
      mushafCache: [],
      activityLog: [],
      onboardingCompleted: false,
      reviewProgress: {},
      fullReviewDates: []
    };
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {}
}

export function formatLocalTimestamp(d: Date): string {
  const date = formatDateKey(d);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${date} ${hours}:${minutes}:${seconds}`;
}

export function logActivity(state: AppState, title: string, desc: string): AppState {
  const newLog = {
    id: `log-${Date.now()}`,
    timestamp: formatLocalTimestamp(new Date()),
    title,
    desc
  };
  return {
    ...state,
    activityLog: [newLog, ...state.activityLog.slice(0, 100)]
  };
}
