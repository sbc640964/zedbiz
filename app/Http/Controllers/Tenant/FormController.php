<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\Form;

class FormController extends Controller
{
    public function index()
    {

    }

    public function getForm(Collection|Form $form)
    {
        if($form instanceof Collection) {
            $form = $form->getDefaultForm();
        }

        return inertia('Tenant/Form', [
            'form' => $form,
        ]);
    }
}
