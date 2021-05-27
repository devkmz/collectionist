<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;
use Exception;
use App\Models\Access;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class UserAccess extends BaseMiddleware
{

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if ($user->role != "ADMIN") {
                $id = $request->route('id');
                if ($user->id != $id) return response()->json(['error' => 'Not authorized.'],403);
            }
            return $next($request);
        } 
        catch (Exception $e) {
            return response()->json(['error' => 'Not authorized.'],403);
        }
    }
}

