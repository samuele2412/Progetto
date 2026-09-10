/**
 * Seed catalogue: formats, add-ons, the cocktail list and the event types.
 *
 * These rows are inserted once by `npm run db:seed`; after that the admin panel
 * owns them. Prices are the reasoned starting point from docs/03-pricing.md —
 * they are a commercial decision, not a constant, and are meant to be reviewed.
 */
import type { Localized, LocalizedList } from '@/db/schema';

type PackageSeed = {
  slug: string;
  position: number;
  highlighted: boolean;
  name: Localized;
  kicker: Localized;
  description: Localized;
  guestsMin: number;
  guestsMax: number | null;
  pricePerGuestFrom: number;
  minimumTotal: number;
  priceNote: Localized;
  includes: LocalizedList;
  excludes: LocalizedList;
  imagePath: string;
};

export const packageSeeds: PackageSeed[] = [
  {
    slug: 'aperitivo',
    position: 1,
    highlighted: false,
    name: { it: 'Aperitivo', en: 'Aperitivo' },
    kicker: { it: 'Cene e serate in casa', en: 'Dinners and evenings at home' },
    description: {
      it: 'Il bar completo per una serata in casa o su un terrazzo. Un bartender, un bancone vero, quattro cocktail scelti da te e tutto quello che serve per servirli come si deve.',
      en: 'The full bar for an evening at home or on a terrace. One bartender, a real counter, four cocktails you choose, and everything needed to serve them properly.',
    },
    guestsMin: 12,
    guestsMax: 20,
    pricePerGuestFrom: 39,
    minimumTotal: 690,
    priceNote: {
      it: 'Prezzo indicativo a ospite, tutto compreso. Il preventivo finale dipende dalla carta scelta e dalla location.',
      en: 'Indicative all-in price per guest. The final quote depends on the list you choose and on the venue.',
    },
    includes: {
      it: [
        '1 bartender professionista',
        'Bancone mobile 1,5 m + retro-bar essenziale',
        '4 cocktail dalla carta + soft drink',
        'Bottiglie, mixer e succhi: li compriamo noi',
        'Ghiaccio, bicchieri, garnish e attrezzatura',
        'Allestimento, servizio e smontaggio',
        'Circa 3 ore di servizio al bancone',
      ],
      en: [
        '1 professional bartender',
        '1.5 m mobile counter + essential back bar',
        '4 cocktails from the list + soft drinks',
        'Spirits, mixers and juices: we buy them',
        'Ice, glassware, garnish and equipment',
        'Set-up, service and clear-down',
        'Around 3 hours of service at the counter',
      ],
    },
    excludes: {
      it: ['Cocktail signature creati su misura', 'Bicchieri in vetro', 'Secondo bartender'],
      en: ['Bespoke signature cocktails', 'Real glassware', 'Second bartender'],
    },
    imagePath: '/images/packages/aperitivo.jpg',
  },
  {
    slug: 'signature',
    position: 2,
    highlighted: true,
    name: { it: 'Signature', en: 'Signature' },
    kicker: { it: 'La formula più richiesta', en: 'The most requested format' },
    description: {
      it: 'La festa vera e propria: compleanni, lauree, diciottesimi, feste in casa con musica. Sei cocktail, due dei quali firmati, bancone illuminato e welcome drink all’arrivo degli ospiti.',
      en: 'The proper party: birthdays, graduations, eighteenths, house parties with music. Six cocktails — two of them ours — a lit counter, and a welcome drink as guests arrive.',
    },
    guestsMin: 20,
    guestsMax: 45,
    pricePerGuestFrom: 34,
    minimumTotal: 890,
    priceNote: {
      it: 'Prezzo indicativo a ospite, tutto compreso. Sopra i 35 ospiti valutiamo un secondo bartender per evitare code al bancone.',
      en: 'Indicative all-in price per guest. Above 35 guests we look at a second bartender so nobody queues.',
    },
    includes: {
      it: [
        'Tutto quello che c’è in Aperitivo',
        '6 cocktail, di cui 2 signature della casa',
        'Bancone 2 m con retro-bar illuminato',
        'Welcome drink servito all’arrivo',
        'Birra artigianale e bollicine al bancone',
        'Carta dei cocktail personalizzata e stampata',
        'Circa 4 ore di servizio al bancone',
      ],
      en: [
        'Everything in Aperitivo',
        '6 cocktails, 2 of them our own signatures',
        '2 m counter with lit back bar',
        'Welcome drink served on arrival',
        'Craft beer and sparkling wine at the counter',
        'Custom printed cocktail menu',
        'Around 4 hours of service at the counter',
      ],
    },
    excludes: {
      it: ['Ghiaccio limpido scolpito', 'Sopralluogo della location'],
      en: ['Hand-cut clear ice', 'Venue site visit'],
    },
    imagePath: '/images/packages/signature.jpg',
  },
  {
    slug: 'prestige',
    position: 3,
    highlighted: false,
    name: { it: 'Prestige', en: 'Prestige' },
    kicker: { it: 'Ville, terrazze, grandi feste', en: 'Villas, terraces, big parties' },
    description: {
      it: 'Quando gli ospiti sono tanti e la location merita. Due bartender, otto cocktail, bicchieri in vetro, ghiaccio limpido e un sopralluogo prima della serata per non lasciare niente al caso.',
      en: 'For when there are a lot of guests and the venue deserves it. Two bartenders, eight cocktails, real glassware, clear ice, and a site visit beforehand so nothing is left to chance.',
    },
    guestsMin: 45,
    guestsMax: 90,
    pricePerGuestFrom: 31,
    minimumTotal: 1850,
    priceNote: {
      it: 'Prezzo indicativo a ospite, tutto compreso. Include il sopralluogo e il coordinamento con la location.',
      en: 'Indicative all-in price per guest. Includes the site visit and coordination with the venue.',
    },
    includes: {
      it: [
        'Tutto quello che c’è in Signature',
        '2 bartender al bancone',
        '8 cocktail, di cui 3 creati per il tuo evento',
        'Bancone doppio o isola centrale',
        'Bicchieri in vetro per tutti i drink',
        'Ghiaccio limpido e garnish lavorati',
        'Sopralluogo della location incluso',
        'Circa 5 ore di servizio al bancone',
      ],
      en: [
        'Everything in Signature',
        '2 bartenders at the counter',
        '8 cocktails, 3 created for your event',
        'Double counter or central island',
        'Real glassware for every drink',
        'Clear ice and worked garnish',
        'Venue site visit included',
        'Around 5 hours of service at the counter',
      ],
    },
    excludes: { it: [], en: [] },
    imagePath: '/images/packages/prestige.jpg',
  },
  {
    slug: 'su-misura',
    position: 4,
    highlighted: false,
    name: { it: 'Su misura', en: 'Bespoke' },
    kicker: { it: 'Matrimoni, aziende, oltre 90 ospiti', en: 'Weddings, companies, 90+ guests' },
    description: {
      it: 'Matrimoni, eventi aziendali, inaugurazioni, feste con più postazioni bar. Costruiamo il servizio sul programma della giornata: staff dimensionato, tempi concordati con catering e planner, carta scritta apposta.',
      en: 'Weddings, corporate events, openings, parties with more than one bar station. We build the service around the day’s programme: staff sized to the job, timings agreed with caterers and planners, a list written for the occasion.',
    },
    guestsMin: 90,
    guestsMax: null,
    pricePerGuestFrom: 0,
    minimumTotal: 0,
    priceNote: {
      it: 'Preventivo dedicato. Parliamone: bastano data, luogo e numero di invitati per una prima cifra realistica.',
      en: 'Dedicated quote. Let’s talk: a date, a place and a guest count are enough for a realistic first figure.',
    },
    includes: {
      it: [
        'Staff dimensionato sull’evento',
        'Più postazioni bar e mobile bar aggiuntivi',
        'Mixology su misura e prova cocktail',
        'Coordinamento con catering, planner e location',
        'Timeline della giornata concordata',
        'Trasferte fuori Roma e fuori regione su richiesta',
      ],
      en: [
        'Staff sized to the event',
        'Multiple bar stations and extra mobile bars',
        'Bespoke mixology and a tasting session',
        'Coordination with caterers, planners and the venue',
        'An agreed timeline for the day',
        'Travel outside Rome and outside the region on request',
      ],
    },
    excludes: { it: [], en: [] },
    imagePath: '/images/packages/su-misura.jpg',
  },
];

