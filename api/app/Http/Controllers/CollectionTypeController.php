<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CollectionType;
use App\Models\CollectionTypeAttribute;
use DB;

class CollectionTypeController extends Controller
{
    public function index() {
        return CollectionType::all();
    }

    public function show ($id) {
        return CollectionType::find($id);
    }

    public function store(Request $request) {
        return CollectionType::create($request->all());
    }

    public function update (Request $request, $id) {
        $collectionType = CollectionType::findOrFail($id);
        $collectionType->update($request->all());
        return $collectionType;
    }

    public function delete (Request $request, $id) {
        $collectionType = CollectionType::findOrFail($id);
        $collectionType->delete();
        DB::delete('DELETE FROM collection_type_attributes WHERE collection_type_id = ?', [$id]);
        return 204;
    }

    public function getAttributes (Request $request, $id){
        return CollectionType::find($id)->attributes;
    }


    public function saveTypeWithAttributes (Request $request){

        $id = CollectionType::insertGetId(['typeName'=>$request->input('typeName')]);        
        $data = $request->input('attributes');

        for ($i = 0; $i < count($data); $i++) {
            $data[$i]['collection_type_id'] = $id;
            CollectionTypeAttribute::insert($data[$i]);
        }
        return $data;
    }

    public function editTypeWithAttributes (Request $request, $id){

        $collectionType = CollectionType::findOrFail($id);
        $newTypeName = $request->input('typeName');
        $collectionType->update(['typeName' => $newTypeName]);

        DB::delete('DELETE FROM collection_type_attributes WHERE collection_type_id = ?', [$id]);

        $newAttributes = $request->input('attributes');
        for ($i = 0; $i < count($newAttributes); $i++) {
            $newAttributes[$i]['collection_type_id'] = $id;
            CollectionTypeAttribute::insert($newAttributes[$i]);
        }
        $updatedData = ['id' => $id, 'typeName' => $newTypeName, 'attributes' => $collectionType->attributes];
        return $updatedData;
    }
}
