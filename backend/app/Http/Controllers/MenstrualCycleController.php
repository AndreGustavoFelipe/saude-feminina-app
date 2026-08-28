<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCycleRequest;
use App\Http\Requests\UpdateCycleRequest;
use App\Http\Resources\MenstrualCycleResource;
use App\Models\MenstrualCycle;

class MenstrualCycleController extends Controller
{
    public function index()
    {
        $cycles = MenstrualCycle::where('user_id', 1)
            ->orderBy('start_date', 'desc')
            ->get();

        return MenstrualCycleResource::collection($cycles);
    }

    public function store(StoreCycleRequest $request)
    {
        $cycle = MenstrualCycle::create([
            'user_id' => 1,
            'start_date' => $request->validated()['start_date'],
            'end_date' => $request->validated()['end_date'] ?? null,
        ]);

        return (new MenstrualCycleResource($cycle))->response()->setStatusCode(201);
    }

    public function update(UpdateCycleRequest $request, MenstrualCycle $cycle)
    {
        $cycle->update($request->validated());
        return new MenstrualCycleResource($cycle);
    }

    public function destroy(MenstrualCycle $cycle)
    {
        $cycle->delete();
        return response()->json(['message' => 'Ciclo removido com sucesso.'], 200);
    }
}
