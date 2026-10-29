import { apiClient } from "./apiClient";
import type { ApiResource, PaginatedApiResource } from "../../types/api";
import type { CreateTaskPayload, Task } from "../../types/task";

/**
 * `GET /api/tasks?page=N` — one page of the signed in user's tasks, newest first.
 */
export const requestTasks = async (
    page: number,
    signal?: AbortSignal,
): Promise<PaginatedApiResource<Task>> => {
    const { data } = await apiClient.get<PaginatedApiResource<Task>>("/tasks", {
        params: { page },
        signal,
    });

    return data;
};

/**
 * `POST /api/tasks` — creates a task owned by the signed in user.
 */
export const requestCreateTask = async (
    payload: CreateTaskPayload,
): Promise<Task> => {
    const { data } = await apiClient.post<ApiResource<Task>>("/tasks", payload);

    return data.data;
};
