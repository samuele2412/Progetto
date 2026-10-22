/**
 * Seed editorial content: FAQs, the hand-written SEO landing pages and the
 * journal. Bodies use a tiny markdown subset rendered by `src/lib/markdown.ts`
 * (`## heading`, blank-line-separated paragraphs, `- bullets`).
 *
 * Every landing page here answers a different question for a different reader.
 * Resist the temptation to clone them: near-duplicate pages are the fastest way
 * to make Google ignore all of them.
 *
 * Voice and limits: docs/13-brand-voice.md. First person, "tu", no prices, no
 * invented experience ("la domanda che ci fanno più spesso"), no promises the
 * service cannot keep today. Costa Crociere is named only on the home page and
 * on "Chi sono"; elsewhere it is "le navi da crociera".
 */

export const faqSeeds = [
  {
    topic: 'general',
    position: 1,
    question: { it: 'Le bottiglie le compri tu?', en: 'Do you buy the bottles?' },
    answer: {
      it: 'Sì. Compro io le bottiglie e porto quello che serve per fare da bere: attrezzi, ghiaccio e bicchieri monouso.',
      en: 'Yes. I buy the bottles and bring what is needed to make the drinks: the tools, the ice and disposable cups.',
    },
  },
  {
    topic: 'general',
    position: 2,
    question: { it: 'Quanto costa?', en: 'How much does it cost?' },
    answer: {
      it: 'Dipende dalla festa: quante persone siete, cosa bevete, dove. Per questo faccio ogni preventivo su misura. È gratuito e non impegna.',
      en: 'It depends on the party: how many of you there are, what you drink, where it is. That is why every quote is made to measure. It is free and commits you to nothing.',
    },
  },
  {
    topic: 'general',
    position: 3,
    question: { it: 'Cosa ti serve sul posto?', en: 'What do you need on site?' },
    answer: {
      it: 'Un tavolo o un piano dove lavorare. Gli altri dettagli, come spazio e orari, li vediamo insieme quando mi scrivi.',
      en: 'A table or a counter to work at. The other details, like space and timings, we work out together when you get in touch.',
    },
  },
  {
    topic: 'general',
    position: 4,
    question: { it: 'Quando sei disponibile?', en: 'When are you available?' },
    answer: {
      it: 'Lavoro anche come barman sulle navi da crociera, quindi sono a Roma in alcuni periodi dell’anno. Scrivimi comunque: rispondo anche da bordo e fisso le date per quando torno.',
      en: 'I also work as a bartender on cruise ships, so I am in Rome for part of the year. Get in touch anyway: I reply from on board too and book dates for when I am back.',
    },
  },
  {
    topic: 'general',
    position: 5,
    question: { it: 'Lavori da solo?', en: 'Do you work alone?' },
    answer: {
      it: 'Di solito sì: dalla prima domanda all’ultimo drink parli con me. Per le feste molto grandi valutiamo insieme se serve un aiuto.',
      en: 'Usually, yes: from your first question to the last drink, you deal with me. For very large parties we decide together whether an extra pair of hands is needed.',
    },
  },
  {
    topic: 'general',
    position: 6,
    question: { it: 'Servi alcolici ai minorenni?', en: 'Do you serve alcohol to minors?' },
    answer: {
      it: 'No. Lo vieta la legge e non faccio eccezioni, nemmeno con il permesso dei genitori.',
      en: 'No. The law forbids it and I make no exceptions, not even with parental consent.',
    },
  },
  {
    topic: 'general',
    position: 7,
    question: { it: 'Lavori anche fuori Roma?', en: 'Do you work outside Rome?' },
    answer: {
      it: 'La mia zona è Roma e provincia. Se la festa è più lontano, scrivimi e vediamo.',
      en: 'My area is Rome and its province. If the party is further away, get in touch and we will see.',
    },
  },
  {
    topic: 'general',
    position: 8,
    question: { it: 'Come si paga?', en: 'How is payment handled?' },
    answer: {
      it: 'Ne parliamo quando definiamo la festa. Dal sito non si paga niente, e per le feste più grandi posso chiedere un acconto.',
      en: 'We talk about it when we plan the party. Nothing is paid through this site, and for larger parties I may ask for a deposit.',
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
    recommendedPackage: '',
    faqTopic: 'general',
    heroImagePath: '/images/landing/barman-a-domicilio.jpg',
    heroTitle: {
      it: 'Barman a domicilio a Roma',
      en: 'Private bartender in Rome',
    },
    heroSubtitle: {
      it: 'Vengo alla tua festa con attrezzatura, ghiaccio e bottiglie, e preparo i drink per te e i tuoi ospiti.',
      en: 'I come to your party with the kit, the ice and the bottles, and make the drinks for you and your guests.',
    },
    highlights: {
      it: [
        'Dietro al bancone da quando avevo 16 anni',
        'Oggi anche barman sulle navi da crociera',
        'Drink scelti sui tuoi gusti',
        'Preventivo gratuito e senza impegno',
      ],
      en: [
        'Behind the bar since I was 16',
        'Today also a bartender on cruise ships',
        'Drinks chosen around your tastes',
        'Free, no-obligation quote',
      ],
    },
    body: {
      it: `## Cosa vuol dire, in pratica

Mi chiami per la tua festa e arrivo con quello che serve per fare da bere: attrezzi, ghiaccio e bottiglie, che compro io. Lavoro su un tavolo o un piano che trovo da te, e per tutta la serata ai drink penso io.

Tu non devi fare la spesa, calcolare le quantità o passare la serata a versare.

## Come lavoro

Parto dai gusti di chi ho davanti. Se mi dici cosa bevi di solito, ti preparo qualcosa di simile, ma più interessante. Lavoro veloce e con precisione: a bordo delle navi sono abituato a servire tante persone.`,
      en: `## What it means in practice

You book me for your party and I arrive with what it takes to make the drinks: the tools, the ice and the bottles, which I buy. I work at a table or a counter I find at your place, and for the whole night the drinks are my job.

You don’t have to do the shopping, work out quantities or spend the night pouring.

## How I work

I start from the tastes of whoever is in front of me. Tell me what you usually drink and I’ll make you something similar, but more interesting. I work fast and precisely: on board the ships I’m used to serving a lot of people.`,
    },
    seoTitle: {
      it: 'Barman a domicilio a Roma per feste private',
      en: 'Private bartender in Rome for parties',
    },
    seoDescription: {
      it: 'Barman a domicilio a Roma e provincia: porto attrezzatura, ghiaccio e bottiglie e preparo i drink alla tua festa. Preventivo gratuito e senza impegno.',
      en: 'A private bartender in Rome: I bring the kit, the ice and the bottles and make the drinks at your party. Free, no-obligation quote.',
    },
  },
  {
    key: 'feste-private',
    position: 2,
    inNavigation: true,
    slugIt: 'cocktail-bar-feste-private-roma',
    slugEn: 'private-party-cocktail-bar-rome',
    eventTypeSlug: 'festa-privata',
    recommendedPackage: '',
    faqTopic: 'general',
    heroImagePath: '/images/landing/feste-private.jpg',
    heroTitle: {
      it: 'Bartender per feste private a Roma',
      en: 'Bartender for private parties in Rome',
    },
    heroSubtitle: {
      it: 'Compleanni, cene, serate in casa o in terrazza: ai drink penso io, tu stai con i tuoi ospiti.',
      en: 'Birthdays, dinners, nights at home or on a terrace: I take care of the drinks, you stay with your guests.',
    },
    highlights: {
      it: [
        'Drink scelti sui gusti tuoi e dei tuoi ospiti',
        'Attrezzatura, ghiaccio e bottiglie inclusi',
        'Un solo interlocutore, dalla prima domanda all’ultimo drink',
        'Preventivo gratuito e senza impegno',
      ],
      en: [
        'Drinks chosen around your tastes and your guests’',
        'Kit, ice and bottles included',
        'One person to deal with, from your first question to the last drink',
        'Free, no-obligation quote',
      ],
    },
    body: {
      it: `## Chi organizza, di solito, non si gode la festa

Finisce dietro al tavolo delle bottiglie, a versare e a cercare il ghiaccio, invece di stare con i propri ospiti. È esattamente la parte di cui mi occupo io.

## Come si svolge la serata

Arrivo con attrezzi, ghiaccio e bottiglie, mi sistemo su un tavolo o un piano e preparo i drink per tutta la sera. Quando il lavoro lo permette chiacchiero con gli ospiti: la festa deve essere leggera per tutti, anche per chi la organizza.

## Cosa si beve

Si parte da quello che piace a voi. Nella carta trovi qualche idea, ma se cerchi altro basta chiedere.`,
      en: `## Whoever hosts usually misses the party

They end up behind the table of bottles, pouring and hunting for ice, instead of being with their guests. That is exactly the part I take care of.

## How the night goes

I arrive with the tools, the ice and the bottles, set up at a table or a counter and make the drinks all night. When there’s time I chat with the guests: a party should feel light for everyone, including whoever is hosting.

## What gets drunk

We start from what you like. The list has a few ideas, but if you want something else, just ask.`,
    },
    seoTitle: {
      it: 'Cocktail bar per feste private a Roma',
      en: 'Cocktail bar for private parties in Rome',
    },
    seoDescription: {
      it: 'Un bartender alla tua festa privata a Roma e provincia: compleanni, cene e serate in casa. Porto attrezzatura, ghiaccio e bottiglie. Preventivo gratuito.',
      en: 'A bartender at your private party in Rome: birthdays, dinners and nights at home. I bring the kit, the ice and the bottles. Free quote.',
    },
  },
  {
    key: 'matrimonio',
    position: 3,
    inNavigation: true,
    slugIt: 'cocktail-bar-matrimonio-roma',
    slugEn: 'wedding-cocktail-bar-rome',
    eventTypeSlug: 'matrimonio',
    recommendedPackage: '',
    faqTopic: 'general',
    heroImagePath: '/images/landing/matrimonio.jpg',
    heroTitle: {
      it: 'Bartender per matrimoni a Roma',
      en: 'Bartender for weddings in Rome',
    },
    heroSubtitle: {
      it: 'Per l’aperitivo o per il dopocena, d’accordo con chi organizza la giornata.',
      en: 'For the drinks reception or after dinner, agreed with whoever runs the day.',
    },
    highlights: {
      it: [
        'Orari e spazi concordati con catering e wedding planner',
        'Drink scelti sui gusti degli sposi',
        'Attrezzatura, ghiaccio e bottiglie li porto io',
        'Preventivo gratuito e su misura',
      ],
      en: [
        'Timings and space agreed with the caterer and the planner',
        'Drinks chosen around the couple’s tastes',
        'I bring the kit, the ice and the bottles',
        'Free quote, made to measure',
      ],
    },
    body: {
      it: `## Quando serve il bar, a un matrimonio

Di solito in due momenti: all’aperitivo, quando arrivano gli ospiti, e dopo la cena, quando si comincia a ballare. Possiamo scegliere uno dei due, o tutti e due.

## Con chi organizza la giornata

Prima del matrimonio mi accordo con il catering, la location o la wedding planner su orari e spazi. Il giorno stesso nessuno deve pensare al bar.

## Una nota sui numeri

A un matrimonio gli ospiti sono tanti. A bordo delle navi sono abituato a ritmi molto alti, ma per le feste più grandi valutiamo insieme se serve un aiuto.`,
      en: `## When a wedding needs a bar

Usually at two moments: the drinks reception, as guests arrive, and after dinner, when the dancing starts. We can choose one of the two, or both.

## Working with whoever runs the day

Before the wedding I agree timings and space with the caterer, the venue or the planner. On the day itself, nobody has to think about the bar.

## A note on numbers

Weddings have a lot of guests. On board the ships I’m used to a very fast pace, but for the largest parties we decide together whether an extra pair of hands is needed.`,
    },
    seoTitle: {
      it: 'Cocktail bar per matrimoni a Roma',
      en: 'Wedding cocktail bar in Rome',
    },
    seoDescription: {
      it: 'Un bartender per il tuo matrimonio a Roma e provincia: aperitivo e dopocena, in accordo con catering e wedding planner. Preventivo gratuito e su misura.',
      en: 'A bartender for your wedding in Rome: drinks reception and after dinner, agreed with the caterer and the planner. Free quote, made to measure.',
    },
  },
  {
    key: 'diciottesimo',
    position: 4,
    inNavigation: true,
    slugIt: 'cocktail-bar-18-anni-roma',
    slugEn: '18th-birthday-cocktail-bar-rome',
    eventTypeSlug: 'diciottesimo',
    recommendedPackage: '',
    faqTopic: 'general',
    heroImagePath: '/images/landing/diciottesimo.jpg',
    heroTitle: {
      it: 'Bartender per diciottesimi a Roma',
      en: 'Bartender for 18th birthdays in Rome',
    },
    heroSubtitle: {
      it: 'Una festa vera, con un bartender vero, e niente alcol a chi non ha ancora 18 anni.',
      en: 'A real party with a real bartender, and no alcohol for anyone under 18.',
    },
    highlights: {
      it: [
        'Niente alcol a chi non ha ancora 18 anni',
        'Drink scelti sui gusti dei ragazzi',
        'Attrezzatura, ghiaccio e bottiglie li porto io',
        'Preventivo gratuito e senza impegno',
      ],
      en: [
        'No alcohol for anyone under 18',
        'Drinks chosen around the guests’ tastes',
        'I bring the kit, the ice and the bottles',
        'Free, no-obligation quote',
      ],
    },
    body: {
      it: `## Due cose da tenere insieme

Il festeggiato vuole una festa che sembri una festa vera. I genitori vogliono stare tranquilli. Si possono avere tutte e due.

## La regola

Ai minorenni non servo alcol: lo vieta la legge e non faccio eccezioni, nemmeno con il permesso dei genitori. Se alla festa ci sono ospiti di età diverse, ne parliamo prima e decidiamo come organizzarci.

## Il resto della serata

Arrivo con attrezzi, ghiaccio e bottiglie e mi occupo dei drink per tutta la sera, così chi organizza può godersi la festa.`,
      en: `## Two things to keep together

The birthday boy or girl wants a party that feels like a real one. The parents want peace of mind. You can have both.

## The rule

I don’t serve alcohol to minors: the law forbids it and I make no exceptions, not even with parental consent. If the guests are of different ages, we talk about it beforehand and decide how to organise things.

## The rest of the night

I arrive with the tools, the ice and the bottles and take care of the drinks all night, so whoever is hosting can enjoy the party.`,
    },
    seoTitle: {
      it: 'Cocktail bar per diciottesimi a Roma',
      en: 'Cocktail bar for 18th birthdays in Rome',
    },
    seoDescription: {
      it: 'Un bartender per il diciottesimo a Roma e provincia: drink sui gusti dei ragazzi e niente alcol ai minorenni. Preventivo gratuito e senza impegno.',
      en: 'A bartender for an 18th birthday in Rome: drinks around the guests’ tastes and no alcohol for minors. Free, no-obligation quote.',
    },
  },
  {
    key: 'laurea',
    position: 5,
    inNavigation: true,
    slugIt: 'cocktail-bar-laurea-roma',
    slugEn: 'graduation-party-cocktail-bar-rome',
    eventTypeSlug: 'laurea',
    recommendedPackage: '',
    faqTopic: 'general',
    heroImagePath: '/images/landing/laurea.jpg',
    heroTitle: {
      it: 'Bartender per feste di laurea a Roma',
      en: 'Bartender for graduation parties in Rome',
    },
    heroSubtitle: {
      it: 'Dal brindisi alla fine della festa: ai drink penso io, tu festeggi.',
      en: 'From the toast to the end of the party: I take care of the drinks, you celebrate.',
    },
    highlights: {
      it: [
        'Dal brindisi alla fine della festa',
        'Drink scelti sui gusti tuoi e dei tuoi amici',
        'Attrezzatura, ghiaccio e bottiglie li porto io',
        'Preventivo gratuito e senza impegno',
      ],
      en: [
        'From the toast to the end of the party',
        'Drinks chosen around your tastes and your friends’',
        'I bring the kit, the ice and the bottles',
        'Free, no-obligation quote',
      ],
    },
    body: {
      it: `## Una festa in due tempi

Spesso una laurea si festeggia due volte: prima il brindisi con la famiglia, poi la serata con gli amici. Posso seguire tutte e due le parti, o solo quella che ti serve.

## Dove

In casa, in terrazza, in giardino o in un locale preso per l’occasione, a Roma e provincia. Lavoro su un tavolo o un piano che trovo sul posto.`,
      en: `## A party in two halves

A graduation is often celebrated twice: first the toast with the family, then the night with friends. I can cover both halves, or just the one you need.

## Where

At home, on a terrace, in a garden or in a venue hired for the occasion, in Rome and its province. I work at a table or a counter I find on site.`,
    },
    seoTitle: {
      it: 'Cocktail bar per feste di laurea a Roma',
      en: 'Cocktail bar for graduation parties in Rome',
    },
    seoDescription: {
      it: 'Un bartender per la tua festa di laurea a Roma e provincia: dal brindisi alla serata con gli amici. Porto attrezzatura, ghiaccio e bottiglie. Preventivo gratuito.',
      en: 'A bartender for your graduation party in Rome: from the toast to the night with friends. I bring the kit, the ice and the bottles. Free quote.',
    },
  },
  {
    key: 'aziendale',
    position: 6,
    inNavigation: true,
    slugIt: 'cocktail-bar-eventi-aziendali-roma',
    slugEn: 'corporate-cocktail-bar-rome',
    eventTypeSlug: 'aziendale',
    recommendedPackage: '',
    faqTopic: 'general',
    heroImagePath: '/images/landing/aziendale.jpg',
    heroTitle: {
      it: 'Bartender per eventi aziendali a Roma',
      en: 'Bartender for corporate events in Rome',
    },
    heroSubtitle: {
      it: 'Inaugurazioni, cene di Natale, serate di squadra: drink preparati al momento, e un solo referente.',
      en: 'Openings, Christmas dinners, team nights: drinks made on the spot, and one person to deal with.',
    },
    highlights: {
      it: [
        'Orari concordati prima e rispettati',
        'Attrezzatura, ghiaccio e bottiglie li porto io',
        'Un solo referente: io',
        'Preventivo gratuito e su misura',
      ],
      en: [
        'Timings agreed in advance and kept',
        'I bring the kit, the ice and the bottles',
        'One person to deal with: me',
        'Free quote, made to measure',
      ],
    },
    body: {
      it: `## Cosa mi serve sapere

Per prepararti una proposta mi bastano data, luogo, numero di persone e orari. Ti rispondo io.

## Come lavoro

Lavoro veloce e con precisione: sulle navi da crociera sono abituato a servire tante persone in poco tempo.

## Una nota pratica

Se per la tua azienda servono documenti particolari, dimmelo quando mi scrivi: vediamo subito se posso fornirli.`,
      en: `## What I need to know

To put a proposal together I only need the date, the place, the number of people and the timings. I reply myself.

## How I work

I work fast and precisely: on cruise ships I’m used to serving a lot of people in a short time.

## A practical note

If your company needs particular paperwork, tell me when you get in touch: we will see straight away whether I can provide it.`,
    },
    seoTitle: {
      it: 'Cocktail bar per eventi aziendali a Roma',
      en: 'Corporate event cocktail bar in Rome',
    },
    seoDescription: {
      it: 'Un bartender per i tuoi eventi aziendali a Roma: inaugurazioni, cene di Natale, serate di squadra. Orari concordati e un solo referente. Preventivo gratuito.',
      en: 'A bartender for your corporate events in Rome: openings, Christmas dinners, team nights. Agreed timings and one person to deal with. Free quote.',
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
      it: 'Cosa c’è dentro un preventivo, cosa sposta davvero il prezzo e le domande da fare prima di scegliere.',
      en: 'What goes into a quote, what really moves the price and the questions to ask before you choose.',
    },
    seoTitle: {
      it: 'Quanto costa un cocktail bar a domicilio a Roma',
      en: 'What a private cocktail bar costs in Rome',
    },
    seoDescription: {
      it: 'Cosa comprende il preventivo di un cocktail bar a domicilio a Roma, cosa fa cambiare il prezzo e le domande da fare prima di scegliere.',
      en: 'What a private cocktail bar quote in Rome includes, what changes the price and the questions to ask before you choose.',
    },
    body: {
      it: `Il prezzo di un bartender a domicilio cambia molto a seconda di cosa comprende. Prima di confrontare due preventivi, conviene capire quali voci ci sono dentro.

## Cosa può esserci in un preventivo

- **Il bartender.** La persona che prepara i drink per tutta la sera.
- **Le bottiglie.** Alcolici, mixer, succhi e frutta. Io le compro e le porto: non devi fare la spesa né calcolare le quantità.
- **Il ghiaccio.** Ne serve più di quanto si pensi, ed è la prima cosa che finisce.
- **Attrezzi e bicchieri.** Shaker, attrezzi da bar e bicchieri, che nel mio caso sono monouso.

Se un preventivo non comprende le bottiglie, quella spesa resta a te: tienine conto quando confronti i numeri.

## Cosa sposta il prezzo

- **Quante persone bevono.** È il fattore principale.
- **Cosa bevono.** Un drink con un distillato pregiato costa di più; uno con tanta frutta fresca richiede più tempo.
- **Il posto.** Distanza, accessi e spazio a disposizione contano.
- **Gli orari.** Quanto dura la festa e quando si beve di più.

## Le domande da fare

1. Le bottiglie sono comprese?
2. Il ghiaccio è compreso?
3. Cosa devo mettere a disposizione io?
4. Cosa succede se gli ospiti aumentano?
5. Il prezzo concordato può cambiare a fine serata?

## Il mio preventivo

Ogni festa è diversa, quindi lo faccio su misura: mi racconti la festa dal modulo e ti rispondo io. È gratuito e non impegna.`,
      en: `The price of a private bartender varies a lot depending on what it includes. Before comparing two quotes, it is worth understanding what is inside them.

## What a quote can include

- **The bartender.** The person who makes the drinks all night.
- **The bottles.** Spirits, mixers, juices and fruit. I buy them and bring them: you don’t have to shop or work out quantities.
- **The ice.** You need more than you think, and it is the first thing to run out.
- **Tools and cups.** A shaker, bar tools and cups, which in my case are disposable.

If a quote doesn’t include the bottles, that cost is still yours: keep it in mind when you compare the numbers.

## What moves the price

- **How many people drink.** It is the main factor.
- **What they drink.** A drink with a premium spirit costs more; one with lots of fresh fruit takes longer.
- **The place.** Distance, access and the space available all count.
- **The timings.** How long the party lasts and when people drink the most.

## Questions worth asking

1. Are the bottles included?
2. Is the ice included?
3. What do I need to provide?
4. What happens if more guests turn up?
5. Can the agreed price change at the end of the night?

## My quote

Every party is different, so I make every quote to measure: tell me about the party through the form and I reply myself. It is free and commits you to nothing.`,
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
      it: 'Un conto pratico per capire quanti drink, quanto ghiaccio e quanti bicchieri servono, e gli errori più comuni.',
      en: 'A practical way to work out how many drinks, how much ice and how many cups you need, and the most common mistakes.',
    },
    seoTitle: {
      it: 'Quanti cocktail servono per una festa di 30 persone',
      en: 'How many cocktails do you need for a party of 30?',
    },
    seoDescription: {
      it: 'Quanti drink, quanto ghiaccio e quanti bicchieri servono per una festa di 30 persone: un conto pratico e gli errori più comuni da evitare.',
      en: 'How many drinks, how much ice and how many cups you need for a party of 30: a practical calculation and the most common mistakes to avoid.',
    },
    body: {
      it: `La risposta breve: per 30 persone, in una serata di quattro ore, conta indicativamente **tra 75 e 105 drink**. Il numero vero dipende dalla festa, quindi ecco come ragionare.

## Quanto si beve

Una stima prudente è di **2,5–3,5 drink a persona** in una serata di quattro ore. Il numero sale se fa caldo, se la festa finisce tardi o se c’è poco da mangiare; scende se c’è una cena vera.

## Quante bottiglie

Con una dose da 5 cl, da una bottiglia da 70 cl escono **14 drink**. Per 90 drink servono quindi sei o sette bottiglie di distillato, da dividere fra le basi che scegli: gin, vodka, rum, tequila. A queste si aggiungono mixer, succhi e frutta.

## Il ghiaccio

È la cosa che finisce per prima. Conta almeno **mezzo chilo a persona**, fino a un chilo d’estate: per 30 persone, dai 15 ai 30 kg. Serve per shakerare, per riempire i bicchieri e per tenere in fresco le bottiglie.

## I bicchieri

Calcola **almeno due bicchieri a persona**, di più se non pensi di lavarli durante la serata.

## Gli errori più comuni

- **Una carta troppo lunga.** Più drink in carta vuol dire più bottiglie aperte e più attesa. Pochi drink fatti bene funzionano meglio.
- **Dimenticare chi non beve.** Un paio di analcolici costruiti come cocktail veri fanno la differenza.
- **Sottovalutare lime e limoni.** Nei sour se ne usano tanti.
- **Comprare il ghiaccio troppo presto,** senza un posto dove conservarlo.

## Se preferisci non pensarci

Le bottiglie le compro io e le quantità le calcolo io, sui gusti tuoi e dei tuoi ospiti. Raccontami la festa e ti preparo un preventivo.`,
      en: `The short answer: for 30 people over a four-hour evening, allow roughly **between 75 and 105 drinks**. The real number depends on the party, so here is how to think about it.

## How much people drink

A cautious estimate is **2.5–3.5 drinks per person** over four hours. It goes up if it is hot, if the party runs late or if there is little to eat; it goes down if there is a proper dinner.

## How many bottles

At a 5 cl measure, a 70 cl bottle gives **14 drinks**. For 90 drinks you need six or seven bottles of spirits, split between the bases you choose: gin, vodka, rum, tequila. Then add mixers, juices and fruit.

## The ice

It is the first thing to run out. Allow at least **half a kilo per person**, up to a kilo in summer: for 30 people, 15 to 30 kg. It is for shaking, for filling the cups and for keeping the bottles cold.

## The cups

Allow **at least two cups per person**, more if you are not planning to wash any during the night.

## The most common mistakes

- **A list that is too long.** More drinks on the list means more open bottles and longer waits. A few drinks made well work better.
- **Forgetting the people who don’t drink.** A couple of alcohol-free drinks built like real cocktails make a difference.
- **Underestimating limes and lemons.** Sours use a lot of them.
- **Buying the ice too early,** with nowhere to keep it.

## If you would rather not think about it

I buy the bottles and I work out the quantities, around your tastes and your guests’. Tell me about the party and I’ll put a quote together.`,
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
      it: 'Dove mettere la postazione, come evitare la coda, quanto ghiaccio serve e perché una carta corta funziona meglio.',
      en: 'Where to set up, how to avoid the queue, how much ice you need and why a short list works better.',
    },
    seoTitle: {
      it: 'Come organizzare un open bar in casa: guida pratica',
      en: 'How to run an open bar at home: a practical guide',
    },
    seoDescription: {
      it: 'Guida pratica all’open bar in casa: dove mettere la postazione, quali drink scegliere, quanto ghiaccio e quanti bicchieri servono.',
      en: 'A practical guide to an open bar at home: where to set up, which drinks to choose, how much ice and how many cups you need.',
    },
    body: {
      it: `Un open bar in casa raramente va male per colpa dei cocktail. Va male per la logistica: la postazione nel posto sbagliato, la coda, il ghiaccio che finisce, una carta troppo lunga.

## Dove mettere la postazione

Non nell’angolo più comodo, ma in un punto di passaggio, dove le persone si muovono. Intorno serve spazio per due o tre persone in attesa senza bloccare il passaggio. Evita la cucina: è già il posto dove si ammassano tutti.

## Pochi drink, fatti bene

Con troppi cocktail in carta le persone ci mettono di più a scegliere, si aprono troppe bottiglie e l’attesa si allunga. Meglio una carta corta, per esempio:

- uno o due drink **veloci da preparare**, come Gin Tonic o Spritz;
- un paio di **sour**, come Margarita o Daiquiri;
- uno **lungo e fresco**, come Mojito o Paloma;
- uno **da fine serata**, come l’Espresso Martini;
- e almeno un **analcolico**.

## La coda

Si forma quasi sempre all’inizio, quando arrivano tutti insieme. Un drink di benvenuto già pronto, da offrire a chi entra, toglie il primo picco e mette subito qualcosa in mano a tutti.

## Ghiaccio, bicchieri, rifiuti

- **Ghiaccio:** da mezzo chilo a un chilo a persona, a seconda del caldo.
- **Bicchieri:** almeno due a persona.
- **Rifiuti:** un paio di sacchi vicino alla postazione, non uno solo in cucina.

## Quando chiamare qualcuno

Con pochi amici, un open bar in casa si gestisce. Con tanti ospiti diventa un lavoro vero, e di solito tocca a chi organizza passare la serata a versare. È lì che posso pensarci io: porto attrezzi, ghiaccio e bottiglie, e tu stai con i tuoi ospiti.`,
      en: `An open bar at home rarely goes wrong because of the cocktails. It goes wrong on logistics: the bar in the wrong place, the queue, the ice running out, a list that is too long.

## Where to set up

Not in the most convenient corner, but somewhere people pass through. Leave room for two or three people waiting without blocking the way. Avoid the kitchen: it is already where everyone crowds.

## A few drinks, made well

With too many cocktails on the list people take longer to choose, too many bottles get opened and the wait gets longer. A short list works better, for example:

- one or two drinks that are **quick to make**, like a Gin & Tonic or a Spritz;
- a couple of **sours**, like a Margarita or a Daiquiri;
- one **long, fresh** drink, like a Mojito or a Paloma;
- one **end-of-night** drink, like an Espresso Martini;
- and at least one **alcohol-free** drink.

## The queue

It almost always forms at the start, when everyone arrives at once. A welcome drink ready to hand to people as they come in takes away the first rush and puts something in everyone’s hand straight away.

## Ice, cups, rubbish

- **Ice:** half a kilo to a kilo per person, depending on the heat.
- **Cups:** at least two per person.
- **Rubbish:** a couple of bags next to the bar, not one in the kitchen.

## When to call someone

With a few friends, an open bar at home is manageable. With a lot of guests it becomes a real job, and the host usually ends up pouring all night. That is where I can take over: I bring the tools, the ice and the bottles, and you stay with your guests.`,
    },
  },
];
