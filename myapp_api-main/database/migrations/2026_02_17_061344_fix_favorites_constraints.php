<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('favorites', function (Blueprint $table) {
            // لو فيه بيانات قديمة null لازم تنظفها قبل ما تعملها not nullable
            // (هنحط سكربت تنظيف تحت)

            $table->unsignedBigInteger('user_id')->nullable(false)->change();
            $table->unsignedBigInteger('product_id')->nullable(false)->change();

            $table->unique(['user_id', 'product_id'], 'favorites_user_product_unique');
        });
    }

    public function down(): void
    {
        Schema::table('favorites', function (Blueprint $table) {
            $table->dropUnique('favorites_user_product_unique');
            $table->unsignedBigInteger('user_id')->nullable()->change();
            $table->unsignedBigInteger('product_id')->nullable()->change();
        });
    }
};
