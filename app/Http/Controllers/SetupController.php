<?php

namespace App\Http\Controllers;

use App\Models\Uloga;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class SetupController extends Controller
{
    public function create(): Response|RedirectResponse
    {
        if ($this->adminExists()) {
            return redirect('/');
        }

        return Inertia::render('setup');
    }

    public function store(Request $request): RedirectResponse
    {
        if ($this->adminExists()) {
            abort(403);
        }

        Artisan::call('migrate', ['--force' => true]);

        $validated = $request->validate([
            'ime_korisnika' => ['required', 'string', 'max:100'],
            'prezime_korisnika' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $adminUloga = Uloga::where('sifra_uloge', 'administrator_sustava')->firstOrFail();

        $admin = User::create([
            'name' => trim($validated['ime_korisnika'].' '.$validated['prezime_korisnika']),
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'id_uloge' => $adminUloga->id_uloge,
            'ime_korisnika' => $validated['ime_korisnika'],
            'prezime_korisnika' => $validated['prezime_korisnika'],
            'deactivated_at' => null,
        ]);

        return redirect()
            ->route('login')
            ->with('status', 'Administratorski račun je kreiran. Prijavite se s novim podacima.');
    }

    private function adminExists(): bool
    {
        try {
            return User::whereHas(
                'uloga',
                fn ($q) => $q->where('sifra_uloge', 'administrator_sustava')
            )->exists();
        } catch (Throwable) {
            return false;
        }
    }
}
