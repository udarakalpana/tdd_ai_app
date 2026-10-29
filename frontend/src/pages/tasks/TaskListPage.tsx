import { Navigate, useNavigate, useSearchParams } from "react-router";

import { PageHeader } from "../../components/PageHeader";
import { TaskTable } from "../../components/tasks/TaskTable";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Pagination } from "../../components/ui/Pagination";
import { useTasks } from "../../tasks/useTasks";
import { ROUTES } from "../../utils/constants/app";
import { toPageNumber } from "../../utils/pagination";

/**
 * The current page lives in the URL (`?page=2`) so refreshing, sharing the link
 * or pressing Back keeps the reader where they were.
 */
const TaskListPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = toPageNumber(searchParams.get("page"));
    const { tasks, meta, error, isLoading, reload } = useTasks(currentPage);

    const goToCreateTask = () => navigate(ROUTES.taskCreate);

    const handlePageChange = (page: number) => {
        setSearchParams(page === 1 ? {} : { page: String(page) });
    };

    /** A stale link, or deleting the last task on a page, can point past the end. */
    if (!isLoading && meta && meta.total > 0 && currentPage > meta.last_page) {
        return <Navigate to={{ search: `?page=${meta.last_page}` }} replace />;
    }

    const hasFailedWithoutData = !isLoading && error && !meta;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <PageHeader
                    eyebrow="Task management"
                    title="All tasks"
                    description="Everything on your list, newest first."
                />
                <Button onClick={goToCreateTask}>Create task</Button>
            </div>

            {!isLoading && error && (
                <Alert>
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        {error.message}
                        <Button variant="secondary" size="sm" onClick={reload}>
                            Try again
                        </Button>
                    </span>
                </Alert>
            )}

            {!hasFailedWithoutData && (
                <TaskTable
                    tasks={tasks}
                    isInitialLoading={isLoading && !meta}
                    isRefreshing={isLoading && meta !== null}
                    onCreateTask={goToCreateTask}
                />
            )}

            {meta && meta.last_page > 1 && (
                <Pagination
                    currentPage={currentPage}
                    lastPage={meta.last_page}
                    total={meta.total}
                    from={meta.from}
                    to={meta.to}
                    itemLabel="tasks"
                    isDisabled={isLoading}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default TaskListPage;
