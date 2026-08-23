import { AppState, MemorizationBlock, UserProfile, formatDateKey, formatLocalTimestamp } from "./storage";
import { getLocalDateKey } from "./storage";

export function generateMockState(defaultProfile: UserProfile): AppState {
  const today = new Date();
  const formatOffsetDate = (daysAgo: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return formatDateKey(d);
  };

  const block1: MemorizationBlock = {
    id: "mock-b1",
    surahId: 1, // Al-Fatihah
    fromAyah: 1,
    toAyah: 7,
    repetitionTarget: 30,
    startDate: formatOffsetDate(3), // Day 4 review
    status: "active"
  };

  const block2: MemorizationBlock = {
    id: "mock-b2",
    surahId: 2, // Al-Baqarah
    fromAyah: 1,
    toAyah: 5,
    repetitionTarget: 50,
    startDate: formatOffsetDate(13), // Day 14 spaced review
    status: "active"
  };

  const block3: MemorizationBlock = {
    id: "mock-b3",
    surahId: 67, // Al-Mulk
    fromAyah: 1,
    toAyah: 10,
    repetitionTarget: 100,
    startDate: formatOffsetDate(0), // New Memorization
    status: "active"
  };

  return {
    profile: { ...defaultProfile, name: "مستخدم تجريبي" },
    blocks: [block1, block2, block3],
    completedReviews: {
      [formatOffsetDate(2)]: ["mock-b1"],
      [formatOffsetDate(1)]: ["mock-b1"]
    },
    repetitions: {
      "mock-b3": 100
    },
    mushafCache: [1, 2, 562],
    activityLog: [
      {
        id: "demo-l-1",
        timestamp: formatLocalTimestamp(new Date(Date.now() - 3 * 24 * 3600000)),
        title: "بدء خطة الحفظ التجريبية",
        desc: "هذه بيانات توضيحية لتجربة واجهة التطبيق."
      }
    ],
    onboardingCompleted: true,
    reviewProgress: {},
    fullReviewDates: []
  };
}
