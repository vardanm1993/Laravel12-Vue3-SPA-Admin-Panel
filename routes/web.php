<?php

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
        Route::post('/login',    [AuthController::class, 'login']);
        Route::post('/logout',   [AuthController::class, 'logout'])
            ->middleware('auth:sanctum');

        Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
            return $request->user();
        });

        Route::get('/test', function () {
            return response()->json(['ok' => true, 'message' => 'API Works']);
        });
    });

Route::view('/{any}', 'app')->where('any', '.*');
