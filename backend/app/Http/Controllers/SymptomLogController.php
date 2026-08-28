<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSymptomLogRequest;
use App\Http\Resources\SymptomLogResource;
use App\Models\SymptomLog;
use Illuminate\Http\Request;

class SymptomLogController extends Controller
{
    public function index(Request $request)
    {
        $query = SymptomLog::with('symptom')
            ->where('user_id', 1)
            ->orderBy('log_date', 'desc');

        if ($request->has('start_date')) {
            $query->where('log_date', '>=', $request->input('start_date'));
        }

        if ($request->has('end_date')) {
            $query->where('log_date', '<=', $request->input('end_date'));
        }

        return SymptomLogResource::collection($query->get());
    }

    public function store(StoreSymptomLogRequest $request)
    {
        $log = SymptomLog::create([
            'user_id' => 1,
            ...$request->validated(),
        ]);

        $log->load('symptom');

        return (new SymptomLogResource($log))->response()->setStatusCode(201);
    }

    public function update(StoreSymptomLogRequest $request, SymptomLog $symptomLog)
    {
        $symptomLog->update($request->validated());
        $symptomLog->load('symptom');

        return new SymptomLogResource($symptomLog);
    }

    public function destroy(SymptomLog $symptomLog)
    {
        $symptomLog->delete();
        return response()->json(['message' => 'Registro removido com sucesso.'], 200);
    }
}
