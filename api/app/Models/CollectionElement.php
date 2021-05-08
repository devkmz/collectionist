<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CollectionElement extends Model
{
    use HasFactory;

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
    protected $fillable = ['elementName', 'elementDescription', 'elementImage', 'collection_id'];
    protected $casts = ['elementImage' => 'array'];

    public function elementsAttributes () {
        return $this->hasMany(ElementsAttributes::class, 'element_id');
    }
}
