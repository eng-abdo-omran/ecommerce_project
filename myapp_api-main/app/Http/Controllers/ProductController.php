<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('perPage', 10);
        $products = $this->productService->indexProduct($search, $perPage);
        return response()->json([
            'status' => true,
            'message' => 'قائمة المنتجات',
            'data' => $products
        ]);
    }

    public function store(ProductRequest $request)
    {
        $data = $request->validated();

        // main image
        if ($request->hasFile('images')) {
            $data['images'] = $request->file('images');
        }

        /**
         *  مهم جدًا:
         * لا تضيف product_images للـ data إلا إذا كانت موجودة في الـ request فعلاً.
         * لأن وجودها حتى لو [] هيخلي ProductService يمسح الجاليري.
         */
        if ($request->has('product_images')) {
            $pis = $request->input('product_images', []);

            // merge gallery files (لو موجودة)
            if (is_array($pis)) {
                foreach ($pis as $i => $img) {
                    if ($request->hasFile("product_images.$i.url")) {
                        $pis[$i]['url'] = $request->file("product_images.$i.url");
                    }
                }
            }

            $data['product_images'] = $pis; // موجودة فعلًا -> ابعتها (حتى لو فاضية)
        }

        $result = $this->productService->storeProduct($data);
        return response()->json($result, $result['status'] ? 201 : 500);
    }
    public function show($id)
    {
        $product = $this->productService->editProduct($id);
        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'المنتج غير موجود'
            ], 404);
        }
        return response()->json([
            'status' => true,
            'message' => 'تفاصيل المنتج',
            'data' => $product
        ]);
    }

    public function update(ProductRequest $request, $id)
    {
        $data = $request->validated();

        // main image
        if ($request->hasFile('images')) {
            $data['images'] = $request->file('images');
        }

        /**
         *  مهم جدًا:
         * لا تضيف product_images للـ data إلا إذا كانت موجودة في الـ request فعلاً.
         * لأن وجودها حتى لو [] هيخلي ProductService يمسح الجاليري.
         */
        if ($request->has('product_images')) {
            $pis = $request->input('product_images', []);

            // merge gallery files (لو موجودة)
            if (is_array($pis)) {
                foreach ($pis as $i => $img) {
                    if ($request->hasFile("product_images.$i.url")) {
                        $pis[$i]['url'] = $request->file("product_images.$i.url");
                    }
                }
            }

            $data['product_images'] = $pis; // موجودة فعلًا -> ابعتها (حتى لو فاضية)
        }

        //  Variants: لا تضيفها للـ data إلا إذا كانت موجودة في الـ request فعلاً
        if ($request->has('variants')) {
            $data['variants'] = $request->input('variants', []);
        }

        
        $result = $this->productService->updateProduct($data, $id);
        return response()->json($result, $result['status'] ? 200 : 500);
    }

    public function destroy($id)
    {
        $result = $this->productService->destroyProduct($id);
        return response()->json($result, $result['status'] ? 200 : 404);
    }
}
