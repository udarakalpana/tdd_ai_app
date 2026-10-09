import {
    useEffect,
    useImperativeHandle,
    useRef,
    type SubmitEvent,
} from "react";

import type {
    FocusableField,
    TaskField,
    TaskFormProps,
} from "../../types/task";
import {
    TASK_PRIORITY_OPTIONS,
    TASK_STATUS_OPTIONS,
    TASK_TITLE_MAX_LENGTH,
} from "../../utils/constants/task";
import { Button } from "../ui/Button";
import { SelectField } from "../ui/SelectField";
import { TextareaField } from "../ui/TextareaField";
import { TextField } from "../ui/TextField";

/**
 * Presentational task form. It owns no data and makes no requests, so the same
 * component serves both creating and editing a task.
 */
export const TaskForm = ({
    values,
    errors,
    isSubmitting,
    submitLabel,
    submittingLabel,
    onFieldChange,
    onSubmit,
    onCancel,
    ref,
}: TaskFormProps) => {
    const titleRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const statusRef = useRef<HTMLSelectElement>(null);
    const priorityRef = useRef<HTMLSelectElement>(null);
    const dueDateRef = useRef<HTMLInputElement>(null);
    const pendingFocusRef = useRef<TaskField | null>(null);

    const getFieldElement = (field: TaskField): FocusableField | null => {
        const fieldElements: Record<TaskField, FocusableField | null> = {
            title: titleRef.current,
            description: descriptionRef.current,
            status: statusRef.current,
            priority: priorityRef.current,
            due_date: dueDateRef.current,
        };

        return fieldElements[field];
    };

    /**
     * Fields are disabled while a request is in flight and a disabled element
     * cannot take focus, so the request is held until the next render enables it.
     */
    useImperativeHandle(ref, () => ({
        focusField: (field) => {
            const element = getFieldElement(field);

            if (element && !element.disabled) {
                element.focus();

                return;
            }

            pendingFocusRef.current = field;
        },
    }));

    useEffect(() => {
        if (isSubmitting || !pendingFocusRef.current) {
            return;
        }

        getFieldElement(pendingFocusRef.current)?.focus();
        pendingFocusRef.current = null;
    });

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit();
    };

    return (
        <form
            noValidate
            onSubmit={handleSubmit}
            aria-busy={isSubmitting || undefined}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900"
        >
            <div className="flex flex-col gap-6 p-6 sm:p-8">
                <TextField
                    id="task-title"
                    ref={titleRef}
                    label="Title"
                    name="title"
                    placeholder="e.g. Write the quarterly report"
                    maxLength={TASK_TITLE_MAX_LENGTH}
                    autoComplete="off"
                    autoFocus
                    disabled={isSubmitting}
                    value={values.title}
                    error={errors.title}
                    onChange={(event) =>
                        onFieldChange("title", event.target.value)
                    }
                />

                <TextareaField
                    id="task-description"
                    ref={descriptionRef}
                    label="Description"
                    name="description"
                    placeholder="Add any details that will help you get it done."
                    rows={5}
                    isOptional
                    disabled={isSubmitting}
                    value={values.description}
                    error={errors.description}
                    onChange={(event) =>
                        onFieldChange("description", event.target.value)
                    }
                />

                <div className="grid gap-6 sm:grid-cols-3">
                    <SelectField
                        id="task-status"
                        ref={statusRef}
                        label="Status"
                        name="status"
                        options={TASK_STATUS_OPTIONS}
                        disabled={isSubmitting}
                        value={values.status}
                        error={errors.status}
                        onValueChange={(status) =>
                            onFieldChange("status", status)
                        }
                    />

                    <SelectField
                        id="task-priority"
                        ref={priorityRef}
                        label="Priority"
                        name="priority"
                        options={TASK_PRIORITY_OPTIONS}
                        disabled={isSubmitting}
                        value={values.priority}
                        error={errors.priority}
                        onValueChange={(priority) =>
                            onFieldChange("priority", priority)
                        }
                    />

                    <TextField
                        id="task-due-date"
                        ref={dueDateRef}
                        label="Due date"
                        type="date"
                        name="due_date"
                        isOptional
                        disabled={isSubmitting}
                        value={values.due_date}
                        error={errors.due_date}
                        onChange={(event) =>
                            onFieldChange("due_date", event.target.value)
                        }
                    />
                </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/60 px-6 py-4 sm:flex-row sm:justify-end sm:px-8 dark:border-slate-800 dark:bg-slate-900/60">
                <Button
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    loadingLabel={submittingLabel}
                >
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
};
