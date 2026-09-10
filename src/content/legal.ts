/**
 * Default privacy and cookie texts.
 *
 * IMPORTANT — these are a *structure*, not legal advice. They follow the shape
 * required by GDPR art. 13 and are pre-filled with what this codebase actually
 * does, so a lawyer or DPO has something concrete to review instead of a blank
 * page. Every field in double brackets must be completed before go-live, and
 * the whole text should be checked by a professional. The site shows a warning
 * banner on these pages while the placeholders are still present.
 */

export const defaultPrivacyBody = {
  it: `## Titolare del trattamento

Il titolare del trattamento dei dati è [[RAGIONE SOCIALE]], con sede in [[INDIRIZZO]], P.IVA [[PARTITA IVA]], contattabile all'indirizzo [[EMAIL]].

## Quali dati raccogliamo

Raccogliamo esclusivamente i dati che inserisci nel modulo di richiesta preventivo:

- nome e cognome
- indirizzo email
- numero di telefono
- data, zona e tipo dell'evento
- numero indicativo di ospiti, formula e preferenze sui cocktail
- eventuali note che scegli di aggiungere

Non raccogliamo dati particolari ai sensi dell'art. 9 GDPR e ti chiediamo di non inserirne nel campo note.

Al momento dell'invio registriamo inoltre la data e l'ora della richiesta, la lingua del sito, la pagina di provenienza ed eventuali parametri di campagna (UTM), oltre a un codice non reversibile derivato dal tuo indirizzo IP. Quest'ultimo serve unicamente a limitare gli invii automatici e non permette di risalire all'indirizzo IP originale.

## Perché li trattiamo e su quale base giuridica

- **Rispondere alla tua richiesta e formulare un preventivo** — base giuridica: misure precontrattuali richieste dall'interessato (art. 6.1.b GDPR) e consenso espresso tramite la casella di spunta del modulo (art. 6.1.a GDPR).
- **Gestire l'eventuale evento confermato** — base giuridica: esecuzione del contratto (art. 6.1.b GDPR).
- **Proteggere il modulo da invii automatici** — base giuridica: legittimo interesse alla sicurezza del sito (art. 6.1.f GDPR).
- **Adempiere agli obblighi fiscali e contabili** in caso di evento confermato — base giuridica: obbligo di legge (art. 6.1.c GDPR).

Non utilizziamo i tuoi dati per inviarti comunicazioni commerciali se non ce lo chiedi espressamente.

## Per quanto tempo li conserviamo

- Richieste non convertite: [[24 MESI — DA CONFERMARE]] dall'ultimo contatto, poi cancellate.
- Richieste convertite in evento: per la durata necessaria alla gestione del rapporto e, per i soli documenti fiscali, per il termine di legge (10 anni).
- Codice derivato dall'indirizzo IP: 12 mesi.

## A chi vengono comunicati

I dati non vengono venduti né ceduti. Possono essere trattati dai seguenti soggetti, in qualità di responsabili del trattamento:

- [[FORNITORE DI HOSTING / SERVER]] — infrastruttura sulla quale è ospitato il sito
- [[FORNITORE SMTP]] — invio delle email di notifica e di conferma
- Cloudflare, Inc. — servizio di rete e protezione del sito ([[VERIFICARE E INSERIRE RIFERIMENTO ALLE CLAUSOLE CONTRATTUALI STANDARD]])

Non è previsto alcun trasferimento di dati verso paesi extra-UE al di fuori di quanto sopra.

## I tuoi diritti

Puoi in qualsiasi momento chiedere l'accesso ai tuoi dati, la loro rettifica o cancellazione, la limitazione del trattamento, la portabilità, e opporti al trattamento fondato sul legittimo interesse. Puoi inoltre revocare il consenso in qualsiasi momento, senza che ciò pregiudichi la liceità del trattamento effettuato prima della revoca.

Per esercitare questi diritti scrivi a [[EMAIL]]. Hai diritto di proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).

## Modifiche

Questa informativa può essere aggiornata. La data dell'ultima modifica è indicata in fondo alla pagina.`,

  en: `## Data controller

The data controller is [[LEGAL NAME]], registered at [[ADDRESS]], VAT [[VAT NUMBER]], reachable at [[EMAIL]].

## What we collect

We only collect what you type into the quote request form:

- name and surname
- email address
- phone number
- date, area and type of the event
- approximate guest count, format and cocktail preferences
- any notes you choose to add

We do not collect special categories of data under art. 9 GDPR, and we ask you not to enter any in the notes field.

On submission we also record the date and time of the request, the site language, the referring page and any campaign parameters (UTM), plus a non-reversible code derived from your IP address. The latter is used solely to throttle automated submissions and cannot be turned back into the original address.

## Why, and on what legal basis

- **To answer your request and prepare a quote** — legal basis: pre-contractual measures taken at your request (art. 6.1.b GDPR) and the consent given via the form checkbox (art. 6.1.a GDPR).
- **To run a confirmed event** — legal basis: performance of a contract (art. 6.1.b GDPR).
- **To protect the form from automated abuse** — legal basis: our legitimate interest in the security of the site (art. 6.1.f GDPR).
- **To meet tax and accounting obligations** where an event is confirmed — legal basis: legal obligation (art. 6.1.c GDPR).

We do not use your data to send marketing unless you explicitly ask us to.

## How long we keep it

- Requests that did not become events: [[24 MONTHS — TO BE CONFIRMED]] from the last contact, then deleted.
- Requests that became events: for as long as needed to manage the relationship and, for tax documents only, for the statutory period (10 years).
- The code derived from your IP address: 12 months.

## Who it is shared with

Your data is never sold or traded. It may be processed by the following parties, acting as processors:

- [[HOSTING / SERVER PROVIDER]] — the infrastructure the site runs on
- [[SMTP PROVIDER]] — delivery of notification and confirmation emails
- Cloudflare, Inc. — network and site protection ([[VERIFY AND REFERENCE THE STANDARD CONTRACTUAL CLAUSES]])

No transfer outside the EU is envisaged beyond the above.

## Your rights

At any time you may request access to your data, its correction or erasure, restriction of processing, portability, and you may object to processing based on legitimate interest. You may also withdraw consent at any time, without affecting the lawfulness of processing carried out beforehand.

To exercise these rights, write to [[EMAIL]]. You have the right to lodge a complaint with the Italian data protection authority (www.garanteprivacy.it).

## Changes

This notice may be updated. The date of the last change is shown at the bottom of the page.`,
};

