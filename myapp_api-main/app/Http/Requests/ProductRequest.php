<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\UploadedFile;


class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product');
        $commonRules = [
            'sku' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('products')->ignore($productId),
            ],
            'name' => 'required|string|max:150',
            'slug' => [
                'nullable',
                'string',
                'max:150',
                Rule::unique('products')->ignore($productId),
            ],
            'description' => 'nullable|string',
            'features' => 'nullable|string',
            'details' => 'nullable|string',
            'price' => 'required|numeric|between:0,99999999.99',
            'compare_price' => 'nullable|numeric|between:0,99999999.99',
            'cost_price' => 'nullable|numeric|between:0,99999999.99',
            'weight' => 'nullable|numeric',
            'quantity' => 'nullable|integer',
            'dimensions' => 'nullable|string',
            'images' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'user_add_id' => 'nullable|exists:users,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            // صور المنتج

            'product_images' => 'nullable|array',
            'product_images.*.url' => [
                'required_with:product_images',
                function ($attribute, $value, $fail) {
                    // لو File
                    if ($value instanceof UploadedFile) {
                        $allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml', 'image/webp'];
                        if (!in_array($value->getMimeType(), $allowed)) {
                            return $fail('صيغة صورة غير مدعومة.');
                        }
                        if ($value->getSize() > 2 * 1024 * 1024) {
                            return $fail('حجم الصورة يجب ألا يتجاوز 2MB.');
                        }
                        return;
                    }

                    //  لو String path/URL
                    if (is_string($value) && trim($value) !== '') {
                        $v = trim($value);

                        // اسمح بمسارات مشروعك (مثال: product_images/xxx.jpg) أو URL كاملة
                        $isPath = preg_match('#^(product_images/|product/)#', $v);
                        $isUrl  = filter_var($v, FILTER_VALIDATE_URL);

                        if (!$isPath && !$isUrl) {
                            return $fail('المسار/الرابط الخاص بالصورة غير صالح.');
                        }
                        return;
                    }

                    return $fail('قيمة الصورة غير صحيحة.');
                }
            ],
            'product_images.*.alt_text' => 'nullable|string|max:255',
            'product_images.*.sort_order' => 'nullable|integer',
            // الفاريانت
            'variants' => 'nullable|array',
            'variants.*.name' => 'required_with:variants|string',
            'variants.*.type' => 'required_with:variants|integer',
            'variants.*.values' => 'nullable|array',
            'variants.*.values.*.value' => 'required_with:variants.*.values|string',
            'variants.*.values.*.image_name' => 'nullable|string',
            'variants.*.values.*.color_name' => 'nullable|string',
        ];
        if ($this->isMethod('POST')) {
            return $commonRules;
        }
        if ($this->isMethod('PATCH') || $this->isMethod('PUT')) {
            return $commonRules;
        }
        return [];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'اسم المنتج مطلوب.',

            'price.required' => 'سعر المنتج مطلوب.',
            'price.numeric' => 'سعر المنتج لازم يكون رقم.',
            'price.between' => 'سعر المنتج لازم يكون بين 0 و 99999999.99',
            'compare_price.between' => 'سعر المقارنة لازم يكون بين 0 و 99999999.99',
            'cost_price.between' => 'سعر التكلفة لازم يكون بين 0 و 99999999.99',

            'sku.unique' => 'SKU مستخدم بالفعل.',
            'slug.unique' => 'Slug مستخدم بالفعل.',

            'images.image' => 'يجب أن يكون الصوره صورة.',
            'images.mimes' => 'صيغة الصوره غير مدعومة. الصيغ المسموحة: jpeg, png, jpg, gif, svg.',
            'images.max' => 'حجم الصوره يجب ألا يتجاوز 2 ميجابايت.',
            'product_images.*.  .required_with' => 'رابط الصورة مطلوب.',

            'variants.*.name.required_with' => 'اسم الفاريانت مطلوب.',
            'variants.*.type.required_with' => 'نوع الفاريانت مطلوب.',
            'variants.*.values.*.value.required_with' => 'قيمة الفاريانت مطلوبة.'
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => 'Validation errors',
            'errors' => $validator->errors()
        ], 422));
    }
}
