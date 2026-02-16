<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class OrderRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        // status enum في migration: pending, processing, shipped, completed, cancelled
        $statusValues = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];

        return [
            'order_number' => 'nullable|string|max:100|unique:orders,order_number',
            'user_id' => 'nullable|exists:users,id',

            // اسم العمود الصحيح في DB هو total_amount
            'total_amount' => 'required|numeric|min:0',

            'status' => ['required', Rule::in($statusValues)],

            // موجودة في migration كـ json
            'shipping_address' => 'required|array',
            'billing_address' => 'nullable|array',

            'tracking_number' => 'nullable|string|max:255',
            'tracking_url' => 'nullable|string|max:255',
            'notes' => 'nullable|string',

            // items
            'order_items' => 'required|array|min:1',
            'order_items.*.product_id' => 'required|exists:products,id',
            'order_items.*.user_id' => 'nullable|exists:users,id',
            'order_items.*.quantity' => 'required|integer|min:1',
            'order_items.*.unit_price' => 'required|numeric|min:0',
            'order_items.*.subtotal' => 'required|numeric|min:0',
            'order_items.*.notes' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'total_amount.required' => 'إجمالي الطلب مطلوب.',
            'total_amount.numeric' => 'إجمالي الطلب يجب أن يكون رقم.',
            'shipping_address.required' => 'عنوان الشحن مطلوب.',
            'shipping_address.array' => 'عنوان الشحن يجب أن يكون بيانات (array).',
            'order_items.required' => 'عناصر الطلب مطلوبة.',
            'order_items.array' => 'عناصر الطلب يجب أن تكون قائمة.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status'  => false,
            'message' => 'Validation errors',
            'errors'  => $validator->errors()
        ], 422));
    }
}
