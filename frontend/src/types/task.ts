import type { NormalizedApiError } from "../utils/api/apiClient";
import { type Ref } from "react";

/** Mirrors the `TaskStatus` enum on the Laravel side. */
export type TaskStatus = "pending" | "in_progress" | "completed";

/** Mirrors the `TaskPriority` enum on the Laravel side. */
export type TaskPriority = "low" | "medium" | "high";

/** Shape returned by `TaskResource` on the Laravel side. */
export type Task = {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    /** `YYYY-MM-DD`, or `null` when the task has no deadline. */
    due_date: string | null;
    created_at: string;
    updated_at: string;
};

/** `POST /api/tasks` body. Omitted status and priority fall back to the API defaults. */
export type CreateTaskPayload = {
    title: string;
    description?: string | null;
    status?: TaskStatus;
    priority?: TaskPriority;
    due_date?: string | null;
};

/**
 * Controlled form state. Inputs always hold strings, so an empty string means
 * "not set" for the optional fields.
 */
export type TaskFormValues = {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    due_date: string;
};

export type TaskField = keyof TaskFormValues;

/** Validation messages keyed by the field they belong to. */
export type TaskFieldErrors = Partial<Record<TaskField, string>>;

export type CreateTaskResult =
    | { isSuccess: true; task: Task }
    | { isSuccess: false; error: NormalizedApiError };

export type TaskFormHandle = {
    /** Moves focus to a field, waiting until it is enabled again if needed. */
    focusField: (field: TaskField) => void;
};

export type TaskFormProps = {
    values: TaskFormValues;
    errors: TaskFieldErrors;
    isSubmitting: boolean;
    submitLabel: string;
    submittingLabel: string;
    onFieldChange: <TField extends TaskField>(
        field: TField,
        value: TaskFormValues[TField],
    ) => void;
    onSubmit: () => void;
    onCancel: () => void;
    ref?: Ref<TaskFormHandle>;
};

export type FocusableField =
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
