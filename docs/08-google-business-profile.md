# 08 — Google Business Profile

## 8.1 Perché conta più del sito, all'inizio

Per un'attività di servizio locale, la scheda Google è spesso il primo (e a
volte l'unico) risultato che il cliente guarda. Compare nel riquadro delle
mappe sopra i risultati organici, mostra le recensioni, e permette di chiamare
con un tocco. Nei primi sei mesi porta più contatti del posizionamento
organico.

## 8.2 La categoria giusta: attività di servizio

Google distingue le attività con una vetrina fisica da quelle che si spostano
dal cliente (*service-area business*). **Questa è chiaramente la seconda.**

Le conseguenze pratiche, e sono importanti:

- **L'indirizzo non viene mostrato pubblicamente.** Va comunque fornito a Google
  in fase di verifica (serve un indirizzo reale), ma si imposta come nascosto e
  si dichiarano invece le zone servite.
- **Non si può usare l'indirizzo di un coworking, di una casella postale o di
  un indirizzo altrui.** È il motivo più comune di sospensione delle schede.
- **Le zone servite** si dichiarano per comune o per area: Roma, e i comuni
  della città metropolitana in cui si lavora davvero. Google consiglia di non
  superare un raggio di circa 2 ore di guida; per questo servizio, Roma +
  provincia è più che sufficiente.

⚠️ **Le regole di Google cambiano.** Prima di creare la scheda, leggere le
linee guida aggiornate sulla rappresentazione delle attività. Quanto sopra è
corretto al momento della scrittura, ma va verificato.

## 8.3 Impostazione

1. **Categoria principale**: *Servizio di catering* oppure *Bar* — la scelta
   dipende da come si vuole essere trovati. Per questo servizio, "Servizio di
   catering" descrive meglio l'attività e ha meno concorrenza da locali fisici.
2. **Categorie secondarie**: *Servizio per feste*, *Organizzazione di eventi*,
   *Bar per eventi* (le opzioni disponibili variano; scegliere le più aderenti).
3. **Nome**: esattamente il nome del brand. **Non** "Cordiale — Barman a
   domicilio Roma economico": lo stuffing nel nome è la violazione più
   sanzionata e può costare la sospensione.
4. **Zone servite**: Roma + i comuni in cui si lavora.
5. **Telefono**: lo stesso numero del sito. Deve rispondere qualcuno.
6. **Sito**: la home, con UTM —
   `?utm_source=google&utm_medium=organic&utm_campaign=gbp`
7. **Orari**: quelli in cui si risponde al telefono, non quelli degli eventi.
8. **Attributi**: identifica un'attività a conduzione familiare / a gestione
   diretta, se applicabile.
9. **Descrizione**: 700+ caratteri che dicono cosa, dove e per chi. Riutilizzare
   il testo di *Chi siamo*, non la meta description.

## 8.4 Verifica

Google richiede una verifica (cartolina, telefono o video). Per le attività di
servizio è sempre più spesso **video**: si riprende l'attrezzatura, il materiale
brandizzato, i documenti. Vale la pena prepararla: bancone montato, cassa degli
strumenti, eventuale visura camerale a portata di mano.

Se la verifica fallisce, non riprovare a raffica: si ottiene una sospensione.
Meglio aprire un ticket con il supporto.

## 8.5 Mantenimento

Le tre cose che spostano davvero il posizionamento locale:

1. **Recensioni.** È il fattore singolo più pesante. Chiedere sempre, il giorno
   dopo l'evento, con un link diretto. **Rispondere a tutte**, comprese quelle
   negative, in modo asciutto e non difensivo.
2. **Foto, regolarmente.** Le schede con foto recenti ricevono più
   visualizzazioni. Caricare 2–3 foto dopo ogni evento (con il consenso del
   cliente per le persone riconoscibili — vedi `docs/09`).
3. **Post.** Aggiornamenti brevi e stagionali ("disponibilità per giugno",
   "nuovo cocktail dell'estate"). Costano cinque minuti.

Da evitare in modo assoluto: recensioni comprate o fra amici che non sono stati
clienti. Google le rileva sempre più spesso, e la penalizzazione colpisce la
scheda, non le singole recensioni.

## 8.6 Coerenza NAP

**N**ome, **A**ddress (qui: zona servita), **P**hone devono essere identici
ovunque compaiano: sito, Google Business Profile, Instagram, portali di
settore, schede sulle directory locali. Le incoerenze diluiscono i segnali
locali.

Sul sito i tre valori vivono nel pannello (*Testi e contatti → Brand* e
*Contatti*) e finiscono automaticamente nel JSON-LD `LocalBusiness`: cambiarli
in un posto solo li aggiorna ovunque.
