import type { TaskTableProps } from "../../types/task";
import { cn } from "../../utils/cn";
import {
    TASK_PRIORITY_BADGE_CLASSES,
    TASK_PRIORITY_LABELS,
    TASK_STATUS_BADGE_CLASSES,
    TASK_STATUS_LABELS,
    TASK_TABLE_COLUMNS,
} from "../../utils/constants/task";
import { formatDueDate } from "../../utils/formatDate";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";

/** Data columns plus the trailing actions column. */
const COLUMN_COUNT = TASK_TABLE_COLUMNS.length + 1;

const HEADER_CELL_CLASSES =
    "px-4 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400";

const CELL_CLASSES = "px-4 py-3 align-middle";

const EmptyValue = () => (
    <span className="text-slate-400 dark:text-slate-500">—</span>
);

/**
 * Presentational task table. It owns no data and makes no requests; the page
 * decides which tasks to show and when they are loading.
 */
export const TaskTable = ({
    tasks,
    isInitialLoading,
    isRefreshing,
    onCreateTask,
}: TaskTableProps) => (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
            <table
                className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800"
                aria-busy={isInitialLoading || isRefreshing || undefined}
            >
                <thead className="bg-slate-50/60 dark:bg-slate-900/60">
                    <tr>
                        {TASK_TABLE_COLUMNS.map((column) => (
                            <th
                                key={column}
                                scope="col"
                                className={HEADER_CELL_CLASSES}
                            >
                                {column}
                            </th>
                        ))}
                        <th
                            scope="col"
                            className={cn(HEADER_CELL_CLASSES, "text-right")}
                        >
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody
                    className={cn(
                        "divide-y divide-slate-200 transition-opacity dark:divide-slate-800",
                        isRefreshing && "opacity-50",
                    )}
                >
                    {isInitialLoading && (
                        <tr>
                            <td
                                colSpan={COLUMN_COUNT}
                                className="px-4 py-12 text-center text-slate-500 dark:text-slate-400"
                            >
                                <span className="inline-flex items-center gap-2">
                                    <Spinner className="size-4" />
                                    Loading tasks…
                                </span>
                            </td>
                        </tr>
                    )}

                    {!isInitialLoading && tasks.length === 0 && (
                        <tr>
                            <td
                                colSpan={COLUMN_COUNT}
                                className="px-4 py-12 text-center"
                            >
                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                    No tasks yet
                                </p>
                                <p className="mt-1 text-slate-500 dark:text-slate-400">
                                    Create your first task to start tracking
                                    your work.
                                </p>
                                <Button className="mt-4" onClick={onCreateTask}>
                                    Create task
                                </Button>
                            </td>
                        </tr>
                    )}

                    {tasks.map((task) => (
                        <tr
                            key={task.id}
                            className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                        >
                            <td
                                className={cn(
                                    CELL_CLASSES,
                                    "max-w-56 font-medium text-slate-900 dark:text-slate-100",
                                )}
                            >
                                <span
                                    className="block truncate"
                                    title={task.title}
                                >
                                    {task.title}
                                </span>
                            </td>
                            <td
                                className={cn(
                                    CELL_CLASSES,
                                    "max-w-xs text-slate-600 dark:text-slate-300",
                                )}
                            >
                                {task.description ? (
                                    <span
                                        className="block truncate"
                                        title={task.description}
                                    >
                                        {task.description}
                                    </span>
                                ) : (
                                    <EmptyValue />
                                )}
                            </td>
                            <td className={CELL_CLASSES}>
                                <Badge
                                    className={
                                        TASK_STATUS_BADGE_CLASSES[task.status]
                                    }
                                >
                                    {TASK_STATUS_LABELS[task.status]}
                                </Badge>
                            </td>
                            <td className={CELL_CLASSES}>
                                <Badge
                                    className={
                                        TASK_PRIORITY_BADGE_CLASSES[
                                            task.priority
                                        ]
                                    }
                                >
                                    {TASK_PRIORITY_LABELS[task.priority]}
                                </Badge>
                            </td>
                            <td
                                className={cn(
                                    CELL_CLASSES,
                                    "whitespace-nowrap text-slate-600 dark:text-slate-300",
                                )}
                            >
                                {task.due_date ? (
                                    <time dateTime={task.due_date}>
                                        {formatDueDate(task.due_date)}
                                    </time>
                                ) : (
                                    <EmptyValue />
                                )}
                            </td>
                            <td className={CELL_CLASSES}>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        aria-label={`Edit “${task.title}”`}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        aria-label={`Delete “${task.title}”`}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
