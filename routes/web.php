<?php

use App\Http\Controllers\Admin\Auth\AuthController;
use App\Http\Controllers\Admin\Auth\EmailVerificationController;
use App\Http\Controllers\Admin\Auth\PasswordResetController;
use App\Http\Controllers\Admin\Profile\ProfileController;
use App\Http\Controllers\Admin\User\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

Route::prefix('api')
    ->middleware([
        'web',
        EnsureFrontendRequestsAreStateful::class,
    ])
    ->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);

        Route::post('/forgot-password', [PasswordResetController::class, 'forgot'])
            ->middleware(['throttle:6,1']);

        Route::post('/reset-password', [PasswordResetController::class, 'reset'])
            ->middleware(['throttle:6,1']);

        Route::post('/logout', [AuthController::class, 'logout'])
            ->middleware('auth:sanctum');

        Route::get('/user', function (Request $request) {
            $user = $request->user();

            return response()->json([
                'user' => $user,
                'roles' => $user->getRoleNames()->values(),
                'permissions' => $user->getAllPermissions()->pluck('name')->values(),
            ]);
        })->middleware('auth:sanctum');

        Route::middleware(['auth:sanctum', 'verified'])->group(function () {

            Route::get('/admin/roles', [UserController::class, 'roles'])
                ->middleware('permission:users.view');

            Route::get('/admin/users', [UserController::class, 'index'])
                ->middleware('permission:users.view');

            Route::patch('/admin/users/{user}', [UserController::class, 'update'])
                ->middleware('permission:users.update');

            Route::put('/admin/users/{user}/roles', [UserController::class, 'syncRoles'])
                ->middleware('permission:users.roles.sync');
        });




        Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
            ->middleware(['signed', 'throttle:6,1'])
            ->name('verification.verify');

        Route::post('/email/verification-notification', [EmailVerificationController::class, 'send'])
            ->middleware(['auth:sanctum', 'throttle:6,1'])
            ->name('verification.send');

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/profile', [ProfileController::class, 'show']);
            Route::post('/profile/update', [ProfileController::class, 'updateProfile']);
            Route::post('/profile/password', [ProfileController::class, 'updatePassword']);
            Route::post('/profile/delete', [ProfileController::class, 'destroy']);
            Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
            Route::delete('/profile/avatar', [ProfileController::class, 'deleteAvatar']);
        });
    });

Route::view('/{any}', 'app')->where('any', '.*');
