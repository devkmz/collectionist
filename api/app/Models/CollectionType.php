<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CollectionType extends Model
{
    use HasFactory;

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
    protected $fillable = ['typeName'];
    
    public function attributes () {
        return $this->hasMany('App\Models\CollectionTypeAttribute');
    }

    public function collections () {
        return $this->hasMany('App\Models\Collection');
    }
}
