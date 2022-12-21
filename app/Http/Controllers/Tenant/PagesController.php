<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Controllers\WidgetsController;
use App\Models\Collection;
use App\Models\Page;
use App\Models\Widget;

class PagesController extends Controller
{
    public function getPage(int $page)
    {
        $page = Page::findOrFail($page);
        $collections = Collection::with('lists:id,name,collection_id')->get()->toArray();

        $widgets = $page->widgets;

        $renderResponse = [
            'page' => $page->toArray(),
            'collections' => $collections,
        ];

        $app = tenant();

        if($widgets){
            $widgets->each(function(Widget $widget) use ($app, &$renderResponse){
                $renderResponse['widget_' . $widget->id] = fn() => WidgetsController::render($widget, $app);
            });
        }

        return $renderResponse;
    }
}
