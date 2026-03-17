/**
 * Time System - Progression helpers and state queries
 *
 * Provides reusable selectors for:
 * - Current day type (class/lab/off) based on day-of-week rules
 * - Classroom availability rules
 * - Mandatory activity status
 * - Day summary for UI display
 * - Free actions tracking
 *
 * All logic is data-driven and decoupled from React components.
 */

import { useGameStore } from "../../store/useGameStore";

type DayType = "class" | "lab" | "off";

/**
 * Get the day type for a given day of the week
 *
 * Weekly schedule:
 * - Day 1 (Mon): class
 * - Day 2 (Tue): class
 * - Day 3 (Wed): class
 * - Day 4 (Thu): lab
 * - Day 5 (Fri): off (lab building is open)
 * - Day 6 (Sat): off
 * - Day 7 (Sun): off
 *
 * @param dayOfWeek - 1-7 (Mon-Sun)
 * @returns "class" | "lab" | "off"
 */
export function getDayType(dayOfWeek: number): DayType {
  const normalized = ((dayOfWeek - 1) % 7) + 1; // Ensure 1-7
  if (normalized >= 1 && normalized <= 3) return "class"; // Mon-Wed
  if (normalized === 4) return "lab"; // Thu
  return "off"; // Fri-Sun
}

/**
 * Get current day type from store state
 * @returns "class" | "lab" | "off"
 */
export function getCurrentDayType(): DayType {
  const state = useGameStore.getState();
  return state.dayType;
}

/**
 * Check if mandatory academic activity is complete for today
 * @returns boolean
 */
export function isMandatoryAcademicActivityComplete(): boolean {
  const state = useGameStore.getState();
  return state.mandatoryActivityComplete;
}

/**
 * Get remaining free actions for today
 * @returns number (0-3)
 */
export function getRemainingFreeActions(): number {
  const state = useGameStore.getState();
  return state.freeActionsRemaining;
}

/**
 * Check if player can sleep now
 * Can sleep if:
 * - Off-day (Fri-Sun), OR
 * - Mandatory activity is complete
 *
 * @returns boolean
 */
export function canSleepNow(): boolean {
  const state = useGameStore.getState();
  const dayType = getCurrentDayType();

  // Off-days: can sleep only after at least one free action is consumed
  // (Otherwise: "You're not tired yet")
  if (dayType === "off") return state.freeActionsRemaining < 3;

  // Class/lab days: can sleep only after mandatory activity complete
  return state.mandatoryActivityComplete;
}

/**
 * Check if classroom should be accessible
 *
 * Classroom is open if:
 * - It's a class day (Mon-Wed), AND
 * - Mandatory lesson is not yet complete
 *
 * Classroom is closed if:
 * - It's not a class day (Thu-Sun), OR
 * - Mandatory lesson is already complete today
 *
 * @returns boolean
 */
export function isClassroomOpen(): boolean {
  const state = useGameStore.getState();
  const dayType = getCurrentDayType();

  // Only open on class days
  if (dayType !== "class") return false;

  // Only open before mandatory activity is complete
  if (state.mandatoryActivityComplete) return false;

  return true;
}

/**
 * Check if lab should be accessible
 *
 * Lab building is open if:
 * - It's Thursday (lab day) and mandatory lab activity is not yet complete, OR
 * - It's Friday (open campus day; optional lab access)
 *
 * @returns boolean
 */
export function isLabOpen(): boolean {
  const state = useGameStore.getState();
  const dayType = getCurrentDayType();
  const normalizedDayOfWeek = ((state.day - 1) % 7) + 1;

  // Thursday: open only until mandatory lab is complete
  if (normalizedDayOfWeek === 4) {
    if (dayType !== "lab") return false;
    return !state.mandatoryActivityComplete;
  }

  // Friday: lab building is open (optional access)
  if (normalizedDayOfWeek === 5) return true;

  // Other days: closed
  return false;
}

