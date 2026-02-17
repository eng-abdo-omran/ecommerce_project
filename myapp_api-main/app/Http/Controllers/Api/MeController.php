<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MeController extends Controller
{
    public function show(Request $request)
    {
        return response()->json([
            'status' => true,
            'message' => 'بيانات المستخدم',
            'data' => $request->user(),
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        $user->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'تم تحديث البيانات بنجاح',
            'data' => $user,
        ]);
    }
}
