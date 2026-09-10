# 07 — Architettura tecnica

## 7.1 Lo stack e il perché

| Livello | Scelta | Perché questa e non un'altra |
| --- | --- | --- |
| Framework | **Next.js 15** (App Router, output `standalone`) | Server rendering per la SEO, React server component per spedire pochissimo JavaScript, un solo processo da gestire per frontend e backend. L'output standalone produce un'immagine Docker autosufficiente |
| Linguaggio | **TypeScript** in modalità strict | Su un progetto che una persona sola manterrà a mesi di distanza, i tipi sono documentazione che non invecchia |
| Stili | **Tailwind CSS v4** | Nessun runtime, CSS finale ridotto al minimo, token di design nel CSS stesso (`@theme`) invece che in un file di configurazione JavaScript |
| Database | **PostgreSQL 17** | SQLite basterebbe per i volumi previsti, ma jsonb (usato per tutti i testi bilingui), i tipi enum e un percorso di backup serio valgono la differenza. E il giorno in cui servono due repliche, non c'è nulla da migrare |
| ORM | **Drizzle** | Puro TypeScript, nessun binario nativo, nessun passaggio di generazione. Le migrazioni sono file SQL leggibili, applicati a runtime dal migratore incluso: l'immagine di produzione non ha bisogno di alcuna dipendenza di sviluppo |
| Autenticazione | bcrypt + JWT in cookie **HttpOnly** (`jose`) | Nessun servizio esterno, nessun database di sessioni. Per un pannello con uno o due utenti, aggiungere NextAuth sarebbe superficie in più senza vantaggi |
| Email | **Nodemailer** su SMTP | Funziona con qualsiasi fornitore. Nessun lock-in su un'API proprietaria |
| Deploy | **Docker Compose** + Cloudflare Tunnel | Due comandi per installare, uno per aggiornare. Nessuna porta aperta sul router |

### Scelte deliberatamente evitate

- **Nessun reverse proxy (nginx/Traefik).** Cloudflare Tunnel termina già TLS e
  parla HTTP con l'app. Un proxy in mezzo sarebbe un componente in più da
  configurare, aggiornare e diagnosticare, in cambio di nulla.
- **Nessun CMS headless** (Strapi, Payload, Sanity). Il pannello necessario è
  piccolo e specifico; un CMS generico avrebbe portato un secondo servizio, un
  secondo modello di dati e un secondo sistema di permessi.
- **Nessuna libreria di animazione.** Le animazioni sono cinque righe di CSS e
  un `IntersectionObserver`. Framer Motion sarebbe stato ~40 kB di JavaScript
  per lo stesso risultato.
- **Nessun Redis.** Il rate limiter è in memoria, il che è corretto finché il
  processo è uno solo — ed è documentato in `src/lib/rate-limit.ts` insieme a
  cosa cambiare se un giorno non lo fosse.

## 7.2 Struttura del progetto

```
.
├── docs/                     Analisi e documentazione (questa cartella)
├── drizzle/                  Migrazioni SQL generate — vanno versionate
├── docker/entrypoint.sh      Attesa DB → migrazioni → seed → avvio
├── public/
│   ├── fonts/                Fraunces e Inter, subset latin (autoprodotti)
│   ├── images/               Segnaposto e foto definitive (vedi il README lì)
│   └── uploads/              Volume Docker: immagini caricate dal pannello
├── scripts/
│   ├── install.sh            Installazione iniziale
│   ├── update.sh             Aggiornamento con backup preventivo
│   ├── backup.sh             Database + upload + .env, con rotazione
│   ├── restore.sh            Ripristino con dump di sicurezza
│   ├── migrate.ts            Applica le migrazioni (usato dall'entrypoint)
│   ├── seed.ts               Contenuti iniziali, idempotente
│   ├── create-admin.ts       Crea o reimposta un amministratore
│   └── retention.ts          Pulizia GDPR dei lead scaduti
└── src/
    ├── app/
    │   ├── layout.tsx              Root pass-through
    │   ├── [locale]/
    │   │   ├── layout.tsx          <html lang>, chrome, JSON-LD globale
    │   │   └── [[...slug]]/        Catch-all: risolve ogni URL pubblico
    │   ├── admin/
    │   │   ├── layout.tsx          Radice del pannello (tema chiaro)
    │   │   ├── login/
    │   │   ├── actions.ts          Tutte le server action del pannello
    │   │   └── (panel)/            Tutto ciò che richiede autenticazione
    │   ├── api/{requests,health,admin/upload}/
    │   ├── sitemap.ts · robots.ts · icon.svg
    │   └── globals.css             Design system completo
    ├── components/
    │   ├── blocks/           Mattoni riusabili (card, FAQ, CTA, hero)
    │   ├── pages/            Un componente per tipo di pagina
    │   ├── request/          Configuratore e tracciamento della provenienza
    │   ├── site/             Header, footer, barra CTA mobile, analytics
    │   └── admin/            Editor generico, form, campi
    ├── content/              Contenuti predefiniti (seed + fallback)
    ├── db/                   Schema Drizzle e client
    ├── lib/                  env, i18n, rotte, SEO, auth, mail, validazione…
    └── middleware.ts         Prefisso di lingua + gate del pannello
```

