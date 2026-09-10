/**
 * Seed editorial content: FAQs, the hand-written SEO landing pages and the
 * journal. Bodies use a tiny markdown subset rendered by `src/lib/markdown.ts`
 * (`## heading`, blank-line-separated paragraphs, `- bullets`).
 *
 * Every landing page here answers a different question for a different reader.
 * Resist the temptation to clone them: near-duplicate pages are the fastest way
 * to make Google ignore all of them.
 */

export const faqSeeds = [
  {
    topic: 'general',
    position: 1,
    question: {
      it: 'Le bottiglie le comprate voi?',
      en: 'Do you buy the bottles?',
    },
    answer: {
      it: 'Sì, ed è il modo in cui lavoriamo di norma. Sulla base del numero di ospiti e della carta scelta calcoliamo le quantità, facciamo la spesa e portiamo tutto sul posto — alcolici, mixer, succhi, frutta, ghiaccio. È già compreso nel prezzo a ospite. Se preferisci fornire tu le bottiglie possiamo farlo, ma è l’eccezione: il conto quasi sempre sale e il rischio di sbagliare le quantità è tutto tuo.',
      en: 'Yes, and that is how we normally work. Based on the guest count and the list you choose, we work out the quantities, do the shopping and bring everything with us — spirits, mixers, juices, fruit, ice. It is already in the per-guest price. If you would rather supply the bottles yourself we can do that, but it is the exception: it usually costs more and getting the quantities wrong is then on you.',
    },
  },
  {
    topic: 'general',
    position: 2,
    question: { it: 'Quanto costa, in pratica?', en: 'What does it actually cost?' },
    answer: {
      it: 'Le formule partono da 39 € a ospite per gruppi piccoli e scendono man mano che gli invitati aumentano. Una festa da 30 persone si colloca di solito fra 1.000 e 1.400 €, tutto compreso: bartender, bancone, attrezzatura, bottiglie, ghiaccio, bicchieri, allestimento e smontaggio. Il prezzo viene concordato prima e non cambia a fine serata.',
      en: 'Formats start at €39 per guest for small groups and come down as numbers rise. A party of 30 usually lands between €1,000 and €1,400 all in: bartender, counter, equipment, bottles, ice, glassware, set-up and clear-down. The price is agreed beforehand and does not change at the end of the night.',
    },
  },
  {
    topic: 'general',
    position: 3,
    question: { it: 'Che spazio vi serve?', en: 'How much space do you need?' },
    answer: {
      it: 'Circa due metri lineari e una presa di corrente. Il bancone è modulare: entra in un soggiorno, su un terrazzo o a bordo piscina. Se la location è complicata (scale strette, giardino senza corrente, ascensore piccolo) ci organizziamo, basta dirlo prima — per gli eventi grandi facciamo un sopralluogo.',
      en: 'About two metres of floor space and a power socket. The counter is modular: it fits a living room, a terrace or a poolside. If the venue is awkward — narrow stairs, a garden with no power, a small lift — we work around it, as long as we know in advance. For larger events we do a site visit.',
    },
  },
  {
    topic: 'general',
    position: 4,
    question: { it: 'Quanto prima devo prenotare?', en: 'How far in advance should I book?' },
    answer: {
      it: 'Per i weekend da maggio a settembre, idealmente quattro-sei settimane prima. Fuori stagione bastano spesso dieci giorni. Detto questo, capita di riuscire a coprire richieste last minute: chiedi comunque, la data la verifichiamo personalmente e ti rispondiamo in fretta.',
      en: 'For weekends between May and September, ideally four to six weeks ahead. Off season, ten days is often enough. That said, last-minute dates do sometimes work out: ask anyway — we check the date personally and reply quickly.',
    },
  },
  {
    topic: 'general',
    position: 5,
    question: { it: 'Che succede se avanzano bottiglie?', en: 'What happens to unopened bottles?' },
    answer: {
      it: 'Le bottiglie integre restano a te: le lasciamo lì, sono già nel prezzo. Quelle aperte le smaltiamo noi insieme al resto. Non c’è nessun conteggio a consumo a fine serata.',
      en: 'Unopened bottles stay with you — they are already paid for, so we leave them. Opened ones we take away with the rest. There is no consumption tally at the end of the night.',
    },
  },
  {
    topic: 'general',
    position: 6,
    question: { it: 'Lavorate anche fuori Roma?', en: 'Do you work outside Rome?' },
    answer: {
      it: 'Roma e provincia sono la zona di casa e non hanno costi aggiuntivi rilevanti. Fuori GRA e fuori provincia aggiungiamo una trasferta calcolata sulla distanza reale. Fuori regione valutiamo caso per caso, di solito solo per eventi di dimensione adeguata.',
      en: 'Rome and its province are home turf, with no meaningful travel cost. Beyond the ring road or outside the province we add a travel fee based on actual distance. Outside the region we look at it case by case, usually only for events of a suitable size.',
    },
  },
  {
    topic: 'general',
    position: 7,
    question: { it: 'Come si paga?', en: 'How is payment handled?' },
    answer: {
      it: 'Alla conferma si versa un acconto, il saldo si regola alla fine dell’evento. Non chiediamo nulla per ricevere un preventivo e non si paga niente online da questo sito.',
      en: 'A deposit on confirmation, the balance settled at the end of the event. Nothing is charged for a quote, and nothing is paid online through this site.',
    },
  },
  {
    topic: 'general',
    position: 8,
    question: { it: 'Servite alcolici ai minorenni?', en: 'Do you serve alcohol to minors?' },
    answer: {
      it: 'No. È vietato dalla legge e per noi non è negoziabile, nemmeno con il consenso dei genitori. Ai diciottesimi lavoriamo con una carta analcolica curata quanto quella alcolica e teniamo il servizio sotto controllo: è esattamente il motivo per cui molti genitori ci chiamano.',
      en: 'No. It is against the law and not negotiable for us, parental consent included. At 18th birthdays we run an alcohol-free list made with the same care as the alcoholic one and keep service under control — which is precisely why many parents call us.',
    },
  },
  {
    topic: 'pricing',
    position: 20,
    question: { it: 'Perché non c’è un prezzo fisso a ore?', en: 'Why isn’t there a fixed hourly rate?' },
    answer: {
      it: 'Perché non stai comprando ore, stai comprando il bar della tua festa. Quello che determina il costo reale è quante persone bevono, cosa bevono e quanto è complicata la location. Un servizio di tre ore per settanta persone costa più di uno di cinque ore per quindici: contare le ore ti darebbe il prezzo sbagliato.',
      en: 'Because you are not buying hours, you are buying the bar for your party. What actually drives the cost is how many people drink, what they drink and how awkward the venue is. Three hours for seventy people costs more than five for fifteen — counting hours would give you the wrong number.',
    },
  },
  {
    topic: 'pricing',
    position: 21,
    question: { it: 'Il prezzo può cambiare dopo il preventivo?', en: 'Can the price change after the quote?' },
    answer: {
      it: 'Solo se cambi tu qualcosa: più ospiti, più ore, una carta diversa. In quel caso lo ridefiniamo insieme prima dell’evento. Non esistono sorprese a fine serata.',
      en: 'Only if you change something: more guests, more hours, a different list. In that case we agree the new figure before the event. There are no surprises at the end of the night.',
    },
  },
  {
    topic: 'wedding',
    position: 30,
    question: { it: 'Vi coordinate con il catering e con la wedding planner?', en: 'Do you coordinate with the caterer and the wedding planner?' },
    answer: {
      it: 'Sempre. Prima del matrimonio concordiamo la timeline con chi gestisce la giornata: quando apre il bar, come si incastra con il taglio della torta, dove sta il bancone rispetto al servizio di sala. Arriviamo autonomi, non abbiamo bisogno della loro cucina né del loro personale.',
      en: 'Always. Before the wedding we agree the timeline with whoever runs the day: when the bar opens, how it fits around the cake, where the counter sits relative to table service. We arrive self-sufficient — we need neither their kitchen nor their staff.',
    },
  },
  {
    topic: 'wedding',
    position: 31,
    question: { it: 'Servite anche vino e birra durante la cena?', en: 'Do you also serve wine and beer during dinner?' },
    answer: {
      it: 'Il nostro mestiere è il bar dei cocktail, di solito prima e dopo la cena. Il servizio al tavolo durante il pranzo resta al catering. Se serve, ci occupiamo anche del welcome drink e dell’open bar di fine serata: sono i due momenti in cui un bar vero si nota di più.',
      en: 'Our job is the cocktail bar, usually before and after dinner. Table service during the meal stays with the caterer. If it helps, we also cover the welcome drink and the late-night open bar — the two moments where a real bar shows the most.',
    },
  },
  {
    topic: 'corporate',
    position: 40,
    question: { it: 'Emettete fattura?', en: 'Do you invoice?' },
    answer: {
      it: 'Sì, con fattura elettronica regolare. Per gli eventi aziendali gestiamo anche l’eventuale documentazione richiesta dalla location e forniamo in anticipo quanto serve all’ufficio acquisti.',
      en: 'Yes, with proper electronic invoicing. For corporate events we also handle any paperwork the venue requires and send procurement what they need in advance.',
    },
  },
];

