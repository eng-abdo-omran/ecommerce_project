<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {

            // امسح الـ foreign key الأول
            $table->dropForeign(['cart_id']);
            $table->dropForeign(['product_id']);

            // 1) هنشيل الـ unique القديم لأنه يمنع نفس المنتج يتكرر (حتى لو options مختلفة)
            $table->dropUnique('cart_items_cart_product_unique');

            // 2) options: هنخزن اختيار المستخدم: [{variant_id, value_id, name, value}]
            $table->json('options')->nullable()->after('quantity');

            // 3) options_hash: بصمة للاختيارات عشان نعمل unique على (cart_id, product_id, options_hash)
            $table->string('options_hash', 64)->nullable()->after('options');

            // 4) unique جديد يسمح بتكرار المنتج لكن يمنع تكرار نفس الاختيارات
            $table->unique(['cart_id', 'product_id', 'options_hash'], 'cart_items_unique_line');
        });
    }

    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropUnique('cart_items_unique_line');
            $table->dropColumn(['options', 'options_hash']);

            // رجّع unique القديم
            $table->unique(['cart_id', 'product_id'], 'cart_items_cart_product_unique');
        });
    }
};
