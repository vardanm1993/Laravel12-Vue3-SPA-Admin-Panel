<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    public function forgot(ForgotPasswordRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        $status = Password::sendResetLink($credentials);

        if ($status !== Password::RESET_LINK_SENT) {
            return response()->json([
                'message_key' => match ($status) {
                    Password::INVALID_USER => 'auth.email_not_found',
                    Password::RESET_THROTTLED => 'auth.too_many_requests',
                    default => 'messages.unknown_error',
                }
            ], 422);
        }

        return response()->json([
            'message_key' => 'auth.reset_link_sent',
        ]);
    }

    public function reset(ResetPasswordRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        $status = Password::reset(
            [
                'email' => $credentials['email'],
                'password' => $credentials['password'],
                'password_confirmation' => $credentials['password_confirmation'],
                'token' => $credentials['token'],
            ],
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message_key' => match ($status) {
                    Password::INVALID_TOKEN => 'auth.reset_invalid_token',
                    Password::INVALID_USER => 'auth.email_not_found',
                    default => 'messages.unknown_error',
                }
            ], 422);
        }

        return response()->json([
            'message_key' => 'auth.password_reset_success',
        ]);
    }
}
