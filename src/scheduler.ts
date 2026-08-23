import { MemorizationBlock, AppState, formatDateKey } from "./storage";

export const INTENSIVE_DAYS = [2, 3, 4, 5, 6, 7, 8, 9, 10];
export const SPACED_DAYS = [12, 14, 16, 21, 31, 41, 55, 66];
export const ALL_REVIEW_DAYS = [...INTENSIVE_DAYS, ...SPACED_DAYS];

/**
 * Calculates number of "active" days between two dates.
 * d1 represents the start date (Memorization Day, Day 1)
 * d2 represents the check date (Review Day)
 * fullReviewDates: optional list of dates when a full review was performed, pausing the counter.
 * activeDays: optional list of week day numbers (0-6) where the user is active.
 */
export function getDaysOffset(
  startDateStr: string,
  checkDateStr: string,
  fullReviewDates: string[] = [],
  activeDays: number[] = [0, 1, 2, 3, 4, 5, 6]
): number {
  const start = new Date(startDateStr);
  const end = new Date(checkDateStr);
  
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  if (end < start) return 0;

  let activeDaysCount = 0;
  let current = new Date(start);

  while (current <= end) {
    const curStr = formatDateKey(current);
    const isPaused = fullReviewDates.includes(curStr);
    const isDayActive = activeDays.includes(current.getDay());

    if (isDayActive && !isPaused) {
      activeDaysCount++;
    }

    current.setDate(current.getDate() + 1);
  }

  return activeDaysCount; // If start == end, returns 1 (Day 1)
}

export interface ScheduledTask {
  block: MemorizationBlock;
  offset: number; // e.g., 2, 14, 66
  type: "memorization" | "review";
  isCompleted: boolean;
}

/**
 * Scanning all memorization blocks to determine which tasks are due for a given date.
 */
export function getTasksForDate(state: AppState, targetDateStr: string): ScheduledTask[] {
  const tasks: ScheduledTask[] = [];
  const activeDays = state.profile?.activeDays || [0, 1, 2, 3, 4, 5, 6];

  // If today is a disabled day, no tasks are due
  const targetDate = new Date(targetDateStr);
  if (!activeDays.includes(targetDate.getDay())) {
    return [];
  }

  const completedList = state.completedReviews[targetDateStr] || [];

  // v2.1: Check if any block triggers Day 66 today to pause new memorization
  const isFullReviewDay = state.blocks.some(block => {
    const offset = getDaysOffset(block.startDate, targetDateStr, state.fullReviewDates, activeDays);
    return offset === 66;
  });

  state.blocks.forEach((block) => {
    const offset = getDaysOffset(block.startDate, targetDateStr, state.fullReviewDates, activeDays);

    if (offset === 1) {
      // Memorization day itself
      // v2.1: If it's a full review day, we skip new memorization tasks
      if (!isFullReviewDay) {
        tasks.push({
          block,
          offset,
          type: "memorization",
          isCompleted: state.repetitions[block.id] === 0 || block.status === "completed"
        });
      }
    } else if (ALL_REVIEW_DAYS.includes(offset)) {
      // It is scheduled for a spaced repetition review
      const isCompleted = completedList.includes(block.id);
      tasks.push({
        block,
        offset,
        type: "review",
        isCompleted
      });
    }
  });

  return tasks;
}

/**
 * Groups past blocks into chunks of up to 15 blocks each for cumulative review consolidation.
 */
export function getCumulativeGroups(blocks: MemorizationBlock[]): { id: string; name: string; blocks: MemorizationBlock[] }[] {
  // Sort blocks by start date ascending
  const sorted = [...blocks].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const groups: { id: string; name: string; blocks: MemorizationBlock[] }[] = [];
  
  const groupSize = 15;
  for (let i = 0; i < sorted.length; i += groupSize) {
    const chunk = sorted.slice(i, i + groupSize);
    if (chunk.length > 0) {
      const gNum = Math.floor(i / groupSize) + 1;
      groups.push({
        id: `group-${gNum}`,
        name: `المجموعة التراكمية ${gNum} (من مقرر ${chunk[0].surahId} إلى ${chunk[chunk.length - 1].surahId})`,
        blocks: chunk
      });
    }
  }
  
  return groups;
}

/**
 * Check if the user has hit Day 66 with any of their blocks today, which triggers the cumulative review reminder.
 */
export function hasDay66TriggerToday(state: AppState, todayStr: string): boolean {
  const activeDays = state.profile?.activeDays || [0, 1, 2, 3, 4, 5, 6];
  return state.blocks.some(block => {
    const offset = getDaysOffset(block.startDate, todayStr, state.fullReviewDates, activeDays);
    return offset === 66;
  });
}