/**
 * Check if player should return to dorm and sleep
 * True when day is "complete":
 * - Mandatory activity done, AND
 * - Free actions are 0, OR
 * - Player has indicated they're done
 *
 * @returns boolean
 */
export function shouldPromptReturnToDorm(): boolean {
  const dayType = getCurrentDayType();
  const mandatoryDone = isMandatoryAcademicActivityComplete();
  const freeActionsLeft = getRemainingFreeActions();

  // Off-days: suggest sleep after 0 free actions (optional)
  if (dayType === "off") {
    return freeActionsLeft === 0;
  }

  // Class/lab days: suggest sleep after mandatory + free actions done
  return mandatoryDone && freeActionsLeft === 0;
}

/**
 * Get display-friendly day name (e.g., "Monday")
 * @param dayOfWeek - 1-7 (Mon-Sun)
 * @returns string
 */
export function getDayName(dayOfWeek: number): string {
  const names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const normalized = ((dayOfWeek - 1) % 7);
  return names[normalized];
}

/**
 * Get current day summary for sidebar/UI display
 * @returns object with formatted day info
 */
export function getCurrentDaySummary(): {
  week: number;
  day: number;
  dayName: string;
  dayType: DayType;
  dayTypeLabel: string;
  mandatoryActivityComplete: boolean;
  mandatoryActivityLabel: string;
  freeActionsRemaining: number;
  canSleep: boolean;
  classroomOpen: boolean;
  labOpen: boolean;
} {
  const state = useGameStore.getState();
  const dayType = getCurrentDayType();
  const dayName = getDayName(state.day);

  return {
    week: state.week,
    day: state.day,
    dayName,
    dayType,
    dayTypeLabel:
      dayType === "class" ? "Class Day" : dayType === "lab" ? "Lab Day" : "Off Day",
    mandatoryActivityComplete: state.mandatoryActivityComplete,
    mandatoryActivityLabel: state.mandatoryActivityComplete
      ? "✓ Complete"
      : dayType === "off"
        ? "—"
        : "Pending",
    freeActionsRemaining: state.freeActionsRemaining,
    canSleep: canSleepNow(),
    classroomOpen: isClassroomOpen(),
    labOpen: isLabOpen(),
  };
}

/**
 * Get upcoming week schedule without spoilers
 * Shows day types but not lesson content
 * @returns array of { day, dayName, dayType }
 */
export function getWeeklySchedule(): Array<{
  day: number;
  dayName: string;
  dayType: DayType;
}> {
  const state = useGameStore.getState();
  const currentDay = state.day;
  const schedule = [];

  // Show next 7 days (current week + partial next week)
  for (let i = 0; i < 7; i++) {
    const dayNum = currentDay + i;
    if (dayNum > 56) break; // Don't show beyond semester (8 weeks = 56 days)

    const dayName = getDayName(dayNum);
    const dayType = getDayType(dayNum);

    schedule.push({
      day: dayNum,
      dayName,
      dayType,
    });
  }

  return schedule;
}

/**
 * Check if semester is complete
 * True if week > 8 or all courses done
 * @returns boolean
 */
export function isSemesterComplete(): boolean {
  const state = useGameStore.getState();
  const { week, courseCompletions } = state;

  // Week 8+ = semester over
  if (week > 8) return true;

  // All courses complete = semester over
  if (courseCompletions.every((c) => c.isCompleted)) return true;

  return false;
}

/**
 * Get semester progress (0-100%)
 * Weights: 60% week progress, 40% course progress
 * @returns number
 */
export function getSemesterProgress(): number {
  const state = useGameStore.getState();
  const { week, courseCompletions } = state;

  const weekProgress = (Math.min(week, 8) / 8) * 60; // Weeks are 60%
  const completedCourseCount = courseCompletions.filter((c) => c.isCompleted).length;
  const totalCourses = courseCompletions.length || 1;
  const courseProgress = (completedCourseCount / totalCourses) * 40; // Courses are 40%

  return Math.round(weekProgress + courseProgress);
}
