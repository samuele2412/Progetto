/**
 * Seed catalogue: formats, add-ons, the cocktail list and the event types.
 *
 * These rows are inserted once by `npm run db:seed`; after that the admin panel
 * owns them. Copy follows docs/13-brand-voice.md — first person, "tu", and
 * nothing the service does not actually do today.
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

type AddonSeed = {
  slug: string;
  position: number;
  name: Localized;
  description: Localized;
  price: Localized;
};

/**
 * No formats and no extras for now. The four formats and nine priced extras
 * this site launched with were estimates, not Samuele's offer: they promised a
 * counter, glassware and a second bartender he does not have, at prices he has
 * not set. Every quote is made to measure until he decides otherwise — and
 * when he does, he adds formats from the panel and the service page shows them
 * on its own. The old rows are kept, switched off, on existing installs.
 */
export const packageSeeds: PackageSeed[] = [];

export const addonSeeds: AddonSeed[] = [];

/**
 * A short list of classics anyone can order by name, plus two alcohol-free
 * drinks. Descriptions say what the drink is like, not how the service is
 * equipped: no claims about machines, copper mugs or ice that is not confirmed.
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
      it: 'Amaro e deciso. Tre ingredienti in parti uguali, e niente da nascondere.',
      en: 'Bitter and bold. Three ingredients in equal parts, and nowhere to hide.',
    },
  },
  {
    slug: 'americano',
    category: 'classics' as const,
    name: 'Americano',
    featured: false,
    ingredients: { it: 'Bitter, vermouth rosso, soda', en: 'Bitter, red vermouth, soda' },
    description: {
      it: 'Più leggero del Negroni, allungato con la soda. Ottimo per cominciare.',
      en: 'Lighter than a Negroni, lengthened with soda. A good way to start.',
    },
  },
  {
    slug: 'espresso-martini',
    category: 'classics' as const,
    name: 'Espresso Martini',
    featured: true,
    ingredients: { it: 'Vodka, caffè espresso, liquore al caffè', en: 'Vodka, espresso, coffee liqueur' },
    description: {
      it: 'Caffè, vodka e liquore al caffè. Quello che rimette in moto la serata.',
      en: 'Coffee, vodka and coffee liqueur. The one that gets the night going again.',
    },
  },
  {
    slug: 'old-fashioned',
    category: 'classics' as const,
    name: 'Old Fashioned',
    featured: false,
    ingredients: { it: 'Bourbon, zucchero, angostura', en: 'Bourbon, sugar, angostura' },
    description: {
      it: 'Pochi ingredienti: si sente subito se è fatto bene.',
      en: 'Few ingredients: you can tell straight away if it is made well.',
    },
  },
  {
    slug: 'margarita',
    category: 'classics' as const,
    name: 'Margarita',
    featured: true,
    ingredients: { it: 'Tequila, lime, triple sec', en: 'Tequila, lime, triple sec' },
    description: {
      it: 'Un sour: una famiglia di drink che mi piace per la sua semplicità.',
      en: 'A sour: a family of drinks I like for its simplicity.',
    },
  },
  {
    slug: 'moscow-mule',
    category: 'classics' as const,
    name: 'Moscow Mule',
    featured: false,
    ingredients: { it: 'Vodka, lime, ginger beer', en: 'Vodka, lime, ginger beer' },
    description: {
      it: 'Fresco e piccante. Piace quasi a tutti.',
      en: 'Fresh and spicy. Almost everyone likes it.',
    },
  },
  {
    slug: 'daiquiri',
    category: 'classics' as const,
    name: 'Daiquiri',
    featured: false,
    ingredients: { it: 'Rum bianco, lime, zucchero', en: 'White rum, lime, sugar' },
    description: {
      it: 'Secco e pulito. Un altro sour, ridotto all’essenziale.',
      en: 'Dry and clean. Another sour, down to the essentials.',
    },
  },
  {
    slug: 'whisky-sour',
    category: 'classics' as const,
    name: 'Whisky Sour',
    featured: false,
    ingredients: { it: 'Bourbon, limone, zucchero, albume', en: 'Bourbon, lemon, sugar, egg white' },
    description: {
      it: 'Il sour più classico. Si può fare anche senza albume.',
      en: 'The most classic sour. It can be made without egg white too.',
    },
  },

  // --- Fresh --------------------------------------------------------------
  {
    slug: 'mojito',
    category: 'fresh' as const,
    name: 'Mojito',
    featured: false,
    ingredients: { it: 'Rum, lime, menta, soda', en: 'Rum, lime, mint, soda' },
    description: {
      it: 'Fresco, da estate e da terrazza.',
      en: 'Fresh, made for summer and terraces.',
    },
  },
  {
    slug: 'spritz-al-bitter',
    category: 'fresh' as const,
    name: 'Spritz al bitter',
    featured: false,
    ingredients: { it: 'Bitter, prosecco, soda', en: 'Bitter, prosecco, soda' },
    description: {
      it: 'Con le proporzioni giuste. Il giro d’apertura più classico che ci sia.',
      en: 'In the right proportions. The most classic opening round there is.',
    },
  },
  {
    slug: 'gin-tonic-dautore',
    category: 'fresh' as const,
    name: 'Gin Tonic',
    featured: false,
    ingredients: { it: 'Gin, acqua tonica, guarnizione', en: 'Gin, tonic water, garnish' },
    description: {
      it: 'Semplice solo in apparenza: conta l’abbinamento fra gin e tonica.',
      en: 'Simple only on the surface: it all comes down to pairing the gin and the tonic.',
    },
  },
  {
    slug: 'paloma',
    category: 'fresh' as const,
    name: 'Paloma',
    featured: false,
    ingredients: { it: 'Tequila, pompelmo, lime, sale', en: 'Tequila, grapefruit, lime, salt' },
    description: {
      it: 'Dissetante e leggermente amaro.',
      en: 'Thirst-quenching and slightly bitter.',
    },
  },
  {
    slug: 'basil-smash',
    category: 'fresh' as const,
    name: 'Basil Smash',
    featured: false,
    ingredients: { it: 'Gin, limone, basilico', en: 'Gin, lemon, basil' },
    description: {
      it: 'Profumato. Convince anche chi dice che il gin non gli piace.',
      en: 'Fragrant. It wins over even the people who say they don’t like gin.',
    },
  },

  // --- Zero proof ---------------------------------------------------------
  {
    slug: 'ginger-sour-zero',
    category: 'zero' as const,
    name: 'Ginger Sour Zero',
    featured: false,
    ingredients: { it: 'Zenzero, limone, sciroppo, soda', en: 'Ginger, lemon, syrup, soda' },
    description: {
      it: 'Costruito come un sour, senza alcol.',
      en: 'Built like a sour, without the alcohol.',
    },
  },
  {
    slug: 'cetriolo-tonica',
    category: 'zero' as const,
    name: 'Cetriolo & Tonica',
    featured: false,
    ingredients: { it: 'Cetriolo, lime, tonica, pepe rosa', en: 'Cucumber, lime, tonic, pink pepper' },
    description: {
      it: 'Lungo e dissetante, per chi non beve alcol.',
      en: 'Long and refreshing, for anyone not drinking alcohol.',
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
      it: 'Da pochi amici in casa a una festa grande: dimmi quanti siete e cosa vi piace.',
      en: 'From a few friends at home to a big party: tell me how many of you there are and what you like.',
    },
    imagePath: '/images/events/compleanno.jpg',
  },
  {
    slug: 'festa-privata',
    position: 2,
    selectable: true,
    name: { it: 'Festa privata', en: 'Private party' },
    blurb: {
      it: 'Nessuna occasione particolare, solo una bella serata.',
      en: 'No particular occasion, just a good night.',
    },
    imagePath: '/images/events/festa-privata.jpg',
  },
  {
    slug: 'diciottesimo',
    position: 3,
    selectable: true,
    name: { it: 'Diciottesimo', en: '18th birthday' },
    blurb: {
      it: 'Niente alcol ai minorenni, come prevede la legge. Per tutto il resto, si festeggia.',
      en: 'No alcohol for anyone under 18, as the law requires. Everything else is a party.',
    },
    imagePath: '/images/events/diciottesimo.jpg',
  },
  {
    slug: 'laurea',
    position: 4,
    selectable: true,
    name: { it: 'Laurea', en: 'Graduation' },
    blurb: {
      it: 'Si comincia con il brindisi e si finisce a ballare.',
      en: 'It starts with a toast and ends with dancing.',
    },
    imagePath: '/images/events/laurea.jpg',
  },
  {
    slug: 'matrimonio',
    position: 5,
    selectable: true,
    name: { it: 'Matrimonio', en: 'Wedding' },
    blurb: {
      it: 'Per l’aperitivo o per il dopocena, d’accordo con chi organizza la giornata.',
      en: 'For the drinks reception or after dinner, agreed with whoever runs the day.',
    },
    imagePath: '/images/events/matrimonio.jpg',
  },
  {
    slug: 'aziendale',
    position: 6,
    selectable: true,
    name: { it: 'Evento aziendale', en: 'Corporate event' },
    blurb: {
      it: 'Inaugurazioni, cene di Natale, serate di squadra.',
      en: 'Openings, Christmas dinners, team nights.',
    },
    imagePath: '/images/events/aziendale.jpg',
  },
  {
    slug: 'villa-piscina',
    position: 7,
    selectable: true,
    name: { it: 'Festa in villa o a bordo piscina', en: 'Villa or poolside party' },
    blurb: {
      it: 'Feste all’aperto e serate calde: drink freschi e tanto ghiaccio.',
      en: 'Outdoor parties and warm nights: fresh drinks and plenty of ice.',
    },
    imagePath: '/images/events/villa.jpg',
  },
  {
    slug: 'altro',
    position: 8,
    selectable: true,
    name: { it: 'Altro', en: 'Something else' },
    blurb: {
      it: 'Presentazioni, anniversari, cene private: chiedimi pure.',
      en: 'Launches, anniversaries, private dinners: just ask.',
    },
    imagePath: '/images/events/altro.jpg',
  },
];
