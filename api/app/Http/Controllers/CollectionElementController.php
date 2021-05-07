<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CollectionElement;
use App\Models\ElementsAttributes;
use DB;

class CollectionElementController extends Controller
{
    public function index() {
        return CollectionElement::all();
    }

    public function show ($id) {
        $collectionElement = CollectionElement::findOrFail($id);
        $attributeValues = $collectionElement->elementsAttributes;
        return $collectionElement;
    }

    public function store(Request $request) {
        return CollectionElement::create($request->all());
    }

    public function update (Request $request, $id) {
        $request->validate([
            'elementName' => 'required|max:50',
            'elementDescription' => 'required|max:150',
            'collection_id' => 'required',
            'elementImage' => 'nullable',
        ]);
        $collectionElement = CollectionElement::findOrFail($id);
        $collectionElement->update($request->all());
        $newValues = $request->input('elements_attributes');
        $currentValues = $collectionElement->elementsAttributes;
        $i = 0;
        foreach ($newValues as $newValue){
            $currentValues[$i]->update($newValue);
            $i++;
        }
        return $collectionElement;
    }

    public function delete (Request $request, $id) {
        $collectionElement = CollectionElement::findOrFail($id);
        $collectionElement->delete();
        return response()->noContent();
    }

    public function saveElementWithValues (Request $request, $id){
        $request->validate([
            'elementName' => 'required|max:50',
            'elementDescription' => 'required|max:150',
            'collection_id' => 'required',
            'elementImage' => 'nullable',
        ]);
        $elementId = CollectionElement::insertGetId([
            'elementName'=>$request->input('elementName'), 
            'elementDescription'=>$request->input('elementDescription'),
            'elementImage'=>json_encode($request->input('elementImage')),
            'collection_id'=>$id
        ]); 

        $attributeValues = $request->input('elements_attributes');

        for ($i = 0; $i < count($attributeValues); $i++) {
            ElementsAttributes::insert([
                'element_id'=> $elementId, 
                'attribute_id' => $attributeValues[$i]['id'],
                'attributeName' => $attributeValues[$i]['attributeName'],
                'value' => $attributeValues[$i]['value']
            ]);
        }
        return $request->all();
    }
}
