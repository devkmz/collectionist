<?php

namespace App\Exports;

use App\Models\CollectionElement;
use App\Models\Collection;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class ElementExport implements FromView
{
    protected $id;

    function __construct($id) {
        $this->id = $id;
    }

    public function view(): View {
        $element = CollectionElement::findOrFail($this->id);
        $attributes = $element->elementsAttributes;

        foreach($attributes as $attribute) {
            if ($attribute->attributeType == "DATE") {
                $attribute->value = date_format(date_create($attribute->value),"d.m.Y");
            }
        }

        $data['info'] = $element;
        $data['attributes'] = $attributes;
        $data['from_collection'] = Collection::findOrFail($element->collection_id);

        return view('element_report_for_excel', [
            'element' => $data
        ]);
    }
}