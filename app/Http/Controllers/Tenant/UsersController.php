<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Option;
use App\Models\Tenant;
use App\Models\User;
use Inertia\Inertia;

class UsersController extends Controller
{
    public ?bool $isAdministrator = null;
    private ?Tenant $appTenant = null;


    public function isAdmin(){
        $id = request()->route()->parameter('app', false);
        if(is_null($this->isAdministrator) && $id){
            $this->isAdministrator = $id;
            $this->appTenant = Tenant::findOrFail($id);
        }

        return $this->isAdministrator;
    }


    public function index()
    {
        $perPage = Option::getOption('per_page-' . request()->path()) ?? 10;

        $app = $this->isAdmin() ? $this->appTenant->load('domains') : null;

        $app && $app->initialize();

        $users = User::paginate($perPage)
            ->onEachSide(1)
            ->toArray();

        $app && $app->end();

        return Inertia::render($this->isAdmin() ? 'Admin/Apps/Users/Index' : 'Users/Index', [
            'users' => $users,
            'app' => $app,
        ]);
    }

    public function store()
    {
        $this->isAdmin() && $this->appTenant->initialize();

        $data = request()->validate([
            'name' => ['required', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'min:8', 'max:255', 'confirmed'],
        ]);

        if(User::create($data)) {
            return redirect()->back()->with('toast', [
                'type' => 'success',
                'message' => 'User created successfully.',
            ]);
        }

        $this->isAdmin() && $this->appTenant->end();

        return redirect()->back()->with('toast', [
            'type' => 'error',
            'message' => 'User could not be created.',
        ]);

    }

    public function show(User $user)
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => $user
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user
        ]);
    }

    public function update(User $user)
    {
        $user->update($this->validateUser());

        return redirect()->route('admin.users')->with('success', 'User updated.');
    }

    public function destroy()
    {
        $this->isAdmin() && $this->appTenant->initialize();

        $delete = User::findOrFail(request()->route()->parameter('user'))->delete();

        $this->isAdmin() && $this->appTenant->end();

        return redirect()->back()->with('toast', [
            'type' => $delete ? 'success' : 'error',
            'message' => $delete ? 'User deleted successfully.' : 'User could not be deleted.',
        ]);
    }

    protected function validateUser()
    {
        return request()->validate([
            'name' => ['required', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'password' => ['nullable', 'min:8', 'max:255', 'confirmed'],
        ]);
    }
}