/* -------------------------------------------------------------------------- */
/* SEO landing pages                                                          */
/* -------------------------------------------------------------------------- */

export const landingPageSeeds = [
  {
    key: 'barman-a-domicilio',
    position: 1,
    inNavigation: true,
    slugIt: 'barman-a-domicilio-roma',
    slugEn: 'private-bartender-rome',
    eventTypeSlug: 'festa-privata',
    recommendedPackage: 'signature',
    faqTopic: 'general',
    heroImagePath: '/images/landing/barman-a-domicilio.jpg',
    heroTitle: {
      it: 'Barman a domicilio a Roma — ma con il bar incluso',
      en: 'A private bartender in Rome — with the bar included',
    },
    heroSubtitle: {
      it: 'Non solo qualcuno che shakera dietro al tuo tavolo della cucina: bancone professionale, attrezzatura, bottiglie e ghiaccio arrivano con noi.',
      en: 'Not just someone shaking behind your kitchen table: a professional counter, the kit, the bottles and the ice all arrive with us.',
    },
    highlights: {
      it: [
        'Bartender professionista, non improvvisato',
        'Bancone e attrezzatura di proprietà, montati da noi',
        'Spesa e trasporto delle bottiglie inclusi',
        'A fine serata smontiamo e portiamo via tutto',
      ],
      en: [
        'A professional bartender, not an improvised one',
        'Counter and kit we own, set up by us',
        'Shopping and transport of the bottles included',
        'We break everything down and take it away at the end',
      ],
    },
    body: {
      it: `## Cosa cambia rispetto a “chiamare un barman”

Cercando *barman a domicilio a Roma* trovi soprattutto una cosa: una persona che viene a casa tua per qualche ora, a una tariffa oraria. Funziona, ma il grosso del lavoro resta a te. Devi comprare le bottiglie — e indovinare quante — procurarti il ghiaccio, trovare i bicchieri, sistemare un tavolo che assomigli a un bancone e sperare che a metà serata non finisca il lime.

Noi partiamo dall'altra estremità del problema: portiamo il bar. Il bancone è nostro, l'attrezzatura è nostra, le bottiglie le compriamo noi in base a quanti siete e a cosa bevete. Tu ci dici quando e dove.

## Cosa arriva a casa tua

- Un bancone professionale montato sul posto, non un tavolo con una tovaglia
- Frigo, ghiaccio in quantità calcolata, bicchieri, shaker, jigger, strainer
- Alcolici, mixer, succhi e frutta acquistati da noi il giorno prima
- Garnish preparati sul momento, non presi da un barattolo
- Uno o due bartender in divisa, a seconda di quante persone siete

## Quanto costa un barman a domicilio a Roma

Sul mercato romano un bartender “da solo” costa in genere fra 150 e 300 € per una serata, ma a quella cifra devi aggiungere la spesa, il ghiaccio, i bicchieri e il tuo tempo. Il nostro servizio parte da 39 € a ospite e comprende tutto: per una festa da trenta persone si parla di circa 1.000–1.400 €, senza altre voci a fine serata.

Vale la pena fare il conto per intero prima di confrontare i due numeri: quasi sempre la differenza reale è molto più piccola di quanto sembri, e in mezzo c'è una serata che non devi organizzare tu.

## Dove lavoriamo

Roma città e provincia, dai Parioli a Ostia, dai Castelli alla zona nord. Fuori dal GRA aggiungiamo solo il costo reale della trasferta. Ville, terrazzi, giardini, appartamenti: se c'è una presa di corrente e due metri di spazio, il bar si monta.`,
      en: `## What changes compared with “hiring a bartender”

Search for a *private bartender in Rome* and you will mostly find one thing: a person who comes to your house for a few hours at an hourly rate. It works, but the bulk of the job stays with you. You have to buy the bottles — and guess how many — sort the ice, find the glasses, arrange a table that looks vaguely like a bar, and hope the limes hold out.

We start from the other end of the problem: we bring the bar. The counter is ours, the kit is ours, and we buy the bottles based on how many of you there are and what you drink. You tell us when and where.

## What turns up at your place

- A professional counter assembled on site, not a table with a cloth on it
- Fridge, a properly calculated amount of ice, glassware, shakers, jiggers, strainers
- Spirits, mixers, juices and fruit, bought by us the day before
- Garnish prepared on the spot, not spooned out of a jar
- One or two bartenders in uniform, depending on numbers

## What a private bartender costs in Rome

In the Roman market a bartender on their own typically runs between €150 and €300 for a night — but you then add the shopping, the ice, the glassware and your own time. Our service starts at €39 per guest and covers everything: a party of thirty comes to roughly €1,000–1,400, with nothing else to settle afterwards.

It is worth adding up the whole bill before comparing the two numbers: the real gap is almost always much smaller than it looks, and on one side of it is an evening you did not have to organise.

## Where we work

Rome and its province, from Parioli to Ostia, from the Castelli to the north of the city. Beyond the ring road we add only the real cost of travel. Villas, terraces, gardens, flats: if there is a socket and two metres of space, the bar goes up.`,
    },
    seoTitle: {
      it: 'Barman a domicilio Roma — cocktail bar completo a casa tua',
      en: 'Private bartender in Rome — a complete cocktail bar at your place',
    },
    seoDescription: {
      it: 'Barman a domicilio a Roma con bancone, attrezzatura e bottiglie incluse. Feste private, compleanni e cene: prezzo chiuso a partire da 39 € a ospite. Richiedi un preventivo.',
      en: 'A private bartender in Rome with counter, equipment and bottles included. Private parties, birthdays and dinners, fixed price from €39 per guest. Request a quote.',
    },
  },
  {
    key: 'feste-private',
    position: 2,
    inNavigation: true,
    slugIt: 'cocktail-bar-feste-private-roma',
    slugEn: 'private-party-cocktail-bar-rome',
    eventTypeSlug: 'festa-privata',
    recommendedPackage: 'signature',
    faqTopic: 'general',
    heroImagePath: '/images/landing/feste-private.jpg',
    heroTitle: {
      it: 'Cocktail bar per feste private a Roma',
      en: 'A cocktail bar for private parties in Rome',
    },
    heroSubtitle: {
      it: 'Il momento in cui la tua festa smette di sembrare una cena fra amici e inizia a sembrare un locale.',
      en: 'The moment your party stops feeling like dinner with friends and starts feeling like a venue.',
    },
    highlights: {
      it: [
        'Da 20 a 90 ospiti, in casa o in villa',
        'Welcome drink all’arrivo, carta stampata con i tuoi nomi',
        'Sei-otto cocktail, analcolici compresi',
        'Zero pulizie: il bancone sparisce come è arrivato',
      ],
      en: [
        'From 20 to 90 guests, at home or in a villa',
        'A welcome drink on arrival, a printed menu with your names on it',
        'Six to eight cocktails, alcohol-free ones included',
        'No cleaning up: the counter leaves exactly as it arrived',
      ],
    },
    body: {
      it: `## Il problema di ogni festa in casa

Le feste in casa si incagliano quasi sempre nello stesso punto: qualcuno deve occuparsi dei drink. All'inizio è divertente, dopo un'ora è un lavoro, e chi lo fa passa la serata dietro un tavolo invece che con i suoi ospiti.

Un bar vero risolve la cosa in modo banale: c'è qualcuno il cui unico compito è quello, con gli strumenti giusti e le quantità già calcolate.

## Come si svolge una serata tipo

- **Due ore prima** arriviamo, montiamo il bancone, sistemiamo ghiaccio e bottiglie, prepariamo i garnish
- **All'arrivo degli ospiti** parte il welcome drink: tutti hanno qualcosa in mano nei primi cinque minuti
- **Durante la festa** il bancone lavora a ritmo continuo, con una carta breve che tiene i tempi bassi
- **A fine serata** smontiamo, portiamo via bottiglie aperte e rifiuti e lasciamo lo spazio pulito

## La carta

Sei o otto cocktail scelti insieme, non cinquanta. Una carta corta è una scelta tecnica, non una limitazione: riduce l'attesa al bancone, evita che qualcuno resti senza e permette di comprare bene invece che comprare tanto.

Ci mettiamo sempre almeno due analcolici costruiti come cocktail veri. Chi guida o non beve non deve accontentarsi di una bibita.

## Quanto serve prenotare prima

Per i sabati di primavera ed estate conviene muoversi con quattro-sei settimane di anticipo. Fuori stagione bastano spesso dieci giorni. Le date le verifichiamo personalmente prima di confermare qualsiasi cosa.`,
      en: `## The problem with every house party

House parties get stuck at the same point almost every time: somebody has to take care of the drinks. It is fun for the first twenty minutes, work after an hour, and whoever is doing it spends the night behind a table instead of with their guests.

A real bar solves this in the most boring way possible: someone is there whose only job is that, with the right tools and the quantities already worked out.

## How a typical night runs

- **Two hours before**, we arrive, build the counter, set up ice and bottles, prep the garnish
- **As guests arrive**, the welcome drink goes out: everyone has something in hand within five minutes
- **Through the party**, the counter works continuously, with a short list that keeps waiting times down
- **At the end**, we break it all down, take away opened bottles and waste, and leave the space clean

## The list

Six or eight cocktails chosen together — not fifty. A short list is a technical decision, not a limitation: it cuts the queue, stops anything running out, and lets us buy well instead of buying a lot.

We always include at least two alcohol-free drinks built like real cocktails. Anyone driving or not drinking should not have to settle for a soft drink.

## How far ahead to book

For spring and summer Saturdays, four to six weeks is sensible. Off season, ten days is often enough. We check dates personally before confirming anything.`,
    },
    seoTitle: {
      it: 'Cocktail bar per feste private a Roma — servizio completo',
      en: 'Cocktail bar for private parties in Rome — full service',
    },
    seoDescription: {
      it: 'Un cocktail bar professionale alla tua festa privata a Roma: bartender, bancone, bottiglie e ghiaccio inclusi. Da 20 a 90 ospiti, prezzo chiuso. Richiedi un preventivo.',
      en: 'A professional cocktail bar at your private party in Rome: bartender, counter, bottles and ice included. From 20 to 90 guests, fixed price. Request a quote.',
    },
  },
  {
    key: 'matrimonio',
    position: 3,
    inNavigation: true,
    slugIt: 'cocktail-bar-matrimonio-roma',
    slugEn: 'wedding-cocktail-bar-rome',
    eventTypeSlug: 'matrimonio',
    recommendedPackage: 'su-misura',
    faqTopic: 'wedding',
    heroImagePath: '/images/landing/matrimonio.jpg',
    heroTitle: {
      it: 'Cocktail bar per matrimoni a Roma',
      en: 'Wedding cocktail bar in Rome',
    },
    heroSubtitle: {
      it: 'Il welcome drink prima del pranzo e l’open bar dopo la torta: i due momenti in cui gli invitati si ricordano davvero di aver bevuto qualcosa.',
      en: 'The welcome drink before lunch and the open bar after the cake: the two moments guests actually remember drinking something.',
    },
    highlights: {
      it: [
        'Welcome drink coordinato con l’arrivo degli invitati',
        'Open bar serale con carta scelta dagli sposi',
        'Due o più bartender, nessuna coda al bancone',
        'Timeline concordata con catering, planner e location',
      ],
      en: [
        'A welcome drink timed to guests arriving',
        'An evening open bar with a list the couple choose',
        'Two or more bartenders, no queue at the counter',
        'Timings agreed with the caterer, the planner and the venue',
      ],
    },
    body: {
      it: `## Dove serve davvero un bar, a un matrimonio

Il pranzo lo gestisce il catering, e lo gestisce bene. I due momenti scoperti sono quasi sempre gli stessi: l'attesa prima del ricevimento, quando gli invitati arrivano alla spicciolata e non sanno cosa fare, e la seconda parte della serata, quando si balla e nessuno ha più voglia di stare seduto a tavola.

È lì che un cocktail bar vero cambia la temperatura della giornata. Non serve un bar aperto otto ore: servono due presidi fatti bene.

## Come lavoriamo con chi organizza

Arriviamo autonomi — bancone, frigo, ghiaccio, bicchieri, bottiglie — e non abbiamo bisogno né della cucina né del personale di sala. Prima del matrimonio fissiamo la timeline con la wedding planner o con la location: orario di apertura del bar, momento del brindisi, posizione del bancone rispetto al flusso degli invitati.

Se lavori nel settore e cerchi un fornitore bar per i tuoi matrimoni, abbiamo un listino dedicato: trovi tutto nella pagina Collaboriamo.

## La carta di un matrimonio

Di solito funziona così: due cocktail leggeri per il welcome, quattro-sei per la sera, almeno due analcolici, più birra e bollicine al bancone. Molte coppie aggiungono un signature con il loro nome, scritto sulla carta stampata — costa poco e resta nelle foto.

## Quanto costa

I matrimoni rientrano nella formula Su misura: il preventivo dipende da quanti invitati, quante postazioni bar e quante ore di presidio servono. Per darti una prima cifra realistica bastano data, location e numero di invitati.`,
      en: `## Where a wedding actually needs a bar

Lunch is the caterer's job, and they do it well. The two gaps are almost always the same: the wait before the reception, when guests trickle in with nothing to do, and the second half of the evening, once the dancing starts and nobody wants to sit at a table.

That is where a real cocktail bar changes the temperature of the day. You do not need a bar open for eight hours — you need two moments covered properly.

## How we work with the people running the day

We arrive self-sufficient — counter, fridge, ice, glassware, bottles — and need neither the kitchen nor the floor staff. Before the wedding we lock the timeline with the planner or the venue: when the bar opens, when the toast happens, where the counter sits relative to the flow of guests.

If you work in the industry and are looking for a bar supplier for your weddings, we have dedicated rates — see the Partners page.

## A wedding list

It usually works like this: two light cocktails for the welcome, four to six for the evening, at least two alcohol-free, plus beer and sparkling wine at the counter. Many couples add a signature drink with their name on the printed menu — it costs very little and it ends up in the photographs.

## What it costs

Weddings fall under the Bespoke format: the quote depends on guest numbers, how many bar stations are needed and how many hours are covered. A date, a venue and a guest count are enough for a realistic first figure.`,
    },
    seoTitle: {
      it: 'Cocktail bar matrimonio Roma — open bar e welcome drink',
      en: 'Wedding cocktail bar Rome — open bar and welcome drinks',
    },
    seoDescription: {
      it: 'Cocktail bar per matrimoni a Roma: welcome drink, open bar serale, bartender e attrezzatura inclusi. Coordinamento con catering e wedding planner. Richiedi un preventivo.',
      en: 'A wedding cocktail bar in Rome: welcome drinks, evening open bar, bartenders and equipment included. Coordinated with caterers and planners. Request a quote.',
    },
  },
  {
    key: 'diciottesimo',
    position: 4,
    inNavigation: true,
    slugIt: 'cocktail-bar-18-anni-roma',
    slugEn: '18th-birthday-cocktail-bar-rome',
    eventTypeSlug: 'diciottesimo',
    recommendedPackage: 'signature',
    faqTopic: 'general',
    heroImagePath: '/images/landing/diciottesimo.jpg',
    heroTitle: {
      it: 'Cocktail bar per un diciottesimo a Roma',
      en: 'An 18th birthday cocktail bar in Rome',
    },
    heroSubtitle: {
      it: 'Una festa che sembra un locale vero, con un adulto responsabile dietro al bancone. Di solito è esattamente quello che cercano entrambe le parti.',
      en: 'A party that feels like a proper venue, with a responsible adult behind the counter. Usually exactly what both sides are after.',
    },
    highlights: {
      it: [
        'Servizio controllato e responsabile, sempre presidiato',
        'Carta analcolica curata quanto quella alcolica',
        'Bancone e allestimento che reggono le foto',
        'Nessun alcolico ai minori di 18 anni, senza eccezioni',
      ],
      en: [
        'Controlled, responsible service, never left unattended',
        'An alcohol-free list made with the same care as the rest',
        'A counter and set-up that hold up in photographs',
        'No alcohol to under-18s, no exceptions',
      ],
    },
    body: {
      it: `## Due esigenze diverse, una soluzione sola

Chi compie diciotto anni vuole una festa che assomigli a un locale: bancone illuminato, drink che sembrano quelli veri, foto che si possono postare. Chi paga la festa vuole soprattutto sapere che nessuno si farà male.

Le due cose non sono in conflitto. Un bar presidiato da un professionista è più sicuro di venti bottiglie lasciate su un tavolo, perché c'è qualcuno che vede chi beve, quanto beve e quando è il caso di fermarsi.

## Come gestiamo la serata

- Serviamo **solo analcolici ai minorenni**, senza eccezioni e senza deroghe su richiesta dei genitori
- Il bancone è sempre presidiato: nessuno si versa da bere da solo
- La carta analcolica ha quattro drink costruiti come cocktail veri, non bibite travestite
- Se qualcuno esagera, ce ne accorgiamo prima noi che voi

## Cosa vede chi arriva alla festa

Bancone montato con retro-bar illuminato, bicchieri veri, garnish preparati al momento, una carta stampata con il nome del festeggiato. È la differenza fra una festa in casa e una festa che sembra organizzata da qualcuno che lo fa di mestiere.

## Formula consigliata

Per un diciottesimo tipico — quaranta o cinquanta invitati, in casa o in una sala affittata — la formula Signature copre bene: sei cocktail più gli analcolici, welcome drink all'arrivo e bancone illuminato. Sopra i trentacinque ospiti aggiungiamo un secondo bartender per evitare code.`,
      en: `## Two different needs, one answer

The person turning eighteen wants a party that looks like a venue: a lit counter, drinks that look like the real thing, photographs worth posting. Whoever is paying for it mostly wants to know nobody will get hurt.

Those two things do not conflict. A bar staffed by a professional is safer than twenty bottles left on a table, because somebody is watching who is drinking, how much, and when it is time to stop.

## How we run the night

- We serve **alcohol-free drinks only to under-18s**, with no exceptions and no waivers at a parent's request
- The counter is always staffed: nobody pours their own
- The alcohol-free list has four drinks built like real cocktails, not soft drinks in disguise
- If somebody is overdoing it, we notice before you do

## What guests actually see

A built counter with a lit back bar, real glassware, garnish prepared on the spot, a printed menu with the birthday name on it. That is the difference between a house party and a party that looks like somebody who does this for a living organised it.

## Recommended format

For a typical 18th — forty or fifty guests, at home or in a hired room — the Signature format covers it well: six cocktails plus the alcohol-free list, a welcome drink on arrival and a lit counter. Above thirty-five guests we add a second bartender so nobody queues.`,
    },
    seoTitle: {
      it: 'Cocktail bar 18 anni Roma — festa con bar e servizio responsabile',
      en: '18th birthday cocktail bar Rome — a party bar run responsibly',
    },
    seoDescription: {
      it: 'Cocktail bar per feste di 18 anni a Roma: bancone professionale, carta analcolica curata e servizio sempre presidiato. Nessun alcolico ai minorenni. Richiedi un preventivo.',
      en: 'An 18th birthday cocktail bar in Rome: a professional counter, a proper alcohol-free list and service that is never left unattended. Request a quote.',
    },
  },
  {
    key: 'laurea',
    position: 5,
    inNavigation: true,
    slugIt: 'cocktail-bar-laurea-roma',
    slugEn: 'graduation-party-cocktail-bar-rome',
    eventTypeSlug: 'laurea',
    recommendedPackage: 'signature',
    faqTopic: 'general',
    heroImagePath: '/images/landing/laurea.jpg',
    heroTitle: {
      it: 'Cocktail bar per una festa di laurea a Roma',
      en: 'A graduation party cocktail bar in Rome',
    },
    heroSubtitle: {
      it: 'Si comincia con il brindisi ai parenti e si finisce a ballare con gli amici. Il bar deve reggere entrambe le cose.',
      en: 'It starts with a toast for the relatives and ends up dancing with friends. The bar has to handle both.',
    },
    highlights: {
      it: [
        'Brindisi iniziale servito a tutti nello stesso momento',
        'Carta che scala dal formale al notturno',
        'Analcolici veri per chi guida o non beve',
        'Montaggio nel pomeriggio, smontaggio a fine serata',
      ],
      en: [
        'An opening toast served to everyone at once',
        'A list that shifts from formal to late-night',
        'Proper alcohol-free drinks for drivers and non-drinkers',
        'Set up in the afternoon, cleared away at the end',
      ],
    },
    body: {
      it: `## Una festa in due tempi

La laurea è l'evento privato con la composizione più strana: nella stessa stanza ci sono i nonni, i genitori, i colleghi di corso e gli amici del liceo. Nella prima ora si brinda in modo composto, tre ore dopo la musica è alta e le persone rimaste hanno vent'anni.

Un bar che funziona in questi casi è un bar che cambia passo: bollicine e drink leggeri all'inizio, cocktail più decisi quando la festa si stringe.

## Cosa prepariamo

- Il **brindisi iniziale** servito contemporaneamente a tutti, senza fila
- Due o tre drink leggeri, adatti anche a chi non beve spesso cocktail
- Tre o quattro cocktail più strutturati per la seconda parte
- Un **Espresso Martini** verso mezzanotte, che a una laurea non ha mai deluso nessuno
- Analcolici curati: alle lauree c'è sempre qualcuno che guida

## Dove si fa

In casa, in un giardino, in una sala affittata, in una villa fuori Roma. Il bancone si monta ovunque ci siano due metri di spazio e una presa. Per i giardini senza corrente ci organizziamo, basta dircelo prima.

## Formula consigliata

Per una laurea da trenta o quaranta persone la formula Signature è quella giusta: welcome drink, sei cocktail e la carta stampata con il nome del laureato e la data. Con più di cinquanta invitati si passa a Prestige, con due bartender al bancone.`,
      en: `## A party in two halves

A graduation is the strangest guest list in private events: grandparents, parents, coursemates and school friends all in the same room. The first hour is a composed toast; three hours later the music is loud and everyone left is twenty.

A bar that works here is a bar that changes pace: sparkling wine and light drinks early, more assertive cocktails once the party narrows.

## What we prepare

- The **opening toast** served to everyone at the same time, no queue
- Two or three light drinks that suit people who do not often drink cocktails
- Three or four more structured cocktails for the second half
- An **Espresso Martini** around midnight, which has never once disappointed at a graduation
- A proper alcohol-free list: at a graduation, somebody is always driving

## Where it happens

At home, in a garden, in a hired room, in a villa outside Rome. The counter goes up anywhere there is two metres of space and a socket. For gardens with no power we make arrangements — just tell us in advance.

## Recommended format

For a graduation of thirty or forty people, Signature is the right fit: welcome drink, six cocktails and a printed menu with the graduate's name and the date. Above fifty guests it becomes Prestige, with two bartenders at the counter.`,
    },
    seoTitle: {
      it: 'Cocktail bar laurea Roma — brindisi e open bar per la festa',
      en: 'Graduation cocktail bar Rome — toast and open bar for the party',
    },
    seoDescription: {
      it: 'Cocktail bar per feste di laurea a Roma: brindisi iniziale, cocktail per tutta la serata, bartender e attrezzatura inclusi. Prezzo chiuso. Richiedi un preventivo.',
      en: 'A graduation party cocktail bar in Rome: opening toast, cocktails all evening, bartender and equipment included. Fixed price. Request a quote.',
    },
  },
  {
    key: 'aziendale',
    position: 6,
    inNavigation: true,
    slugIt: 'cocktail-bar-eventi-aziendali-roma',
    slugEn: 'corporate-cocktail-bar-rome',
    eventTypeSlug: 'aziendale',
    recommendedPackage: 'prestige',
    faqTopic: 'corporate',
    heroImagePath: '/images/landing/aziendale.jpg',
    heroTitle: {
      it: 'Cocktail bar per eventi aziendali a Roma',
      en: 'A corporate cocktail bar in Rome',
    },
    heroSubtitle: {
      it: 'Inaugurazioni, feste di Natale, lanci, cene aziendali. Fattura regolare, orari rispettati, un solo referente.',
      en: 'Openings, Christmas parties, launches, company dinners. Proper invoicing, timings respected, one point of contact.',
    },
    highlights: {
      it: [
        'Fattura elettronica e documentazione per la location',
        'Allestimento personalizzabile con il vostro brand',
        'Servizio dimensionato sul numero reale di partecipanti',
        'Orari di apertura e chiusura del bar concordati',
      ],
      en: [
        'Electronic invoicing and paperwork for the venue',
        'Set-up that can carry your branding',
        'Service sized to the actual headcount',
        'Agreed bar opening and closing times',
      ],
    },
    body: {
      it: `## Cosa chiede un evento aziendale che una festa privata non chiede

Tre cose, di solito: che i tempi siano rispettati al minuto, che ci sia una fattura, e che nessuno debba occuparsi del fornitore durante l'evento. Sono anche le tre cose su cui si vede subito se un fornitore lavora davvero con le aziende.

Arriviamo con anticipo concordato, montiamo prima che entrino i partecipanti, apriamo e chiudiamo il bar agli orari stabiliti e smontiamo quando ce lo dite voi, non prima.

## Formati che funzionano

- **Inaugurazione o open house**: welcome drink continuo, carta corta di tre-quattro cocktail, ritmo alto
- **Festa di Natale**: carta più ampia, bancone illuminato, servizio su tutta la serata
- **Cena aziendale**: aperitivo di apertura e bar dopo cena, coordinati con il catering
- **Lancio o presentazione**: possibilità di un cocktail creato attorno al prodotto o al nome dell'azienda

## Personalizzazione

Il bancone può portare il vostro logo, la carta dei cocktail può essere impaginata con la vostra grafica e un drink può essere costruito su misura per l'occasione. Sono dettagli che costano poco e che nelle foto dell'evento si vedono.

## Aspetti pratici

Emettiamo fattura elettronica. Se la location richiede documentazione — assicurazione, elenco del personale, orari di accesso — la prepariamo noi in anticipo. Per gli eventi sopra i cento partecipanti facciamo sempre un sopralluogo prima.`,
      en: `## What a corporate event asks that a private party does not

Three things, usually: that timings are kept to the minute, that there is an invoice, and that nobody has to manage the supplier during the event. Those are also the three things that immediately reveal whether a supplier really works with companies.

We arrive at an agreed time, set up before attendees walk in, open and close the bar at the stated hours, and break down when you tell us to — not before.

## Formats that work

- **Opening or open house**: a continuous welcome drink, a short list of three or four cocktails, high pace
- **Christmas party**: a wider list, a lit counter, service across the whole evening
- **Company dinner**: an opening aperitivo and an after-dinner bar, coordinated with the caterer
- **Launch or presentation**: the option of a cocktail built around the product or the company name

## Branding

The counter can carry your logo, the menu can be laid out in your house style, and a drink can be built for the occasion. These are inexpensive details that show up in the event photographs.

## Practicalities

We issue electronic invoices. If the venue needs paperwork — insurance, a staff list, access times — we prepare it in advance. For events above a hundred attendees we always do a site visit first.`,
    },
    seoTitle: {
      it: 'Cocktail bar eventi aziendali Roma — open bar con fattura',
      en: 'Corporate cocktail bar Rome — open bar with proper invoicing',
    },
    seoDescription: {
      it: 'Cocktail bar per eventi aziendali a Roma: inaugurazioni, feste di Natale, cene e lanci. Allestimento personalizzabile, fattura elettronica, orari rispettati.',
      en: 'A corporate cocktail bar in Rome: openings, Christmas parties, dinners and launches. Branded set-up, electronic invoicing, timings respected.',
    },
  },
];

