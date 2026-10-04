<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * Tasks are private to their owner. Another user's task is reported as missing
 * (404) rather than forbidden (403) so its existence is never confirmed.
 */
class TaskPolicy
{
    /**
     * Determine whether the user can view the task.
     */
    public function view(User $user, Task $task): Response
    {
        return $this->ownedBy($user, $task);
    }

    /**
     * Determine whether the user can update the task.
     */
    public function update(User $user, Task $task): Response
    {
        return $this->ownedBy($user, $task);
    }

    /**
     * Determine whether the user can delete the task.
     */
    public function delete(User $user, Task $task): Response
    {
        return $this->ownedBy($user, $task);
    }

    /**
     * Allow the task's owner and hide the task from everyone else.
     */
    private function ownedBy(User $user, Task $task): Response
    {
        return $task->user()->is($user)
            ? Response::allow()
            : Response::denyAsNotFound();
    }
}
