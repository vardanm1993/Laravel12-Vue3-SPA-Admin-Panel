<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $credentials = [
            'email' => $validated['email'],
            'password' => $validated['password'],
        ];

        $remember = $validated['remember'] ?? false;

        if (!Auth::guard('web')->attempt($credentials, $remember)) {
            return response()->json([
                'message_key' => 'auth.invalid_credentials',
            ], 401);
        }

        $request->session()->regenerate();

        return response()->json([
            'message_key' => 'auth.login_success',
            'user' => Auth::user(),
        ]);
    }


    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'] ?? 'user',
        ]);

        $remember = $validated['remember'] ?? false;

        Auth::guard('web')->login($user, $remember);

        $request->session()->regenerate();

        return response()->json([
            'message_key' => 'auth.success_register',
            'user' => $user,
        ], 201);
    }


    public function logout(): JsonResponse
    {
        auth()->guard('web')->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return response()->json([
            'message_key' => 'messages.logout_success',
        ]);
    }
}
