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
  mainReviewDailyAmountValue?: number; // v2.1: separated from reviewOnlyDailyAmountValue
  mainReviewProgressPages?: number;
  reviewStartPoint: string;
  enabledPrayers?: string[]; // v2.1.2: user selected prayers for review
  activeDays?: number[]; // v2.1.3: 0-6 (Sun-Sat)
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
  [blockId: string]: number; // remaining repetitions for today
}

export interface CompletedReviews {
  [dateStr: string]: string[]; // list of blockIds reviewed on that date
}

export interface AppState {
  profile: UserProfile | null;
  blocks: MemorizationBlock[];
  completedReviews: CompletedReviews;
  repetitions: RepetitionState;
  mushafCache: number[]; // downloaded pages
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
  lat: 21.4225, // Mecca
  lng: 39.8262, // Mecca
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
  prayerReminderOffsets: {
    fajr: 15,
    dhuhr: 15,
    asr: 15,
    maghrib: 15,
    isha: 15
  },
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
  mainReviewDailyAmountValue: 10, // Default 10 pages for main review
  mainReviewProgressPages: 0,
  reviewStartPoint: 'fajr',
  enabledPrayers: ['fajr', 'duha', 'dhuhr', 'asr', 'maghrib', 'isha', 'qiyam'],
  activeDays: [0, 1, 2, 3, 4, 5, 6]
};

export function loadAppState(): AppState {
  try {
    const v2serialized = localStorage.getItem(STORAGE_KEY);
    let state: AppState;
    let isMigration = false;

    if (v2serialized) {
      state = JSON.parse(v2serialized) as AppState;
    } else {
      const v1serialized = localStorage.getItem("rafiq_alhafiz_state_v1");
      if (v1serialized) {
        state = JSON.parse(v1serialized) as AppState;
        state.onboardingCompleted = true;
        isMigration = true;
      } else {
        // Initial state for new user
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

    // Ensure fields for v2
    if (state.onboardingCompleted === undefined) state.onboardingCompleted = false;
    if (!state.reviewProgress) state.reviewProgress = {};
    if (!state.fullReviewDates) state.fullReviewDates = [];
    if (state.profile && !state.profile.activeDays) state.profile.activeDays = [0, 1, 2, 3, 4, 5, 6];

    const todayStr = getLocalDateKey();
    if (state.profile && state.profile.lastActiveDate !== todayStr) {
      const activeDays = state.profile.activeDays || [0, 1, 2, 3, 4, 5, 6];
      const todayDay = new Date().getDay();
      
      // If today is a disabled day, we don't calculate streak or reset tasks here
      // But we still might want to show the current state.
      // However, getTasksForDate will return [] for disabled days anyway.

      if (activeDays.includes(todayDay)) {
          // Check if the user missed the PREVIOUS active day
          const checkDate = new Date();
          checkDate.setHours(0, 0, 0, 0);
          let prevActiveDayStr = "";
          for (let i = 1; i <= 7; i++) {
            const d = new Date(checkDate);
            d.setDate(d.getDate() - i);
            if (activeDays.includes(d.getDay())) {
                prevActiveDayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                break;
            }
          }

          if (state.profile.lastActiveDate !== prevActiveDayStr) {
            state.profile.streakDays = 0;
            saveAppState(state);
          }
      }

      // Reset daily progress for the new day
      state.reviewProgress = {};

      // Reset today's new memorization repetition counters
      state.repetitions = {};
      state.blocks.forEach(b => {
        if (b.startDate === todayStr) {
          state.repetitions[b.id] = b.repetitionTarget;
        }
      });
    } else if (isMigration) {
      saveAppState(state);
    }
    
    return state;
  } catch (error) {
    console.error("Failed to load app state", error);
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
  } catch (error) {
    console.error("Failed to save app state", error);
  }
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
