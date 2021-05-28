<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CollectionType;
use App\Models\CollectionTypeAttribute;
use App\Models\ElementsAttributes;
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
        $collectionsBelongToType = $collectionType->collections;

        if (!count($collectionsBelongToType)) {
            $collectionType->delete();
            DB::delete('DELETE FROM collection_type_attributes WHERE collection_type_id = ?', [$id]);
            return response()->noContent();
        }
        else return abort(409);
    }

    public function getAttributes (Request $request, $id){
        return CollectionType::find($id)->attributes;
    }

    public function getCollections (Request $request, $id){
        return CollectionType::find($id)->collections;
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

        $receivedAttributes = $request->input('attributes');
        $ids = array_column($receivedAttributes, 'id');

        DB::table('collection_type_attributes')
                ->whereNotIn('id', $ids)
                ->delete();

        for ($i = 0; $i < count($receivedAttributes); $i++) {
            if (isset($receivedAttributes[$i]['id'])) {
                $singleAttribute = CollectionTypeAttribute::findOrFail($receivedAttributes[$i]['id']);
                $singleAttribute->update($receivedAttributes[$i]);
                DB::table('elements_attributes')
                ->where('attribute_id',$receivedAttributes[$i]['id'])
                ->update(['attributeName'=>$receivedAttributes[$i]['attributeName'],'attributeType'=>$receivedAttributes[$i]['attributeType']]);
            }
            else {
                $receivedAttributes[$i]['collection_type_id'] = $id;
                $attributeId = CollectionTypeAttribute::insertGetId($receivedAttributes[$i]);
                $collections = $collectionType->collections;

                if($receivedAttributes[$i]['attributeType'] == "DATE")
                    $attributeValue = date(DATE_ATOM);
                else 
                    $attributeValue = "";

                foreach($collections as $collection) {
                    $elements = $collection->elements;
                    foreach($elements as $element) {
                        ElementsAttributes::insert(['element_id' => $element->id, 'attribute_id' => $attributeId, 'attributeName'=>$receivedAttributes[$i]['attributeName'],'attributeType'=>$receivedAttributes[$i]['attributeType'], 'value'=>$attributeValue]);
                    }
                }
            }
        }
        $updatedData = ['id' => $id, 'typeName' => $newTypeName, 'attributes' => $collectionType->attributes];
        return $updatedData;
    }
}