## 7.3 Due decisioni che vale la pena spiegare

### Il catch-all `[[...slug]]`

Gli slug sono localizzati (`/it/pacchetti` e `/en/packages`), e le pagine SEO
vivono nel database. Nessuna delle due cose si può esprimere con una gerarchia
di cartelle, perché una cartella ha un nome solo.

Il risolutore in `src/app/[locale]/[[...slug]]/page.tsx` fa tre tentativi in
ordine: rotta statica (dalla mappa in `src/lib/routes.ts`) → pagina SEO
(database) → articolo del journal. Se falliscono tutti, 404.

Il vantaggio non è solo tecnico: **ogni URL che il sito può produrre è deciso
in un unico posto**, quindi aggiungere una pagina significa aggiungere una riga
alla mappa e un ramo allo switch, e i link, la sitemap e l'hreflang seguono da
soli.

### Il registro delle collection nel pannello

Il pannello ha nove schermate CRUD quasi identiche. Invece di nove pagine e
nove action, ogni collection è **descritta una volta** in
`src/lib/admin/collections.ts` (tabella, campi, etichette), e un editor generico
più una sola server action le coprono tutte.

Aggiungere un campo a un pacchetto = aggiungere una riga al descrittore. La
colla che rende possibile tutto ciò è la coppia
`parseFormData` / `validateRecord` in `src/lib/admin/form.ts`, che riporta il
`FormData` piatto alla forma della tabella convertendo i tipi.

Un dettaglio importante emerso in sviluppo: **l'oggetto tabella di Drizzle non
può attraversare il confine server/client** (è un Proxy che manda in ricorsione
la serializzazione). L'editor riceve quindi solo `slug` e `fields`.

## 7.4 Flusso di una richiesta di preventivo

```
Browser                  API /api/requests             Database        SMTP
   │                            │                          │             │
   │── POST JSON ──────────────▶│                          │             │
   │                            │ 1. rate limit (IP hash)  │             │
   │                            │ 2. schema zod            │             │
   │                            │ 3. honeypot + tempo      │             │
   │                            │ 4. Turnstile (se attivo) │             │
   │                            │──── INSERT ─────────────▶│             │
   │◀── 201 { reference } ──────│                          │             │
   │                            │──── notifica (fire & forget) ─────────▶│
   │                            │──── conferma al cliente ──────────────▶│
```

**L'ordine non è casuale.** Il lead viene scritto sul database *prima* di
qualsiasi invio, e le email partono senza attendere. Se l'SMTP è giù, il
visitatore riceve comunque il proprio codice e la richiesta è nel pannello: la
conseguenza di un guasto è una risposta più lenta, non una prenotazione persa.

## 7.5 Prestazioni

Il rendering è dinamico su tutto il sito pubblico, per scelta: le modifiche fatte
dal pannello devono comparire subito, senza rigenerazioni o purge di cache. Con
Postgres sulla stessa macchina il costo è di pochi millisecondi, e Cloudflare
davanti assorbe il traffico ripetuto.

Il primo caricamento condivide ~103 kB di JavaScript. I componenti client sono
solo quattro: header (menu mobile), configuratore, editor del pannello e
l'observer dei reveal.

## 7.6 Come evolve

Le fasi richieste dal briefing, con cosa serve davvero per ciascuna.

| Fase | Cosa serve | Stato delle fondamenta |
| --- | --- | --- |
| 1. Un bartender | — | ✅ Completa |
| 2. Più bartender | Tabella `staff`, assegnazione sulla richiesta | Schema pronto a estendersi; nessuna modifica strutturale |
| 3. Eventi in parallelo | Vista calendario sulla data evento | Il campo esiste ed è indicizzato |
| 4. Gestione staff | Disponibilità, compensi | Nuove tabelle, nessuna riscrittura |
| 5. CRM | Storico contatti per cliente | `status_history` è già un jsonb per evento; servirebbe una tabella `clients` |
| 6. Calendario disponibilità | Date bloccate, controllo in fase di richiesta | Il configuratore già accetta la data; basterebbe una tabella `blocked_dates` |
| 7. Preventivi automatici | Motore di calcolo su ospiti + formula + extra | La logica di prezzo è già dati (`packages`, `addons`), non codice |
| 8. Pagamenti | Stripe o simile, acconto alla conferma | Il modello richiesta → preventivo → conferma è già lo stesso di un flusso con acconto |

Il principio seguito: **niente astrazioni per il futuro, ma nessun vicolo cieco.**
Non c'è un sistema di ruoli per un utente solo, ma `admins` ha già una tabella
propria; non c'è un motore di preventivi, ma i prezzi sono dati.
