<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        return Address::where('user_id', $request->user()->id)->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'label'  => 'required|string|max:100',
            'city'   => 'required|string|max:100',
            'street' => 'required|string|max:255',
            'notes'  => 'nullable|string',
        ]);

        $data['user_id'] = $request->user()->id;
        $address = Address::create($data);

        return response()->json(['status' => true, 'data' => $address], 201);
    }

    public function show(Request $request, Address $address)
    {
        abort_unless($address->user_id === $request->user()->id, 403);
        return $address;
    }

    public function update(Request $request, Address $address)
    {
        abort_unless($address->user_id === $request->user()->id, 403);

        $data = $request->validate([
            'label'  => 'sometimes|required|string|max:100',
            'city'   => 'sometimes|required|string|max:100',
            'street' => 'sometimes|required|string|max:255',
            'notes'  => 'nullable|string',
        ]);

        $address->update($data);
        return response()->json(['status' => true, 'data' => $address]);
    }

    public function destroy(Request $request, Address $address)
    {
        abort_unless($address->user_id === $request->user()->id, 403);
        $address->delete();
        return response()->json(['status' => true, 'message' => 'تم الحذف']);
    }
}
