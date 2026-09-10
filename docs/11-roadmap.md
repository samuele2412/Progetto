# 11 — Roadmap

## Fatto (versione 1.0)

Sito pubblico bilingue, configuratore di richiesta, pannello di
amministrazione, notifiche email, SEO tecnica completa, impianto GDPR,
deploy Docker con backup e ripristino.

## Prossimi passi, in ordine di ritorno

### Subito dopo il lancio — nessun codice

Sono le cose che valgono di più e non richiedono sviluppo.

1. **Foto vere.** Il sito è costruito attorno alla fotografia; i segnaposto
   sono una cortesia, non uno stato accettabile. Un pomeriggio con un fotografo
   e un bancone allestito basta per home, pacchetti e social.
2. **Completare i segnaposto** — li elenca la dashboard del pannello.
3. **Testi legali verificati** da un professionista (`docs/09`).
4. **Google Business Profile** (`docs/08`).
5. **Prime cinque recensioni vere.** La sezione recensioni resta
   deliberatamente vuota finché non esistono: è una scelta di prodotto, non una
   funzionalità mancante.

### Fase 2 — quando gli eventi diventano regolari

| Intervento | Perché | Sforzo |
| --- | --- | --- |
| **Calendario delle date bloccate** | Oggi si verifica a mano ogni data. Una tabella `blocked_dates` e un avviso nel configuratore ("questa data non è disponibile, ma dimmi comunque") eviterebbero telefonate inutili | Piccolo |
| **Export CSV delle richieste** | Per il commercialista e per analisi fuori dal pannello | Molto piccolo |
| **Notifica su Telegram** | L'email si legge dopo ore; un messaggio istantaneo cambia il tempo di risposta, che è il fattore competitivo più forte in questo mestiere | Piccolo — `sendMail` è già isolato dietro un'interfaccia |
| **Modello di preventivo PDF** | Oggi il preventivo si scrive a mano ogni volta | Medio |

### Fase 3 — quando il bartender non è più uno solo

| Intervento | Perché | Sforzo |
| --- | --- | --- |
| **Tabella staff e assegnazione** | Sapere chi è a quale evento | Medio |
| **Disponibilità per bartender** | Evitare doppie prenotazioni | Medio |
| **Ruoli nel pannello** | Un collaboratore non deve poter cambiare i prezzi | Piccolo — `admins` esiste già |

### Fase 4 — quando il volume lo giustifica

| Intervento | Perché | Sforzo |
| --- | --- | --- |
| **Preventivo automatico** | Ospiti + formula + extra → cifra immediata via email. La logica di prezzo è già dati, non codice | Medio |
| **Acconto online** (Stripe) | Riduce le disdette. Il flusso richiesta → preventivo → conferma è già quello giusto | Medio |
| **Anagrafica clienti** | Riconoscere chi ha già prenotato; è l'inizio di un CRM vero | Medio |
| **Rate limiter condiviso** | Solo se un giorno l'app girasse su più repliche. Oggi sarebbe complessità gratuita | Piccolo |

## Cosa non fare

Per quanto sembrino ovvi, questi interventi peggiorerebbero il prodotto.

- **Prenotazione automatica confermata.** Il valore del servizio sta nella
  conversazione. Un calendario che conferma da solo produce eventi che non si
  possono servire.
- **Chatbot.** Il cliente vuole parlare con la persona che starà dietro al
  bancone. Un bot comunica esattamente il contrario del posizionamento.
- **Newsletter.** Nessuno organizza feste abbastanza spesso da giustificarla.
- **Un blog "perché ci vuole il blog".** Il journal esiste per intercettare
  ricerche specifiche ad alta intenzione. Tre articoli utili valgono più di
  trenta riempitivi, e ogni articolo in più è manutenzione.
- **Decine di landing per quartiere.** Vedi `docs/05` § 5.3.
- **Un secondo tema o una modalità chiara per il sito pubblico.** La scelta di
  una sola palette scura è parte dell'identità.
