<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Http\Services\CheckoutService;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function __construct(private CheckoutService $service) {}

    public function store(CheckoutRequest $request)
    {
        $userId = $request->user()->id;

        $result = $this->service->checkout($userId, $request->validated());

        $status = ($result['status'] ?? false) ? 201 : 422;

        return response()->json($result, $status);
    }
}
