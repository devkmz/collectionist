<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('collections', 'App\Http\Controllers\CollectionController@index');
Route::get('collections/{id}', 'App\Http\Controllers\CollectionController@show');
Route::post('collections', 'App\Http\Controllers\CollectionController@store');
Route::put('collections/{id}', 'App\Http\Controllers\CollectionController@update');
Route::delete('collections/{id}', 'App\Http\Controllers\CollectionController@delete');

Route::post('/collections/file', 'App\Http\Controllers\FileController@store');
Route::delete('/collections/file/{id}', 'App\Http\Controllers\FileController@delete');

