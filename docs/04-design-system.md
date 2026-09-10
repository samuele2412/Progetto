# 04 — Design system

## 4.1 Principi

Quattro regole che spiegano quasi ogni scelta a valle.

1. **La fotografia è il contenuto, il resto è cornice.** Il cliente compra
   un'atmosfera. Il layout esiste per far respirare le immagini, non per
   competere con loro. Ne consegue: palette scura, tipografia sobria, zero
   decorazioni gratuite.
2. **Costoso non vuol dire dorato.** Il "luxury finto" (oro lucido, script
   calligrafici, marmo) segnala esattamente il contrario del premium. Il vero
   premium si ottiene con **spazio bianco, gerarchia e contrasto**.
3. **Mobile prima, non mobile anche.** La maggior parte del traffico arriverà da
   Instagram e TikTok. Ogni componente è progettato a 390 px e poi allargato.
4. **L'animazione conferma, non intrattiene.** Un reveal in dissolvenza dice
   "questo sito è curato". Un parallax aggressivo dice "questo sito è una demo".

## 4.2 Colore

Palette scura, calda, con un solo accento. I token vivono in
`src/app/globals.css` sotto `@theme`.

| Token | Valore | Uso |
| --- | --- | --- |
| `ink-950` | `#0a0908` | Fondo pagina. Nero caldo, non `#000`: il nero puro su schermo OLED "buca" e stanca |
| `ink-900` | `#100e0c` | Sezioni alternate, card |
| `ink-850` / `ink-800` | `#16130f` / `#1c1814` | Campi form, stati hover |
| `ink-700` / `ink-600` | `#262019` / `#342c23` | Bordi marcati, barre di stato |
| `bone-50` | `#faf7f2` | Titoli |
| `bone-100` | `#f2ece3` | Testo corrente |
| `bone-400` | `#b3a999` | Testo secondario, lede |
| `bone-500` | `#8f8577` | Didascalie, note |
| `brass-500` | `#c9a46a` | **Accento**: CTA primaria, eyebrow, bullet |
| `brass-400` / `brass-300` | `#d8b87d` / `#e9d3a6` | Hover, prezzi, link nel testo |
| `bitter-500` | `#c05540` | Solo errori. Mai decorativo |
| `olive-500` | `#7d8b6a` | Riservato, per grafici futuri |

**Perché l'ottone e non l'oro.** `#c9a46a` è desaturato: legge come metallo
usato, non come cromatura. È anche il colore del rum invecchiato e del vermouth,
quindi coerente con il prodotto. Un solo accento in tutto il sito significa che
quando appare, il visitatore sa che è qualcosa su cui si clicca.

**Contrasto (WCAG 2.1).** Le combinazioni usate sono verificate:
`bone-100` su `ink-950` ≈ 15:1 (AAA); `bone-400` su `ink-950` ≈ 8,4:1 (AAA);
`brass-500` su `ink-950` ≈ 7,6:1 (AAA); `ink-950` su `brass-500` (CTA primaria)
≈ 7,6:1. Il testo più chiaro usato per note (`bone-500`, ≈ 5,4:1) resta sopra
il minimo AA per il testo normale.

**Il pannello admin è chiaro, per scelta.** Leggere quaranta righe di lead in
una palette editoriale scura è faticoso. Il pannello è uno strumento, non una
vetrina: fondo `#f6f5f3`, testo `#1c1917`, isolato dalla classe `.admin-shell`.

## 4.3 Tipografia

Due famiglie, **autoprodotte** (`public/fonts/`, subset latin e latin-ext).
Nessuna chiamata a Google Fonts a runtime: un round trip in meno, un CDN in meno
da dichiarare nella cookie policy, e una build che funziona anche offline.

| Ruolo | Font | Perché |
| --- | --- | --- |
| Display | **Fraunces** (variabile 300–700) | Serif contemporaneo con un'inflessione un po' "insegna": ha carattere senza essere decorativo. Regge dimensioni molto grandi, che è dove vive nell'hero |
| Testo | **Inter** (variabile 300–700) | Il riferimento per la leggibilità a corpo piccolo su schermo. Neutro: lascia parlare il display |

Scala tipografica, tutta fluida con `clamp()` — nessun breakpoint da gestire a
mano:

| Classe | Dimensione | Uso |
| --- | --- | --- |
| `.display-1` | `clamp(2.5rem, 7.5vw, 5rem)` | H1 dell'hero |
| `.display-2` | `clamp(2rem, 4.6vw, 3.25rem)` | Titoli di sezione |
| `.display-3` | `clamp(1.5rem, 2.8vw, 2rem)` | Titoli di card |
| `.lede` | `clamp(1.05rem, 1.6vw, 1.25rem)` | Sottotitoli |
| `.eyebrow` | `0.75rem`, tracking `0.16em`, maiuscolo | Etichette sopra i titoli |
| corpo | `1rem` / `1.0625rem`, interlinea 1.6–1.75 | Testo corrente |

