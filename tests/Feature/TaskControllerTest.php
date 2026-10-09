<?php

use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;

describe('authentication', function () {
    it('rejects unauthenticated requests and leaves tasks untouched', function (string $method, string $uri) {
        $task = Task::factory()->create(['title' => 'Untouched title']);

        $response = $this->json($method, str_replace('{task}', $task->id, $uri), [
            'title' => 'Changed title',
        ]);

        $response->assertUnauthorized();
        $this->assertDatabaseCount('tasks', 1);
        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'title' => 'Untouched title']);
    })->with([
        'index' => ['GET', '/api/tasks'],
        'store' => ['POST', '/api/tasks'],
        'show' => ['GET', '/api/tasks/{task}'],
        'update' => ['PUT', '/api/tasks/{task}'],
        'destroy' => ['DELETE', '/api/tasks/{task}'],
    ]);
});

describe('index', function () {
    it('lists the authenticated user\'s tasks ordered newest first', function () {
        $user = User::factory()->create();
        $oldest = Task::factory()->for($user)->create(['created_at' => now()->subDays(2)]);
        $middle = Task::factory()->for($user)->create(['created_at' => now()->subDay()]);
        $newest = Task::factory()->for($user)->create(['created_at' => now()]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/tasks');

        $response->assertOk();
        $response->assertJsonCount(3, 'data');
        $response->assertJsonPath('data.0.id', $newest->id);
        $response->assertJsonPath('data.1.id', $middle->id);
        $response->assertJsonPath('data.2.id', $oldest->id);
    });

    it('excludes tasks owned by other users', function () {
        $user = User::factory()->create();
        $ownTask = Task::factory()->for($user)->create();
        Task::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/tasks');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.id', $ownTask->id);
    });

    it('returns an empty list when the user has no tasks', function () {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->getJson('/api/tasks');

        $response->assertOk();
        $response->assertJsonCount(0, 'data');
    });
});

describe('store', function () {
    it('creates a task with valid data and assigns it to the authenticated user', function () {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/tasks', [
            'title' => 'Write project report',
            'description' => 'Summarize Q3 progress',
            'status' => 'in_progress',
            'priority' => 'high',
            'due_date' => '2026-09-10',
        ]);

        $response->assertCreated();
        $response->assertJsonPath('data.title', 'Write project report');
        $response->assertJsonPath('data.status', 'in_progress');
        $response->assertJsonPath('data.priority', 'high');
        $response->assertJsonPath('data.due_date', '2026-09-10');

        $this->assertDatabaseHas('tasks', [
            'id' => $response->json('data.id'),
            'user_id' => $user->id,
            'title' => 'Write project report',
            'status' => 'in_progress',
            'priority' => 'high',
        ]);
    });

    it('ignores a other user_id in the payload when try to create task', function () {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/tasks', [
            'title' => 'Minimal task',
            'user_id' => $otherUser->id,
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('tasks', ['id' => $response->json('data.id'), 'user_id' => $user->id]);
        $this->assertDatabaseMissing('tasks', ['user_id' => $otherUser->id]);
    });

    it('defaults status to pending and priority to medium when omitted', function () {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/tasks', ['title' => 'Minimal task']);

        $response->assertCreated();
        $response->assertJsonPath('data.status', 'pending');
        $response->assertJsonPath('data.priority', 'medium');
    });

    it('rejects invalid input', function (array $payload, string $invalidField) {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/tasks', array_merge(['title' => 'Valid title'], $payload));

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors($invalidField);
        $this->assertDatabaseCount('tasks', 0);
    })->with([
        'missing title' => [['title' => ''], 'title'],
        'title too long' => [['title' => str_repeat('a', 256)], 'title'],
        'invalid status' => [['status' => 'not_a_status'], 'status'],
        'invalid priority' => [['priority' => 'not_a_priority'], 'priority'],
        'invalid due_date' => [['due_date' => 'not-a-date'], 'due_date'],
    ]);
});

describe('show', function () {
    it('returns a single task owned by the authenticated user', function () {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create();
        Sanctum::actingAs($user);

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertOk();
        $response->assertJsonPath('data.id', $task->id);
        $response->assertJsonPath('data.title', $task->title);
    });

    it('returns 404 for a task owned by another user', function () {
        $task = Task::factory()->create();
        Sanctum::actingAs(User::factory()->create());

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertNotFound();
    });

    it('returns 404 when the task does not exist', function () {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->getJson('/api/tasks/'.Str::uuid7());

        $response->assertNotFound();
    });
});

describe('update', function () {
    it('updates a task with valid data', function () {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create(['title' => 'Old title', 'status' => 'pending']);
        Sanctum::actingAs($user);

        $response = $this->putJson("/api/tasks/{$task->id}", [
            'title' => 'New title',
            'status' => 'completed',
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.title', 'New title');
        $response->assertJsonPath('data.status', 'completed');
        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'title' => 'New title', 'status' => 'completed']);
    });

    it('allows a partial update of a single field', function () {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create(['title' => 'Keep this title', 'status' => 'pending']);
        Sanctum::actingAs($user);

        $response = $this->patchJson("/api/tasks/{$task->id}", ['status' => 'in_progress']);

        $response->assertOk();
        $response->assertJsonPath('data.title', 'Keep this title');
        $response->assertJsonPath('data.status', 'in_progress');
    });

    it('rejects an invalid status on update', function () {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create();
        Sanctum::actingAs($user);

        $response = $this->putJson("/api/tasks/{$task->id}", ['status' => 'not_a_status']);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('status');
    });

    it('returns 404 for a task owned by another user and leaves it unchanged', function (array $payload) {
        $task = Task::factory()->create(['title' => 'Untouched title']);
        Sanctum::actingAs(User::factory()->create());

        $response = $this->putJson("/api/tasks/{$task->id}", $payload);

        $response->assertNotFound();
        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'title' => 'Untouched title']);
    })->with([
        'valid payload' => [['title' => 'Changed title']],
        'invalid payload' => [['status' => 'not_a_status']],
    ]);

    it('returns 404 when updating a non-existent task', function () {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->putJson('/api/tasks/'.Str::uuid7(), ['title' => 'Anything']);

        $response->assertNotFound();
    });
});

describe('destroy', function () {
    it('deletes the task', function () {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create();
        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertNoContent();
        $this->assertModelMissing($task);
    });

    it('returns 404 for a task owned by another user and keeps it', function () {
        $task = Task::factory()->create();
        Sanctum::actingAs(User::factory()->create());

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertNotFound();
        $this->assertModelExists($task);
    });

    it('returns 404 when deleting a non-existent task', function () {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->deleteJson('/api/tasks/'.Str::uuid7());

        $response->assertNotFound();
    });
});
