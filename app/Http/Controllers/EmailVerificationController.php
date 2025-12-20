<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    public function verify(Request $request, string $id, string $hash)
    {
        if (! $request->hasValidSignature()) {
            return redirect('/admin/verify-email?verify=invalid');
        }

        $user = User::findOrFail($id);

        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return redirect('/admin/verify-email?verify=invalid');
        }

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        return redirect('/admin/verify-email?verify=verified');
    }

    public function send(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message_key' => 'auth.email_already_verified']);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message_key' => 'auth.verification_sent']);
    }
}
