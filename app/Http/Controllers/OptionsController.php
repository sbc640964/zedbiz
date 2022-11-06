<?php

namespace App\Http\Controllers;

use App\Models\Option;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Str;

class OptionsController extends Controller
{
    public function index()
    {

    }

    public function create()
    {
    }

    public function store(Request $request)
    {
    }

    public function show(Option $option)
    {
    }

    public function edit(Option $option)
    {
    }

    public function update(Request $request)
    {
        Option::updateOrCreate(
            [
                'key' => $request->key,
                'user_id' => $request->user_id ?? auth()->id()
            ],
            [
                'value' => $request->value
            ]
        );

        $key = Str::of($request->get('key'));

        if($key->startsWith('per_page-')) {
            session()->flash('paginationReset', $request->query_expect ?? 'page');
        }

        $toastMessage = $request->toast_message
            ?? $key->before('-')
                ->replace('_', ' ')
                ->ucfirst()
                ->finish(' has been successfully updated.')
                ->value();

        if($request->get('redirect')){
            return redirect($request->get('redirect'))->with('success', $toastMessage);
        }

        return back()
            ->with('success', $toastMessage);
    }

    public function destroy(Option $option)
    {
    }
}
