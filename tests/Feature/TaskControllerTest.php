<?php

use App\Models\Task;
use Illuminate\Support\Str;

describe('index', function () {
    it('lists tasks ordered newest first', function () {
        $oldest = Task::factory()->create(['created_at' => now()->subDays(2)]);
        $middle = Task::factory()->create(['created_at' => now()->subDay()]);
        $newest = Task::factory()->create([
            'title' => 'first task',
            'created_at' => now()
        ]);

        $response = $this->getJson('/api/tasks');

        $response->assertOk();
        $response->assertJsonPath('data.0.id', $newest->id);
        $response->assertJsonPath('data.1.id', $middle->id);
        $response->assertJsonPath('data.2.id', $oldest->id);
    });

    it('returns an empty list when no tasks exist', function () {
        $response = $this->getJson('/api/tasks');

        $response->assertOk();
        $response->assertJsonCount(0, 'data');
    });
});

describe('store', function () {
    it('creates a task with valid data', function () {
        $payload = [
            'title' => 'Write project report',
            'description' => 'Summarize Q3 progress',
            'status' => 'in_progress',
            'priority' => 'high',
            'due_date' => '2026-09-10',
        ];

        $response = $this->postJson('/api/tasks', $payload);

        $response->assertCreated();
        $response->assertJsonPath('data.title', 'Write project report');
        $response->assertJsonPath('data.status', 'in_progress');
        $response->assertJsonPath('data.priority', 'high');
        $response->assertJsonPath('data.due_date', '2026-09-10');

        $this->assertDatabaseHas('tasks', [
            'id' => $response->json('data.id'),
            'title' => 'Write project report',
            'status' => 'in_progress',
            'priority' => 'high',
        ]);
    });

    it('defaults status to pending and priority to medium when omitted', function () {
        $response = $this->postJson('/api/tasks', ['title' => 'Minimal task']);

        $response->assertCreated();
        $response->assertJsonPath('data.status', 'pending');
        $response->assertJsonPath('data.priority', 'medium');
    });

    it('rejects invalid input', function (array $payload, string $invalidField) {
        $response = $this->postJson('/api/tasks', array_merge(['title' => 'Valid title'], $payload));

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors($invalidField);
    })->with([
        'missing title' => [['title' => ''], 'title'],
        'title too long' => [['title' => str_repeat('a', 256)], 'title'],
        'invalid status' => [['status' => 'not_a_status'], 'status'],
        'invalid priority' => [['priority' => 'not_a_priority'], 'priority'],
        'invalid due_date' => [['due_date' => 'not-a-date'], 'due_date'],
    ]);
});

describe('show', function () {
    it('returns a single task', function () {
        $task = Task::factory()->create();

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertOk();
        $response->assertJsonPath('data.id', $task->id);
        $response->assertJsonPath('data.title', $task->title);
    });

    it('returns 404 when the task does not exist', function () {
        $response = $this->getJson('/api/tasks/'.Str::uuid7());

        $response->assertNotFound();
    });
});

describe('update', function () {
    it('updates a task with valid data', function () {
        $task = Task::factory()->create(['title' => 'Old title', 'status' => 'pending']);

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
        $task = Task::factory()->create(['title' => 'Keep this title', 'status' => 'pending']);

        $response = $this->patchJson("/api/tasks/{$task->id}", ['status' => 'in_progress']);

        $response->assertOk();
        $response->assertJsonPath('data.title', 'Keep this title');
        $response->assertJsonPath('data.status', 'in_progress');
    });

    it('rejects an invalid status on update', function () {
        $task = Task::factory()->create();

        $response = $this->putJson("/api/tasks/{$task->id}", ['status' => 'not_a_status']);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('status');
    });

    it('returns 404 when updating a non-existent task', function () {
        $response = $this->putJson('/api/tasks/'.Str::uuid7(), ['title' => 'Anything']);

        $response->assertNotFound();
    });
});

describe('destroy', function () {
    it('deletes the task', function () {
        $task = Task::factory()->create();

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertNoContent();
        $this->assertModelMissing($task);
    });

    it('returns 404 when deleting a non-existent task', function () {
        $response = $this->deleteJson('/api/tasks/'.Str::uuid7());

        $response->assertNotFound();
    });
});