export const addonSeeds = [
  {
    slug: 'bartender-extra',
    position: 1,
    name: { it: 'Bartender aggiuntivo', en: 'Extra bartender' },
    description: {
      it: 'Consigliato oltre i 35 ospiti o quando il servizio si concentra in poche ore.',
      en: 'Recommended above 35 guests, or when service is squeezed into a couple of hours.',
    },
    price: { it: 'da 220 €', en: 'from €220' },
  },
  {
    slug: 'ora-extra',
    position: 2,
    name: { it: 'Ora di servizio extra', en: 'Extra hour of service' },
    description: {
      it: 'Da concordare prima. Se la festa si allunga, si può decidere anche sul momento.',
      en: 'Agreed in advance — or on the night, if the party runs long.',
    },
    price: { it: 'da 120 €', en: 'from €120' },
  },
  {
    slug: 'cocktail-firma',
    position: 3,
    name: { it: 'Cocktail firma su misura', en: 'Bespoke signature cocktail' },
    description: {
      it: 'Un drink creato per la tua serata, con il nome che scegli tu e la carta stampata.',
      en: 'A drink created for your night, named by you, printed on the menu.',
    },
    price: { it: '150 €', en: '€150' },
  },
  {
    slug: 'bicchieri-vetro',
    position: 4,
    name: { it: 'Bicchieri in vetro', en: 'Real glassware' },
    description: {
      it: 'Al posto dei bicchieri in materiale riciclabile. Noleggio, trasporto e lavaggio inclusi.',
      en: 'Instead of recyclable cups. Hire, transport and washing included.',
    },
    price: { it: 'da 2,50 €/ospite', en: 'from €2.50/guest' },
  },
  {
    slug: 'bollicine',
    position: 5,
    name: { it: 'Bollicine per il brindisi', en: 'Sparkling wine for the toast' },
    description: {
      it: 'Servizio dedicato al momento del brindisi, con calici e tempistica concordata.',
      en: 'A dedicated pour for the toast, with proper glasses and agreed timing.',
    },
    price: { it: 'da 9 €/ospite', en: 'from €9/guest' },
  },
  {
    slug: 'analcolico-premium',
    position: 6,
    name: { it: 'Angolo analcolico premium', en: 'Premium alcohol-free corner' },
    description: {
      it: 'Quattro mocktail costruiti come cocktail veri: chi non beve non si accontenta di una cola.',
      en: 'Four mocktails built like real cocktails — non-drinkers deserve better than a cola.',
    },
    price: { it: 'da 6 €/ospite', en: 'from €6/guest' },
  },
  {
    slug: 'ghiaccio-limpido',
    position: 7,
    name: { it: 'Ghiaccio limpido e garnish lavorati', en: 'Clear ice and worked garnish' },
    description: {
      it: 'Cubi trasparenti tagliati a mano e guarnizioni preparate il giorno stesso.',
      en: 'Hand-cut clear cubes and garnish prepared the same day.',
    },
    price: { it: 'da 120 €', en: 'from €120' },
  },
  {
    slug: 'trasferta',
    position: 8,
    name: { it: 'Trasferta fuori GRA o fuori provincia', en: 'Travel beyond the GRA or the province' },
    description: {
      it: 'Calcolata sulla distanza reale. Fuori regione solo per eventi di dimensione adeguata.',
      en: 'Based on actual distance. Outside the region only for events of a suitable size.',
    },
    price: { it: 'da 60 €', en: 'from €60' },
  },
  {
    slug: 'sopralluogo',
    position: 9,
    name: { it: 'Sopralluogo della location', en: 'Venue site visit' },
    description: {
      it: 'Per capire spazi, corrente, accessi e dove mettere il bancone. Scalato dal saldo se confermi.',
      en: 'To check space, power, access and where the counter goes. Deducted from the balance if you book.',
    },
    price: { it: '80 €', en: '€80' },
  },
];

