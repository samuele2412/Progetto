# Page Builder — come si usa

Il pannello `/admin` è anche un CMS: puoi creare pagine nuove e comporle a
blocchi, senza toccare il codice e senza rifare il deploy.

---

## 1. L'idea in tre righe

Una pagina è una **pila di sezioni**. Ogni sezione è un blocco predefinito
(Hero, Testo, Galleria, Pacchetti…) che segue già il design del sito: non puoi
scegliere un font o un colore, puoi scegliere *cosa* mostrare e *in che ordine*.

Tutto quello che fai resta **bozza** finché non premi **Pubblica**. Il sito
pubblico legge una copia separata, quindi una modifica a metà non può finire
online per sbaglio.

---

## 2. Creare una pagina

`/admin/pagine` → **Nuova pagina**.

Servono solo due cose:

| Campo | Cosa metterci |
| --- | --- |
| Titolo | Come la chiami tu. Diventa anche il titolo della pagina |
| Indirizzo | Si genera dal titolo. Corto, con le parole che cercherebbe un cliente |

Esempio per una landing SEO: titolo *“Cocktail bar per compleanni a Roma”*,
indirizzo `compleanni-roma`. La pagina sarà su `/it/compleanni-roma`.

L'indirizzo si può cambiare dopo, ma i link già condivisi smetterebbero di
funzionare: meglio pensarci subito.

---

## 3. Comporre la pagina

Nella scheda **Struttura**:

- **+ Aggiungi sezione** apre il catalogo, diviso per tipo di lavoro
  (testata, contenuto, dal catalogo, conversione).
- Ogni sezione è una riga con quattro azioni: **modifica**, **nascondi**,
  **duplica**, **elimina**.
- La maniglia a sinistra (⠿) **trascina** la sezione su o giù. Funziona col
  dito sul telefono e con le frecce da tastiera.

### Le sezioni disponibili

| Sezione | Quando serve |
| --- | --- |
| **Hero** | La testata: immagine grande, titolo, due bottoni |
| **Testo** | Un titolo e un testo, con immagine opzionale |
| **Immagine + testo** | Due colonne affiancate. Puoi scegliere da che lato sta l'immagine e la proporzione |
| **Galleria** | Griglia di foto, dalla Galleria del sito o scelte a mano |
| **Griglia cocktail** | Prende i cocktail **dal catalogo**: li aggiorni una volta e cambiano ovunque |
| **Pacchetti** | Stessa cosa per i pacchetti, con prezzo e bottone |
| **Recensioni** | Dal catalogo, oppure scritte a mano |
| **FAQ** | Dal catalogo per argomento, oppure scritte a mano |
| **Come funziona** | I passaggi numerati |
| **Chiamata all'azione** | Il blocco finale che porta al preventivo |
| **Testo formattato** | Testo lungo con titoli, elenchi, grassetto, link |
| **HTML personalizzato** | Casi particolari — vedi la nota sulla sicurezza più sotto |

### Nascondere invece di eliminare

**Nascondi** toglie la sezione dal sito ma la lascia nel pannello. È il modo
giusto per una promozione stagionale: la riattivi l'anno dopo invece di
riscriverla.

---

## 4. Le immagini

Non si incollano mai percorsi a mano. Dentro ogni campo immagine:

- **Scegli dalla libreria** apre la Media Library con la ricerca;
- **Carica una nuova immagine** la carica e la seleziona subito.

Il **testo alternativo** descrive la foto a chi non la vede e a Google. Se una
foto ce l'ha già in libreria, viene riusato automaticamente.

Le immagini vengono convertite in AVIF/WebP e ridimensionate da sole: una foto
da 500 KB arriva al visitatore come 45 KB circa, senza che tu faccia nulla.

---

## 5. Bozza, anteprima, pubblicazione

1. **Salva bozza** — salva senza toccare il sito. È quello che fa ogni pulsante
   di salvataggio nel builder.
2. **Anteprima** — apre la pagina com'è adesso, dentro l'header e il footer
   veri. La scheda *Anteprima* la mostra anche affiancata, nelle tre larghezze
   (telefono, tablet, desktop).
3. **Pubblica** — solo adesso la pagina cambia per i visitatori.

