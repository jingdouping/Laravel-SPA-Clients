<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/{every?}', function () {
//     return view('welcome');
// });
// Route::get('/test', function () {
//     return view('welcome');
// });
Route::post('register',[AuthController::class,'register']);
Route::post('login',[AuthController::class,'login']);

Route::fallback(function () {
    return view('welcome');
});
