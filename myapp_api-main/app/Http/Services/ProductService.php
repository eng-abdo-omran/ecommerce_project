<?php

namespace App\Http\Services;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\VariantValue;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;

class ProductService
{
    protected Product $model;

    public function __construct(Product $model)
    {
        $this->model = $model;
    }

    public function indexProduct($search = null, $perPage = 10)
    {
        return $this->model->with(['productImages', 'variants.values'])
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            })->paginate($perPage);
    }

    public function storeProduct(array $requestData)
    {
        DB::beginTransaction();
        try {
            $data = Arr::only($requestData, [
                'sku',
                'name',
                'slug',
                'description',
                'details',
                'features',
                'price',
                'compare_price',
                'cost_price',
                'weight',
                'quantity',
                'dimensions',
                'user_add_id',
                'supplier_id',
                'category_id',
                'brand_id'
            ]);
            $data['user_add_id'] = Auth::id();
            // حفظ صورة المنتج الأساسية
            if (isset($requestData['images']) && $requestData['images'] instanceof \Illuminate\Http\UploadedFile) {
                $folder = public_path('product');
                if (!file_exists($folder)) {
                    mkdir($folder, 0777, true);
                }
                $filename = uniqid('product_') . '.' . $requestData['images']->getClientOriginalExtension();
                $requestData['images']->move($folder, $filename);
                $data['images'] = 'product/' . $filename;
            }

            $product = $this->model->create($data);

            // حفظ صور المنتج الفرعية
            if (!empty($requestData['product_images']) && is_array($requestData['product_images'])) {
                foreach ($requestData['product_images'] as $img) {
                    if (isset($img['url']) && $img['url'] instanceof \Illuminate\Http\UploadedFile) {
                        $folder = public_path('product_images');
                        if (!file_exists($folder)) {
                            mkdir($folder, 0777, true);
                        }
                        $filename = uniqid('product_img_') . '.' . $img['url']->getClientOriginalExtension();
                        $img['url']->move($folder, $filename);
                        $img['url'] = 'product_images/' . $filename;
                    }
                    $product->productImages()->create($img);
                }
            }

            // حفظ الفاريانت والقيم
            if (isset($requestData['variants']) && is_array($requestData['variants'])) {

                foreach ($requestData['variants'] as $variant) {
                    $variantData = Arr::only($variant, ['name', 'type']);
                    $productVariant = $product->variants()->create($variantData);

                    if (!empty($variant['values']) && is_array($variant['values'])) {
                        $valuesData = [];

                        foreach ($variant['values'] as $value) {
                            $valueData = Arr::only($value, ['value', 'color_name', 'image_name']);
                            $valueData['product_id'] = $product->id;
                            $valueData['variant_id'] = $productVariant->id;

                            $valuesData[] = $valueData;
                        }

                        $productVariant->values()->createMany($valuesData);
                    }
                }
            }



            DB::commit();
            return [
                'status' => true,
                'message' => 'تم إنشاء المنتج بنجاح',
                // 'data' => $product->load(['images', 'variants.values'])
                'data' => $product
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Product creation failed: ' . $e->getMessage());
            return [
                'status' => false,
                'message' => 'حدث خطأ أثناء إنشاء المنتج'
            ];
        }
    }

    public function editProduct($id)
    {
        return $this->model->with(['productImages', 'variants.values'])->find($id);
    }

    public function updateProduct(array $requestData, $id)
    {
        DB::beginTransaction();
        try {
            $product = $this->model->find($id);
            if (!$product) {
                return [
                    'status' => false,
                    'message' => 'المنتج غير موجود'
                ];
            }
            $data = Arr::only($requestData, [
                'sku',
                'name',
                'slug',
                'description',
                'features',
                'details',
                'price',
                'compare_price',
                'cost_price',
                'weight',
                'quantity',
                'dimensions',
                'supplier_id',
                'category_id',
                'brand_id'
            ]);
            // تحديث صورة المنتج الأساسية
            if (isset($requestData['images']) && $requestData['images'] instanceof \Illuminate\Http\UploadedFile) {
                if ($product->images && file_exists(public_path($product->images))) {
                    @unlink(public_path($product->images));
                }
                $folder = public_path('product');
                if (!file_exists($folder)) {
                    mkdir($folder, 0777, true);
                }
                $filename = uniqid('product_') . '.' . $requestData['images']->getClientOriginalExtension();
                $requestData['images']->move($folder, $filename);
                $data['images'] = 'product/' . $filename;
            }
            $product->update($data);

            // حذف الصور القديمة وحفظ الجديدة
            if (isset($requestData['product_images']) && is_array($requestData['product_images'])) {

                // 1) جهز قائمة URLs الجديدة (بعد الرفع) في مصفوفة
                $newImagesPayload = [];

                foreach ($requestData['product_images'] as $img) {
                    $row = Arr::only($img, ['alt_text', 'sort_order']);

                    // url may be file or string
                    if (isset($img['url']) && $img['url'] instanceof UploadedFile) {
                        $folder = public_path('product_images');
                        if (!file_exists($folder)) mkdir($folder, 0777, true);

                        $filename = uniqid('product_img_') . '.' . $img['url']->getClientOriginalExtension();
                        $img['url']->move($folder, $filename);
                        $row['url'] = 'product_images/' . $filename;
                    } elseif (isset($img['url']) && is_string($img['url'])) {
                        $row['url'] = trim($img['url']); // old url/path
                    } else {
                        continue;
                    }

                    $newImagesPayload[] = $row;
                }

                // 2) احذف الصور القديمة (records) + احذف الملفات اللي اتشالت
                // هنعرف الصور اللي لازم تفضل
                $keepUrls = collect($newImagesPayload)->pluck('url')->filter()->values()->all();

                foreach ($product->productImages as $oldImg) {
                    // لو الصورة القديمة مش ضمن keep => احذف ملفها + record
                    if (!in_array($oldImg->url, $keepUrls, true)) {
                        if ($oldImg->url && file_exists(public_path($oldImg->url))) {
                            @unlink(public_path($oldImg->url));
                        }
                        $oldImg->delete();
                    }
                }

                // 3) اعمل upsert بسيط: لو url موجودة بالفعل حدث alt_text/sort_order، لو جديدة اعمل create
                foreach ($newImagesPayload as $row) {
                    $existing = $product->productImages()->where('url', $row['url'])->first();
                    if ($existing) {
                        $existing->update([
                            'alt_text' => $row['alt_text'] ?? null,
                            'sort_order' => $row['sort_order'] ?? 0,
                        ]);
                    } else {
                        $product->productImages()->create([
                            'url' => $row['url'],
                            'alt_text' => $row['alt_text'] ?? null,
                            'sort_order' => $row['sort_order'] ?? 0,
                            'user_add_id' => Auth::id(),
                        ]);
                    }
                }
            }
            // حذف الفاريانت والقيم القديمة وحفظ الجديدة
            if (isset($requestData['variants']) && is_array($requestData['variants'])) {

                foreach ($product->variants as $oldVariant) {
                    $oldVariant->values()->delete();
                }
                $product->variants()->delete();

                foreach ($requestData['variants'] as $variant) {
                    $variantData = Arr::only($variant, ['name', 'type']);
                    $productVariant = $product->variants()->create($variantData);

                    if (isset($variant['values']) && is_array($variant['values'])) {
                        foreach ($variant['values'] as $value) {
                            $productVariant->values()->create(
                                Arr::only($value, ['value', 'color_name', 'image_name']) + ['product_id' => $product->id]
                            );
                        }
                    }
                }
            }

            DB::commit();
            return [
                'status' => true,
                'message' => 'تم تحديث المنتج بنجاح',
                // 'data' => $product->load(['images', 'variants.values'])
                'data' => $product->load(['productImages', 'variants.values'])
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Product update failed: ' . $e->getMessage());
            return [
                'status' => false,
                'message' => 'حدث خطأ أثناء التحديث'
            ];
        }
    }

    public function destroyProduct($id)
    {
        try {
            $product = $this->model->with(['productImages', 'variants.values'])->find($id);

            if (!$product) {
                return [
                    'status' => false,
                    'message' => 'المنتج غير موجود'
                ];
            }

            // حذف الصورة الأساسية من المجلد
            if (!empty($product->images) && file_exists(public_path($product->images))) {
                @unlink(public_path($product->images));
            }

            // حذف صور المنتج الفرعية من المجلد
            if ($product->productImages  && $product->productImages->count() > 0) {
                foreach ($product->productImages as $img) {
                    if (!empty($img->url) && file_exists(public_path($img->url))) {
                        @unlink(public_path($img->url));
                    }
                }
                $product->productImages()->delete();
            }

            // حذف الفاريانت والقيم
            if ($product->variants && $product->variants->count() > 0) {
                foreach ($product->variants as $variant) {
                    $variant->values()->delete();
                }
                $product->variants()->delete();
            }

            // حذف المنتج نفسه
            $product->delete();

            return [
                'status' => true,
                'message' => 'تم حذف المنتج بنجاح'
            ];
        } catch (\Exception $e) {
            Log::error('Product deletion failed: ' . $e->getMessage());
            return [
                'status' => false,
                'message' => 'حدث خطأ أثناء حذف المنتج'
            ];
        }
    }
}
