import { useCallback, useEffect, useState } from "react";

import { normalizeApiError } from "../utils/api/apiClient";
import { requestTasks } from "../utils/api/tasksApi";
import type { TaskListState } from "../types/task";

const INITIAL_STATE: TaskListState = {
    requestKey: null,
    tasks: [],
    meta: null,
    error: null,
};

/**
 * Loads one page of tasks whenever `page` changes.
 *
 * The rows of the previous page stay in place while the next one loads, and a
 * failed request keeps them too, so the table never flashes empty. Leaving a
 * page aborts its request, so a slow response can never overwrite a newer one.
 */
export const useTasks = (page: number) => {
    const [attempt, setAttempt] = useState(0);
    const [state, setState] = useState<TaskListState>(INITIAL_STATE);
    const requestKey = `${page}:${attempt}`;

    useEffect(() => {
        const controller = new AbortController();

        requestTasks(page, controller.signal)
            .then(({ data, meta }) => {
                setState({ requestKey, tasks: data, meta, error: null });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) {
                    return;
                }

                setState((current) => ({
                    ...current,
                    requestKey,
                    error: normalizeApiError(error),
                }));
            });

        return () => controller.abort();
    }, [page, requestKey]);

    const reload = useCallback(() => setAttempt((count) => count + 1), []);

    return {
        tasks: state.tasks,
        meta: state.meta,
        error: state.error,
        isLoading: state.requestKey !== requestKey,
        reload,
    };
};