Una fascia gialla ti avvisa quando ci sono modifiche non ancora pubblicate.

### Versioni

Ogni pubblicazione salva una copia (le ultime 20). Da **Versioni pubblicate**
puoi **Ripristinare** una versione precedente: torna come **bozza**, così puoi
guardarla prima di rimetterla online. Il ripristino da solo non pubblica mai
nulla.

---

## 6. SEO

Nella scheda **SEO e indirizzo** di ogni pagina:

- **Titolo per Google** (~60 caratteri) e **Descrizione** (~155)
- **Titolo e descrizione per la condivisione** (Facebook, WhatsApp), se vuoi che
  siano diversi da quelli di Google
- **Immagine di condivisione**
- **Canonical personalizzato** — serve solo se la pagina duplica un'altra
- **Escludi dai motori di ricerca** — la pagina resta raggiungibile col link ma
  sparisce da Google e dalla sitemap

`/admin/seo` mostra tutte le pagine insieme, con quali campi mancano e quali
sono troppo lunghi.

---

## 7. Sezioni riutilizzabili

Dentro una sezione, **Salva come sezione riutilizzabile** la mette nel catalogo
di “Aggiungi sezione”. C'è una scelta che conta:

- **Copia indipendente** (predefinita): inserendola ne ottieni un duplicato.
  Modificarla su una pagina non tocca le altre.
- **Globale**: tutte le pagine che la usano mostrano la stessa cosa, e
  modificandola in un punto **cambiano tutte insieme**. Comodo per la chiamata
  all'azione finale, rischioso per il resto.

Le sezioni globali sono marcate con un'etichetta viola, sia nella lista sia
nell'editor.

---

## 8. Le pagine che esistevano già

Home, Pacchetti, Cocktail e le altre continuano a essere generate dal codice.
Compaiono comunque in `/admin/pagine` e puoi:

- modificarne la **SEO** subito, senza altro;
- ricostruirle col Page Builder, con **Affida questa pagina al Page Builder**.

Prima di affidarla devi aggiungerci almeno una sezione, e puoi sempre tornare
indietro: il codice originale non viene toccato, quindi **Torna alla versione
del codice** rimette esattamente la pagina di prima.

---

## 9. HTML personalizzato e sicurezza

Il blocco HTML accetta solo una lista chiusa di tag: paragrafi, titoli,
grassetto, corsivo, elenchi, link, citazioni e tabelle semplici.

Non è una “pulizia” del codice che incolli: l'HTML viene **letto** e ricostruito
da zero, e tutto ciò che non è nella lista semplicemente non esiste nel
risultato. `<script>`, `<iframe>`, gli attributi `onclick`, `style` e `class` e i
link `javascript:` non arrivano alla pagina in nessun caso. Il pannello ti dice
in anticipo quali tag verranno ignorati.

La conseguenza utile: incollare da Word o da una mail funziona, e il testo eredita
la tipografia del sito invece di portarsi dietro la sua.

---

## 10. Backup

Niente di nuovo da fare: `scripts/backup.sh` fa un dump completo del database,
quindi pagine, sezioni, versioni e sezioni salvate sono già dentro, insieme alle
immagini caricate.

```bash
./scripts/backup.sh            # crea backups/cordiale-<data>.tar.gz
./scripts/restore.sh backups/cordiale-2026-09-11.tar.gz
```

---

## 11. Limiti che restano

- **Una pagina nuova non può avere lo stesso indirizzo di una pagina del sito.**
  `pacchetti`, `cocktail`, `admin`, `anteprima` e gli altri sono riservati: il
  pannello te lo dice invece di creare una pagina irraggiungibile.
- **Il Page Builder non modifica header e footer.** Quelli restano in
  `/admin/contenuti`.
- **Le lingue sono due.** Ogni campo ha italiano e inglese; l'inglese vuoto
  ricade sull'italiano, quindi puoi pubblicare in italiano e tradurre dopo.
- **Non c'è un editor visuale in-place.** Modifichi in un pannello e guardi il
  risultato in anteprima. È una scelta: un editor che si modifica “sulla pagina”
  è anche un editor che può rompere la pagina.
