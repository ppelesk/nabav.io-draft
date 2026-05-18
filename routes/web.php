<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\ImovinaController;
use App\Http\Controllers\InventuraController;
use App\Http\Controllers\InventurnaListaController;
use App\Http\Controllers\IzvjestajController;
use App\Http\Controllers\KategorijaImovineController;
use App\Http\Controllers\KorisnikController;
use App\Http\Controllers\LokacijaController;
use App\Http\Controllers\OdjelController;
use App\Http\Controllers\ProvjeraBarkodaController;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\StatusImovineController;
use App\Http\Controllers\UlogaController;
use App\Http\Controllers\ZaposlenikController;
use App\Http\Controllers\ZgradaController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::controller(SetupController::class)->group(function () {
    Route::get('setup', 'create')->name('setup.create');
    Route::post('setup', 'store')->name('setup.store');
});

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'verified', 'can:korisnik'])->group(function () {

    Route::get('audit-log', [AuditLogController::class, 'index'])->name('audit-log.index');
    Route::resource('kategorije-imovine', KategorijaImovineController::class);
    Route::resource('korisnici', KorisnikController::class);
    Route::resource('lokacije', LokacijaController::class);
    Route::resource('odjeli', OdjelController::class);
    Route::resource('status-imovine', StatusImovineController::class);
    Route::resource('uloge', UlogaController::class);
    Route::resource('zaposlenici', ZaposlenikController::class);
    Route::resource('zgrade', ZgradaController::class);
    Route::get('imovina/zaduzenje', [ImovinaController::class, 'zaduzenje'])
        ->name('imovina.zaduzenje');
    Route::get('imovina/razduzenje', [ImovinaController::class, 'razduzenje'])
        ->name('imovina.razduzenje');
    Route::get('imovina/barkod-naljepnice', [ImovinaController::class, 'barkodNaljepnice'])
        ->name('imovina.barkod-naljepnice');
    Route::get('inventura', [InventuraController::class, 'index'])
        ->name('inventura.index');
    Route::post('inventura/skeniraj', [InventuraController::class, 'skeniraj'])
        ->name('inventura.skeniraj');
    Route::resource('imovina', ImovinaController::class);
    Route::patch('imovina/{imovina}/popisano', [ImovinaController::class, 'oznaciPopisanu'])
        ->name('imovina.popisano');
    Route::patch('imovina/{imovina}/zaduzi', [ImovinaController::class, 'zaduzi'])
        ->name('imovina.zaduzi');
    Route::patch('imovina/{imovina}/razduzi', [ImovinaController::class, 'razduzi'])
        ->name('imovina.razduzi');

    Route::prefix('izvjestaji')->name('izvjestaji.')->group(function () {
        Route::get('/', [IzvjestajController::class, 'index'])->name('index');
        Route::get('provedena-inventura', [IzvjestajController::class, 'provedenaInventura'])->name('provedena-inventura');
        Route::get('stanje-imovine', [IzvjestajController::class, 'stanjeImovine'])->name('stanje-imovine');
        Route::get('izdana-imovina', [IzvjestajController::class, 'izdanaImovina'])->name('izdana-imovina');
        Route::get('imovina-u-odjelima', [IzvjestajController::class, 'imovinaUOdjelima'])->name('imovina-u-odjelima');
        Route::get('imovina-na-lokacijama', [IzvjestajController::class, 'imovinaNaLokacijama'])->name('imovina-na-lokacijama');
        Route::get('imovina-po-kategoriji', [IzvjestajController::class, 'imovinaPoKategoriji'])->name('imovina-po-kategoriji');
        Route::get('imovina-u-skladistu', [IzvjestajController::class, 'imovinaUSkladistu'])->name('imovina-u-skladistu');
        Route::get('imovina-na-servisu', [IzvjestajController::class, 'imovinaNaServisu'])->name('imovina-na-servisu');
        Route::get('rashodovana-imovina', [IzvjestajController::class, 'rashodovanaImovina'])->name('rashodovana-imovina');
        Route::get('revizijski-trag', [IzvjestajController::class, 'revizijskiTrag'])->name('revizijski-trag');
        Route::get('imovina-na-revers', [IzvjestajController::class, 'imovinaNaRevers'])->name('imovina-na-revers');
    });
    Route::get('provjera-barkoda', [ProvjeraBarkodaController::class, 'index'])
        ->name('provjera-barkoda.index');

    Route::post('korisnici/{korisnici}/resend-invite', [KorisnikController::class, 'resendInvite'])
        ->name('korisnici.resend-invite');
});

require __DIR__.'/settings.php';

Route::middleware(['auth', 'verified', 'can:upravitelj_imovinom'])->group(function () {
    Route::get('/inventurna-lista', [InventurnaListaController::class, 'index'])->name('inventurna-lista.index');
    Route::get('/inventurna-lista/create', [InventurnaListaController::class, 'create'])->name('inventurna-lista.create');
    Route::post('/inventurna-lista', [InventurnaListaController::class, 'store'])->name('inventurna-lista.store');
    Route::get('/inventurna-lista/{lista}', [InventurnaListaController::class, 'show'])->name('inventurna-lista.show');
    Route::post('/inventurna-lista/{lista}/skeniraj', [InventurnaListaController::class, 'skeniraj'])->name('inventurna-lista.skeniraj');
    Route::patch('/inventurna-lista/{lista}/zakljucaj', [InventurnaListaController::class, 'zakljucaj'])->name('inventurna-lista.zakljucaj');
});
