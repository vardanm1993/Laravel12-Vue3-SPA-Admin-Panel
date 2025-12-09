<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

Route::prefix('api')
    ->middleware([
        'web',
        EnsureFrontendRequestsAreStateful::class,
    ])
    ->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/logout', [AuthController::class, 'logout'])
            ->middleware('auth:sanctum');

        Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
            return $request->user();
        });

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
