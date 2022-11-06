<?php

namespace App\Http\Controllers;

use App\Models\Option;
use App\Models\User;
use Inertia\Inertia;

class UsersController extends Controller
{
    public function index()
    {
        $perPage = Option::getOption('per_page-' . request()->path()) ?? 10;

        return Inertia::render('Admin/Users/Index', [
            'users' => User::paginate($perPage)
                ->onEachSide(1)
        ]);
    }

    public function store()
    {
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

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'User deleted successfully.',
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
