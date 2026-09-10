# 10 — Analytics

## 10.1 Cosa serve davvero sapere

Cinque domande, non di più:

1. Quante persone arrivano sul sito?
2. Da dove arrivano (Instagram, TikTok, Google, diretto)?
3. Quante inviano una richiesta?
4. Quali pagine convertono meglio?
5. Su quali pagine se ne vanno subito?

Tutto il resto — mappe di calore, registrazioni di sessione, coorti — è rumore
per un sito di dieci pagine con qualche decina di richieste al mese.

Va anche notato che **la metà del lavoro è già fatta senza analytics**: ogni
richiesta memorizza la propria provenienza (UTM, referrer, pagina di arrivo) e
la si vede nel dettaglio della richiesta. È il dato che conta di più, perché
riguarda le richieste, non le visite.

## 10.2 La raccomandazione: Umami o Plausible, self-hosted

| | Umami | Plausible (self-hosted) | Google Analytics 4 |
| --- | --- | --- | --- |
| Cookie | Nessuno | Nessuno | Sì |
| Banner di consenso | Non necessario | Non necessario | **Necessario** |
| Dati fuori dalla UE | No | No | Sì |
| Peso dello script | ~2 kB | ~1 kB | ~50 kB |
| Costo | Gratuito (self-hosted) | Gratuito (self-hosted) | Gratuito |
| Complessità | Un container + un database | Più container (ClickHouse) | Nessuna |

**Raccomandazione: Umami.** Sta in un container accanto a quelli già presenti,
può usare lo stesso PostgreSQL, è cookieless e non richiede il banner. La
differenza con Plausible è marginale; Umami è più leggero da ospitare.

### Perché non Google Analytics

Non è un'obiezione ideologica, sono tre costi concreti:

1. **Obbliga al banner di consenso.** Un banner riduce la conversione, e — cosa
   peggiore — chi rifiuta non viene misurato, quindi i dati sono comunque
   parziali. Si paga un costo di conversione per un dato incompleto.
2. **Complica la privacy policy** (trasferimento extra-UE, clausole contrattuali
   standard, un responsabile in più da nominare).
3. **È sovradimensionato.** GA4 è progettato per e-commerce con migliaia di
   eventi. Qui, per rispondere alle cinque domande di sopra, è come usare un
   ERP per la lista della spesa.

Ha senso solo se in futuro si fa Google Ads con ottimizzazione automatica delle
conversioni: in quel caso il collegamento nativo GA4 ↔ Ads vale il fastidio. È
una decisione da prendere allora, non ora.

## 10.3 Come attivarlo

Il sito lo supporta già: due variabili in `.env` e lo script viene incluso.
Senza di esse **non viene caricato nulla**.

```env
ANALYTICS_SCRIPT_URL=https://analytics.tuo-dominio.it/script.js
ANALYTICS_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Il componente è `src/components/site/Analytics.tsx`; usa `next/script` con
strategia `afterInteractive`, quindi non blocca il rendering.

### Aggiungere Umami allo stack

Da mettere in `docker-compose.yml` accanto agli altri servizi:

```yaml
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    restart: unless-stopped
    depends_on:
      db: { condition: service_healthy }
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/umami
      APP_SECRET: ${UMAMI_SECRET}
    ports:
      - '127.0.0.1:3001:3000'
    networks: [internal]
```

Serve creare il database una volta sola:

```bash
docker compose exec db createdb -U cordiale umami
```

Poi si espone `analytics.tuo-dominio.it` con una seconda route del tunnel
Cloudflare verso `http://localhost:3001`.

## 10.4 Cosa misurare, e con quale cadenza

**Ogni settimana** (due minuti):
- Richieste ricevute — dalla dashboard del pannello
- Provenienza delle richieste — dal dettaglio di ognuna

**Ogni mese** (venti minuti):
- Visitatori unici e sorgenti di traffico
- Pagine di ingresso più frequenti
- Tasso di conversione: richieste ÷ visitatori (per questo tipo di sito,
  **1–3% è normale, sopra il 4% è ottimo**)
- Tasso di conversione richiesta → evento confermato (dalla dashboard)

**Ogni trimestre**:
- Quali landing SEO portano traffico e quali no — una landing che dopo sei mesi
  non porta nulla va riscritta o rimossa, non lasciata lì
- Quale canale genera gli eventi di valore più alto, non solo i più numerosi

## 10.5 Misurare l'invio del modulo

Con Umami, l'evento si registra con una riga nel `RequestForm`, subito dopo
l'esito positivo dell'invio:

```ts
window.umami?.track('richiesta-inviata', { pacchetto: values.packageSlug });
```

Non è incluso di serie: aggiungerlo solo dopo aver attivato l'analytics, per
non lasciare in giro riferimenti a un oggetto che non esiste.

Nota metodologica: **la fonte di verità sulle richieste resta il database**, non
l'analytics. Un ad-blocker può bloccare lo script; non può bloccare un INSERT.
