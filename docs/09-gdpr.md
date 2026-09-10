# 09 — GDPR e privacy

> ⚠️ **Questo documento non è consulenza legale.** Descrive cosa fa il software
> e quali decisioni restano da prendere. I testi legali forniti sono una
> traccia con segnaposto espliciti `[[…]]`, da completare e **far verificare a
> un professionista** prima di andare online. Finché i segnaposto sono presenti,
> le pagine legali mostrano un avviso ben visibile.

## 9.1 Quali dati tratta il sito

Uno solo dei flussi del sito raccoglie dati personali: il modulo di richiesta
preventivo.

| Dato | Perché | Obbligatorio |
| --- | --- | --- |
| Nome e cognome | Per rivolgersi al cliente | Sì |
| Email | Per inviare conferma e preventivo | Sì |
| Telefono | Perché la vendita si chiude al telefono | Sì |
| Data, zona, tipo di evento, numero di ospiti | Per formulare il preventivo | Sì |
| Formula, preferenze sui cocktail, note | Per personalizzare la proposta | No |
| Lingua, pagina di arrivo, parametri UTM | Per capire quale canale funziona | Automatico |
| **Hash dell'indirizzo IP** | Solo per limitare gli invii automatici | Automatico |

**Non** vengono raccolti: indirizzo esatto (si concorda al telefono), data di
nascita, dati di pagamento, categorie particolari ex art. 9. Le note libere
avvisano di non inserire informazioni sensibili.

### L'indirizzo IP

Non viene mai salvato in chiaro. Il rate limiter usa
`SHA-256(IP_HASH_SALT + ":" + IP)`, e solo l'hash finisce nel database
(`event_requests.ip_hash`). L'operazione è a senso unico e, senza il sale
(che sta in `.env`, non nel database), non è invertibile nemmeno da chi
ottenesse un dump. Lo script di retention lo azzera dopo dodici mesi.

## 9.2 Basi giuridiche

| Trattamento | Base giuridica |
| --- | --- |
| Rispondere alla richiesta, formulare il preventivo | Art. 6.1.b — misure precontrattuali su richiesta dell'interessato, **rafforzata** dal consenso esplicito nel modulo (6.1.a) |
| Gestire l'evento confermato | Art. 6.1.b — esecuzione del contratto |
| Protezione anti-spam del modulo | Art. 6.1.f — legittimo interesse alla sicurezza |
| Obblighi fiscali sugli eventi svolti | Art. 6.1.c — obbligo di legge |

Il modulo ha una casella di consenso **non preselezionata**, obbligatoria, con
link all'informativa. Data e ora del consenso vengono registrate
(`consent_privacy_at`): è l'unica prova utile in caso di contestazione.

Non c'è consenso di marketing: il sito non fa email marketing. Se un giorno si
volesse una newsletter, servirebbe **una seconda casella separata e
facoltativa** — mai la stessa.

## 9.3 Conservazione

| Dato | Durata | Come avviene |
| --- | --- | --- |
| Richieste non convertite | `RETENTION_MONTHS` (predefinito 24) dall'ultima modifica | `npm run db:retention` |
| Richieste diventate eventi | Durata del rapporto; documenti fiscali 10 anni per legge | Manuale |
| Hash dell'IP | 12 mesi | Stesso script |
| Log del server | Quanto li tiene Docker (`docker compose logs`) | Configurabile su Docker |

Lo script **non gira da solo**: va messo in cron (vedi il README). È una scelta
deliberata — una cancellazione automatica di dati non sorvegliata è un rischio
maggiore di una da avviare.

```
0 4 1 * * cd /opt/cordiale && docker compose exec -T app node dist-scripts/retention.cjs >> /var/log/cordiale-retention.log 2>&1
```

## 9.4 Diritti degli interessati

| Diritto | Come si soddisfa oggi |
| --- | --- |
| Accesso | Pannello → Richieste → cerca per email; i dati sono tutti in una schermata |
| Rettifica | Modificabile nelle note; per i campi anagrafici, correzione manuale su richiesta |
| **Cancellazione** | Pannello → dettaglio richiesta → *Elimina definitivamente*. Cancellazione reale, non logica |
| Limitazione | Impostare lo stato su *Perso* e non ricontattare |
| Portabilità | Export manuale (i dati stanno su una riga di `event_requests`) |
| Opposizione | Come sopra |

Il pulsante di eliminazione esiste apposta ed è etichettato in modo che si
capisca a cosa serve. È il diritto che viene esercitato più spesso.

