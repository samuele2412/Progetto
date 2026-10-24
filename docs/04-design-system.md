# 04 — Design system

> **Ottobre 2026: due temi.** Il sito ha la palette chiara "carta e
> inchiostro" e quella scura "il bar di notte", con gli stessi ruoli. **Lo
> scuro è il tema predefinito**, per scelta di Samuele; chi visita può passare
> al chiaro con il sole e la luna nell'intestazione (§ 4.3). L'apertura della
> home è di nuovo una fotografia a tutto schermo con il titolo sopra. I token
> vivono in `src/app/globals.css` (`@theme` per il chiaro,
> `:root[data-theme='dark']` per lo scuro).
>
> **Restyling di fine ottobre: ospitalità contemporanea.** Una sola direzione,
> per sottrazione. L'ottone resta l'identità ma diventa un dettaglio (filetti,
> occhielli, focus, numeri), non una superficie: il pulsante principale è nel
> colore del testo, crema di notte e inchiostro di giorno, piatto. Via gli
> effetti che non servono a leggere (aloni di luce, grana, ombre e bagliore
> dei pulsanti, vetro sfocato di intestazione e barra del telefono, entrate
> animate dei blocchi, il cerchio del cambio tema). L'intestazione mostra solo
> il nome: lo slogan sotto di esso ripeteva l'occhiello di ogni pagina.

## 4.1 Principi

1. **La tipografia porta il design, le foto lo accompagnano.** Una sola
   fotografia a tutto schermo, quella dell'apertura della home; altrove titoli
   in Fraunces, molto spazio, poche immagini incorniciate. Una pagina deve
   sembrare finita anche senza fotografie.
2. **Costoso non vuol dire dorato.** Il premium si ottiene con spazio,
   gerarchia e contrasto, non con oro, ombre e decorazioni. Nero e ottone non
   diventano mai "nero e oro": l'ottone è un filo, non una superficie.
3. **Un solo segnale per l'azione.** L'unica forma piena della pagina è il
   pulsante principale, nel colore del testo (inchiostro di giorno, crema di
   notte e sopra le foto): il contrasto più forte della pagina, quindi non c'è
   mai il dubbio su quale conta.
4. **Mobile prima.** Ogni componente è progettato a 390 px e poi allargato.
5. **L'animazione conferma, non intrattiene.** Niente entra in scena: i
   contenuti ci sono quando c'è la pagina. Si muove solo ciò che risponde a un
   gesto (passaggio del mouse, focus, menu, cambio di tema).

## 4.2 Colore

I nomi sono ruoli, non tonalità: `ink-3` è "testo secondario" ovunque, in
entrambi i temi. Tutti i colori di testo superano AA (4,5:1) su `paper`,
`paper-2` e `paper-3`.

**Tema chiaro** (carta e inchiostro):

| Token | Valore | Uso | Contrasto su paper / paper-2 |
| --- | --- | --- | --- |
| `paper` | `#f7f3ec` | Fondo pagina: avorio caldo, non bianco | — |
| `paper-2` | `#efe9df` | Fasce alterne, pannelli, il modulo | — |
| `paper-3` | `#e6dfd3` | Hover su `paper-2`, fascia "contrasto" del page builder | — |
| `field` | `#fffdf9` | Campi dei moduli, card | — |
| `ink` | `#1c1a17` | Titoli, pulsante principale | 15,7 : 1 |
| `ink-2` | `#3b3631` | Testo corrente | 10,8 : 1 |
| `ink-3` | `#645d55` | Testo secondario, didascalie, placeholder | 5,9 / 5,4 : 1 |
| `accent` | `#7e5a28` | **Ottone brunito**: eyebrow, link, focus, stati attivi | 5,6 / 5,1 : 1 |
| `accent-strong` | `#5f431d` | Hover e pressione | — |
| `accent-soft` | `#ebe1cf` | Stati selezionati (chip del modulo), selezione del testo | — |
| `brass` | `#b08a4f` | Filetti e puntini decorativi. **Mai testo** (2,9 : 1) | — |
| `brass-light` | `#d8b87d` | Accenti sopra una foto scurita | — |
| `danger` | `#a23b2a` | Solo errori | 5,9 / 5,4 : 1 |

**Tema scuro** (il bar di notte, predefinito) — la palette con cui il sito è
nato, ricostruita sugli stessi ruoli:

| Token | Valore | Contrasto su paper / paper-2 / paper-3 |
| --- | --- | --- |
| `paper` | `#0e0c0a` | — |
| `paper-2` | `#161310` | — |
| `paper-3` | `#1f1b16` | — |
| `field` | `#1a1612` | — |
| `ink` | `#f3ede3` | 16,8 / 15,9 / 14,7 : 1 |
| `ink-2` | `#d9d0c2` | 12,8 / 12,1 / 11,2 : 1 |
| `ink-3` | `#a59b8c` | 7,1 / 6,8 / 6,3 : 1 |
| `accent` | `#d2b07a` | 9,5 / 9,0 / 8,3 : 1 |
| `accent-strong` | `#e8cf9e` | — |
| `accent-soft` | `#2b2319` | — |
| `brass` | `#a8874f` | decorativo |
| `danger` | `#e8907c` | 8,1 / 7,7 / 7,1 : 1 |

**Costanti** — `cream` (`#f6f1e8`) e `night` (`#0e0c0a`) non cambiano con il
tema: servono per il testo e le forme sopra una fotografia scurita, che è
scura in entrambi i temi. La classe `.on-image` ripunta i ruoli (`ink`,
`ink-2`, `accent`, i filetti, il pulsante principale) su valori chiari: tutto
quello che sta dentro (titoli, link, focus) funziona senza casi speciali. La
usano l'apertura della home, l'intestazione mentre galleggia sopra di essa e
l'apertura con foto del page builder.

**Altre variabili per tema** — `--cta`, `--cta-hover`, `--cta-text` (il
pulsante principale: `#1c1a17` su `#f7f3ec` di giorno, `#f3ede3` su `#0e0c0a`
di notte e sopra le foto), `--field-border` (bordo dei campi, almeno 3:1 come
chiede WCAG 1.4.11: inchiostro al 50% di giorno, al 40% di notte),
`--selection`.

**Perché l'ottone resta.** È la continuità con l'identità di prima: stesso
metallo, brunito perché su carta deve reggere come testo. Il verde di WhatsApp
è sparito dai pulsanti: WhatsApp è un'azione secondaria, contornata come le
altre e riconoscibile dal suo simbolo.

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
  `<html data-theme="…">`, il colore della barra del browser (`theme-color`) e
  `color-scheme` già nella risposta (`src/app/[locale]/layout.tsx`,
  `src/lib/theme.ts`). Non serve uno script in linea, quindi la CSP con nonce
  resta com'era.
- **La transizione** — dove il browser ha le View Transitions il nuovo tema si
  dissolve nell'altro in 0,2 s; con "riduci movimento", o senza supporto,
  cambia e basta.
- **Accessibilità** — è un pulsante a due stati con nome fisso ("Tema scuro") e
  `aria-pressed`, il modello che i lettori di schermo annunciano meglio; il
  suggerimento al passaggio dice cosa fa il clic ("Passa al tema chiaro").
- **Senza scelta** — il tema predefinito è lo scuro (`defaultTheme`). Per
  seguire invece l'impostazione del telefono basterebbe cambiare quella riga,
  ma il server non conosce la preferenza del sistema: tornerebbe il lampo al
  primo caricamento.

## 4.4 Tipografia

Due famiglie, **autoprodotte** (`public/fonts/`, subset latin e latin-ext).
Nessuna chiamata a Google Fonts a runtime.

| Ruolo | Font | Perché |
| --- | --- | --- |
| Display | **Fraunces** (variabile 300–700), peso 400 | Serif contemporaneo con carattere: regge i titoli grandi, che sono l'immagine principale del sito |
| Testo | **Inter** (variabile 300–700) | Leggibile a corpo piccolo, neutro: lascia parlare il display |

| Classe | Dimensione | Uso |
| --- | --- | --- |
| `.display-hero` | `clamp(2.75rem, 7.4vw, 5.6rem)`, interlinea 1,02 | Il titolo sopra la foto della home |
| `.display-1` | `clamp(2.6rem, 6.4vw, 4.75rem)`, interlinea 1,04 | H1 |
| `.display-2` | `clamp(1.9rem, 4.2vw, 3rem)` | Titoli di sezione |
| `.display-3` | `clamp(1.35rem, 2.4vw, 1.75rem)` | Titoli di blocco |
| `.lede` | `clamp(1.0625rem, 1.5vw, 1.25rem)` | Sottotitoli |
| `.copy` | `1.0625rem`, interlinea 1,7 | Testo corrente nelle sezioni |
| `.eyebrow` | `0.75rem`, maiuscolo, tracking 0,16em, `accent` | Etichette sopra i titoli; con `.eyebrow-ruled` sono precedute da un filetto, come i capitoli a stampa |