/* -------------------------------------------------------------------------- */
/* Journal                                                                    */
/* -------------------------------------------------------------------------- */

export const postSeeds = [
  {
    slugIt: 'quanto-costa-cocktail-bar-a-domicilio-roma',
    slugEn: 'what-a-private-cocktail-bar-costs-in-rome',
    published: true,
    coverImagePath: '/images/journal/costo-cocktail-bar.jpg',
    title: {
      it: 'Quanto costa un cocktail bar a domicilio a Roma',
      en: 'What a private cocktail bar costs in Rome',
    },
    excerpt: {
      it: 'I numeri reali del mercato romano, cosa è incluso e cosa quasi sempre non lo è, e come confrontare due preventivi che sembrano identici.',
      en: 'The real numbers in the Roman market, what is included and what usually is not, and how to compare two quotes that look identical.',
    },
    seoTitle: {
      it: 'Quanto costa un cocktail bar a domicilio a Roma (2026)',
      en: 'What a private cocktail bar costs in Rome (2026)',
    },
    seoDescription: {
      it: 'Prezzi reali per un cocktail bar a domicilio a Roma: tariffe del bartender, costo delle bottiglie, formule tutto compreso e come confrontare i preventivi.',
      en: 'Real prices for a private cocktail bar in Rome: bartender rates, the cost of bottles, all-inclusive formats and how to compare quotes.',
    },
    body: {
      it: `Il prezzo di un cocktail bar a domicilio a Roma cambia molto a seconda di cosa comprende davvero. Prima di confrontare due preventivi conviene capire quali voci ci sono dentro, perché la stessa festa può costare 500 € o 1.400 € a seconda di chi compra le bottiglie.

## Le tre formule che trovi sul mercato

**Solo bartender.** Costa in genere 150–300 € per una serata. Arriva una persona con lo shaker; bottiglie, ghiaccio, bicchieri, frutta e attrezzatura li metti tu. È l'opzione più economica sulla carta e la più impegnativa nella pratica.

**Bartender più attrezzatura.** Aggiunge il bancone e gli strumenti, tipicamente 400–700 €. Le bottiglie restano a carico tuo.

**Full service.** Tutto compreso, di solito calcolato a ospite: 30–50 € a persona a Roma, con minimi fra 700 e 1.000 € per gli eventi piccoli. Comprende bartender, attrezzatura, bottiglie, ghiaccio, bicchieri, allestimento e smontaggio.

## Il conto che quasi nessuno fa

Prendiamo una festa da 30 persone, tre ore di servizio, sei cocktail in carta.

- Bartender da solo: **250 €**
- Alcolici, mixer, succhi e frutta comprati da te: **circa 450–600 €**
- Ghiaccio (servono circa 15 kg): **35–50 €**
- Bicchieri, cannucce, tovaglioli: **40–70 €**
- Il tuo tempo: due ore di spesa, il trasporto, il montaggio, e la gestione degli avanzi

Totale reale: **800–950 €**, più il tuo pomeriggio. Un full service per lo stesso evento a Roma sta fra 1.000 e 1.400 €. La differenza c'è, ma è molto più piccola del confronto fra "250 €" e "1.200 €" che si fa a mente la prima volta.

## Cosa sposta davvero il prezzo

Non sono le ore. Sono:

- **Quante persone bevono.** È il fattore principale: il consumo cresce in modo abbastanza prevedibile, circa 2,5–3,5 drink a testa in una serata standard.
- **Cosa bevono.** Un Gin Tonic con un gin di fascia alta costa il triplo di uno standard. Un Mojito costa poco in bottiglia ma tanto in tempo di preparazione.
- **La location.** Un terzo piano senza ascensore, un giardino senza corrente o una villa a quaranta chilometri sono costi reali.
- **I bicchieri.** Vetro noleggiato significa trasporto e lavaggio: sono 2–3 € a ospite in più.

## Domande da fare a chi ti manda un preventivo

1. Le bottiglie sono incluse? Per quante consumazioni a persona?
2. Il ghiaccio è compreso, e in che quantità?
3. Chi monta e chi smonta? Quanto tempo prima arrivate?
4. Cosa succede se gli ospiti diventano dieci in più?
5. Il prezzo è chiuso o si conteggia a consumo alla fine?

Le ultime due sono quelle che separano un preventivo serio da una sorpresa a fine serata.`,
      en: `The price of a private cocktail bar in Rome varies enormously depending on what it actually includes. Before comparing two quotes, it is worth understanding which line items are inside them — the same party can cost €500 or €1,400 depending on who buys the bottles.

## The three formats on the market

**Bartender only.** Typically €150–300 for a night. A person turns up with a shaker; bottles, ice, glassware, fruit and equipment are yours to sort. Cheapest on paper, most work in practice.

**Bartender plus equipment.** Adds the counter and the tools, typically €400–700. The bottles are still on you.

**Full service.** Everything included, usually priced per guest: €30–50 a head in Rome, with minimums between €700 and €1,000 for smaller events. Covers bartender, equipment, bottles, ice, glassware, set-up and clear-down.

## The sum almost nobody does

Take a party of 30, three hours of service, six cocktails on the list.

- Bartender on their own: **€250**
- Spirits, mixers, juices and fruit bought by you: **around €450–600**
- Ice (you need about 15 kg): **€35–50**
- Glasses, straws, napkins: **€40–70**
- Your own time: two hours of shopping, the transport, the set-up, and dealing with the leftovers

Real total: **€800–950**, plus your afternoon. A full-service package for the same event in Rome runs €1,000–1,400. There is a difference, but it is far smaller than the "€250 versus €1,200" comparison people make in their heads the first time.

## What actually moves the price

Not the hours. It is:

- **How many people drink.** The main factor: consumption scales fairly predictably, roughly 2.5–3.5 drinks a head over a standard evening.
- **What they drink.** A Gin & Tonic with a top-shelf gin costs three times a standard one. A Mojito is cheap in bottle terms and expensive in preparation time.
- **The venue.** A third floor with no lift, a garden with no power, or a villa forty kilometres out are real costs.
- **The glassware.** Hired glass means transport and washing: another €2–3 per guest.

## Questions worth asking anyone who sends you a quote

1. Are the bottles included? For how many drinks per person?
2. Is ice included, and how much?
3. Who sets up and who breaks down? How early do you arrive?
4. What happens if ten more guests turn up?
5. Is the price fixed, or tallied by consumption at the end?

The last two are what separate a serious quote from a surprise at the end of the night.`,
    },
  },
  {
    slugIt: 'quanti-cocktail-servono-per-una-festa',
    slugEn: 'how-many-cocktails-for-a-party',
    published: true,
    coverImagePath: '/images/journal/quanti-cocktail.jpg',
    title: {
      it: 'Quanti cocktail servono per una festa di 30 persone',
      en: 'How many cocktails you need for a party of 30',
    },
    excerpt: {
      it: 'Il conto che facciamo prima di ogni evento: consumi medi, quante bottiglie comprare, quanto ghiaccio serve davvero e gli errori che si ripetono sempre.',
      en: 'The calculation we run before every event: average consumption, how many bottles to buy, how much ice you really need, and the mistakes that keep repeating.',
    },
    seoTitle: {
      it: 'Quanti cocktail servono per una festa di 30 persone',
      en: 'How many cocktails do you need for a party of 30?',
    },
    seoDescription: {
      it: 'Quante bottiglie, quanto ghiaccio e quanti bicchieri servono per una festa di 30 persone. Consumi medi reali e la formula che usiamo per calcolarli.',
      en: 'How many bottles, how much ice and how many glasses you need for a party of 30. Real average consumption and the formula we use.',
    },
    body: {
      it: `Questa è la domanda che riceviamo più spesso, e la risposta breve è: **circa 90 drink per 30 persone in una serata di quattro ore**. Quella lunga è più utile, perché il numero cambia parecchio a seconda di che festa è.

## Il consumo medio reale

Su una serata standard di quattro ore, la media si aggira su **2,5–3,5 drink a persona**. I fattori che spostano il numero:

- **L'orario.** Un aperitivo dalle 19 alle 22 sta sotto i 2,5. Una festa che finisce alle due sta sopra i 4.
- **Il caldo.** A luglio, a bordo piscina, si beve molto di più — e molto più lungo.
- **La composizione.** A un matrimonio con parenti di tre generazioni si beve meno che a un compleanno di trentenni.
- **Il cibo.** Se c'è una cena vera, il consumo cala; se ci sono solo stuzzichini, sale.

Per 30 persone su quattro ore, il conto prudente è **90 drink**, con margine per arrivare a 105.

## Quante bottiglie

Da una bottiglia da 70 cl si ricavano **circa 14 cocktail** (dose standard 5 cl). Per 90 drink servono quindi sei-sette bottiglie di distillato, ripartite fra le basi che hai in carta.

Una ripartizione che regge quasi sempre, su sei cocktail in carta:

- Gin: 2 bottiglie
- Vodka: 1,5
- Rum: 1,5
- Tequila o bourbon: 1
- Vermouth e bitter: 1 ciascuno
- Prosecco: 4–6 bottiglie se c'è un brindisi

Più mixer: tonica, ginger beer, soda, cola e succhi in ragione di circa 1,2 litri a persona complessivi.

## Il ghiaccio: l'errore numero uno

Il ghiaccio è la cosa che finisce sempre per prima. Serve **mezzo chilo a persona come minimo**, e in estate si arriva tranquillamente a un chilo. Per 30 persone: **15 kg d'inverno, 25–30 kg d'estate**.

Non è un margine di sicurezza esagerato: il ghiaccio serve per shakerare, per riempire i bicchieri e per tenere in fresco le bottiglie, e una parte si scioglie prima di essere usata.

## I bicchieri

Conta **1,5 bicchieri a persona** se lavi durante la serata, **2,5 se non lavi**. Per 30 persone significa 45 o 75 bicchieri. È il calcolo che quasi tutti sbagliano per difetto.

## Gli errori che si ripetono

1. **Carta troppo lunga.** Dodici cocktail per trenta persone significano bottiglie aperte a metà e code al bancone. Sei è il numero giusto.
2. **Niente analcolici veri.** C'è sempre chi guida, chi è incinta, chi non beve. Due mocktail costruiti bene evitano che quelle persone passino la serata con una cola.
3. **Lime e limoni sottostimati.** Per 90 drink servono circa 25 lime e 15 limoni. Sembra tantissimo finché non li spremi.
4. **Ghiaccio comprato la mattina.** Se non hai un freezer capiente, a mezzogiorno hai già perso metà del ghiaccio.

## La scorciatoia

Questo conto lo facciamo per ogni evento prima di andare a fare la spesa: se preferisci non farlo tu, è esattamente quello che comprende una formula full service.`,
      en: `This is the question we get most often, and the short answer is: **around 90 drinks for 30 people over a four-hour evening**. The long answer is more useful, because the number moves a lot depending on the kind of party.

## Real average consumption

Over a standard four-hour night, the average sits at **2.5–3.5 drinks per person**. What shifts it:

- **The time.** An aperitivo from 7 to 10pm stays under 2.5. A party that ends at 2am goes past 4.
- **The heat.** In July, by a pool, people drink far more — and far longer drinks.
- **The mix of guests.** A wedding with three generations of relatives drinks less than a thirty-something's birthday.
- **The food.** A proper dinner brings consumption down; snacks alone push it up.

For 30 people over four hours, the prudent figure is **90 drinks**, with headroom to 105.

## How many bottles

A 70cl bottle yields **about 14 cocktails** (a 5cl standard measure). So 90 drinks means six or seven bottles of spirits, split across the bases on your list.

A split that almost always works, for a list of six:

- Gin: 2 bottles
- Vodka: 1.5
- Rum: 1.5
- Tequila or bourbon: 1
- Vermouth and bitter: 1 each
- Prosecco: 4–6 bottles if there is a toast

Plus mixers: tonic, ginger beer, soda, cola and juices, at roughly 1.2 litres per person in total.

## Ice: mistake number one

Ice is always the first thing to run out. You need **half a kilo per person minimum**, and in summer a full kilo is normal. For 30 people: **15 kg in winter, 25–30 kg in summer**.

That is not an inflated safety margin: ice is used to shake, to fill glasses and to keep bottles cold, and some of it melts before it is ever used.

## Glassware

Count **1.5 glasses per person** if you wash during the night, **2.5 if you don't**. For 30 people that is 45 or 75 glasses. It is the number almost everyone underestimates.

## The mistakes that keep repeating

1. **A list that is too long.** Twelve cocktails for thirty people means half-open bottles and a queue at the counter. Six is the right number.
2. **No real alcohol-free options.** Somebody is always driving, pregnant, or not drinking. Two well-built mocktails stop those people spending the night with a cola.
3. **Underestimating limes and lemons.** Ninety drinks take about 25 limes and 15 lemons. It sounds like a lot until you start squeezing.
4. **Buying ice in the morning.** Without a big freezer, half of it is gone by midday.

## The shortcut

We run this calculation before every event, before going shopping. If you would rather not do it yourself, that is precisely what a full-service package covers.`,
    },
  },
  {
    slugIt: 'organizzare-open-bar-in-casa',
    slugEn: 'how-to-run-an-open-bar-at-home',
    published: true,
    coverImagePath: '/images/journal/open-bar-in-casa.jpg',
    title: {
      it: 'Open bar in casa: come organizzarlo senza impazzire',
      en: 'An open bar at home: how to run one without losing your mind',
    },
    excerpt: {
      it: 'Dove mettere il bancone, come evitare la coda, quanto ghiaccio serve e perché una carta corta funziona meglio di una lunga.',
      en: 'Where to put the counter, how to avoid the queue, how much ice you need, and why a short list beats a long one.',
    },
    seoTitle: {
      it: 'Come organizzare un open bar in casa — guida pratica',
      en: 'How to run an open bar at home — a practical guide',
    },
    seoDescription: {
      it: 'Guida pratica all’open bar in casa: posizione del bancone, carta dei cocktail, quantità, ghiaccio, bicchieri e gestione della serata.',
      en: 'A practical guide to an open bar at home: counter position, the cocktail list, quantities, ice, glassware and running the night.',
    },
    body: {
      it: `Un open bar in casa non fallisce mai per i cocktail. Fallisce per la logistica: il bancone nel posto sbagliato, la coda che si forma alle undici, il ghiaccio finito, la carta troppo lunga.

## Dove mettere il bancone

La regola è controintuitiva: **non nel punto più comodo, ma in quello che crea movimento**. Un bar messo nell'angolo del salotto svuota il resto della casa; un bar messo fra due stanze fa circolare le persone.

Serve però che intorno ci sia spazio per due-tre persone in attesa senza bloccare un passaggio. E serve una presa di corrente vicina, per il frigo o per le luci.

Il posto peggiore in assoluto è la cucina: è già il punto in cui tutti si ammassano.

## Perché una carta corta funziona meglio

Con dodici cocktail in carta succedono tre cose, tutte negative: le persone impiegano più tempo a scegliere, il bartender deve tenere aperte troppe bottiglie, e i tempi di preparazione si allungano. Risultato: coda.

**Sei cocktail sono il numero giusto** per una festa fino a cinquanta persone. Meglio se scelti così:

- Due **veloci da versare** (Gin Tonic, Spritz, Americano): reggono i picchi
- Due **da shakerare** (Margarita, Daiquiri, un sour): sono quelli che fanno effetto
- Uno **lungo e dissetante** (Mojito, Moscow Mule, Paloma): d'estate è il più richiesto
- Uno **da fine serata** (Espresso Martini, Old Fashioned)

Più due analcolici costruiti come cocktail veri.

## Il momento in cui si forma la coda

Quasi sempre nella prima mezz'ora, quando arrivano tutti insieme. La soluzione è il **welcome drink**: un drink già pronto in quantità, versato a chi entra. Toglie il picco iniziale e mette qualcosa in mano a tutti nei primi cinque minuti, che è anche il modo più veloce per far partire una festa.

## Ghiaccio, bicchieri, spazzatura

- **Ghiaccio:** mezzo chilo a persona d'inverno, fino a un chilo d'estate. Compralo il giorno stesso o tienilo in un contenitore termico.
- **Bicchieri:** 1,5 a persona se lavi durante la serata, 2,5 se non lavi.
- **Spazzatura:** due sacchi dedicati vicino al bar, non uno solo in cucina. È il dettaglio che decide se a fine serata la casa è recuperabile.

## Quando ha senso chiamare qualcuno

Se la festa è sotto le quindici persone e hai voglia di occupartene, un open bar in casa è perfettamente gestibile. Sopra i venticinque invitati diventa un lavoro vero: qualcuno passerà la serata dietro al bancone, e quel qualcuno sei probabilmente tu.

È lì che ha senso far arrivare un bar già montato — con le bottiglie già comprate.`,
      en: `An open bar at home never fails because of the cocktails. It fails on logistics: the counter in the wrong place, the queue that forms at eleven, the ice running out, a list that is too long.

## Where to put the counter

The rule is counter-intuitive: **not in the most convenient spot, but in the one that creates movement**. A bar in the corner of the living room empties the rest of the house; a bar between two rooms keeps people circulating.

You do need room for two or three people to wait without blocking a doorway, and a socket nearby for the fridge or the lights.

The single worst place is the kitchen — everyone already crowds in there.

## Why a short list works better

With twelve cocktails on the list, three things happen, all bad: people take longer to choose, the bartender has too many bottles open, and preparation times stretch. Result: a queue.

**Six cocktails is the right number** for a party up to fifty. Ideally chosen like this:

- Two **quick pours** (Gin & Tonic, Spritz, Americano): they absorb the peaks
- Two **shaken** (Margarita, Daiquiri, a sour): these are the ones that land
- One **long and refreshing** (Mojito, Moscow Mule, Paloma): the most-ordered drink in summer
- One **for the end of the night** (Espresso Martini, Old Fashioned)

Plus two alcohol-free drinks built like real cocktails.

## When the queue forms

Almost always in the first half hour, when everybody arrives at once. The fix is the **welcome drink**: something batched in advance and poured as people walk in. It removes the initial peak and puts a glass in every hand within five minutes — which is also the fastest way to get a party going.

## Ice, glassware, rubbish

- **Ice:** half a kilo per person in winter, up to a kilo in summer. Buy it the same day or keep it in an insulated box.
- **Glassware:** 1.5 per person if you wash during the night, 2.5 if you don't.
- **Rubbish:** two dedicated bags next to the bar, not one in the kitchen. That detail decides whether the house is salvageable in the morning.

## When it makes sense to call somebody

If the party is under fifteen people and you feel like handling it, an open bar at home is entirely manageable. Above twenty-five guests it becomes a real job — somebody will spend the evening behind the counter, and that somebody is probably you.

That is the point where it makes sense to have a bar arrive already built, with the bottles already bought.`,
    },
  },
];
