<?php

$file = 'routes/web.php';
$content = file_get_contents($file);

$search = <<<SEARCH
    Route::get('izvjestaji', [IzvjestajController::class, 'index'])->name('izvjestaji.index');
SEARCH;

$replace = <<<REPLACE
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
REPLACE;

$newContent = str_replace($search, $replace, $content);
file_put_contents($file, $newContent);
