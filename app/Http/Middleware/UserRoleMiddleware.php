<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class UserRoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $role): Response
    {
        $role_sekarang=Auth::user()->role;
        $role_array=explode("|",$role);
        // dd($role_array);
        if(Auth::check() && in_array($role_sekarang, $role_array)){
            return $next($request);
        }

        // if(Auth::check() && Auth::user()->role == $role){
        //     return $next($request);
        // }
        return response()->json(["anda tidak memiliki akses"]);
    }
}