/**
 * A deliberately short list. Classics are named as they are known; the
 * "signature" entries are working titles the owner should replace with his own
 * — the descriptions say what the drink is like, not an exact recipe.
 */
export const cocktailSeeds = [
  // --- Classics -----------------------------------------------------------
  {
    slug: 'negroni',
    category: 'classics' as const,
    name: 'Negroni',
    featured: true,
    ingredients: { it: 'Gin, bitter, vermouth rosso', en: 'Gin, bitter, red vermouth' },
    description: {
      it: 'Il più romano dei cocktail non romani. Amaro, diretto, servito su un cubo grande.',
      en: 'The most Roman of non-Roman cocktails. Bitter, direct, served over one big cube.',
    },
  },
  {
    slug: 'americano',
    category: 'classics' as const,
    name: 'Americano',
    featured: false,
    ingredients: { it: 'Bitter, vermouth rosso, soda', en: 'Bitter, red vermouth, soda' },
    description: {
      it: 'Più leggero del Negroni, perfetto come primo giro quando gli ospiti arrivano.',
      en: 'Lighter than a Negroni — the right first round as guests arrive.',
    },
  },
  {
    slug: 'espresso-martini',
    category: 'classics' as const,
    name: 'Espresso Martini',
    featured: true,
    ingredients: { it: 'Vodka, caffè espresso, liquore al caffè', en: 'Vodka, espresso, coffee liqueur' },
    description: {
      it: 'Quello che a mezzanotte rimette in piedi la festa. Caffè estratto al momento, sempre.',
      en: 'The one that puts the party back on its feet at midnight. Coffee pulled fresh, always.',
    },
  },
  {
    slug: 'old-fashioned',
    category: 'classics' as const,
    name: 'Old Fashioned',
    featured: false,
    ingredients: { it: 'Bourbon, zucchero, angostura', en: 'Bourbon, sugar, angostura' },
    description: {
      it: 'Tre ingredienti e nessun posto dove nascondersi. Si fa bene o non si fa.',
      en: 'Three ingredients and nowhere to hide. Do it properly or don’t do it.',
    },
  },
  {
    slug: 'margarita',
    category: 'classics' as const,
    name: 'Margarita',
    featured: true,
    ingredients: { it: 'Tequila, lime, triple sec', en: 'Tequila, lime, triple sec' },
    description: {
      it: 'Lime spremuto sul momento. È l’unica cosa che la rende diversa da tutte le altre.',
      en: 'Lime squeezed to order. That single detail is the whole difference.',
    },
  },
  {
    slug: 'moscow-mule',
    category: 'classics' as const,
    name: 'Moscow Mule',
    featured: false,
    ingredients: { it: 'Vodka, lime, ginger beer', en: 'Vodka, lime, ginger beer' },
    description: {
      it: 'Nel rame, ghiacciato. Piace praticamente a chiunque: utile quando gli invitati sono tanti.',
      en: 'In copper, ice cold. Almost everyone likes it — useful when the guest list is long.',
    },
  },
  {
    slug: 'daiquiri',
    category: 'classics' as const,
    name: 'Daiquiri',
    featured: false,
    ingredients: { it: 'Rum bianco, lime, zucchero', en: 'White rum, lime, sugar' },
    description: {
      it: 'Secco e pulito. Il test più onesto per capire se un bartender sa lavorare.',
      en: 'Dry and clean. The most honest test of whether a bartender can actually work.',
    },
  },
  {
    slug: 'whisky-sour',
    category: 'classics' as const,
    name: 'Whisky Sour',
    featured: false,
    ingredients: { it: 'Bourbon, limone, zucchero, albume', en: 'Bourbon, lemon, sugar, egg white' },
    description: {
      it: 'Schiuma densa e acidità giusta. Disponibile anche in versione senza albume.',
      en: 'Dense foam, the right acidity. Available without egg white too.',
    },
  },

  // --- Fresh --------------------------------------------------------------
  {
    slug: 'mojito',
    category: 'fresh' as const,
    name: 'Mojito',
    featured: true,
    ingredients: { it: 'Rum, lime, menta, soda', en: 'Rum, lime, mint, soda' },
    description: {
      it: 'Menta comprata il giorno stesso, ghiaccio tritato al momento. Estate, terrazzi, piscine.',
      en: 'Mint bought the same day, ice crushed to order. Summer, terraces, pools.',
    },
  },
  {
    slug: 'spritz-al-bitter',
    category: 'fresh' as const,
    name: 'Spritz al bitter',
    featured: false,
    ingredients: { it: 'Bitter, prosecco, soda', en: 'Bitter, prosecco, soda' },
    description: {
      it: 'Fatto con le proporzioni giuste, non annegato nella soda. Il giro d’apertura per eccellenza.',
      en: 'Made in the right proportions, not drowned in soda. The opening round, done right.',
    },
  },
  {
    slug: 'gin-tonic-dautore',
    category: 'fresh' as const,
    name: 'Gin Tonic d’autore',
    featured: true,
    ingredients: { it: 'Gin selezionato, tonica abbinata, botanica', en: 'Selected gin, matched tonic, botanicals' },
    description: {
      it: 'Non un gin qualsiasi con una tonica qualsiasi: scegliamo l’abbinamento insieme prima della serata.',
      en: 'Not any gin with any tonic: we choose the pairing together before the night.',
    },
  },
  {
    slug: 'paloma',
    category: 'fresh' as const,
    name: 'Paloma',
    featured: false,
    ingredients: { it: 'Tequila, pompelmo, lime, sale', en: 'Tequila, grapefruit, lime, salt' },
    description: {
      it: 'Dissetante e leggermente amaro. Regge il caldo romano di luglio meglio di quasi tutto.',
      en: 'Thirst-quenching and slightly bitter. It survives a Roman July better than most.',
    },
  },
  {
    slug: 'basil-smash',
    category: 'fresh' as const,
    name: 'Basil Smash',
    featured: false,
    ingredients: { it: 'Gin, limone, basilico', en: 'Gin, lemon, basil' },
    description: {
      it: 'Verde, profumatissimo, sorprende sempre chi dice “il gin non mi piace”.',
      en: 'Green, intensely aromatic, and it always surprises the “I don’t like gin” crowd.',
    },
  },

  // --- Signature (working titles — replace with your own) ------------------
  {
    slug: 'ponentino',
    category: 'signature' as const,
    name: 'Ponentino',
    featured: true,
    ingredients: { it: 'Gin, vermouth bianco, agrumi, erbe mediterranee', en: 'Gin, white vermouth, citrus, Mediterranean herbs' },
    description: {
      it: 'Costruito attorno al vento che a Roma arriva la sera e rende sopportabile agosto. Secco, agrumato, profumato di erbe.',
      en: 'Built around the evening wind that makes a Roman August bearable. Dry, citrus-led, herbal.',
    },
  },
  {
    slug: 'sette-colli',
    category: 'signature' as const,
    name: 'Sette Colli',
    featured: true,
    ingredients: { it: 'Rum invecchiato, amaro italiano, miele, agrumi', en: 'Aged rum, Italian amaro, honey, citrus' },
    description: {
      it: 'Il drink da fine serata: rotondo, un po’ amaro, si beve piano seduti da qualche parte.',
      en: 'The end-of-night drink: round, faintly bitter, made to be sipped sitting down somewhere.',
    },
  },
  {
    slug: 'ora-blu',
    category: 'signature' as const,
    name: 'Ora Blu',
    featured: false,
    ingredients: { it: 'Vodka o gin, frutta di stagione, bollicine', en: 'Vodka or gin, seasonal fruit, sparkling wine' },
    description: {
      it: 'Il welcome drink: leggero, servito nel momento in cui la luce cala e gli ospiti arrivano.',
      en: 'The welcome drink: light, poured exactly as the light drops and the guests arrive.',
    },
  },

  // --- Zero proof ---------------------------------------------------------
  {
    slug: 'ponentino-zero',
    category: 'zero' as const,
    name: 'Ponentino Zero',
    featured: false,
    ingredients: { it: 'Distillato analcolico, agrumi, erbe, tonica', en: 'Non-alcoholic spirit, citrus, herbs, tonic' },
    description: {
      it: 'La versione senza alcol del nostro signature. Stesso bicchiere, stessa cura.',
      en: 'The alcohol-free version of our signature. Same glass, same care.',
    },
  },
  {
    slug: 'ginger-sour-zero',
    category: 'zero' as const,
    name: 'Ginger Sour Zero',
    featured: false,
    ingredients: { it: 'Zenzero, limone, sciroppo, soda', en: 'Ginger, lemon, syrup, soda' },
    description: {
      it: 'Pungente e acido, con la stessa struttura di un sour. Non è una spremuta.',
      en: 'Sharp and sour, built like a real sour. It is not a fruit juice.',
    },
  },
  {
    slug: 'cetriolo-tonica',
    category: 'zero' as const,
    name: 'Cetriolo & Tonica',
    featured: false,
    ingredients: { it: 'Cetriolo, lime, tonica, pepe rosa', en: 'Cucumber, lime, tonic, pink pepper' },
    description: {
      it: 'Lunghissimo e dissetante. Chi guida ringrazia, soprattutto d’estate.',
      en: 'Long and refreshing. Designated drivers are grateful, especially in summer.',
    },
  },
];

