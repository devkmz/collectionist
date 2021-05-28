<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;
use Exception;
use App\Models\Access;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class AccessLevel extends BaseMiddleware
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
        if (Access::findOrFail(1)->isPublic)
            return $next($request);
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } 
        catch (Exception $e) {
            return response()->json(['error' => 'Not authorized.'],403);
        }
        return $next($request);
    }
}
