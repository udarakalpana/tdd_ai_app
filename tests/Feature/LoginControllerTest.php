<?php

use App\Models\User;

it('returns a sanctum token for valid credentials', function () {
    $user = User::factory()->create(['email' => 'taylor@example.com']);

    $response = $this->postJson('/api/login', [
        'email' => $user['email'],
        'password' => 'password',
    ]);

    $response->assertOk();
    $response->assertJsonPath('data.token_type', 'Bearer');
    $response->assertJsonPath('data.user.id', $user->id);
    $response->assertJsonPath('data.user.email', $user['email']);
    $response->assertJsonPath('data.user.name', $user['name']);
    expect($response->json('data.token'))->toBeString()->not->toBeEmpty();
});

it('issues a token that authenticates a subsequent request', function () {
    $user = User::factory()->create(['email' => 'taylor@example.com']);

    $token = $this->postJson('/api/login', [
        'email' => 'taylor@example.com',
        'password' => 'password',
    ])->json('data.token');

    $response = $this->withToken($token)->getJson('/api/user');

    $response->assertOk();
    $response->assertJsonPath('id', $user->id);
});

it('persists the token against the signed in user', function () {
    $user = User::factory()->create(['email' => 'taylor@example.com']);

    $this->postJson('/api/login', [
        'email' => 'taylor@example.com',
        'password' => 'password',
    ]);

    $this->assertDatabaseHas('personal_access_tokens', [
        'tokenable_type' => User::class,
        'tokenable_id' => $user->id,
        'name' => 'api-token',
    ]);
});

it('does not expose the password hash in the response', function () {
    $user = User::factory()->create(['email' => 'taylor@example.com']);

    $response = $this->postJson('/api/login', [
        'email' => 'taylor@example.com',
        'password' => 'password',
    ]);

    $response->assertOk();
    $response->assertJsonMissingPath('data.user.password');
    expect($response->getContent())->not->toContain($user->password);
});

it('returns 422 when the email is not registered', function () {
    $response = $this->postJson('/api/login', [
        'email' => 'nobody@example.com',
        'password' => 'password',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors([
        'email' => 'These credentials do not match our records.',
    ]);
});

it('returns 422 when the password is wrong', function () {
    User::factory()->create(['email' => 'taylor@example.com']);

    $response = $this->postJson('/api/login', [
        'email' => 'taylor@example.com',
        'password' => 'wrong-password',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors([
        'email' => 'These credentials do not match our records.',
    ]);
    $this->assertDatabaseCount('personal_access_tokens', 0);
});

it('returns 422 and reports both fields when the payload is empty', function () {
    $response = $this->postJson('/api/login', []);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['email', 'password']);
});

it('rejects invalid credential input', function (array $payload, string $invalidField) {
    $response = $this->postJson('/api/login', array_merge([
        'email' => 'taylor@example.com',
        'password' => 'password',
    ], $payload));

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors($invalidField);
})->with([
    'malformed email' => [['email' => 'not-an-email'], 'email'],
    'missing email' => [['email' => ''], 'email'],
    'missing password' => [['password' => ''], 'password'],
]);

it('returns 429 once the attempt limit is exceeded', function () {
    User::factory()->create(['email' => 'taylor@example.com']);

    $credentials = [
        'email' => 'taylor@example.com',
        'password' => 'wrong-password',
    ];

    for ($attempt = 0; $attempt < 5; $attempt++) {
        $this->postJson('/api/login', $credentials)->assertUnprocessable();
    }

    $this->postJson('/api/login', $credentials)->assertTooManyRequests();
});
