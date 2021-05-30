<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Session;

class FileController extends Controller
{
    public function store (Request $request) {

        if ($request->hasFile('image')) {
            if ($request->file('image')->isValid()) {
                //
                $validated = $request->validate([
                    'name' => 'string|max:90',
                    'image' => 'mimes:jpeg,png|max:20480',
                ]);

                $time = date("d-m-Y")."-".time() ;
                $name = $time . $request->file('image')->getClientOriginalName();
                $request->image->storeAs('/public', $name);

                $url = asset('storage/'.$name);
                $id = File::insertGetId(["name"=>$name, "url"=>$url]);

                $imageObject = [
                    'id' => $id,
                    'name' => $name,
                    'url' => $url,
                ];

                return $imageObject;
            }
        }
        abort(500, 'Błąd przesyłania');
    }

    public function show ($id) {
        return File::find($id);
    }

    public function delete (Request $request, $id) {

        $file = File::findOrFail($id);
        unlink('storage/'.$file->name);
        $file->delete();
        return response()->noContent();
    }
}