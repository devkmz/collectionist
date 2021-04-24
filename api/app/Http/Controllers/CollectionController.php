<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Collection;

class CollectionController extends Controller
{
    public function index() {
        return Collection::all();
    }

    public function show ($id) {
        return Collection::find($id);
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required|max:50',
            'description' => 'required|max:150',
            'collection_type_id' => 'required',
            'image' => 'nullable',
        ]);
        return Collection::create($request->all());
    }

    public function update (Request $request, $id) {
        $request->validate([
            'name' => 'required|max:50',
            'description' => 'required|max:150',
            'collection_type_id' => 'required',
            'image' => 'nullable',
        ]);
        $collection = Collection::findOrFail($id);
        $collection->update($request->all());
        return $collection;
    }

    public function delete (Request $request, $id) {
        $collection = Collection::findOrFail($id);
        $collection->delete();
        return 204;
    }
}
