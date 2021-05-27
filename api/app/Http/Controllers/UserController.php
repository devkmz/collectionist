<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Rules\MatchOldPassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use DB;
use Auth;

class UserController extends Controller
{
    public function index() {
        return User::all()->makeHidden(['email_verified_at', 'updated_at']);
    }

    public function authenticate(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 400);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        return response()->json(compact('token'));
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create([
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user','token'),201);
    }


    public function delete (Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        DB::delete('DELETE FROM users WHERE id = ?', [$id]);
        return response()->noContent();
    }

    public function getAuthenticatedUser()
    {
        try {

            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }

        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            return response()->json(['token_expired'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            return response()->json(['token_invalid'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['token_absent'], $e->getStatusCode());

        }

        return response()->json(compact('user'));
    }

    protected function getCurrentUser()
    {
        return JWTAuth::parseToken()->authenticate()->id;
    }


    public function update(Request $request)
    {
        try {
            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token_absent'], $e->getStatusCode());
        }

        $userId = $user->id;

        $request -> validate([
            'firstName' => 'string|max:50',
            'lastName' => 'string|max:50',
            'password' => 'required|string|min:6',
            'newPassword' => 'string|min:6|confirmed'
        ]);

        $user = User::findOrFail($userId);

        if($request->firstName != null){
            $user -> firstName = $request->get('firstName');
        }

        if($request->lastName != null){
            $user -> lastName = $request->get('lastName');
        }

        if(Hash::check($request->password, $user->password) && $request->newPassword != null){
            $user -> password = Hash::make($request->get('newPassword'));
        }
        
        if($request->newPassword != null){
            $user -> password = Hash::make($request->get('newPassword'));
        }
        $user -> save();
        return $user;
    }

    public function adminUpdate(Request $request, $id){
        $request->validate([
            'role' => 'nullable|string|max:50',
            'firstName' => 'nullable|string|max:50',
            'lastName' => 'nullable|string|max:50',
            'newPassword' => 'string|min:6|confirmed'
        ]);

        $user = User::findOrFail($id);

        if($request->firstName != null){
            $user -> firstName = $request->get('firstName');
        }

        if($request->lastName != null){
            $user -> lastName = $request->get('lastName');
        }

        $user = User::findOrFail($id);
        $user -> firstName = $request->get('firstName');
        $user -> lastName = $request->get('lastName');
        $user -> role = $request->get('role');
        if($request->newPassword != null){
            $user -> password = Hash::make($request->get('newPassword'));
        }
        $user -> save();
        return $user;

    }
}