## 9.5 Responsabili del trattamento

Vanno elencati nell'informativa e, dove previsto, coperti da un accordo ex
art. 28. Nel setup predefinito:

| Soggetto | Ruolo | Da fare |
| --- | --- | --- |
| Fornitore del server / hosting | Infrastruttura | Nominarlo responsabile; verificare dove sono i data center |
| Fornitore SMTP | Recapito delle email | Verificare l'ubicazione e le clausole contrattuali standard se extra-UE |
| Cloudflare, Inc. | Rete e protezione (tunnel) | Verificare le clausole contrattuali standard; è extra-UE |
| Fornitore di analytics (se attivato) | Statistiche | Se self-hosted, nessun terzo coinvolto |

**Se l'analytics resta self-hosted e cookieless, la lista si accorcia** — un
motivo pratico in più per la scelta descritta in `docs/10`.

## 9.6 Cookie: perché non c'è un banner

Il sito, così com'è, **non installa alcun cookie sui visitatori**:

- I font sono serviti dal proprio server, non da Google Fonts
- Non ci sono pixel pubblicitari, embed di social, mappe incorporate o chat
- L'unico cookie è `cordiale_session`, tecnico, presente **solo** per
  l'amministratore che ha effettuato l'accesso al pannello
- Cloudflare può impostare cookie tecnici di sicurezza: rientrano fra quelli
  strettamente necessari

Per i cookie tecnici non serve il consenso preventivo. **Mostrare un banner
quando non serve non è "prudente": è un fastidio inutile che abbassa la
conversione**, e comunica che non si è capito il tema.

**Quando servirebbe un banner** (e allora va implementato per davvero, con
blocco preventivo degli script e possibilità di rifiutare):
- Google Analytics, Meta Pixel, TikTok Pixel
- Video YouTube o Vimeo incorporati
- Google Maps incorporato
- Qualsiasi widget di chat di terze parti

## 9.7 Foto degli eventi

L'aspetto più trascurato, e quello con il rischio pratico più alto.

- **Le persone riconoscibili nelle foto sono dati personali.** Per pubblicarle
  serve una liberatoria, che nel caso di un evento privato è ragionevole
  raccogliere dal committente, in forma scritta, prima della serata.
- **La soluzione più semplice è fotografare cose, non persone**: bancone,
  cocktail, ghiaccio, mani, dettagli, ambiente. Sono anche le foto che
  funzionano meglio sul sito.
- **Le location private** vanno concordate con il proprietario prima di
  mostrarle: molti non vogliono che la propria villa sia riconoscibile.
- Per i **minorenni** (diciottesimi) il consenso dei genitori è indispensabile.

Aggiungere una riga sulla liberatoria fotografica al preventivo o al contratto
è il modo più economico di risolvere il problema una volta per tutte.

## 9.8 Sicurezza dei dati

Cosa è già in atto:

- HTTPS obbligatorio (terminato da Cloudflare)
- Password del pannello con bcrypt, costo 12
- Sessioni JWT firmate in cookie HttpOnly + SameSite=Lax, con invalidazione
  immediata di tutte le sessioni al cambio password
- Controllo dell'origine su ogni azione che modifica dati (CSRF)
- Rate limiting su modulo pubblico e login
- Validazione e normalizzazione di ogni input lato server (zod)
- Query parametrizzate ovunque (Drizzle): nessuna SQL injection possibile
- Header di sicurezza (`X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`)
- Postgres non esposto sulla rete; l'app in ascolto solo su loopback
- Nessun segreto nel repository

Cosa resta da fare a chi gestisce il server:
- Backup **fuori dalla macchina** (un backup sullo stesso disco non è un backup)
- Aggiornamenti di sistema regolari (`unattended-upgrades`)
- Una password lunga per il pannello, in un gestore di password
- `chmod 600 .env` (lo fa l'installer, ma va mantenuto)

## 9.9 Prima di andare online: checklist

- [ ] Completare tutti i `[[…]]` nell'informativa privacy
- [ ] Completare il paragrafo sulle statistiche nella cookie policy
- [ ] Far verificare entrambi i testi da un professionista
- [ ] Compilare titolare, indirizzo, P.IVA ed email nel pannello
- [ ] Decidere e configurare `RETENTION_MONTHS`
- [ ] Programmare in cron lo script di retention
- [ ] Verificare che i backup partano e che siano copiati altrove
- [ ] Predisporre la liberatoria fotografica per i clienti
- [ ] Verificare i responsabili del trattamento effettivamente usati
