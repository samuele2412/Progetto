# 04 — Design system

> **Redesign premium (24 ottobre 2026).** Rivista editoriale, cocktail bar
> intimo e ospitalità boutique: avorio caldo e nero carbone, l'oro champagne
> solo nei dettagli, Cormorant Garamond per i titoli e DM Sans per il testo.
> La home è diventata una piccola rivista in sette parti (§ 4.5), con fasce
> chiare e scure che si alternano in entrambi i temi, fotografie integrate
> nell'impaginato e un movimento d'ingresso misurato (§ 4.7). Restano: lo
> scuro come tema predefinito, l'interruttore con il sole e la luna (§ 4.3),
> la fotografia a tutto schermo sotto l'apertura della home. I token vivono in
> `src/app/globals.css` (`@theme` per il chiaro, `:root[data-theme='dark']`
> per lo scuro, `.tone-night` per le fasce scure).
>
> Le fotografie sono tutte **temporanee** (CC0, `docs/photo-sources.md`) e
> nessuna mostra Samuele o una sua serata: si sostituiscono dal pannello
> (Testi e contatti → Home · Fotografie, più l'apertura e «Chi sono»).

## 4.1 Principi

1. **Editoriale, non a modelli.** Titoli grandi con a capo voluti, numerazione
   da rivista (numeri romani per le sezioni, 01–03 per i passaggi), filetti
   sottili, fotografie di formati diversi e fuori asse. Ogni dettaglio ha una
   funzione: orientare, ordinare, far respirare.
2. **L'oro è un dettaglio.** Filetti, numeri, link, focus, il passaggio sul
   pulsante. Mai superfici dorate, gradienti metallici o "nero e oro".
3. **Un solo segnale per l'azione.** L'unica forma piena della pagina è il
   pulsante principale, nel colore del testo (carbone di giorno, avorio di
   notte e sopra le foto); al passaggio diventa bronzo o oro chiaro.
4. **Le foto accompagnano, non mentono.** Luce calda, mani, ghiaccio, agrumi,
   attrezzi: immagini d'atmosfera, mai presentate come serate di Samuele.
5. **Mobile prima.** Ogni sezione è disegnata a 390 px e poi allargata; il
   telefono non è una versione impoverita (stesse foto, stesse sezioni).
6. **Il movimento accompagna, non trattiene.** Un'apertura in sequenza e
   sezioni che entrano una volta sola: niente si nasconde senza JavaScript,
   niente si muove con "riduci movimento", niente parallasse o cursori.

## 4.2 Colore

I nomi sono ruoli, non tonalità: `ink-3` è "testo secondario" ovunque, in
entrambi i temi. Tutti i colori di testo superano AA (4,5:1) su `paper` e
`paper-2`. Punto di partenza: avorio `#F5F0E6`, carbone `#171612`, oro
champagne `#B69A68`, beige `#DED3C0`, grigio caldo `#777064`; i valori sotto
sono quelli adattati per il contrasto.

**Tema chiaro** (avorio):

| Token | Valore | Uso | Contrasto su paper / paper-2 |
| --- | --- | --- | --- |
| `paper` | `#f5f0e6` | Avorio caldo, fondo pagina | — |
| `paper-2` | `#ede6d8` | Fasce alterne, il modulo | — |
| `paper-3` | `#ded3c0` | Beige tenue: riempimenti, cornici delle foto. Mai sotto testo piccolo | — |
| `field` | `#fbf8f2` | Campi dei moduli, card | — |
| `ink` | `#171612` | Titoli, pulsante principale | 15,9 / 14,6 : 1 |
| `ink-2` | `#3a362f` | Testo corrente | 10,6 / 9,7 : 1 |
| `ink-3` | `#6b6458` | Grigio caldo scurito per il testo piccolo (`#777064` era 4,3:1) | 5,2 / 4,7 : 1 |
| `accent` | `#7a6338` | L'oro champagne scurito: occhielli, link, numeri, focus | 5,0 / 4,6 : 1 |
| `accent-strong` | `#5e4c2a` | Passaggio e pressione; fondo del pulsante al passaggio | 7,3 / 6,7 : 1 |
| `accent-soft` | `#f0e9dc` | Stati selezionati (chip del modulo) | — |
| `brass` | `#b69a68` | **Oro champagne pieno**: filetti, ornamenti. Mai testo sull'avorio (2,4:1) | — |
| `danger` | `#a23b2a` | Solo errori | 5,8 / 5,3 : 1 |

**Tema scuro** (carbone, predefinito):

| Token | Valore | Contrasto su paper / paper-2 |
| --- | --- | --- |
| `paper` | `#171612` | — |
| `paper-2` | `#1f1d18` | — |
| `paper-3` | `#2a2721` | — |
| `field` | `#1c1a16` | — |
| `ink` | `#f5f0e6` | 15,9 / 14,8 : 1 |
| `ink-2` | `#ded3c0` | 12,2 / 11,4 : 1 |
| `ink-3` | `#a39a8a` | 6,5 / 6,1 : 1 |
| `accent` / `brass` | `#b69a68` | 6,7 / 6,3 : 1 |
| `accent-strong` | `#cdb689` | — |
| `danger` | `#e8907c` | 7,5 / 7,0 : 1 |

**Fasce scure** — `.tone-night` impone la palette di notte a una sezione in
entrambi i temi: di giorno la pagina alterna avorio e carbone, di notte la
fascia scende di un tono (`paper` `#100f0c`), così il ritmo resta. La usano «Il
mio modo di lavorare», il contatto finale e il footer.

**Costanti** — `cream` (`#f5f0e6`) e `night` (`#100f0c`) non cambiano con il
tema: testo e forme sopra una fotografia scurita. `.on-image` ripunta i ruoli
su valori chiari (l'oro dei link diventa `#cdb689`): la usano l'apertura della
home, l'intestazione mentre ci galleggia sopra e l'apertura con foto del page
builder.

**Altre variabili** — `--cta`, `--cta-hover`, `--cta-text` (pulsante
principale: carbone su avorio con passaggio bronzo `#5e4c2a` di giorno; avorio
su carbone con passaggio oro `#cdb689` di notte, nelle fasce scure e sopra le
foto), `--field-border` (3:1 come chiede WCAG 1.4.11), `--focus-ring` (alone
dei campi), `--selection`.

**Il pannello admin** resta con la sua palette da strumento (`.admin-shell`).

## 4.3 Temi e interruttore

- **Dove si sceglie** — il pulsante con il sole e la luna nell'intestazione
  (`src/components/site/ThemeToggle.tsx`), sempre visibile, anche con il menu
  del telefono aperto. Mostra il tema in uso: la luna di notte, il sole di
  giorno; al cambio uno ruota via e l'altro entra.
- **Come si ricorda** — un cookie di prima parte, `cordiale_theme`, che
  contiene solo `light` o `dark`, dura un anno e viene scritto solo quando
  qualcuno usa il pulsante. È dichiarato nella cookie policy
  (`src/content/legal.ts`) e non richiede consenso: è una preferenza chiesta
  dal visitatore, non un tracciamento (`09-gdpr.md` § 9.6).
- **Niente lampi** — il server legge il cookie e scrive
  `<html data-theme="…">`, il colore della barra del browser (`theme-color`:
  `#171612` di notte, `#f5f0e6` di giorno) e `color-scheme` già nella risposta
  (`src/app/[locale]/layout.tsx`, `src/lib/theme.ts`). Nessuno script in linea:
  la CSP con nonce resta com'era.
- **La transizione** — dove il browser ha le View Transitions il nuovo tema si
  dissolve nell'altro in 0,2 s; con "riduci movimento", o senza supporto,
  cambia e basta.
- **Accessibilità** — pulsante a due stati con nome fisso ("Tema scuro") e
  `aria-pressed`; il suggerimento al passaggio dice cosa fa il clic.

## 4.4 Tipografia

Due famiglie **autoprodotte** (`public/fonts/`, subset latin e latin-ext,
licenza SIL OFL in `public/fonts/licenses/`). Nessuna chiamata a Google Fonts:
la CSP ammette font solo da `'self'`.

| Ruolo | Font | Perché |
| --- | --- | --- |
| Titoli | **Cormorant Garamond** (variabile 300–700, tondo e corsivo), peso 500 | Un Garamond disegnato per i corpi grandi, con un corsivo vero: il tono della rivista. Il peso 400 si assottiglia troppo sullo schermo |
| Testo | **DM Sans** (variabile 300–700, dimensione ottica fissata a 14) | Morbido, leggibile in piccolo, più caldo di un grottesco tecnico |

DM Sans è stato **istanziato** (asse ottico fissato al disegno da testo, pesi
limitati a 300–700): da 62,7 a 28,4 KB, senza differenze nel testo corrente.
Cormorant è com'è su Google Fonts.

**Font di riserva tarati** — `DM Sans Fallback` (Arial / Liberation Sans) e
`Cormorant Garamond Fallback` (Times New Roman / Liberation Serif) con
`size-adjust` 105,25% e 96,75% e le sovrascritture di ascendenti e
discendenti calcolate dai file: mentre i font arrivano il testo occupa già lo
stesso spazio, e nulla si sposta quando arrivano (la tecnica di `next/font`).

| Classe | Dimensione | Uso |
| --- | --- | --- |
| `.display-hero` | `clamp(3.1rem, 1.25rem + 6.6vw, 7.6rem)`, interlinea 0,93 | Il titolo dell'apertura: una frase per riga, a scalare, l'ultima in corsivo |
| `.display-1` | `clamp(2.9rem, 1.6rem + 4.6vw, 5.6rem)` | H1 delle pagine interne, il contatto finale |
| `.display-2` | `clamp(2.35rem, 1.55rem + 3vw, 4.25rem)` | Titoli di sezione |
| `.display-3` | `clamp(1.6rem, 1.35rem + 0.9vw, 2.15rem)` | Titoli di colonna e di passaggio |
| `.lede` | `clamp(1.0625rem, 1rem + 0.35vw, 1.25rem)` | Sottotitoli |
| `.copy` | `1.0625rem`, interlinea 1,75 | Testo corrente nelle sezioni |
| `.eyebrow` | `0.75rem`, maiuscolo, tracking 0,2em, `accent` | Occhielli; `.eyebrow-ruled` li fa precedere da un filetto d'oro |
| `.section-mark` | occhiello + numero romano in corsivo | Il "capitolo" delle sezioni della home (I–V) |
| `.numeral` | cifre allineate di Cormorant, `accent` | Numeri dei passaggi, del menu, del modulo |

Il corpo minore di Cormorant (occhio 0,39 dell'em) è compensato da una scala
più ampia: i titoli di carte e passaggi stanno tra 1,4 e 2,15rem.

**12 px è il minimo**: occhielli, titoli delle colonne del footer, date e note
non scendono sotto. `text-wrap: balance` sui titoli e `pretty` sui paragrafi;
righe di testo entro 65–75 caratteri.

## 4.5 Componenti

Classi CSS in `@layer components`, non componenti React.

- **Pulsanti** — `.btn` (pillola, altezza minima 52 px; freccia `.arrow` che
  scorre di 4 px al passaggio).
  - `.btn-primary`: pieno, dalle variabili `--cta`, piatto; al passaggio
    bronzo o oro chiaro. Uno per schermata.
  - `.btn-ghost` / `.btn-whatsapp`: contorno sottile; il pulsante dell'
    intestazione è un `.btn-ghost`, discreto per scelta.
  - Durante l'invio del modulo: `aria-busy`, un anello che gira e
    l'etichetta "Invio in corso…".
- **Link** — `.link-more`: filetto d'oro sotto l'etichetta, su cui al
  passaggio si disegna da sinistra un filetto nel colore del testo; freccia
  che scorre. `.link-line`: lo stesso filetto, senza freccia (footer, liste).
  `.nav-link`: filetto d'oro sotto la voce del menu e sotto la pagina attiva.
- **Cornice delle foto** — `.frame`: angoli quasi vivi (2 px), fondo beige
  mentre l'immagine arriva, filetto disegnato sopra. Dentro un link la foto
  si avvicina del 3,5% al passaggio.
- **Carta del bar** — `.menu-card`: doppio filetto come una carta stampata; in
  home elenca i tre cocktail «in evidenza» con nome e ingredienti, senza foto.
- **Campi e chip** — `.field`: fondo `field`, bordo `--field-border` (3:1),
  16 px (sotto iOS zooma), altezza 52 px; al focus bordo carbone e alone
  `--focus-ring`; con errore bordo e alone rossi. `.field-error`: un punto e
  il messaggio, che scende in 0,35 s. `.chip`: selezionata con bordo carbone
  doppio e fondo `accent-soft`.
- **Modulo di richiesta** — i tre passi per nome e numero, con una linea d'oro
  che cresce sotto (`role="progressbar"` per i lettori di schermo); ogni passo
  entra con una breve dissolvenza; il messaggio del server arriva in un
  riquadro con filetto rosso a sinistra. Il modulo resta collegato al server
  com'era: il "ricevuta" compare solo dopo il salvataggio.
- **Apertura della home** — `.hero`: la fotografia sotto tutta la prima
  schermata (`min(92svh, 46rem)` al telefono, `min(100svh, 60rem)` da tablet),
  l'intestazione trasparente sopra. Occhiello con filetto, titolo a scalare
  (`.hero-title`, una frase per riga, l'ultima in corsivo e rientrata), testo,
  pulsante e link al servizio; in fondo una riga sottile con "Preventivo
  gratuito e senza impegno" e l'indicatore di scorrimento: le tacche di un
  jigger con una goccia che scende (`.scroll-cue`), che è anche un link alla
  sezione successiva. `.hero-scrim` vela la foto dove sta il testo.
- **Sezioni della home** (`src/components/pages/HomePage.tsx`):
  I. Il servizio — titolo e testo affiancati, tre colonne con foto di formati
  diversi e fuori asse, l'indice dei tipi di festa. II. Chi sono — ritratto,
  i fatti, la formazione in elenco. III. Il mio modo di lavorare — fascia
  scura, la sua frase in corsivo tra virgolette d'oro, la carta del bar.
  IV. Galleria — quattro foto in mosaico (una grande verticale contro una
  orizzontale e due piccole). V. Come funziona — tre passaggi con numeri
  grandi e filetti. Poi il contatto finale.
- **Contatto finale** — `FinalCta`, in fondo a ogni pagina: fascia scura,
  titolo grande, pulsante e WhatsApp, e sopra di essi un calice disegnato a
  filo d'oro (`CoupeMark`, l'unico disegno del sito).
- **Intestazione** — il nome in Cormorant, tre voci e «Eventi», lingua, tema,
  contatto discreto. Trasparente sopra la foto della home, poi piena con un
  filetto e 8 px più bassa quando si scorre.
- **Menu del telefono** — a tutta altezza, sempre nella pagina e animato in
  entrata e in uscita (`.mobile-menu`): le tre voci grandi con il loro numero,
  i tipi di festa in due colonne, lingua e pulsante in fondo. Chiuso è
  `visibility: hidden`, quindi fuori dal `Tab` e dai lettori di schermo.
- **Footer** — fascia scura: il nome in grande, descrittore, la frase del
  brand, le colonne, solo i contatti e i profili davvero impostati, le note
  legali e «Torna su».
- **Passaggi** — `StepList` (pagina del servizio e page builder): numero
  grande in `accent`, filetto che parte dal numero, titolo, testo.
- **Immagini mancanti** — `Media` mostra un segnaposto tratteggiato
  (`.placeholder-hatch`); dove una foto è facoltativa la pagina usa
  `mediaExists()` e la omette.

## 4.6 Spaziature e griglia

- Contenitore: `max-width: 86rem`; margine laterale 1,25rem al telefono,
  2,5rem da 768 px, 4rem da 1280 px (mai sotto i 16 px, rispettando le
  tacche dei telefoni).
- Sezione: `clamp(4.5rem, 10vw, 9rem)` in verticale.
- Griglia a 12 colonne da `lg`; le composizioni sono asimmetriche per scelta
  (7/5, 5/6, 6/6 con sfalsamenti verticali), mai centrate per comodità.
- Misura di lettura: 65–75 battute (`max-w-xl` / `max-w-2xl`).
- `.render-lazy` (`content-visibility: auto`) sulle tre sezioni basse della
  home: il browser le impagina solo quando si avvicinano (§ 4.9). Non sul
  footer né sul contatto finale: fuori schermo non vengono dipinti, e gli
  strumenti di verifica del contrasto leggevano allora il loro testo chiaro
  sullo sfondo avorio della pagina, segnalando errori che non esistono.

## 4.7 Movimento

Leggero e fatto in casa: CSS e un piccolo componente
(`src/components/site/ScrollReveal.tsx`), nessuna libreria.

1. **L'apertura della home** — solo CSS. Un velo notturno si alza sulla foto
   mentre questa si assesta da un leggero ingrandimento (2,6 s); l'occhiello
   appare, le tre righe del titolo salgono da dietro una maschera una dopo
   l'altra, poi il testo, i pulsanti e la riga in fondo (circa 1,6 s in
   tutto). La foto non parte mai trasparente: è l'elemento più grande della
   pagina, e un'immagine trasparente ritarderebbe la misura del caricamento.
2. **Le aperture delle pagine interne** — occhiello e introduzione in
   dissolvenza; il titolo sale senza dissolvenza, per lo stesso motivo.
3. **Le sezioni allo scorrimento** — gli elementi con `data-reveal` salgono
   di 28 px in dissolvenza; le foto (`data-reveal="image"`) si aprono da un
   ritaglio più stretto. Una volta sola, scaglionate dentro un gruppo. Sono
   nascosti **solo** gli elementi ancora sotto la piega, e solo dopo che il
   JavaScript ha verificato di poterli mostrare: senza JavaScript, per un
   crawler o con "riduci movimento" tutto è visibile da subito.
4. **Microinterazioni** — filetti che si disegnano sotto link e voci di menu,
   frecce che scorrono, foto che si avvicinano, campi con alone al focus,
   errori che scendono, chip, menu del telefono, cambio di tema.
5. **Mai** — scorrimento dirottato, parallasse, cursori personalizzati,
   animazioni necessarie per leggere. L'unica animazione continua è la
   goccia dell'indicatore di scorrimento, decorativa.

`prefers-reduced-motion: reduce` azzera durate e ritardi (le animazioni
finiscono subito nello stato visibile) e nasconde la goccia.

## 4.8 Accessibilità

Requisiti trattati come vincoli di build, non come rifiniture.

- **Focus** — `:focus-visible` con outline `accent` da 2 px e offset di 3 px;
  nei campi un bordo pieno più un alone.
- **Skip link** — primo elemento del DOM, visibile al focus; «Torna su» nel
  footer porta allo stesso punto.
- **HTML semantico** — un solo `h1` per pagina (l'occhiello dell'apertura è
  dentro l'`h1`), gerarchia dei titoli senza salti, numeri decorativi
  (romani, 01–03) nascosti ai lettori di schermo.
- **Form** — etichette associate, gruppi in `<fieldset>`, errori con
  `aria-invalid` e `aria-describedby`, focus sul primo campo da correggere,
  barra di avanzamento con nome e valore leggibili.
- **Menu** — `Esc` chiude il menu «Eventi» e quello del telefono e riporta il
  focus sul pulsante; con il menu del telefono aperto il resto della pagina è
  `inert`.
- **Testo sopra la foto** — misurato a parte (axe non sa farlo): il colore di
  ogni riga contro il pixel più chiaro (99° percentile) della foto velata
  dietro le sue lettere. Minimi: titolo 9,1:1, occhiello 6,2:1 (al telefono,
  dopo aver scurito la parte alta del velo), testo 9,7:1, link e note sopra
  8:1, intestazione sopra 8:1.
- **Verifica (24 ottobre 2026)** — axe con le regole WCAG 2.2 AA su 15
  pagine, telefono e desktop, in entrambi i temi: zero violazioni. Nessun
  testo sotto i 12 px, nessuno scorrimento orizzontale a 360, 390, 820, 1024
  e 1440 px. Movimento provato con e senza JavaScript e con "riduci
  movimento" (17 controlli); tastiera, interruttore del tema (12 controlli) ed
  eventi di conversione (18) provati con script. Restano da provare con uno
  screen reader vero.

## 4.9 Performance

- **JavaScript** — ~103 kB condivisi, come prima: nessuna libreria di
  animazione. `ScrollReveal` legge le posizioni dalle notifiche
  dell'IntersectionObserver invece di misurare ogni elemento, così non
  costringe il browser a impaginare tutta la pagina al caricamento.
- **Font** — precaricati solo Cormorant tondo e DM Sans (66 KB in tutto,
  contro i 115 KB di prima); il corsivo è precaricato solo dalla home, dove il
  titolo lo usa subito, e fuori dalla home non si scarica affatto (la frase
  del footer è in tondo per questo). `font-display: swap` e font di riserva
  tarati: CLS 0. L'occhiello dell'apertura va a capo al punto su telefono,
  qualunque sia il font: lasciato alla larghezza, il font di riserva (più
  largo nelle maiuscole) andava a capo dove quello vero no, e l'apertura
  saltava di una riga quando il font arrivava.
- **Immagini** — `next/image` con AVIF e WebP e `sizes` su ogni istanza;
  `priority` solo sulla foto dell'apertura. Le foto nuove sono WebP a 80, tra
  45 e 93 KB alla dimensione piena.
- **Rendering differito** — `content-visibility: auto` sulle sezioni basse
  della home.
- **Misure** (Lighthouse 12.6, telefono, build di produzione in locale, tre
  misure alternate con la versione precedente, mediane, 24 ottobre 2026):
  - rete e CPU simulate: home LCP 2,89 s (prima 2,95 s), landing dei
    matrimoni 2,49 s (2,42 s), CLS 0, punteggi 95–97 (95–98);
  - rallentamento reale di DevTools: home LCP 1,78 s (1,66 s), TBT 136 ms
    (244 ms), punteggio 98 (95); landing LCP 1,68 s (1,66 s), punteggio 97
    (97), peso 254 KiB (286 KiB).

  In entrambe le versioni una misura su tre della landing arriva a circa 3 s:
  è il titolo ridisegnato quando arriva il suo font, non una differenza tra
  le due. La home è più ricca (sette sezioni, più foto) e pesa di più; le
  pagine interne sono più leggere perché precaricano meno font e il corsivo
  non serve fuori dalla home.
- **Client component solo dove servono**: header, modulo, `ScrollReveal`,
  barra del telefono, editor admin.
