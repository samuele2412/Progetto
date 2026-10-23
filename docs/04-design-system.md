# 04 — Design system

> **Ottobre 2026: carta e inchiostro.** Il sito è passato da una palette scura
> a una chiara. La palette scura era pensata per incorniciare le fotografie
> degli eventi, che non ci sono ancora; dopo la riscrittura dei testi
> ([`13-brand-voice.md`](13-brand-voice.md)) il protagonista è Samuele, con le
> sue parole, e la tipografia porta il design. I token vivono in
> `src/app/globals.css` sotto `@theme`.

## 4.1 Principi

1. **La tipografia porta il design, le foto lo accompagnano.** Titoli in
   Fraunces su carta avorio, molto spazio, poche immagini incorniciate. Una
   pagina deve sembrare finita anche senza fotografie.
2. **Costoso non vuol dire dorato.** Il premium si ottiene con spazio bianco,
   gerarchia e contrasto, non con oro, ombre e decorazioni.
3. **Un solo segnale per l'azione.** L'unica forma piena e scura della pagina è
   il pulsante principale: non c'è mai il dubbio su quale conta.
4. **Mobile prima.** Ogni componente è progettato a 390 px e poi allargato.
5. **L'animazione conferma, non intrattiene.** Niente si anima nella prima
   schermata: il titolo è lì subito.

## 4.2 Colore

I nomi sono ruoli, non tonalità: `ink-3` è "testo secondario" ovunque. Tutti i
colori di testo superano AA (4,5:1) sia su `paper` sia su `paper-2`.

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
| `brass-light` | `#d8b87d` | Accenti sopra una foto scurita (solo page builder) | — |
| `danger` | `#a23b2a` | Solo errori | 6 : 1 |

**Perché l'ottone resta.** È la continuità con l'identità di prima: stesso
metallo, brunito perché su carta deve reggere come testo. Il verde di WhatsApp
è sparito dai pulsanti: WhatsApp è un'azione secondaria, contornata come le
altre e riconoscibile dal suo simbolo.

**Il pannello admin** resta con la sua palette da strumento (`.admin-shell`).

## 4.3 Tipografia

Due famiglie, **autoprodotte** (`public/fonts/`, subset latin e latin-ext).
Nessuna chiamata a Google Fonts a runtime.

| Ruolo | Font | Perché |
| --- | --- | --- |
| Display | **Fraunces** (variabile 300–700), peso 400 | Serif contemporaneo con carattere: regge i titoli grandi, che sono l'immagine principale del sito |
| Testo | **Inter** (variabile 300–700) | Leggibile a corpo piccolo, neutro: lascia parlare il display |

| Classe | Dimensione | Uso |
| --- | --- | --- |
| `.display-1` | `clamp(2.6rem, 6.4vw, 4.75rem)`, interlinea 1,04 | H1 |
| `.display-2` | `clamp(1.9rem, 4.2vw, 3rem)` | Titoli di sezione |
| `.display-3` | `clamp(1.35rem, 2.4vw, 1.75rem)` | Titoli di blocco |
| `.lede` | `clamp(1.0625rem, 1.5vw, 1.25rem)` | Sottotitoli |
| `.copy` | `1.0625rem`, interlinea 1,7 | Testo corrente nelle sezioni |
| `.eyebrow` | `0.72rem`, maiuscolo, tracking 0,18em, `accent` | Etichette sopra i titoli |

`text-wrap: balance` sui titoli e `pretty` sui paragrafi. Righe di testo entro
circa 65 caratteri (`max-w-xl` / `max-w-2xl`).

## 4.4 Componenti

Classi CSS in `@layer components`, non componenti React.

- **Pulsanti** — `.btn` (pillola, altezza minima 48 px).
  - `.btn-primary`: inchiostro pieno su testo carta. Uno per schermata.
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
- **Campi e chip** — `.field`, `.chip`: fondo `field`, bordo al 24%,
  `font-size: 1rem` (sotto i 16 px iOS zooma), altezza minima 48 px. Chip
  selezionata: bordo inchiostro e fondo `accent-soft`.
- **Passaggi** — `StepList`: lista aperta con un filetto sopra ogni passo e il
  numero in ottone, niente riquadri.
- **Immagini mancanti** — `Media` mostra un segnaposto tratteggiato; dove una
  foto è facoltativa (copertina di una pagina evento o di un articolo) la
  pagina usa `mediaExists()` e la omette del tutto.

## 4.5 Spaziature e griglia

- Contenitore: `max-width: 78rem`, margine laterale 1,25rem su mobile e 2rem
  da 768 px (mai sotto i 16 px).
- Sezione: `clamp(3rem, 9vw, 7.5rem)` in verticale.
- Griglia a 12 colonne da `lg` per le composizioni testo + immagine; le pagine
  interne allineano tutto al bordo sinistro del contenitore, sotto il titolo.
- Testo e immagini si alternano lungo la pagina: due fotografie non stanno mai
  una dopo l'altra sul telefono.

## 4.6 Movimento

1. **`.reveal`** — opacità e 12 px di traslazione, 600 ms, attivata da un solo
   `IntersectionObserver` (`src/components/Reveal.tsx`). Solo sotto la piega.
2. **Prima schermata ferma.** Il titolo, il sottotitolo e il pulsante
   dell'apertura non si animano: sono l'elemento più grande della pagina su un
   telefono e devono comparire subito.
3. **Microinterazioni** — 200 ms sui colori, la freccia dei link si sposta di
   3 px.

`prefers-reduced-motion: reduce` azzera tutto. Niente parallax, niente
animazioni continue.

## 4.7 Accessibilità

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
- **Verifica** — axe con le regole WCAG 2.2 AA su 15 pagine, telefono e
  desktop: zero violazioni (ottobre 2026). La navigazione da tastiera dei menu
  è provata a mano; restano da provare con uno screen reader vero.

## 4.8 Performance

Scelte fatte guardando i Core Web Vitals, non i benchmark.

- **Bundle JS di primo caricamento: ~103 kB condivisi.** Nessuna libreria di
  animazione, nessun framework di componenti, nessun icon pack: le icone sono
  SVG inline (poche, riusate).
- **Font autoprodotti** con `font-display: swap` e `<link rel="preload">` sui
  due subset latin effettivamente usati above the fold.
- **Immagini** via `next/image` con AVIF e WebP, `sizes` dichiarato su ogni
  istanza, `priority` e `fetchPriority="high"` **solo** sull'immagine
  dell'apertura: con `priority` da solo il browser la scaricava a priorità
  bassa, dopo i font.
- **Testo prima delle immagini.** Nelle pagine interne l'elemento più grande
  è il titolo, che compare con il primo disegno della pagina.
- **Client component solo dove servono**: header (menu), configuratore, editor
  admin, reveal. Tutto il resto è server component: zero JS spedito.
- **CSS unico** generato da Tailwind v4, senza runtime.
