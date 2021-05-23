<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Collection;
use App\Exports\CollectionExport;
use App\Models\ElementsAttributes;
use PDF;
use Excel;

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
        return response()->noContent();
    }

    public function getElements (Request $request, $id){
        $elements = Collection::find($id)->elements;
        foreach ($elements as $element){
            $element->elementsAttributes;
        }
        return $elements;
    }

    public function createPdf($id) {
        $collection = Collection::findOrFail($id);
        $elements = $collection->elements;

        foreach ($elements as $element) {
            $attributes = $element->elementsAttributes;
            foreach($attributes as $attribute) {
                if ($attribute->attributeType == "DATE") {
                    $attribute->value = date_format(date_create($attribute->value),"d.m.Y");
                }
            }
        }

        $data['elements'] = $elements;
        $data['info'] = $collection;
  
        view()->share('collection',$data);
        $pdf = PDF::loadView('collection_report', $data);
  
        return $pdf->download('collection_report.pdf');
      }

      
    public function createXlsx($id) {
        return Excel::download(new CollectionExport($id), 'collection_report.xlsx');
      }
}