`text-wrap: balance` sui titoli e `pretty` sui paragrafi: risolve gratis le
righe orfane, che su un sito fotografico si notano molto.

## 4.4 Componenti

Tutti definiti come classi CSS in `@layer components`, non come componenti
React: il markup resta leggibile e i pesi del bundle non crescono.

**Bottoni** — `.btn` + variante. Raggio pieno (`999px`), altezza minima 3rem
(48 px: il target minimo raccomandato per il pollice), transizione di 250 ms.
- `.btn-primary` — ottone pieno su testo scuro. Una sola per schermata.
- `.btn-ghost` — bordo sottile, trasparente. Per le azioni secondarie.
- `.btn-whatsapp` — verde `#1f6f4e`, desaturato rispetto al verde ufficiale
  perché il verde WhatsApp su fondo scuro è aggressivo.

**Card** — `.card` (fondo `ink-900`, bordo capello, raggio 1rem). Con
`.card-hover` si aggiunge un sollevamento di 3 px e il bordo vira all'ottone.
Nessuna ombra pesante: su fondo scuro le ombre non si vedono, il bordo sì.

**Campi** — `.field`. Due dettagli non negoziabili: **`font-size: 1rem`**
(sotto i 16 px iOS Safari zooma da solo appena si tocca un campo, e la
sensazione è quella di un sito rotto) e **altezza minima 3rem**.

**Chip** — `.chip`, pilotata dall'input `peer` fratello. È il pattern usato in
tutto il configuratore: un radio/checkbox nascosto e un'etichetta cliccabile
grande. Su mobile è molto più veloce di un `<select>`, e resta accessibile
perché sotto c'è un input vero.

**Bordi** — un solo capello, `--hairline` (`bone-100` al 12%), e la variante al
22% per gli elementi interattivi. Su fondo scuro un bordo da 1px al 12% legge
come una linea disegnata, non come un contorno.

## 4.5 Spaziature e griglia

- Contenitore: `max-width: 78rem`, padding laterale 1,25rem su mobile e 2rem da
  768 px. **Il gutter minimo non scende mai sotto 16px.**
- Sezione verticale: `clamp(3.5rem, 9vw, 7.5rem)`. È la variabile che più
  determina la percezione di "premium": lo spazio costa e si vede.
- Griglie: 1 colonna su mobile → 2 su tablet → 3-4 su desktop. Le griglie di
  card usano `gap-px` su fondo `--hairline`, così le separazioni sono linee
  perfette da 1px invece di bordi doppi.

## 4.6 Movimento

Tutto passa da due meccanismi, entrambi economici.

1. **`.reveal`** — opacità 0 → 1 e traslazione di 18px, attivata da un unico
   `IntersectionObserver` (`src/components/Reveal.tsx`) che aggiunge
   `.is-visible`. Un solo observer per pagina, non un wrapper per elemento. Gli
   elementi già visibili al caricamento vengono rivelati subito, quindi l'hero
   non lampeggia mai vuoto.
2. **`.fade-in-up`** — animazione CSS immediata, solo per l'hero e i titoli di
   pagina, con `reveal-delay-1…4` per lo sfalsamento.

Easing unico: `cubic-bezier(0.22, 1, 0.36, 1)` — parte deciso e si posa. Durate
fra 250 ms (interazioni) e 700 ms (reveal).

**`prefers-reduced-motion: reduce` azzera tutto**, e i `.reveal` diventano
visibili immediatamente: nessun contenuto è raggiungibile solo attraverso
un'animazione.

Niente parallax sull'hero: su mobile costa jank e non aggiunge nulla.

## 4.7 Accessibilità

Requisiti trattati come vincoli di build, non come rifiniture.

- **Focus** — `:focus-visible` con outline ottone da 2px e offset di 3px, su
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

## 4.8 Performance

Scelte fatte guardando i Core Web Vitals, non i benchmark.

- **Bundle JS di primo caricamento: ~103 kB condivisi.** Nessuna libreria di
  animazione, nessun framework di componenti, nessun icon pack: le icone sono
  SVG inline (poche, riusate).
- **Font autoprodotti** con `font-display: swap` e `<link rel="preload">` sui
  due subset latin effettivamente usati above the fold.
- **Immagini** via `next/image` con AVIF e WebP, `sizes` dichiarato su ogni
  istanza, `priority` **solo** sull'immagine dell'hero (è l'LCP).
- **Client component solo dove servono**: header (menu), configuratore, editor
  admin, reveal. Tutto il resto è server component: zero JS spedito.
- **CSS unico** generato da Tailwind v4, senza runtime.
