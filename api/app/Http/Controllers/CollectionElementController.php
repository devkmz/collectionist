<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CollectionElement;
use App\Models\ElementsAttributes;
use App\Models\Collection;
use App\Exports\ElementExport;
use PDF;
use Excel;

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

        if ($newValues != NULL){
            $i = 0;
            foreach ($newValues as $newValue){
                $currentValues[$i]->update($newValue);
                $i++;
            }
        return $collectionElement;
    }
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
        if ($attributeValues == NULL)
            $attributeValues = [];

        for ($i = 0; $i < count($attributeValues); $i++) {
            ElementsAttributes::insert([
                'element_id'=> $elementId, 
                'attribute_id' => $attributeValues[$i]['id'],
                'attributeName' => $attributeValues[$i]['attributeName'],
                'attributeType' => $attributeValues[$i]['attributeType'],
                'value' => $attributeValues[$i]['value']
            ]);
        }
        return $request->all();
    }

    public function createPdf($id) {
        $element = CollectionElement::findOrFail($id);
        $attributes = $element->elementsAttributes;

        $data['info'] = $element;
        $data['attributes'] = $attributes;
        $data['from_collection'] = Collection::findOrFail($element->collection_id);

        foreach($attributes as $attribute) {
            if ($attribute->attributeType == "DATE") {
                $attribute->value = date_format(date_create($attribute->value),"d.m.Y");
            }
        }
        view()->share('element',$data);
        $pdf = PDF::loadView('element_report', $data);
        return $pdf->download('element_report.pdf');
      }

      public function createXlsx($id) {
        return Excel::download(new ElementExport($id), 'element_report_for_excel.xlsx');
      }
}
