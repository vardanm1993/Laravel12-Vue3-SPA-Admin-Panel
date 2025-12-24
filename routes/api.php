<?php

use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'ok' => true,
        'message' => 'API Layer Works from Laravel 12!'
    ]);
});
