<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'Minha Saúde Feminina API',
        'version' => '1.0.0',
    ]);
});
