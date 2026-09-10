# 06 — Marketing e funnel

## 6.1 Il funnel

```
Instagram / TikTok / Google / passaparola
        ↓
Landing (home o pagina evento)
        ↓
Desiderio: foto, atmosfera, "ci si vede la propria festa"
        ↓
Fiducia: prezzi chiari, come funziona, chi c'è dietro
        ↓
Configuratore  →  richiesta qualificata
        ↓
Telefonata / WhatsApp entro 24 h
        ↓
Preventivo → conferma → evento
        ↓
Foto dell'evento + richiesta recensione  →  torna in cima
```

Il sito ha un compito solo: **portare il visitatore alla telefonata avendo già
raccolto abbastanza da poterla fare bene.** Non chiude la vendita, e non deve
provarci: la vendita si chiude parlando.

Ecco perché il configuratore chiede data, zona, ospiti e formula. Non è
burocrazia: è la differenza fra una telefonata che comincia da "allora,
raccontami" e una che comincia da "per il 12 giugno ai Castelli con 60 persone
ti consiglio Prestige, siamo intorno a 1.900 €".

## 6.2 Instagram

Il canale più adatto a questo servizio: è visivo, è locale, ed è dove si trovano
i 25–45enni che organizzano feste.

**Profilo**
- Bio: cosa, dove, come. `Private cocktail bar · Roma e provincia` /
  `Portiamo un bar vero alla tua festa` / link al sito
- Link in bio direttamente alla home con UTM:
  `?utm_source=instagram&utm_medium=bio` — così il pannello attribuisce le
  richieste al canale
- Storie in evidenza: *Serate*, *Cocktail*, *Come funziona*, *Prezzi*

**Cosa pubblicare** (in ordine di resa reale)
1. **Reel di preparazione**: bancone che si monta, ghiaccio, garnish. Il
   "dietro le quinte" converte più del prodotto finito
2. **Il momento del versaggio** in slow motion, luce bassa
3. **Il bancone montato** in una location bella — è lo scatto che fa scrivere
   "quanto costa?"
4. **Prima/dopo dello spazio**: tavolo vuoto → bar completo
5. **Risposte a domande vere**: "quanti cocktail servono per 30 persone?"

**Cosa non pubblicare**: citazioni motivazionali, foto stock, caroselli di
testo. Nessuno prenota un bar per una frase in Helvetica.

**Ritmo sostenibile**: 2 reel a settimana, storie durante ogni evento. Meglio
poco e costante che una settimana intensa e un mese di silenzio.

## 6.3 TikTok

Stesso materiale, montaggio diverso: primi 2 secondi decisivi, testo grande a
schermo, audio in tendenza.

I formati che funzionano per questo mestiere:
- **"Quanto costa davvero un open bar per 30 persone"** con i numeri a schermo
- **"Tre errori nell'organizzare il bar di una festa"**
- **Il conto alla rovescia del montaggio** (2 ore in 15 secondi)
- **Il cocktail più richiesto della serata**, ripreso dall'alto

TikTok porta volume ma qualifica meno di Instagram. Serve soprattutto a
riempire la parte alta del funnel e a intercettare i diciottesimi, dove chi
decide è più giovane.

UTM da usare nel link in bio: `?utm_source=tiktok&utm_medium=bio`.

## 6.4 Google

**Organico**: vedi `docs/05-seo.md`. Tempi realistici: 3–6 mesi per la coda
lunga, 6–12 per le query di testa.

**Google Business Profile**: vedi `docs/08`. Per un'attività locale di servizio
è più importante del sito nei primi mesi.

**Google Ads**: non ora. Ha senso quando esistono (a) 5+ recensioni pubbliche,
(b) foto vere, (c) un tasso di conversione noto del sito. Prima, si paga per
mandare traffico su una pagina che non si sa se converte.

Quando sarà il momento, l'architettura è pronta: si crea una landing dedicata
alla campagna dal pannello, con `inNavigation` disattivato (non appare nel menu,
esiste solo per l'annuncio), e la si collega con
`?utm_source=google&utm_medium=cpc&utm_campaign=barman-domicilio`.

## 6.5 Partnership

Il canale a più alto ritorno per unità di sforzo. Un wedding planner attivo può
valere 6–10 eventi l'anno; una villa che affitta per feste, molti di più.

**Chi contattare, in ordine di rendimento atteso**
1. Ville e casali con affitto per eventi nel raggio di 40 km da Roma
2. Wedding planner (partono da lontano ma portano il valore più alto)
3. Catering che non hanno un servizio bar decente — sono i più ricettivi
4. Fotografi e DJ di eventi: si incontrano sul campo e ricambiano
5. Location per feste di 18 anni e lauree

**Come presentarsi**: non "cerco lavoro" ma "risolvo un problema che avete".
Il pitch che funziona è che arriviamo autonomi (bancone, frigo, ghiaccio,
bicchieri, bottiglie), non serviamo la loro cucina né il loro personale, e non
parliamo mai con il loro cliente scavalcandoli. Quest'ultimo punto è quello che
i planner temono di più, e va detto per primo.

La pagina `/collaboriamo` esiste per questo: la si manda dopo il primo contatto,
insieme a due foto.

## 6.6 Passaparola

Il canale più sottovalutato in questo mestiere. A ogni festa ci sono 30–90
persone che vedono il servizio dal vivo mentre sono di buonumore. Va reso
facile:

- **Una carta stampata** con nome e QR code del sito sul bancone. Costa 20 € e
  in una serata la fotografano in dieci
- **Un post-evento**: entro 48 ore, tre foto al cliente da poter condividere.
  Le condivide, e sono taggate
- **La richiesta di recensione al momento giusto**: il giorno dopo, non due
  settimane dopo
- **Uno sconto referral** (es. 50 € a chi porta un evento confermato). Da
  gestire a voce: non serve implementarlo nel sito

## 6.7 Misurare

Ciò che va guardato ogni mese, in ordine di importanza:

| Metrica | Dove | Perché conta |
| --- | --- | --- |
| Richieste ricevute | Pannello → Dashboard | Il numero che conta più di tutti |
| Tasso di conversione richiesta → evento | Dashboard (30 giorni) | Se è basso, il problema è il prezzo o la qualificazione |
| Provenienza delle richieste | Dettaglio richiesta → Provenienza | Dice dove investire il tempo il mese dopo |
| Visitatori e pagine di ingresso | Analytics (`docs/10`) | Dice cosa sta funzionando *prima* della richiesta |
| Valore stimato in pipeline | Dashboard | Utile per pianificare la stagione |

Il campo *Valore stimato* nel dettaglio richiesta va compilato: è l'unico
input manuale che fa funzionare la pipeline della dashboard.

## 6.8 I primi 90 giorni

**Mese 1 — Fondamenta**
Completare i segnaposto nel pannello; fare le prime foto (anche di un setup
allestito apposta in casa); aprire Google Business Profile; profili Instagram e
TikTok; contattare 10 location.

**Mese 2 — Prova sul campo**
Fare 2–3 eventi anche a margine ridotto per ottenere foto e recensioni vere;
pubblicare 8 reel; chiedere la recensione a ogni cliente il giorno dopo;
pubblicare il primo articolo nuovo del journal.

**Mese 3 — Trazione**
Pubblicare le recensioni sul sito; aggiungere una landing per il segmento che
ha risposto meglio; chiudere le prime 2 partnership; valutare Google Ads solo
se il tasso di conversione del sito è noto e decente.
