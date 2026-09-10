# Cordiale — Private Cocktail Bar Roma

Sito, configuratore di preventivi e pannello di gestione per un servizio di
cocktail bar a domicilio a Roma e provincia.

**Non è una landing page.** È un sistema completo: sito pubblico bilingue,
pagine SEO, configuratore che qualifica le richieste, notifiche email e un
pannello da cui si modificano testi, prezzi, cocktail e foto senza toccare il
codice.

---

## Indice

1. [Cosa contiene](#1-cosa-contiene)
2. [Requisiti](#2-requisiti)
3. [Installazione rapida](#3-installazione-rapida)
4. [Installazione passo per passo](#4-installazione-passo-per-passo)
5. [Cloudflare Tunnel e HTTPS](#5-cloudflare-tunnel-e-https)
6. [Configurazione email](#6-configurazione-email)
7. [Il pannello](#7-il-pannello)
8. [Backup e ripristino](#8-backup-e-ripristino)
9. [Aggiornamenti](#9-aggiornamenti)
10. [Manutenzione periodica](#10-manutenzione-periodica)
11. [Sviluppo in locale](#11-sviluppo-in-locale)
12. [Risoluzione dei problemi](#12-risoluzione-dei-problemi)
13. [Documentazione](#13-documentazione)

---

## 1. Cosa contiene

**Sito pubblico** (italiano e inglese, slug localizzati)
Home · Pacchetti · Cocktail · Galleria · Chi siamo · FAQ · Collaboriamo ·
Journal · sei pagine SEO per tipo di evento · privacy e cookie policy.

**Configuratore di richiesta** in tre passi, pensato per il telefono: tipo di
evento, data, zona, numero di ospiti, formula, preferenze, contatti. Salva
anche la provenienza (UTM, referrer, pagina di arrivo) per sapere quale canale
porta clienti.

**Pannello** su `/admin`: dashboard, pipeline delle richieste in sei stati,
editor di tutti i testi del sito, pacchetti, extra, cocktail, tipi di evento,
FAQ, recensioni, galleria, pagine SEO, journal, caricamento immagini.

**Sotto il cofano**: Next.js 15 · TypeScript · Tailwind v4 · PostgreSQL 17 ·
Drizzle ORM · Docker Compose. Le motivazioni delle scelte sono in
[`docs/07-architettura.md`](docs/07-architettura.md).

---

## 2. Requisiti

**Server**: Ubuntu 22.04 LTS o 24.04 LTS · 2 GB di RAM (4 GB consigliati) ·
10 GB di disco · Docker Engine 24+ con il plugin Compose.

**Altro**: un dominio, un account Cloudflare (gratuito), e un accesso SMTP per
le notifiche (facoltativo ma vivamente consigliato).

### Installare Docker su Ubuntu

```bash
sudo apt update && sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Per usare docker senza sudo (poi riaprire la sessione)
sudo usermod -aG docker "$USER"
newgrp docker

docker --version && docker compose version
```

---

## 3. Installazione rapida

```bash
git clone <url-del-repository> /opt/cordiale
cd /opt/cordiale
./scripts/install.sh
```

Lo script verifica i prerequisiti, crea `.env` con segreti generati
casualmente, si ferma per far compilare le voci mancanti, costruisce le
immagini e avvia tutto. Al termine il sito risponde su
`http://127.0.0.1:3000`.

Se preferisci capire cosa succede, prosegui con la sezione seguente.

---

## 4. Installazione passo per passo

### 4.1 Scaricare il progetto

```bash
sudo mkdir -p /opt/cordiale && sudo chown "$USER" /opt/cordiale
git clone <url-del-repository> /opt/cordiale
cd /opt/cordiale
```

### 4.2 Configurare `.env`

```bash
cp .env.example .env
chmod 600 .env
```

Generare i segreti:

```bash
echo "SESSION_SECRET=$(openssl rand -base64 48)"
echo "IP_HASH_SALT=$(openssl rand -hex 24)"
echo "POSTGRES_PASSWORD=$(openssl rand -base64 30 | tr -d '/+=' | cut -c1-32)"
```

Poi `nano .env` e completare **almeno** queste voci:

| Variabile | Cosa metterci |
| --- | --- |
| `SITE_URL` | `https://tuo-dominio.it` — senza barra finale |
| `POSTGRES_PASSWORD` | La password generata sopra |
| `DATABASE_URL` | La stessa password dentro l'URL: `postgresql://cordiale:LA_PASSWORD@db:5432/cordiale` |
| `SESSION_SECRET` | Il valore generato sopra |
| `IP_HASH_SALT` | Il valore generato sopra |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Le credenziali del primo accesso (password: almeno 12 caratteri) |
| `NOTIFY_EMAIL` | Dove ricevere le nuove richieste |

> `DATABASE_URL` usa `db` come host: è il nome del servizio Postgres dentro la
> rete di Docker Compose, non `localhost`.

### 4.3 Avviare

```bash
docker compose up -d --build
```

Al primo avvio il container dell'applicazione, prima di servire una sola
pagina: aspetta che Postgres sia pronto, applica le migrazioni, inserisce i
contenuti iniziali (pacchetti, cocktail, FAQ, pagine SEO, articoli) e crea
l'amministratore da `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

Seguire l'avvio:

```bash
docker compose logs -f app
```

### 4.4 Verificare

```bash
curl -s http://127.0.0.1:3000/api/health
# {"status":"ok","database":"up","time":"..."}
```

Poi aprire `http://127.0.0.1:3000/admin` (in locale, o attraverso il tunnel una
volta configurato) e accedere.

### 4.5 Mettere in sicurezza le credenziali

Dopo il primo accesso riuscito, **rimuovere `ADMIN_PASSWORD` da `.env`**: non
serve più. Resta valida quella con cui si è entrati.

---

## 5. Cloudflare Tunnel e HTTPS

Il tunnel espone il sito su internet **senza aprire porte sul router e senza
IP pubblico**. Cloudflare termina anche TLS, quindi non serve né certbot né un
reverse proxy.

### 5.1 Creare il tunnel (interfaccia web, consigliata)

1. Portare il dominio su Cloudflare (cambio dei nameserver presso il
   registrar) e attendere la propagazione.
2. Nel pannello Cloudflare: **Zero Trust → Networks → Tunnels → Create a
   tunnel**, tipo *Cloudflared*.
3. Dare un nome (es. `cordiale-prod`) e copiare il **token** mostrato.
4. Nella scheda **Public Hostnames**, aggiungere:

   | Campo | Valore |
   | --- | --- |
   | Subdomain | *(vuoto)* |
   | Domain | `tuo-dominio.it` |
   | Type | `HTTP` |
   | URL | `app:3000` |

   `app:3000` è il nome del servizio nella rete Docker. Se si preferisce far
   girare `cloudflared` direttamente sull'host, usare `localhost:3000`.

5. Ripetere per `www` se lo si vuole (poi si reindirizza con una Redirect Rule).

### 5.2 Avviare cloudflared insieme allo stack

Aggiungere il token a `.env`:

```env
CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoiXXXXXXXX...
```

E avviare includendo il profilo `tunnel`:

```bash
docker compose --profile tunnel up -d
```

### 5.3 In alternativa: cloudflared sull'host

```bash
curl -L --output cloudflared.deb \
  https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
sudo cloudflared service install <IL_TUO_TOKEN>
sudo systemctl status cloudflared
```

In questo caso, nel pannello Cloudflare l'URL del servizio è
`http://localhost:3000` e nel `docker-compose.yml` si può commentare il
servizio `cloudflared`.

### 5.4 Impostazioni Cloudflare consigliate

| Sezione | Impostazione | Valore |
| --- | --- | --- |
| SSL/TLS | Encryption mode | **Full** |
| SSL/TLS → Edge Certificates | Always Use HTTPS | On |
| SSL/TLS → Edge Certificates | Automatic HTTPS Rewrites | On |
| SSL/TLS → Edge Certificates | Minimum TLS Version | 1.2 |
| Speed → Optimization | Brotli | On |
| Caching | Caching Level | Standard |

> **Non attivare "Rocket Loader"**: riordina l'esecuzione degli script e rompe
> l'idratazione di React.

### 5.5 Verificare

```bash
curl -I https://tuo-dominio.it
curl -s https://tuo-dominio.it/api/health
```

Poi controllare che `SITE_URL` in `.env` corrisponda al dominio reale
(altrimenti canonical, sitemap e link nelle email puntano altrove) e
riavviare: `docker compose up -d`.

---

## 6. Configurazione email

Senza SMTP il sito funziona: le richieste vengono comunque salvate e sono
visibili nel pannello. Si perde solo la notifica immediata — e con essa il
tempo di risposta, che in questo mestiere è il vantaggio competitivo più
concreto.

```env
SMTP_HOST=smtp.tuoprovider.it
SMTP_PORT=587
SMTP_SECURE=false          # true solo sulla porta 465
SMTP_USER=no-reply@tuo-dominio.it
SMTP_PASSWORD=...
MAIL_FROM="Cordiale <no-reply@tuo-dominio.it>"
NOTIFY_EMAIL=tua-email-personale@example.com
```

Ogni nuova richiesta genera due email: la notifica al titolare (con
`Reply-To` impostato sul cliente, così basta rispondere) e una conferma al
cliente con il proprio codice di riferimento.

### Consigli pratici

- Usare un fornitore transazionale, non la casella personale: la deliverability
  è tutt'altra cosa.
- Impostare **SPF**, **DKIM** e **DMARC** sul dominio, altrimenti le conferme
  finiscono nello spam.
- Provare l'invio inviando una richiesta di prova dal sito.

Dopo aver modificato `.env`: `docker compose up -d`.

---

## 7. Il pannello

`https://tuo-dominio.it/admin`

**Dashboard** — richieste nuove, da ricontattare, preventivi aperti, eventi
confermati, valore in pipeline, tasso di conversione a 30 giorni, prossimi
eventi. In cima segnala i segnaposto ancora da completare: quando quel riquadro
sparisce, il sito è pronto per essere pubblicizzato.

**Richieste** — pipeline a sei stati: Nuova → Contattato → Preventivo →
Confermato → Completato, più Perso. Nel dettaglio: tutti i dati dell'evento, la
provenienza, note interne, valore stimato (alimenta la pipeline), pulsanti per
rispondere via WhatsApp con messaggio già pronto, telefono ed email, ed
eliminazione definitiva per le richieste di cancellazione GDPR.

**Testi e contatti** — ogni testo del sito, in italiano e inglese, diviso per
sezione. Le modifiche sono immediate, senza deploy.

**Pacchetti · Extra · Cocktail · Tipi di evento · FAQ · Recensioni · Galleria ·
Pagine SEO · Journal** — creazione, modifica ed eliminazione.

**Immagini** — caricamento (max 6 MB, JPG/PNG/WebP/AVIF). Si copia il percorso
mostrato e lo si incolla nel campo immagine della sezione desiderata.

**Password** — il cambio password chiude tutte le sessioni aperte, su qualsiasi
dispositivo.

### Sostituire le foto

Due strade, entrambe valide:

1. **Dal pannello** → Immagini → carica → copia il percorso `/uploads/...` →
   incollalo dove serve.
2. **Da file**: mettere i file in `public/images/` seguendo i nomi indicati in
   [`public/images/README.md`](public/images/README.md) e ricostruire
   (`./scripts/update.sh`).

Finché un'immagine non esiste, il sito mostra un segnaposto grafico coerente
con il design, non un'icona rotta: si può andare online e sostituire le foto a
mano a mano.

---

## 8. Backup e ripristino

### Backup

```bash
./scripts/backup.sh              # in ./backups
./scripts/backup.sh /mnt/nas     # altrove
```

Ogni backup contiene il dump del database, le immagini caricate e `.env`, in un
unico `.tar.gz` con permessi `600`. Vengono conservati gli ultimi 14 archivi
(`RETAIN_BACKUPS` per cambiare).

**Automatizzare** — `crontab -e`:

```cron
0 3 * * * cd /opt/cordiale && ./scripts/backup.sh >> /var/log/cordiale-backup.log 2>&1
```

> **Un backup sulla stessa macchina non è un backup.** Sincronizzare la
> cartella altrove — `rclone` verso uno storage a oggetti, `rsync` verso un NAS,
> qualunque cosa purché sia un altro disco.

### Ripristino

```bash
./scripts/restore.sh backups/cordiale-20260115-030000.tar.gz
```

Chiede una conferma esplicita, salva un dump di sicurezza dello stato attuale,
ferma l'applicazione, ripristina database e immagini e riavvia. Il `.env`
contenuto nell'archivio **non** viene applicato: va confrontato a mano.

```bash
tar -xzOf backups/cordiale-20260115-030000.tar.gz ./env.backup | diff - .env
```

---

## 9. Aggiornamenti

```bash
cd /opt/cordiale
./scripts/update.sh
```

Fa un backup, aggiorna il codice, ricostruisce le immagini e riavvia. Le
migrazioni vengono applicate dal container all'avvio.

A mano, se si preferisce:

```bash
./scripts/backup.sh
git pull --ff-only
docker compose build --pull
docker compose up -d
docker compose logs -f app
```

---

## 10. Manutenzione periodica

| Cadenza | Operazione |
| --- | --- |
| Giornaliera | Backup automatico (cron) |
| Settimanale | Guardare la dashboard: richieste, conversione |
| Mensile | Pulizia GDPR dei lead scaduti; aggiornamenti di sistema |
| Trimestrale | Provare un ripristino su una macchina di prova. Un backup mai ripristinato è un'ipotesi, non un backup |

**Pulizia GDPR** — elimina le richieste non convertite più vecchie di
`RETENTION_MONTHS` e azzera gli hash IP oltre i 12 mesi:

```bash
docker compose exec app node dist-scripts/retention.cjs
```

In cron:

```cron
0 4 1 * * cd /opt/cordiale && docker compose exec -T app node dist-scripts/retention.cjs >> /var/log/cordiale-retention.log 2>&1
```

**Aggiornamenti di sistema**:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y unattended-upgrades   # una volta sola
```

---

## 11. Sviluppo in locale

```bash
npm install
cp .env.example .env        # DATABASE_URL su localhost:5432

docker compose -f docker-compose.dev.yml up -d    # solo Postgres

npm run db:migrate
npm run db:seed
npm run admin:create -- tu@example.com "una password lunga"

npm run dev                 # http://localhost:3000
```

| Comando | Cosa fa |
| --- | --- |
| `npm run dev` | Server di sviluppo |
| `npm run build` / `start` | Build e avvio di produzione |
| `npm run typecheck` | Controllo dei tipi |
| `npm run lint` | ESLint |
| `npm run db:generate` | Genera una migrazione dopo aver modificato lo schema |
| `npm run db:migrate` | Applica le migrazioni |
| `npm run db:seed` | Inserisce i contenuti iniziali (non sovrascrive nulla) |
| `npm run db:studio` | Interfaccia web sul database |
| `npm run admin:create` | Crea o reimposta un amministratore |
| `npm run db:retention` | Pulizia GDPR |

**Modificare lo schema**: cambiare `src/db/schema.ts` → `npm run db:generate` →
rileggere l'SQL generato in `drizzle/` → `npm run db:migrate`. Le migrazioni
vanno versionate insieme al codice.

---

## 12. Risoluzione dei problemi

### Il container `app` riparte in continuazione

```bash
docker compose logs app --tail 100
```

Quasi sempre è una variabile d'ambiente: l'applicazione si rifiuta di partire
con una configurazione non valida e dice quale campo manca. Verificare che
`DATABASE_URL` usi `db` come host e che `SESSION_SECRET` sia lungo almeno 32
caratteri.

### `database unreachable after 40 attempts`

```bash
docker compose ps                # db deve risultare (healthy)
docker compose logs db --tail 50
```

Se Postgres non parte, di solito è un permesso sul volume o una password
cambiata dopo l'inizializzazione. **Attenzione**: cambiare
`POSTGRES_PASSWORD` dopo il primo avvio non aggiorna la password già impostata
nel volume. O si ripristina il valore precedente, o si cambia dentro Postgres:

```bash
docker compose exec db psql -U cordiale -c "ALTER USER cordiale PASSWORD 'nuova';"
```

### Il sito risponde in locale ma non dal dominio

```bash
docker compose logs cloudflared --tail 50   # oppure: sudo journalctl -u cloudflared -n 50
```

Controllare che il Public Hostname punti a `app:3000` (tunnel nel Compose) o a
`localhost:3000` (cloudflared sull'host), e che i nameserver del dominio siano
quelli di Cloudflare.

### Le email non arrivano

```bash
docker compose logs app | grep '\[mail\]'
```

Nessuna riga `[mail]` significa che l'SMTP non è configurato (`SMTP_HOST` o
`NOTIFY_EMAIL` mancanti). Se compare un errore, è il fornitore a rifiutare:
controllare porta, credenziali e SPF/DKIM.

### Le modifiche del pannello non compaiono

Le modifiche sono immediate. Se non si vedono, è quasi sempre la cache di
Cloudflare: *Caching → Configuration → Purge Everything*. Verificare anche di
non aver lasciato disattivato l'elemento (spunta "Attivo").

### "Esiste già un elemento con questo slug"

Slug e chiavi sono unici. Cambiarne uno, oppure modificare l'elemento esistente
invece di crearne un altro.

### Immagini non visibili

Il percorso deve iniziare con `/images/...` (file nel repository) o
`/uploads/...` (caricati dal pannello). Il campo immagine nel pannello avvisa
quando il file non esiste ancora.

### Ho perso la password del pannello

```bash
docker compose exec app node dist-scripts/create-admin.cjs \
  tu@example.com "una nuova password lunga"
```

Reimposta la password e chiude tutte le sessioni aperte.

### Spazio su disco esaurito

```bash
docker system df
docker image prune -a       # immagini inutilizzate
docker compose logs --tail 0 -f   # se i log sono enormi, limitarli nel compose
```

---

## 13. Documentazione

Le decisioni di prodotto e di mercato sono documentate, non improvvisate:

| File | Contenuto |
| --- | --- |
| [`docs/01-analisi-mercato.md`](docs/01-analisi-mercato.md) | Concorrenti romani, prezzi reali, segmenti, dove sta il gap |
| [`docs/02-brand-e-naming.md`](docs/02-brand-e-naming.md) | Posizionamento, 20 nomi valutati, cosa verificare prima di scegliere |
| [`docs/03-pricing-e-pacchetti.md`](docs/03-pricing-e-pacchetti.md) | Perché non si vende a ore, i quattro pacchetti, i margini, le regole di trattativa |
| [`docs/04-design-system.md`](docs/04-design-system.md) | Colori, tipografia, componenti, movimento, accessibilità |
| [`docs/05-seo.md`](docs/05-seo.md) | Strategia locale, parole chiave, perché sei landing e non venti |
| [`docs/06-marketing-e-funnel.md`](docs/06-marketing-e-funnel.md) | Funnel, Instagram, TikTok, partnership, primi 90 giorni |
| [`docs/07-architettura.md`](docs/07-architettura.md) | Stack e motivazioni, struttura, come evolve |
| [`docs/08-google-business-profile.md`](docs/08-google-business-profile.md) | Scheda Google per un'attività senza vetrina |
| [`docs/09-gdpr.md`](docs/09-gdpr.md) | Dati trattati, basi giuridiche, retention, perché non c'è il banner cookie |
| [`docs/10-analytics.md`](docs/10-analytics.md) | Analytics privacy-first, perché non GA4 |
| [`docs/11-roadmap.md`](docs/11-roadmap.md) | Cosa fare dopo, e cosa non fare |

---

## Prima di andare online

- [ ] Sostituire tutti i segnaposto segnalati dalla dashboard
- [ ] Caricare le foto vere (almeno hero, ritratto, tre cocktail)
- [ ] Completare e far verificare privacy e cookie policy
- [ ] Impostare `SITE_URL` sul dominio definitivo
- [ ] Configurare l'SMTP e provare l'invio
- [ ] Programmare i backup e copiarli fuori dalla macchina
- [ ] Verificare il sito su un telefono vero, non solo nel simulatore
- [ ] Aprire Google Business Profile
- [ ] Rimuovere `ADMIN_PASSWORD` da `.env`
