<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Throwable;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->ensureAppIsReady();
        $this->configureDefaults();
        $this->configureGates();
    }

    /**
     * Check DB connectivity and table existence early.
     * If the app isn't ready, switch session to array driver so the
     * session middleware doesn't crash before EnsureAppIsSetup can redirect.
     */
    protected function ensureAppIsReady(): void
    {
        try {
            DB::connection()->getPdo();
        } catch (Throwable) {
            // Cannot connect to DB at all
            Config::set('session.driver', 'array');
            return;
        }

        if (! Schema::hasTable('sessions') || ! Schema::hasTable('cache') || ! Schema::hasTable('users') || ! Schema::hasTable('uloge')) {
            Config::set('session.driver', 'array');
        }
    }

    /**
     * Define authorization gates based on role hierarchy.
     * Hierarchy: administrator_sustava > upravitelj_imovinom > korisnik
     */
    protected function configureGates(): void
    {
        Gate::define('korisnik', fn ($user) => $user->uloga !== null);

        Gate::define('upravitelj_imovinom', fn ($user) => in_array(
            $user->uloga?->sifra_uloge,
            ['upravitelj_imovinom', 'administrator_sustava'],
            true
        ));

        Gate::define('administrator_sustava', fn ($user) =>
            $user->uloga?->sifra_uloge === 'administrator_sustava'
        );
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
