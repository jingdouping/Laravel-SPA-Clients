<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Credit;
use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use PhpParser\Node\Expr\Cast\Array_;

class CardController extends Controller
{
    public function view(){
        if(auth('sanctum')->check()){
            $user_id = auth('sanctum')->user()->id;
            $user = User::Where('id',$user_id)->get();
            $cartitems = Cart::where('user_id',$user_id)->with('sizequantityinfo.subproduct.product')->where('is_ordered',0)->get();
            $card = Credit::where('user_id',$user_id)->where('default',1)->get()->toArray();
            $reverse_card = array_reverse($card);
            return response()->json([
                'status' => 200,
                'cart' => $cartitems,
                'user' => $user,
                'card' => $reverse_card,
            ]);
        }else{
            return response()->json([
                'status' => 401,
                'message' => 'カートを見るにはログインしてください',
            ]);
        }
    }


    public function store(Request $request){
        if(auth('sanctum')->check()){
            if($request->default === 1){
                $user_id = auth('sanctum')->user()->id;
                Credit::create([
                    'user_id' => $user_id,
                    'card_number' => $request->card_number,
                    'expiry_date' => $request->expiry_date,
                    'cvc' => $request->cvc,
                    'credit_name' => $request->credit_name,
                    'default' => $request->default,
                    'filter' => $request->filter,
                ]);
                return response()->json([
                    'status' => 200,
                    'message' => 'カード情報を登録しました',
                ]);
            }

        }
    }

    public function delete($date){
        if(auth('sanctum')->check()){
            $removeCard = Credit::where('filter',$date);
            $removeCard->delete();
            return response()->json([
                'status' => 200,
                'message' =>$removeCard,
            ]);
        }

    }

    public function update(Request $request){
        if(auth('sanctum')->check()){
            Credit::where('filter',$request->filter)->update([
                'card_number' => $request->card_number,
                'expiry_date' => $request->expiry_date,
                'cvc' => $request->cvc,
                'credit_name' => $request->credit_name
            ]);
            return response()->json([
                'status' => 200,
                
            ]);
        }
    }
}
