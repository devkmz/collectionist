<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CollectionTypeAttribute extends Model
{
    use HasFactory;

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
    protected $fillable = ['attributeName', 'attributeType', 'collection_type_id'];

    public function elementsAttributes () {
        return $this->hasMany('App\Models\ElementsAttributes', 'attribute_id');
    }
}
