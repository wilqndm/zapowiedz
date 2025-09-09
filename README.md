# Generator zapowiedzi meczu (1200×630)

    Aplikacja webowa (Next.js + Tailwind CSS) do tworzenia plakatów zapowiedzi meczu ligowego z możliwością wdrożenia na **Vercel**.  
    Stały kadr **1200×630 px**. Pasek u góry zmienia kolor w zależności od **typu meczu** (Liga – czerwony, Puchar – zielony).

    ## Funkcje
    - Wybór **Gospodarza** i **Gościa** (z listy).
    - Po wyborze **Gospodarza**: ładuje się herb po lewej, podpis nazwy oraz adres stadionu gospodarza na dole (obok ikony lokalizacji).
    - Po wyborze **Gościa**: ładuje się logo po prawej z podpisem.
    - Wybór **daty** – pełna forma z nazwą dnia tygodnia po polsku.
    - Wpisanie **godziny**.
    - Wpisanie **numeru kolejki** – wyświetla się u góry (pasek).
    - **Biała poświata** dookoła herbów (PNG z tłem przezroczystym).
    - Upload tła lub użycie domyślnego.
    - **Pobierz PNG** (1200×630).

    ## Szybki start
    ```bash
    pnpm install
    pnpm dev
    # http://localhost:3000
    ```

    ## Logotypy i adresy
    - Wstaw swoje pliki PNG do `public/logos/` i nazwij je zgodnie ze `slugami` w `lib/teams.ts` (np. `nadbuzanka-slopsk.png`).
    - Uzupełnij adresy stadionów gospodarzy w `lib/teams.ts` – wtedy pojawią się automatycznie na plakacie.

    ## Deploy na Vercel
    1. Wypchnij repo na GitHub.
    2. Na https://vercel.com → **Add New Project** → wybierz repo → **Deploy**.
    3. Vercel automatycznie wykryje Next.js. Nie wymaga dodatkowej konfiguracji (jest `vercel.json`).

    ## Technologia
    - **Next.js 14** (App Router), **React 18**
    - **Tailwind CSS** (nowoczesny wygląd)
    - **html-to-image** (eksport PNG)
    - Format dat i dni tygodnia via `Intl.DateTimeFormat('pl-PL')`.

    ## Dostosowanie
    - Kolory paska: `tailwind.config.mjs` (`liga`, `puchar`).
    - Czcionka: `Inter` przez `next/font`.
    - Układ stały (nieresponsywny) 1200×630 – dobry do social mediów.

    ## Licencja
    MIT
