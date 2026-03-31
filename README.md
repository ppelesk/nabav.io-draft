# nabav.io – Draft

Laravel 13 + React (Inertia.js) aplikacija.

---

## Preduvjeti

Prije nego što pokreneš aplikaciju, provjeri da su instalirani:

| Alat | Minimalna verzija |
|------|-------------------|
| PHP | **8.4** |
| Composer | 2.x |
| Node.js | 20+ |
| npm | 10+ |
| Git | bilo koja |

> **PHP ekstenzije** koje moraju biti uključene:
> `bcmath`, `ctype`, `fileinfo`, `json`, `mbstring`, `openssl`, `pdo`, `pdo_sqlite`, `sqlite3`, `tokenizer`, `xml`
>
> Na macOS-u ih možeš provjeriti s `php -m`. Na Windowsu ih uključiš u `php.ini` (uncommentaj odgovarajuće `extension=` linije).

---

## Instalacija

### 1. Kloniraj repozitorij

```bash
git clone https://github.com/ppelesk/nabav.io-draft.git
cd nabav.io-draft
```

### 2. Pokretanje setup skripte

Projekt dolazi s `composer setup` skriptom koja automatski obavlja sve korake instalacije:

```bash
composer setup
```

Ova naredba će:
1. Instalirati PHP ovisnosti (`composer install`)
2. Kreirati `.env` datoteku iz `.env.example` (ako ne postoji)
3. Generirati aplikacijski ključ (`php artisan key:generate`)
4. Pokrenuti migracije baze podataka (`php artisan migrate`)
5. Instalirati JavaScript ovisnosti (`npm install`)
6. Buildati frontend (`npm run build`)

> **Baza podataka:** Po defaultu koristi **SQLite** – nije potreban MySQL niti ikakav poseban database server. SQLite datoteka se automatski kreira u `database/database.sqlite`.

### 3. (Opcionalno) Konfiguracija .env

Ako trebaš promijeniti neke postavke (npr. naziv aplikacije, mail konfiguraciju), uredi `.env` datoteku:

```bash
# Primjer ključnih varijabli
APP_NAME=nabav.io
APP_URL=http://localhost:8000
```

---

## Pokretanje razvojnog okruženja

```bash
composer dev
```

Ova naredba paralelno pokreće:
- **PHP dev server** – `http://localhost:8000`
- **Vite** (hot reload za frontend)
- **Queue worker** (za pozadinske zadatke)
- **Pail** (log viewer)

Sve u jednom terminalu.

---

## Korisne naredbe

```bash
# Pokretanje testova
composer test

# Linting PHP koda
composer lint

# Linting i formatiranje JS/TS koda
npm run lint
npm run format

# TypeScript provjera tipova
npm run types:check
```

---

## Česta pitanja

**`composer setup` prijavljuje grešku vezanu uz SQLite`?**
Provjeri da je ekstenzija `pdo_sqlite` uključena: `php -m | grep sqlite`

**Stranica se ne prikazuje ispravno (nema styla)?**
Pokreni `npm run build` ili koristi `composer dev` koji automatski uključuje Vite server s hot reloadom.

**Port 8000 je zauzet?**
Pokreni server ručno na drugom portu: `php artisan serve --port=8080`

