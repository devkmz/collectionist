<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Access;

class AccessController extends Controller
{
    public function getCurrentAccessLevel () {
        return Access::findOrFail(1);
    }

    public function switchAccessLevel (Request $request) {
        $accessLevel = Access::findOrFail(1);
        $accessLevel->update(['isPublic' => $request->input(['isPublic'])]);
        return $accessLevel;
    }
}
