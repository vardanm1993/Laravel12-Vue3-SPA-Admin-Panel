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
        if (!Auth::guard('web')->attempt($request->validated())) {
            return response()->json([
                'message_key' => 'messages.invalid_credentials',
            ], 401);
        }

        $request->session()->regenerate();

        return response()->json([
            'message_key' => 'messages.login_success',
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
        ]);

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return response()->json([
            'message_key' => 'messages.success_register',
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
