<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CalendarEventController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MenstrualCycleController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\LifePhaseController;
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\SymptomController;
use App\Http\Controllers\SymptomLogController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::apiResource('categories', CategoryController::class);
Route::apiResource('tags', TagController::class);
Route::apiResource('life-phases', LifePhaseController::class)->parameters([
    'life-phases' => 'lifePhase'
]);

Route::get('articles', [ArticleController::class, 'index']);

Route::prefix('admin')->group(function () {
    Route::get('articles', [ArticleController::class, 'adminIndex']);
    Route::post('articles', [ArticleController::class, 'store']);
    Route::get('articles/{article}', [ArticleController::class, 'show']);
    Route::put('articles/{article}', [ArticleController::class, 'update']);
    Route::post('articles/{article}', [ArticleController::class, 'update']);
    Route::delete('articles/{article}', [ArticleController::class, 'destroy']);
});

Route::apiResource('cycles', MenstrualCycleController::class)->except(['show']);

Route::get('predictions', [PredictionController::class, 'index']);

Route::get('symptoms', [SymptomController::class, 'index']);
Route::apiResource('symptom-logs', SymptomLogController::class)->except(['show']);

// Calendar Events - custom routes BEFORE apiResource to avoid route model binding conflicts
Route::post('calendar-events/toggle-menstruation', [CalendarEventController::class, 'toggleMenstruation']);
Route::get('calendar-events-reminders/upcoming', [CalendarEventController::class, 'upcomingReminders']);
Route::apiResource('calendar-events', CalendarEventController::class)->parameters([
    'calendar-events' => 'calendarEvent'
]);
