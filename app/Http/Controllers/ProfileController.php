<?php

namespace App\Http\Controllers;

use App\Http\Requests\Profile\DeleteAccountRequest;
use App\Http\Requests\Profile\UpdatePasswordRequest;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Requests\Profile\UploadAvatarRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json([
            'user' => auth()->user(),
        ]);
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $credentials = $request->validated();
        $user = auth()->user();

        $emailChanged = array_key_exists('email', $credentials)
            && $credentials['email'] !== $user->email;

        if ($emailChanged) {
            $user->forceFill([
                'email' => $credentials['email'],
                'email_verified_at' => null,
            ])->save();

            unset($credentials['email']);
            if (!empty($credentials)) {
                $user->update($credentials);
            }

            $user->sendEmailVerificationNotification();

            return response()->json([
                'message_key' => 'auth.verification_sent',
                'user' => $user->fresh(),
            ]);
        }

        $user->update($credentials);

        return response()->json([
            'message_key' => 'messages.profile_updated',
            'user' => $user,
        ]);
    }


    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $user = auth()->user();

        $user->update(['password' => bcrypt($request->new_password)]);


        return response()->json([
            'message_key' => 'messages.password_updated',
        ]);
    }

    public function destroy(DeleteAccountRequest $request): JsonResponse
    {
        $user = auth()->user();

        if ($user->avatar_path && Storage::disk('public')->exists($user->avatar_path)) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        $user->delete();

        auth()->guard('web')->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return response()->json([
            'message_key' => 'messages.account_deleted',
        ]);
    }


    public function uploadAvatar(UploadAvatarRequest $request): JsonResponse
    {
        $user = auth()->user();
        $file = $request->file('avatar');

        if ($user->avatar_path && Storage::disk('public')->exists($user->avatar_path)) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        $hash = bin2hex(random_bytes(10));
        $extension = $file->getClientOriginalExtension();
        $filename = "avatar_{$hash}.{$extension}";
        $directory = "avatars/{$user->id}";

        Storage::disk('public')->makeDirectory($directory);

        $path = $file->storeAs($directory, $filename, 'public');

        $user->update([
            'avatar_path' => $path,
        ]);

        return response()->json([
            'message_key' => 'messages.avatar_updated',
            'avatar_url' => $user->avatar_url,
        ]);
    }

}
