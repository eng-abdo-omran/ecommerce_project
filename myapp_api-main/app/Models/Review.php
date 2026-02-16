<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_add_id',
        'product_id',
        'customer_id', // NEW
        'rating',
        'comment',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function userAdd()
    {
        return $this->belongsTo(User::class, 'user_add_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // NEW: customer relation (ReviewService بيستدعيها)
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }
}
