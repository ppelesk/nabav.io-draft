<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Uloga;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        $korisnikUlogaId = Uloga::query()
            ->where('sifra_uloge', 'korisnik')
            ->value('id_uloge');

        $name = trim($input['name']);
        $parts = preg_split('/\s+/', $name) ?: [];
        $ime = $parts[0] ?? $name;
        $prezime = count($parts) > 1 ? implode(' ', array_slice($parts, 1)) : 'Korisnik';

        return User::create([
            'id_uloge' => $korisnikUlogaId,
            'ime_korisnika' => $ime,
            'prezime_korisnika' => $prezime,
            'name' => $name,
            'email' => $input['email'],
            'password' => $input['password'],
        ]);
    }
}
