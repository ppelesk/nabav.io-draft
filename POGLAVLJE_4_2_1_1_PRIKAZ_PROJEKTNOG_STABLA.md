# 4.2.1.1. Prikaz projektnog stabla s objasnjenjem

Ovo poglavlje daje strukturni pregled repozitorija aplikacije Inventur.io (Laravel + Inertia + React).
Prikaz je fokusiran na produkcijski relevantne direktorije i datoteke.

## Prikaz projektnog stabla

```text
inventuriodraft/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── ImovinaController.php
│   │   │   ├── InventuraController.php
│   │   │   ├── IzvjestajController.php
│   │   │   └── ProvjeraBarkodaController.php
│   │   ├── Middleware/
│   │   │   ├── HandleInertiaRequests.php
│   │   │   └── AuditCrudOperations.php
│   │   └── Requests/
│   ├── Models/
│   │   ├── Imovina.php
│   │   ├── Lokacija.php
│   │   ├── StatusImovine.php
│   │   ├── KategorijaImovine.php
│   │   ├── Odjel.php
│   │   ├── Zaposlenik.php
│   │   └── User.php
│   ├── Providers/
│   │   ├── AppServiceProvider.php
│   │   └── FortifyServiceProvider.php
│   └── Support/
│       └── AuditLogger.php
├── bootstrap/
├── config/
├── database/
│   ├── migrations/
│   ├── factories/
│   └── seeders/
├── public/
│   ├── index.php
│   └── build/
├── resources/
│   ├── css/
│   ├── js/
│   │   ├── components/
│   │   │   ├── app-sidebar.tsx
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   ├── imovina/
│   │   │   ├── inventura/
│   │   │   │   └── index.tsx
│   │   │   ├── izvjestaji/
│   │   │   └── provjera-barkoda/
│   │   ├── routes/
│   │   └── types/
│   └── views/
├── routes/
│   ├── web.php
│   └── settings.php
├── storage/
├── tests/
│   ├── Feature/
│   └── Unit/
├── vendor/
├── .env
├── artisan
├── composer.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Objasnjenje strukture

### app/
Sadrzi poslovnu logiku backenda.
- `Http/Controllers`: ulazna tocka za zahtjeve i orkestracija procesa (CRUD imovine, inventura u hodu, izvjestaji, provjera barkoda).
- `Http/Middleware`: presretanje zahtjeva (dijeljenje Inertia podataka, audit zapisivanje akcija).
- `Models`: Eloquent modeli i relacije prema bazi.
- `Providers`: registracija servisa, Gate pravila i Fortify konfiguracija.
- `Support`: pomocne infrastrukturalne klase (npr. audit log helper).

### database/
Sadrzi baznu shemu i inicijalne podatke.
- `migrations`: verzionirana struktura tablica.
- `seeders`: inicijalni podaci (uloge, sifrarnici, itd.).
- `factories`: testni generatori podataka.

### resources/
Frontend sloj i blade ulazne view datoteke.
- `resources/js/pages`: Inertia stranice po modulima.
- `resources/js/components`: ponovno iskoristive UI komponente.
- `resources/js/routes`: generirani route helperi za TypeScript.
- `resources/views`: blade root template za aplikaciju.

### routes/
Definicije ruta aplikacije.
- `web.php`: glavne poslovne i administracijske rute.
- `settings.php`: odvojene rute za korisnicke postavke.

### tests/
Automatski testovi.
- `Feature`: testovi korisnickih tokova i HTTP endpointa.
- `Unit`: testovi izolirane logike.

### public/
Javno dostupne datoteke aplikacije.
- `index.php`: ulazna tocka PHP aplikacije.
- `build/`: rezultat Vite build procesa (frontend asseti).

### config/
Konfiguracijske datoteke Laravel aplikacije (auth, database, queue, session, itd.).

### storage/
Runtime podaci (logovi, cache, sesije, privremene datoteke).

### vendor/
Composer ovisnosti (framework i biblioteke).

### Korijenske datoteke
- `artisan`: CLI ulazna tocka Laravel alata.
- `composer.json`: PHP ovisnosti i skripte.
- `package.json`: Node ovisnosti i frontend skripte.
- `vite.config.ts`: konfiguracija frontend build alata.
- `tsconfig.json`: TypeScript konfiguracija.
- `.env`: lokalne varijable okoline.

## Napomena o modularnosti

Projekt je organiziran modularno po poslovnim cjelinama:
- Administracija sifrarnika i korisnika
- Upravljanje imovinom
- Inventura u hodu (odabir sobe + skeniranje + potvrda lokacije)
- Izvjestaji
- Provjera barkoda

Takva organizacija olaksava odrzavanje, testiranje i daljnje prosirenje funkcionalnosti.