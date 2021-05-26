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

Route::post('collections/{id}/elements', 'App\Http\Controllers\CollectionElementController@saveElementWithValues');
Route::get('collections/{id}/elements', 'App\Http\Controllers\CollectionController@getElements');
Route::put('collections/elements/{id}', 'App\Http\Controllers\CollectionElementController@update');
Route::get('collections/elements/{id}', 'App\Http\Controllers\CollectionElementController@show');
Route::delete('collections/elements/{id}', 'App\Http\Controllers\CollectionElementController@delete');

Route::post('register', 'App\Http\Controllers\UserController@register');
Route::post('login', 'App\Http\Controllers\UserController@authenticate');
Route::get('open', 'App\Http\Controllers\DataController@open');
Route::get('users', 'App\Http\Controllers\UserController@index');
Route::delete('users/{id}', 'App\Http\Controllers\UserController@delete');
Route::put('users/{id}', 'App\Http\Controllers\UserController@adminUpdate');
Route::put('user', 'App\Http\Controllers\UserController@update');

Route::get('collections/{id}/pdf', 'App\Http\Controllers\CollectionController@createPdf');
Route::get('collections/{id}/xlsx', 'App\Http\Controllers\CollectionController@createXlsx');

Route::get('collections/elements/{id}/pdf', 'App\Http\Controllers\CollectionElementController@createPdf');
Route::get('collections/elements/{id}/xlsx', 'App\Http\Controllers\CollectionElementController@createXlsx');

Route::group(['middleware' => ['jwt.verify']], function() {
    Route::get('user', 'App\Http\Controllers\UserController@getAuthenticatedUser');
    Route::get('closed', 'App\Http\Controllers\DataController@closed');
});