**12 px è il minimo**: occhielli, titoli delle colonne del footer, date e note
non scendono sotto (c'erano testi da 10,4 e 11,2 px).

`text-wrap: balance` sui titoli e `pretty` sui paragrafi. Righe di testo entro
circa 65 caratteri (`max-w-xl` / `max-w-2xl`).

## 4.5 Componenti

Classi CSS in `@layer components`, non componenti React.

- **Pulsanti** — `.btn` (pillola, altezza minima 48 px).
  - `.btn-primary`: pieno, dalle variabili `--cta` — il colore del testo del
    tema, piatto: niente ombra, niente sollevamento; al passaggio cambia solo
    tono. Uno per schermata.
  - `.btn-ghost`: contorno sottile, per le azioni secondarie.
  - `.btn-whatsapp`: come `.btn-ghost`, con il simbolo di WhatsApp
    (`src/components/icons.tsx`).
- **Link "continua"** — `.link-more`: area di tocco da 44 px, etichetta
  sottolineata in ottone (`.label`), freccia che si sposta al passaggio
  (`.arrow`).
- **Cornice delle foto** — `.frame`: angoli da 0,75rem e un filetto disegnato
  sopra l'immagine, così una foto chiara su carta ha comunque un bordo.
- **Card** — `.card`: fondo `field`, filetto, nessuna ombra a riposo. Usata
  poco: liste e indici con filetti sono preferiti alle griglie di card.
- **Campi e chip** — `.field`: fondo `field`, bordo `--field-border` (3:1),
  `font-size: 1rem` (sotto i 16 px iOS zooma), altezza minima 48 px. `.chip`:
  bordo al 24%, perché la riconosce già la sua etichetta. Chip selezionata:
  bordo inchiostro e fondo `accent-soft`.
- **Apertura della home** — `.hero`: la fotografia sotto tutta la prima
  schermata, l'intestazione trasparente che ci galleggia sopra finché non si
  scorre o si apre un menu. La fascia è `night` in entrambi i temi, con
  `.hero-scrim` (velatura più scura dove sta il testo, una fascia in alto per
  l'intestazione: è l'unico gradiente del sito, e serve a leggere). Senza
  fotografia resta una fascia scura finita, non un segnaposto. Altezza:
  `min(86svh, 40rem)` al telefono, `min(92svh, 56rem)` da tablet.
- **Intestazione e barra del telefono** — superfici piene nel colore della
  pagina con un filetto, senza trasparenze né sfocature. L'intestazione mostra
  solo il nome; lo slogan sta nell'occhiello della pagina e nel footer.
- **Menu** — `.nav-link`: un filetto d'ottone si disegna da sinistra sotto la
  voce al passaggio del mouse e resta sotto la pagina in cui ci si trova.
- **Footer** — nome grande, descrittore e filetto d'ottone; dal tablet al
  portatile il nome ha la sua riga sopra tre colonne, da `lg` sono quattro.
- **Passaggi** — `StepList`: lista aperta con un filetto sopra ogni passo e il
  numero in ottone, niente riquadri.
- **Immagini mancanti** — `Media` mostra un segnaposto tratteggiato nel
  filetto del tema (`.placeholder-hatch`); dove una
  foto è facoltativa (copertina di una pagina evento o di un articolo) la
  pagina usa `mediaExists()` e la omette del tutto.

## 4.6 Spaziature e griglia

- Contenitore: `max-width: 78rem`, margine laterale 1,25rem su mobile e 2rem
  da 768 px (mai sotto i 16 px).
- Sezione: `clamp(3rem, 9vw, 7.5rem)` in verticale.
- Griglia a 12 colonne da `lg` per le composizioni testo + immagine; tutte le
  pagine, articoli compresi, allineano tutto al bordo sinistro del
  contenitore, sotto il nome nell'intestazione.
- Misura di lettura: circa 70-80 battute (`max-w-2xl` per gli articoli e le
  pagine legali, `max-w-xl` per i paragrafi nelle sezioni).
- Le foto affiancate al testo diventano orizzontali e a tutta larghezza finché
  le colonne non si aprono (`lg`), così su un tablet non resta mezza riga
  vuota.
- Testo e immagini si alternano lungo la pagina: due fotografie non stanno mai
  una dopo l'altra sul telefono.

## 4.7 Movimento

1. **Niente entra in scena.** I blocchi comparivano uno dopo l'altro
   scorrendo (`.reveal`): l'effetto si ripeteva su ogni sezione di ogni pagina
   e lasciava vuoti i blocchi finché non arrivavano sullo schermo. Tolto,
   insieme al componente che lo guidava.
2. **Microinterazioni** — 200 ms sui colori, la freccia dei link si sposta di
   3 px, il filetto del menu si disegna in 350 ms, una foto dentro un link si
   avvicina del 3% in 900 ms.
3. **Cambio di tema** — una dissolvenza di 0,2 s (§ 4.3), il sole e la luna
   che ruotano.

`prefers-reduced-motion: reduce` azzera tutto. Niente parallax, niente
animazioni continue.

## 4.8 Accessibilità

Requisiti trattati come vincoli di build, non come rifiniture.

- **Focus** — `:focus-visible` con outline `accent` da 2px e offset di 3px, su
  ogni elemento interattivo, mai rimosso.
- **Skip link** — primo elemento del DOM, visibile al focus.
- **HTML semantico** — `header`/`main`/`footer`/`nav`/`article`/`figure`; un solo
  `h1` per pagina; gerarchia dei titoli senza salti.
- **Form** — ogni campo ha una `<label>` associata; i gruppi di radio e checkbox
  sono in `<fieldset>` con `<legend>`; gli errori usano `aria-invalid` e sono
  annunciati; il cambio di passo sposta il focus sul titolo del nuovo passo.
- **FAQ** — `<details>`/`<summary>` nativi: navigabili da tastiera e leggibili
  da Google senza una riga di JavaScript.
- **Immagini** — `alt` obbligatorio; il segnaposto espone `role="img"` con
  `aria-label`, così anche prima delle foto vere la pagina si legge.
- **Barra CTA mobile** — quando è nascosta gli elementi sono `tabIndex={-1}` e
  la barra è `aria-hidden`: non si finisce dentro un elemento invisibile
  tabulando.
- **Menu** — `Esc` chiude il menu "Eventi" e quello del telefono e riporta il
  focus sul pulsante che li ha aperti; il menu "Eventi" si apre solo con un
  clic o `Invio`, e si chiude uscendone col `Tab`. Con il menu del telefono
  aperto il resto della pagina è `inert`: il `Tab` non finisce su link coperti.
- **Testo sopra la foto** — axe non sa misurarlo, quindi è misurato a parte:
  il colore del testo contro il pixel più chiaro (99° percentile) della foto
  velata dietro ogni riga. Minimo 5:1 (l'occhiello al telefono, e al
  computer la fine della prima riga del titolo, che passa sopra il bicchiere),
  sottotitolo sopra 10:1, voci dell'intestazione sopra 8:1. Ogni frase del
  titolo va su una riga sua: il bilanciamento automatico spezzava a metà
  "Ai cocktail penso / io.".
- **Verifica** — axe con le regole WCAG 2.2 AA su 15 pagine, telefono e
  desktop, **in entrambi i temi**: zero violazioni (ottobre 2026, ripetuta
  dopo il restyling). Nessun testo sotto i 12 px, nessuno scorrimento
  orizzontale su 15 pagine a 360, 390, 820, 1024 e 1440 px.
  L'interruttore è provato con clic, `Invio`, `Spazio`, tocco, "riduci
  movimento" e menu del telefono aperto. La navigazione da tastiera dei menu è
  provata a mano; restano da provare con uno screen reader vero.

## 4.9 Performance

Scelte fatte guardando i Core Web Vitals, non i benchmark.

- **Bundle JS di primo caricamento: ~103 kB condivisi.** Nessuna libreria di
  animazione, nessun framework di componenti, nessun icon pack: le icone sono
  SVG inline (poche, riusate).
- **Font autoprodotti** con `font-display: swap` e `<link rel="preload">` sui
  due subset latin effettivamente usati above the fold.
- **Immagini** via `next/image` con AVIF e WebP, `sizes` dichiarato su ogni
  istanza, `priority` e `fetchPriority="high"` **solo** sull'immagine
  dell'apertura: con `priority` da solo il browser la scaricava a priorità
  bassa, dopo i font. La foto di sfondo della home pesa circa 14 KB in AVIF
  alla larghezza di un telefono.
- **Misure** (Lighthouse, telefono simulato, build di produzione in locale,
  mediana di tre misure alternate con la versione precedente, fine ottobre
  2026): home LCP 2,94 s (prima del restyling 2,95 s), landing dei matrimoni
  2,74 s (2,75 s), CLS 0, punteggio 95-96. Le sottrazioni del restyling non
  hanno cambiato il peso delle pagine.
- **Testo prima delle immagini.** Nelle pagine interne l'elemento più grande
  è il titolo, che compare con il primo disegno della pagina.
- **Client component solo dove servono**: header (menu e tema), modulo,
  editor admin. Tutto il resto è server component: zero JS spedito.
- **CSS unico** generato da Tailwind v4, senza runtime.
