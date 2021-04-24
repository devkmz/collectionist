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
Route::get('collections/file/{id}', 'App\Http\Controllers\FileController@show');

Route::get('types/{id}/attributes', 'App\Http\Controllers\CollectionTypeController@getAttributes');
Route::get('types/{id}/collections', 'App\Http\Controllers\CollectionTypeController@getCollections');
Route::post('types', 'App\Http\Controllers\CollectionTypeController@saveTypeWithAttributes');
Route::put('types/{id}/attributes', 'App\Http\Controllers\CollectionTypeController@editTypeWithAttributes');

Route::get('types', 'App\Http\Controllers\CollectionTypeController@index');
Route::get('types/{id}', 'App\Http\Controllers\CollectionTypeController@show');
Route::put('types/{id}', 'App\Http\Controllers\CollectionTypeController@update');
Route::delete('types/{id}', 'App\Http\Controllers\CollectionTypeController@delete');

Route::get('types/attributes', 'App\Http\Controllers\CollectionTypeAttributeController@index');
Route::get('types/attributes/{id}', 'App\Http\Controllers\CollectionTypeAttributeController@show');
Route::post('types/attributes', 'App\Http\Controllers\CollectionTypeAttributeController@store');
Route::put('types/attributes/{id}', 'App\Http\Controllers\CollectionTypeAttributeController@update');
Route::delete('types/attributes/{id}', 'App\Http\Controllers\CollectionTypeAttributeController@delete');
