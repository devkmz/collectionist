<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CollectionTypeAttribute;

class CollectionTypeAttributeController extends Controller
{
    public function index() {
        return CollectionTypeAttribute::all();
    }

    public function show ($id) {
        return CollectionTypeAttribute::find($id);
    }

    public function store(Request $request) {
        return CollectionTypeAttribute::create($request->all());
    }

    public function update (Request $request, $id) {
        $CollectionTypeAttribute = CollectionTypeAttribute::findOrFail($id);
        $CollectionTypeAttribute->update($request->all());
        return $CollectionTypeAttribute;
    }

    public function delete (Request $request, $id) {
        $CollectionTypeAttribute = CollectionTypeAttribute::findOrFail($id);
        $CollectionTypeAttribute->delete();
        return response()->noContent();
    }
}