export const eventTypeSeeds = [
  {
    slug: 'compleanno',
    position: 1,
    selectable: true,
    name: { it: 'Compleanno', en: 'Birthday' },
    blurb: {
      it: 'Da venti amici in casa a cento in terrazza: il bancone si adatta, la carta pure.',
      en: 'From twenty friends at home to a hundred on a terrace: the counter adapts, so does the list.',
    },
    imagePath: '/images/events/compleanno.jpg',
  },
  {
    slug: 'festa-privata',
    position: 2,
    selectable: true,
    name: { it: 'Festa privata', en: 'Private party' },
    blurb: {
      it: 'Nessuna occasione particolare, solo una bella serata. Spesso le migliori.',
      en: 'No particular occasion, just a good night. Often the best ones.',
    },
    imagePath: '/images/events/festa-privata.jpg',
  },
  {
    slug: 'diciottesimo',
    position: 3,
    selectable: true,
    name: { it: 'Diciottesimo', en: '18th birthday' },
    blurb: {
      it: 'Servizio controllato, analcolici curati quanto gli altri drink, genitori tranquilli.',
      en: 'Controlled service, alcohol-free drinks made with the same care, parents at ease.',
    },
    imagePath: '/images/events/diciottesimo.jpg',
  },
  {
    slug: 'laurea',
    position: 4,
    selectable: true,
    name: { it: 'Laurea', en: 'Graduation' },
    blurb: {
      it: 'Si parte con il brindisi e si finisce a ballare. Il bar regge entrambe le fasi.',
      en: 'It starts with a toast and ends with dancing. The bar handles both halves.',
    },
    imagePath: '/images/events/laurea.jpg',
  },
  {
    slug: 'matrimonio',
    position: 5,
    selectable: true,
    name: { it: 'Matrimonio', en: 'Wedding' },
    blurb: {
      it: 'Open bar dopo il taglio della torta, coordinato con catering e planner.',
      en: 'An open bar after the cake, coordinated with the caterers and the planner.',
    },
    imagePath: '/images/events/matrimonio.jpg',
  },
  {
    slug: 'aziendale',
    position: 6,
    selectable: true,
    name: { it: 'Evento aziendale', en: 'Corporate event' },
    blurb: {
      it: 'Inaugurazioni, Natale, team building. Fattura regolare e tempi rispettati.',
      en: 'Openings, Christmas parties, team building. Proper invoicing, timings respected.',
    },
    imagePath: '/images/events/aziendale.jpg',
  },
  {
    slug: 'villa-piscina',
    position: 7,
    selectable: true,
    name: { it: 'Festa in villa o a bordo piscina', en: 'Villa or poolside party' },
    blurb: {
      it: 'Grandi spazi, tanto caldo, ghiaccio che va calcolato bene. La nostra specialità estiva.',
      en: 'Big spaces, real heat, ice that has to be calculated properly. Our summer speciality.',
    },
    imagePath: '/images/events/villa.jpg',
  },
  {
    slug: 'altro',
    position: 8,
    selectable: true,
    name: { it: 'Altro', en: 'Something else' },
    blurb: {
      it: 'Presentazioni, shooting, anniversari, cene private. Chiedi pure.',
      en: 'Launches, shoots, anniversaries, private dinners. Just ask.',
    },
    imagePath: '/images/events/altro.jpg',
  },
];
