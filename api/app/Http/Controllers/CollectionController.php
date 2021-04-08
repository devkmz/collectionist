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
        return Collection::create($request->all());
    }

    public function update (Request $request, $id) {
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
