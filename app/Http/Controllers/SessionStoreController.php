<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class SessionStoreController extends Controller
{
    public function update(Request $request)
    {
        $data = $request->all();

        //get the referer path request
        $path = \URL::previousPath();

        Session::put($path . "_session_store", $data);

        back();
    }
}
