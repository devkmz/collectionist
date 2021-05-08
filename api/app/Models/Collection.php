<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    use HasFactory;

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
    protected $fillable = ['name', 'description', 'collection_type_id', 'image'];
    protected $casts = ['image' => 'array'];

    public function type(){
        return $this->belongsTo(CollectionType::class);
    }

    public function elements () {
        return $this->hasMany(CollectionElement::class);
    }
}
