import type {
    TaskField,
    TaskFormValues,
    TaskPriority,
    TaskStatus,
} from "../../types/task";
import type { SelectOption } from "../../types/ui";

/** Matches the `max:255` rule in `StoreTaskRequest`. */
export const TASK_TITLE_MAX_LENGTH = 255;

/** Column defaults of the `tasks` table. */
export const DEFAULT_TASK_STATUS: TaskStatus = "pending";

export const DEFAULT_TASK_PRIORITY: TaskPriority = "medium";

export const TASK_STATUS_OPTIONS: readonly SelectOption<TaskStatus>[] = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In progress" },
    { value: "completed", label: "Completed" },
];

export const TASK_PRIORITY_OPTIONS: readonly SelectOption<TaskPriority>[] = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
];

/** Every task form field, in the order it appears on screen. */
export const TASK_FIELDS: readonly TaskField[] = [
    "title",
    "description",
    "status",
    "priority",
    "due_date",
];

export const INITIAL_TASK_FORM_VALUES: TaskFormValues = {
    title: "",
    description: "",
    status: DEFAULT_TASK_STATUS,
    priority: DEFAULT_TASK_PRIORITY,
    due_date: "",
};

export const TASK_VALIDATION_MESSAGES = {
    titleRequired: "Enter a title for the task.",
    titleTooLong: `Keep the title to ${TASK_TITLE_MAX_LENGTH} characters or fewer.`,
    dueDateInvalid: "Enter a valid due date.",
} as const;

const toLabelMap = <TValue extends string>(
    options: readonly SelectOption<TValue>[],
): Record<TValue, string> =>
    Object.fromEntries(
        options.map(({ value, label }) => [value, label]),
    ) as Record<TValue, string>;

export const TASK_STATUS_LABELS = toLabelMap(TASK_STATUS_OPTIONS);

export const TASK_PRIORITY_LABELS = toLabelMap(TASK_PRIORITY_OPTIONS);

export const TASK_STATUS_BADGE_CLASSES: Record<TaskStatus, string> = {
    pending:
        "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
    in_progress:
        "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/20",
    completed:
        "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
};

export const TASK_PRIORITY_BADGE_CLASSES: Record<TaskPriority, string> = {
    low: "bg-slate-50 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/20",
    medium: "bg-brand-50 text-brand-700 ring-brand-600/20 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-400/20",
    high: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20",
};

/** Data columns of the task table, in the order they appear on screen. */
export const TASK_TABLE_COLUMNS: readonly string[] = [
    "Title",
    "Description",
    "Status",
    "Priority",
    "Due date",
];
