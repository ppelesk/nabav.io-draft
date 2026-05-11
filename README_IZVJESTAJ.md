# Izvještaj o reviziji koda i ispravku grešaka

U sklopu zadatka revizije aplikacije "Nabav.io" pronađeno je i otklonjeno više grešaka na backendu i frontendu. Aplikacija se sastoji od Laravel 13 backenda i React frontenda (Inertia.js + Vite). Promjene su napravljene u grani `dev`.

## Popravljene greške na backendu

1. **Test Suite - Nedostajući korisnički podaci (Roles / Uloge)**
   - Testovi poput `DashboardTest`, `SecurityTest` i mnogi drugi su padali s greškom `UniqueConstraintViolationException` ili `QueryException` zbog nekompletnog inicijalnog stanja baze.
   - Ponašanje se događalo zato što se prilikom kreiranja korisnika pomoću `User::factory()->create()` očekuje postojanje role, što standardni testovi u Laravelu bez dodatne pripreme ne pružaju.
   - **Rješenje:** Dodan je `Database\Seeders\UlogaSeeder::class` prije izvođenja testova u `tests/Pest.php` konfiguraciji te nadopunjen `tests/TestCase.php` da osigurava ispravno pripremljeno stanje s ulogama (roles) prije testiranja.

2. **Greška u Seederu - Uloge (Timestamps)**
   - Prilikom izvođenja `php artisan db:seed` ili unutar testova baza je bacala grešku: `General error: 1 no such column: updated_at (Connection: sqlite...`.
   - **Razlog:** U modelu `App\Models\Uloga` postoji svojstvo `public $timestamps = false;`, a u `UlogaSeeder`-u su se ručno unosila polja `created_at` i `updated_at`.
   - **Rješenje:** Maknuti su dodaci za `created_at` i `updated_at` iz metode `updateOrInsert` unutar `UlogaSeeder`-a.

3. **Disabled Fortify Registration Feature**
   - Rute poput `/register` su pozivale komponentu na frontendu koju je Laravel Fortify onemogućio unutar `config/fortify.php`. Test `RegistrationTest` je padao i ispisivao `Fortify feature [registration] is not enabled.`
   - Registracija je isključena jer se upravljanje korisnicima izvodi ručno kroz administraciju.
   - **Rješenje:** Uklonjen je `RegistrationTest.php` jer testira ukinutu značajku. Komponenta `register.tsx` je obrisana sa sustava.

## Popravljene greške na frontendu

1. **Vite Build greška (Missing Export)**
   - Vite nije mogao uspješno kompajlirati aplikaciju (naredba `npm run build` je stalno pucala).
   - Problem je bio u stranici za prijavu (`resources/js/pages/auth/login.tsx`) gdje se koristio nepostojeći import rutera `register` iz `@/routes`, s obzirom na to da je ruta za registraciju onemogućena i uklonjena.
   - **Rješenje:** Uklonjen import funkcije `register()` iz komponente za login, kao i pripadajući dio korisničkog sučelja (HTML-a) koji se odnosio na `Sign Up` link u dnu modala za prijavu. Također je izbrisana nepotrebna komponenta `register.tsx` unutar `auth` mape.

2. **Neiskorištene varijable (ESLint i TypeScript)**
   - Pokretanjem koda kroz ESLint, javljale su se razne greške o neiskorištenim importovima i varijablama širom codebasea (npr. u `provjera-barkoda/index.tsx`, `zaduzenja.tsx`, `welcome.tsx`).
   - U datoteci `resources/js/pages/welcome.tsx` je definirano destrukcija svojstava koja nije sadržavala ni jedno svojstvo i bacala je gresku `Unexpected empty object pattern`.
   - **Rješenje:** Riješeni su svi problemi vezani uz Typechecking i linting. Dodano je pravilo u `eslint.config.js` za prepoznavanje React verzije (`settings: { react: { version: "detect" } }`), kako bi nestalo pripadajuće upozorenje. Kod je uspješno usklađen (svi buildovi i provjere preko `npm run types:check` te `npm run lint` prolaze bez problema).

3. **Oblikovanje koda (Formatting)**
   - Za formatiranje koda korišten je `php artisan pint` koji je ispravio konvencije kodiranja u **94** datoteke.

## Osvrt na dokumentaciju "korisnickePrice draft(10).docx"

Datoteka `korisnickePrice draft(10).docx` ne postoji niti se nalazi poslana unutar repozitorija stoga taj specifičan kod (za "inventurne liste") nije još implementiran ili analiziran. Da bismo dovršili izmjenu o "inventurnim listama", bilo bi potrebno da se priloži i commita odgovarajući dokument.
