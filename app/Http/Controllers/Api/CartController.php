<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use App\Models\SizeQuantityInfo;
use App\Models\SubProduct;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function addCart(Request $request){
        if(auth('sanctum')->check()){
            $user_id = auth('sanctum')->user()->id;

            // $subproduct_id = $request->id;
            $db_quantity = SizeQuantityInfo::where('id',$request->id)->value('quantity');
            $product_quantity = $request->quantity;
            $product_id = SubProduct::where('id',$request->subproduct_id)->value('product_id');
            $product_price = Product::where('id',$product_id)->value('price');
            $productCheck = SizeQuantityInfo::where('id',$request->id)->first();

            $cartQuantity = Cart::where('size_quantity_info_id',$request->id)->where('user_id',$user_id)->where('is_ordered',0)->value('quantity');

            $subproductQuantity = SizeQuantityInfo::where('id',$request->id)->value('quantity');

            if($db_quantity < 1){
                return response()->json([
                    'status' => 405,
                    'message' => '申し訳ございません、商品数が0となってしまいました',
                ]);
            }


            if($productCheck){
                if(Cart::where('size_quantity_info_id',$request->id)->where('user_id',$user_id)->where('is_ordered',0)->exists()){
                    if($subproductQuantity >= $cartQuantity + $product_quantity){
                        $cartitem = Cart::where('size_quantity_info_id',$request->id)->where('user_id',$user_id)->where('is_ordered',0)->first();
                        $cartitem->quantity += $product_quantity;
                        $cartitem->price += ($product_price * $request->quantity);
                        $cartitem->update();
                        return response()->json([
                            'status' => 200,
                            'message' =>'商品をカートに追加しました '
                        ]);
                    }else{
                        return response()->json([
                            'status' => 400,
                            'message' =>'その商品はそれ以上追加できません'
                        ]);
                    }
                }else{
                    Cart::create([
                        'user_id'=> $user_id,
                        'size_quantity_info_id'=>$request->id,
                        'quantity'=>$product_quantity,
                        'price'=>$product_price * $request->quantity,
                        'is_ordered'=> 0,
                    ]);
                    return response()->json([
                        'status' => 200,
                        'message' => '商品をカートに追加しました'
                    ]);
                }
            }else{
                return response()->json([
                    'status' => 404,
                    'message' => '商品が見つかりません'
                ]);
            }

        }else{
            return response()->json([
                'status' => 401,
                'message' => 'カートに入れるにはログインしてください'
            ]);
        }
    }

    public function increaseProduct(Request $request){

        if(auth('sanctum')->check()){
            $cartitem = Cart::where('id',$request->id)->with('sizequantityinfo.subproduct.product')->first();
            $product_price = $cartitem->sizequantityinfo[0]->subproduct->product->price;
            $cartitem->quantity += 1;
            $cartitem->price += $product_price;
            $cartitem->update();

            return response()->json([
                'status' => 200,
                'id' => $request->id,
                'cartitem' => $cartitem,
            ]);
        }else{
            return response()->json([
                'status' => 401,
                'message' => 'カートへ加えるにはログインしてください'
            ]);
        }
    }
    public function decreaseProduct(Request $request){
        if(auth('sanctum')->check()){
            $cartitem = Cart::where('id',$request->id)->with('sizequantityinfo.subproduct.product')->first();
            $product_price = $cartitem->sizequantityinfo[0]->subproduct->product->price;
            $cartitem->quantity -= 1;
            $cartitem->price -= $product_price;
            $cartitem->update();

            return response()->json([
                'status' => 200,
                'id' => $request->id,
                'cartitem' => $cartitem,
            ]);
        }else{
            return response()->json([
                'status' => 401,
                'message' => 'カートへ加えるにはログインしてください'
            ]);
        }
    }

    public function removeProduct(Request $request){
        if(auth('sanctum')->check()){
            $removeCart = Cart::findOrFail($request->id);
            if($removeCart){
                $removeCart->delete();
                return response()->json([
                    'status'=>200,
                    'message'=>'カートから商品を削除しました',
                ]);
            }else{
                return response()->json([
                    'status'=>404,
                    'message'=>'該当商品が見つかりませんでした',
                ]);
            }
        }else{
            return response()->json([
                'status' => 401,
                'message' => '商品を削除するにはログインしてください',
            ]);
        }
    }


    public function viewCart(Request $request){

        // return response()->json([
        //     'status' => 401,
        //     'message' => $request->session()->all(),
        //     'user' => auth()->user(),
        //     'auth' => Auth::check(),
        // ]);

        if(auth('sanctum')->check()){

            $user_id = auth('sanctum')->user()->id;
            $user = User::Where('id',$user_id)->get();
            $cartitems = Cart::where('user_id',$user_id)->where('is_ordered',0)->with('sizequantityinfo.subproduct.product')->get();

            return response()->json([
                'status' => 200,
                'cart' => $cartitems,
                'user' => $user,
            ]);
        }else{
            return response()->json([
                'status' => 401,
                'message' => 'カートを見るにはログインしてください',
            ]);
        }
    }


}
