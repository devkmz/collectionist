<?php

namespace App\Exports;

use App\Models\Collection;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class CollectionExport implements FromView
{
    protected $id;

    function __construct($id) {
        $this->id = $id;
    }

    public function view(): View {
        $collection = Collection::findOrFail($this->id);
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

        return view('collection_report_for_excel', [
            'collection' => $data
        ]);
    }
}