export const defaultCookieBody = {
  it: `## In breve

Questo sito non utilizza cookie di profilazione, non installa pixel pubblicitari e non condivide dati con circuiti di advertising. Per questo motivo non vedi un banner di consenso: non c'è nulla per cui chiedere il consenso.

## Cosa viene effettivamente salvato sul tuo dispositivo

- **Cookie tecnico di sessione dell'area riservata** (cordiale_session) — presente solo se sei l'amministratore del sito e hai effettuato l'accesso al pannello. Scade alla chiusura della sessione. Non riguarda i visitatori.
- **Nessun altro cookie** viene impostato dal sito nella navigazione ordinaria.

I font sono ospitati sul nostro server: non viene effettuata alcuna chiamata a servizi di terze parti per caricarli.

## Statistiche di visita

[[SE ATTIVI UN SISTEMA DI STATISTICHE, DESCRIVILO QUI. La configurazione prevista è un sistema self-hosted e senza cookie (per esempio Plausible o Umami), che raccoglie soltanto dati aggregati e non consente di identificare i singoli visitatori. Se in futuro venisse adottato uno strumento che utilizza cookie o profila gli utenti, sarà necessario implementare un banner di consenso preventivo conforme alle Linee guida del Garante.]]

## Protezione della rete

Il sito è servito attraverso Cloudflare, che può impostare cookie tecnici di sicurezza per identificare traffico malevolo. Sono cookie strettamente necessari al funzionamento e alla sicurezza del servizio.

## Come gestire i cookie

Puoi bloccare o eliminare i cookie dalle impostazioni del tuo browser. Trattandosi esclusivamente di cookie tecnici, il blocco non impedisce la consultazione del sito.`,

  en: `## In short

This site uses no profiling cookies, installs no advertising pixels and shares no data with ad networks. That is why you do not see a consent banner: there is nothing to consent to.

## What is actually stored on your device

- **A technical session cookie for the admin area** (cordiale_session) — present only if you are the site administrator and have signed in. It expires with the session and does not concern visitors.
- **No other cookie** is set by the site during ordinary browsing.

Fonts are served from our own server: no third-party request is made to load them.

## Visit statistics

[[IF YOU ENABLE ANALYTICS, DESCRIBE IT HERE. The intended configuration is a self-hosted, cookieless system (for example Plausible or Umami) collecting aggregate data only and unable to identify individual visitors. If a tool that sets cookies or profiles users is adopted later, a prior-consent banner compliant with the Italian authority's guidelines will be required.]]

## Network protection

The site is served through Cloudflare, which may set technical security cookies to identify malicious traffic. These are strictly necessary for the operation and security of the service.

## Managing cookies

You can block or delete cookies from your browser settings. Since only technical cookies are involved, blocking them does not prevent you from using the site.`,
};
