# Immagini

Sostituire i file di questa cartella è l'unica operazione necessaria per
passare dai segnaposto alle foto vere: **il codice non va toccato**. Finché un
file non esiste, il sito mostra un segnaposto grafico coerente con il design
(non un'icona di immagine rotta), quindi si può andare online per gradi.

Percorsi attesi — corrispondono ai valori predefiniti in `src/content/`:

| Percorso                                   | Cosa serve                                  | Formato consigliato |
| ------------------------------------------ | ------------------------------------------- | ------------------- |
| `hero/hero-main.jpg`                       | Immagine principale della home              | 2400 × 1600, orizzontale |
| `bartender/bartender-portrait.jpg`         | Ritratto del titolare dietro al bancone     | 1600 × 2000, verticale |
| `packages/aperitivo.jpg` …                 | Una per pacchetto (slug del pacchetto)      | 1600 × 1200 |
| `cocktails/<slug>.jpg`                     | Una per cocktail (slug del cocktail)        | 1200 × 1500, verticale |
| `events/<slug>.jpg`                        | Una per tipo di evento                      | 1600 × 1280 |
| `landing/<chiave>.jpg`                     | Hero delle pagine SEO                       | 2400 × 1400 |
| `journal/<slug>.jpg`                       | Copertine degli articoli                    | 1600 × 900 |
| `gallery/…`                                | Galleria (caricabile anche dal pannello)    | lato lungo ≥ 1600 |
| `og/og-default.jpg`                        | Anteprima social predefinita                | 1200 × 630 esatti |

## Consigli pratici

- **JPEG o WebP**, qualità 80. Next.js li riconverte in AVIF/WebP e li
  ridimensiona da solo: non serve preparare più versioni.
- Tenere ogni file **sotto 500 KB** prima del caricamento.
- L'immagine hero è l'unica caricata con priorità: è quella che determina il
  Largest Contentful Paint, quindi vale la pena comprimerla bene.
- Le foto caricate dal pannello finiscono in `/uploads/...`, non qui: quella
  cartella è un volume Docker e viene inclusa nei backup.
- Evitare stock photo riconoscibili. Meglio tre foto vere fatte con un
  telefono recente che venti immagini palesemente comprate.
