<?php

namespace App\Http\Controllers;

use App\Http\Resources\SymptomResource;
use App\Models\Symptom;

class SymptomController extends Controller
{
    public function index()
    {
        $symptoms = Symptom::all();
        return SymptomResource::collection($symptoms);
    }
}
