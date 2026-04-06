<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\KategorijaImovineController;
use App\Http\Controllers\KorisnikController;
use App\Http\Controllers\LokacijaController;
use App\Http\Controllers\OdjelController;
use App\Http\Controllers\StatusImovineController;
use App\Http\Controllers\UlogaController;
use App\Http\Controllers\ZaposlenikController;
use App\Http\Controllers\ZgradaController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('audit-log', [AuditLogController::class, 'index'])->name('audit-log.index');
    Route::resource('kategorije-imovine', KategorijaImovineController::class);
    Route::resource('korisnici', KorisnikController::class);
    Route::resource('lokacije', LokacijaController::class);
    Route::resource('odjeli', OdjelController::class);
    Route::resource('status-imovine', StatusImovineController::class);
    Route::resource('uloge', UlogaController::class);
    Route::resource('zaposlenici', ZaposlenikController::class);
    Route::resource('zgrade', ZgradaController::class);

    Route::post('korisnici/{korisnici}/resend-invite', [KorisnikController::class, 'resendInvite'])
        ->name('korisnici.resend-invite');
});

require __DIR__.'/settings.php';


