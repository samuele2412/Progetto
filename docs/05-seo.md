# 05 — SEO locale

## 5.1 La strategia in breve

Tre livelli, con ruoli diversi e tempi diversi.

| Livello | Pagine | Intenzione | Obiettivo |
| --- | --- | --- | --- |
| **Testa** | Home, `/barman-a-domicilio-roma` | "voglio un barman a Roma" | Traffico ad alta intenzione. È la battaglia più dura ma paga subito |
| **Corpo** | Landing per evento (matrimonio, 18 anni, laurea, aziendale, feste private) | "cocktail bar per il mio *tipo* di evento" | Volumi minori, conversione molto più alta, concorrenza bassa |
| **Coda** | Journal ("quanto costa", "quanti cocktail servono") | "sto capendo se posso permettermelo" | Intercetta il cliente prima che sappia di volere un fornitore |

Il livello *corpo* è dove si vince realisticamente nei primi sei mesi: nessun
concorrente romano ha pagine serie su "cocktail bar 18 anni Roma".

## 5.2 Mappa delle parole chiave

| Query | Pagina di destinazione | Note |
| --- | --- | --- |
| barman a domicilio roma | `/it/barman-a-domicilio-roma` | La query di testa. La pagina riformula il servizio ("con il bar incluso") invece di rincorrere il termine |
| cocktail bar a domicilio roma | Home | H1 e meta description |
| cocktail catering roma | Home + pacchetti | Termine più usato dal B2B |
| barman feste private roma | `/it/cocktail-bar-feste-private-roma` | |
| cocktail bar matrimonio roma | `/it/cocktail-bar-matrimonio-roma` | Alto valore, ciclo lungo |
| cocktail bar 18 anni roma | `/it/cocktail-bar-18-anni-roma` | Concorrenza quasi nulla |
| cocktail bar laurea roma | `/it/cocktail-bar-laurea-roma` | Stagionale (marzo, luglio, ottobre) |
| cocktail bar eventi aziendali roma | `/it/cocktail-bar-eventi-aziendali-roma` | |
| open bar eventi roma | Pacchetti + journal | |
| quanto costa un barman a domicilio | `/it/journal/quanto-costa-...` | Massimo volume informativo, converte molto meglio di quanto si pensi |
| quanti cocktail per una festa | `/it/journal/quanti-cocktail-...` | |
| bartender eventi roma | Home | |

**Nessun keyword stuffing.** Ogni pagina ha una parola chiave principale che
compare nel `<title>`, nell'H1 e naturalmente nel testo. Le varianti si
inseriscono da sole scrivendo in italiano decente.

## 5.3 Perché sei landing e non venti

Il briefing metteva in guardia dal generare decine di pagine quasi identiche.
Vale la pena essere espliciti sul confine.

**Legittimo**: una pagina per tipo di evento, perché il contenuto è davvero
diverso. La pagina matrimoni parla di coordinamento con il catering e di
timeline; quella dei diciottesimi parla di servizio responsabile e di genitori;
quella delle lauree parla di una festa in due tempi. Sono problemi diversi,
risposte diverse, foto diverse.

**Non legittimo**: `/cocktail-bar-parioli`, `/cocktail-bar-eur`,
`/cocktail-bar-trastevere`. Sarebbero la stessa pagina con un quartiere
sostituito. Google le riconosce come doorway pages, e nel migliore dei casi le
ignora.

La copertura geografica si ottiene diversamente: **il campo zona nel
configuratore**, la menzione delle zone nel corpo della landing "barman a
domicilio" e — soprattutto — **Google Business Profile** (vedi `08`).

Le landing sono righe della tabella `landing_pages`, quindi aggiungerne una è
un'operazione da pannello. **Prima di farlo**, il criterio è: *ho almeno 400
parole di contenuto vero, specifico e non riciclato?* Se no, meglio un
paragrafo dentro una pagina esistente.

## 5.4 Implementazione tecnica

Tutto già in funzione nel codice.

**URL** — puliti, in italiano per `/it`, in inglese per `/en`, senza date né
parametri. La mappa è in `src/lib/routes.ts`; le landing e gli articoli portano
i propri slug nel database.

**Title e meta description** — per pagina, editabili dal pannello. Template dei
title: `%s | Cordiale Roma`.

**Canonical e hreflang** — generati da `src/lib/seo.ts` per ogni pagina, con
`x-default` sull'italiano. Ogni pagina italiana punta alla propria gemella
inglese e viceversa: è il requisito su cui la maggior parte dei siti bilingue
sbaglia.

**Dati strutturati** (`JSON-LD`):
- `LocalBusiness` + `BarOrPub` con `areaServed` — **senza indirizzo**: è un
  servizio che si sposta, e pubblicare l'indirizzo di casa sarebbe sbagliato sia
  per Google sia per la privacy del titolare
- `WebSite` a livello di sito
- `Service` con `OfferCatalog` sui pacchetti (home, pacchetti, landing)
- `FAQPage` dove ci sono FAQ reali — è lo schema che più spesso produce rich
  result su questo tipo di query
- `BreadcrumbList` su landing e articoli
- `Article` sugli articoli del journal

**Sitemap** (`/sitemap.xml`) — generata dal database, include entrambe le
lingue con i rispettivi `alternates`, ed **esclude** la pagina di ringraziamento
e le legali.

**robots.txt** — generato. Blocca `/admin` e `/api`. **Finché `SITE_URL`
contiene `localhost`, blocca tutto**: una installazione di prova non finisce
indicizzata per distrazione.

**Open Graph e Twitter Card** — su ogni pagina, con l'immagine di anteprima
configurabile. Da preparare a 1200×630 esatti.

## 5.5 Cosa fare dopo il lancio

In ordine, perché l'ordine conta.

1. **Google Search Console** — verificare il dominio (record DNS TXT, che con
   Cloudflare è immediato), inviare la sitemap, controllare la copertura dopo
   una settimana.
2. **Google Business Profile** — vedi `docs/08`. Per un'attività locale di
   servizio vale più di qualsiasi ottimizzazione on-page.
3. **Foto vere** — le pagine con immagini reali si posizionano meglio, non per
   magia ma perché la gente ci resta sopra.
4. **Prime recensioni** — su Google Business Profile prima ancora che sul sito.
5. **Backlink locali, pochi e veri** — location con cui si lavora, wedding
   planner, l'associazione di categoria, un articolo su un blog locale di
   eventi. **Non comprare pacchetti di link**: su un dominio nuovo è il modo più
   rapido per farsi male.
6. **Un articolo al mese, non uno a settimana.** Meglio tre articoli che
   rispondono davvero a una domanda che dodici riscaldati.

## 5.6 Errori da non fare

- Aprire pagine per quartiere (vedi § 5.3).
- Tradurre l'inglese con un traduttore automatico: il testo inglese di questo
  sito è scritto, non tradotto, e va mantenuto così.
- Inserire le parole chiave nell'`alt` delle immagini al posto della
  descrizione reale. L'`alt` serve a chi non vede la foto.
- Cambiare gli slug dopo il lancio senza redirect: si perde tutto quello che si
  è costruito.
- Inseguire "barman Roma" al singolare come query primaria: è dominata dalle
  offerte di lavoro, non dai servizi.
