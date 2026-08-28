<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLifePhaseRequest;
use App\Http\Requests\UpdateLifePhaseRequest;
use App\Http\Resources\LifePhaseResource;
use App\Models\LifePhase;

class LifePhaseController extends Controller
{
    public function index()
    {
        $lifePhases = LifePhase::orderBy('name')->get();
        return LifePhaseResource::collection($lifePhases);
    }

    public function store(StoreLifePhaseRequest $request)
    {
        $lifePhase = LifePhase::create($request->validated());
        return (new LifePhaseResource($lifePhase))->response()->setStatusCode(201);
    }

    public function show(LifePhase $lifePhase)
    {
        return new LifePhaseResource($lifePhase);
    }

    public function update(UpdateLifePhaseRequest $request, LifePhase $lifePhase)
    {
        $lifePhase->update($request->validated());
        return new LifePhaseResource($lifePhase);
    }

    public function destroy(LifePhase $lifePhase)
    {
        $lifePhase->delete();
        return response()->json(null, 204);
    }
}
