<?php

namespace App\Http\Controllers;

use App\Models\Uloga;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class KorisnikController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('korisnici/index', [
            'korisnici' => User::query()
                ->with('uloga:id_uloge,naziv_uloge,sifra_uloge')
                ->orderByDesc('id')
                ->get()
                ->map(fn (User $korisnik) => [
                    'id_korisnika' => $korisnik->id,
                    'id_uloge' => $korisnik->id_uloge,
                    'ime_korisnika' => $korisnik->ime_korisnika,
                    'prezime_korisnika' => $korisnik->prezime_korisnika,
                    'email' => $korisnik->email,
                    'deactivated_at' => $korisnik->deactivated_at,
                    'created_at' => $korisnik->created_at,
                    'updated_at' => $korisnik->updated_at,
                    'uloga' => $korisnik->uloga?->only(['id_uloge', 'naziv_uloge', 'sifra_uloge']),
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('korisnici/create', [
            'uloge' => $this->ulogeOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $payload = $this->validatePayload($request);

        $korisnik = User::create([
            'name' => trim($payload['ime_korisnika'].' '.$payload['prezime_korisnika']),
            'email' => $payload['email'],
            'password' => Str::password(40),
            'id_uloge' => (int) $payload['id_uloge'],
            'ime_korisnika' => $payload['ime_korisnika'],
            'prezime_korisnika' => $payload['prezime_korisnika'],
            'deactivated_at' => null,
        ]);

        Password::sendResetLink(['email' => $korisnik->email]);

        return to_route('korisnici.index');
    }

    public function show(User $korisnici): Response
    {
        $korisnici->load('uloga:id_uloge,naziv_uloge,sifra_uloge');

        return Inertia::render('korisnici/show', [
            'korisnik' => [
                'id_korisnika' => $korisnici->id,
                'id_uloge' => $korisnici->id_uloge,
                'ime_korisnika' => $korisnici->ime_korisnika,
                'prezime_korisnika' => $korisnici->prezime_korisnika,
                'email' => $korisnici->email,
                'deactivated_at' => $korisnici->deactivated_at,
                'created_at' => $korisnici->created_at,
                'updated_at' => $korisnici->updated_at,
                'uloga' => $korisnici->uloga?->only(['id_uloge', 'naziv_uloge', 'sifra_uloge']),
            ],
        ]);
    }

    public function edit(User $korisnici): Response
    {
        return Inertia::render('korisnici/edit', [
            'korisnik' => [
                'id_korisnika' => $korisnici->id,
                'id_uloge' => $korisnici->id_uloge,
                'ime_korisnika' => $korisnici->ime_korisnika,
                'prezime_korisnika' => $korisnici->prezime_korisnika,
                'email' => $korisnici->email,
                'deactivated_at' => $korisnici->deactivated_at,
            ],
            'uloge' => $this->ulogeOptions(),
        ]);
    }

    public function update(Request $request, User $korisnici): RedirectResponse
    {
        $payload = $this->validatePayload($request, $korisnici);

        $aktivan = $request->boolean('aktivan', true);

        $korisnici->update([
            'name' => trim($payload['ime_korisnika'].' '.$payload['prezime_korisnika']),
            'email' => $payload['email'],
            'id_uloge' => (int) $payload['id_uloge'],
            'ime_korisnika' => $payload['ime_korisnika'],
            'prezime_korisnika' => $payload['prezime_korisnika'],
            'deactivated_at' => $aktivan ? null : now(),
        ]);

        return to_route('korisnici.index');
    }

    public function destroy(User $korisnici): RedirectResponse
    {
        $korisnici->delete();

        return to_route('korisnici.index');
    }

    public function resendInvite(User $korisnici): RedirectResponse
    {
        Password::sendResetLink(['email' => $korisnici->email]);

        return to_route('korisnici.show', $korisnici->id);
    }

    /**
     * @return array<int, array<string, int|string>>
     */
    private function ulogeOptions(): array
    {
        return Uloga::query()
            ->orderBy('naziv_uloge')
            ->get(['id_uloge', 'naziv_uloge', 'sifra_uloge'])
            ->map(fn (Uloga $uloga) => $uloga->only(['id_uloge', 'naziv_uloge', 'sifra_uloge']))
            ->all();
    }

    /**
     * @return array<string, string>
     */
    private function validatePayload(Request $request, ?User $korisnik = null): array
    {
        return $request->validate([
            'id_uloge' => ['required', 'integer', 'exists:uloge,id_uloge'],
            'ime_korisnika' => ['required', 'string', 'max:100'],
            'prezime_korisnika' => ['required', 'string', 'max:100'],
            'email' => [
                'required',
                'email:rfc,dns',
                'max:150',
                Rule::unique('users', 'email')->ignore($korisnik?->id),
            ],
        ]);
    }
}
