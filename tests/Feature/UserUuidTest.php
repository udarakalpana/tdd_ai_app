<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

it('generates a valid uuid as the primary key when a user is created', function () {
    $user = User::factory()->create();

    expect($user->id)->toBeString()
        ->and(Str::isUuid($user->id))->toBeTrue();
});

it('generates unique uuids for each user', function () {
    $first = User::factory()->create();
    $second = User::factory()->create();

    expect($first->id)->not->toBe($second->id);
});

it('persists the uuid to the database as the primary key column', function () {
    $user = User::factory()->create();

    $this->assertDatabaseHas('users', ['id' => $user->id]);
    expect(DB::table('users')->where('id', $user->id)->count())->toBe(1);
});

it('does not use auto-incrementing integer keys', function () {
    $user = User::factory()->create();

    expect($user->getIncrementing())->toBeFalse()
        ->and($user->getKeyType())->toBe('string');
});

it('issues sanctum tokens with a matching uuid tokenable_id', function () {
    $user = User::factory()->create();

    $user->createToken('test');

    $this->assertDatabaseHas('personal_access_tokens', [
        'tokenable_type' => User::class,
        'tokenable_id' => $user->id,
    ]);
});

it('returns the uuid id from the authenticated /user endpoint', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'sanctum')->getJson('/api/user');

    $response->assertOk();
    $response->assertJsonPath('id', $user->id);
});
