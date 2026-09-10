/**
 * Default site copy and configuration.
 *
 * Everything here can be overridden from the admin panel (Contenuti); these
 * values are the fallback and the seed. Placeholders in SCREAMING_SNAKE_CASE
 * are meant to be replaced before going live — the admin panel flags them.
 */

export type L = { it: string; en: string };
export type LL = { it: string[]; en: string[] };
/** A localized list of small title + body pairs (steps, value props). */
export type LPairs = { it: { title: string; body: string }[]; en: { title: string; body: string }[] };

export type SiteSettings = {
  brand: {
    name: string;
    /** Sits under the wordmark in the header and the footer. */
    descriptor: L;
    claim: L;
    legalName: string;
    vatNumber: string;
  };
  contact: {
    /** E.164, e.g. +39XXXXXXXXXX. Used for tel: links. */
    phone: string;
    /** Digits only, e.g. 39XXXXXXXXXX. Used for wa.me links. */
    whatsapp: string;
    whatsappMessage: L;
    email: string;
    serviceArea: L;
    availability: L;
    /** Prefix applied to national numbers before opening a WhatsApp chat. */
    defaultCountryCode: string;
  };
  social: { instagram: string; tiktok: string; facebook: string };
  hero: {
    eyebrow: L;
    title: L;
    subtitle: L;
    primaryCta: L;
    secondaryCta: L;
    imagePath: string;
    /** Optional short muted loop behind the hero. Leave empty to use the image. */
    videoPath: string;
    /** Three short proof points under the CTAs. */
    badges: LL;
  };
  home: {
    valuePropTitle: L;
    valuePropIntro: L;
    valueProps: LPairs;
    howTitle: L;
    howIntro: L;
    steps: LPairs;
    packagesTitle: L;
    packagesIntro: L;
    cocktailsTitle: L;
    cocktailsIntro: L;
    eventsTitle: L;
    eventsIntro: L;
    galleryTitle: L;
    galleryIntro: L;
    testimonialsTitle: L;
    testimonialsIntro: L;
    faqTitle: L;
    faqIntro: L;
    finalCtaTitle: L;
    finalCtaBody: L;
  };
  about: {
    eyebrow: L;
    title: L;
    body: L;
    /** Two or three factual lines — no CV, no superlatives. */
    facts: LL;
    imagePath: string;
    signature: string;
  };
  partners: {
    title: L;
    intro: L;
    bullets: LL;
    ctaLabel: L;
  };
  requestForm: {
    title: L;
    intro: L;
    submitLabel: L;
    reassurance: L;
    successTitle: L;
    successBody: L;
  };
  seo: {
    siteName: string;
    defaultTitle: L;
    titleTemplate: L;
    defaultDescription: L;
    ogImagePath: string;
    /** Comma-separated, used only for the LocalBusiness knowsAbout field. */
    focusKeywords: L;
  };
  legal: {
    dataController: string;
    controllerAddress: string;
    privacyEmail: string;
    lastUpdated: string;
    privacyBody: L;
    cookieBody: L;
  };
};

export const defaultSettings: SiteSettings = {
  brand: {
    name: 'Cordiale',
    descriptor: {
      it: 'Private Cocktail Bar · Roma',
      en: 'Private Cocktail Bar · Rome',
    },
    claim: {
      it: 'Tu pensa alla festa. Al bar pensiamo noi.',
      en: 'You throw the party. We take care of the bar.',
    },
    legalName: 'LEGAL_NAME_HERE',
    vatNumber: 'VAT_NUMBER_HERE',
  },

  contact: {
    phone: 'PHONE_NUMBER_HERE',
    whatsapp: 'WHATSAPP_NUMBER_HERE',
    whatsappMessage: {
      it: 'Ciao! Vorrei un cocktail bar per il mio evento a Roma. Ti racconto: ',
      en: 'Hi! I would like a cocktail bar for my event in Rome. Here are the details: ',
    },
    email: 'EMAIL_HERE',
    serviceArea: {
      it: 'Roma e provincia — fuori zona su richiesta',
      en: 'Rome and its province — further afield on request',
    },
    availability: {
      it: 'Rispondiamo tutti i giorni, 10:00–20:00',
      en: 'We reply every day, 10:00–20:00',
    },
    defaultCountryCode: '39',
  },

  social: {
    instagram: 'INSTAGRAM_URL_HERE',
    tiktok: 'TIKTOK_URL_HERE',
    facebook: '',
  },

  hero: {
    eyebrow: {
      it: 'Private cocktail bar — Roma e provincia',
      en: 'Private cocktail bar — Rome and province',
    },
    title: {
      it: 'Portiamo un bar vero alla tua festa.',
      en: 'We bring a real bar to your party.',
    },
    subtitle: {
      it: 'Bancone, bartender, attrezzatura e bottiglie. Arriviamo, montiamo, serviamo e a fine serata portiamo via tutto. Tu devi solo decidere chi invitare.',
      en: 'Counter, bartender, kit and bottles. We arrive, set up, serve, and clear everything away at the end of the night. All you have to do is decide who to invite.',
    },
    primaryCta: { it: 'Richiedi il tuo preventivo', en: 'Request your quote' },
    secondaryCta: { it: 'Guarda i cocktail', en: 'See the cocktails' },
    imagePath: '/images/hero/hero-main.jpg',
    videoPath: '',
    badges: {
      it: ['Bottiglie e ghiaccio inclusi', 'Prezzo chiuso, deciso prima', 'Montaggio e pulizia compresi'],
      en: ['Bottles and ice included', 'Fixed price, agreed upfront', 'Set-up and clean-up included'],
    },
  },

  home: {
    valuePropTitle: {
      it: 'Non è un barman a ore. È un bar che si sposta.',
      en: 'Not a bartender by the hour. A bar that travels.',
    },
    valuePropIntro: {
      it: 'La differenza fra una festa con le bottiglie sul tavolo e una serata di cui si parla per mesi sta quasi sempre in quattro cose.',
      en: 'The difference between bottles on a table and a night people talk about for months usually comes down to four things.',
    },
    valueProps: {
      it: [
        {
          title: 'Un bar vero, non un tavolo con le bottiglie',
          body: 'Bancone professionale, ghiaccio nella forma giusta per ogni drink, bicchieri veri, garnish preparati sul posto. La differenza si vede al primo giro.',
        },
        {
          title: 'Alle bottiglie pensiamo noi',
          body: 'Calcoliamo le quantità sui tuoi ospiti, facciamo la spesa e portiamo tutto. Niente code al supermercato, niente cinque bottiglie avanzate da smaltire.',
        },
        {
          title: 'Prezzo chiuso, deciso prima',
          body: 'Una cifra concordata prima dell’evento, non un conteggio a consumo a fine serata. Quello che avanza integro resta a te.',
        },
        {
          title: 'C’è una persona, non un centralino',
          body: 'Ti risponde chi sta dietro al bancone. Stessa persona dalla prima domanda all’ultimo bicchiere.',
        },
      ],
      en: [
        {
          title: 'A real bar, not a table with bottles on it',
          body: 'A professional counter, the right shape of ice for each drink, real glassware, garnish prepped on site. You notice it on the first round.',
        },
        {
          title: 'We take care of the bottles',
          body: 'We calculate quantities against your guest list, do the shopping and bring everything. No supermarket queue, no five leftover bottles to deal with.',
        },
        {
          title: 'A fixed price, agreed upfront',
          body: 'A figure agreed before the event, not a tally at the end of the night. Anything unopened stays with you.',
        },
        {
          title: 'A person, not a switchboard',
          body: 'The person who replies is the person behind the counter. Same one from the first question to the last glass.',
        },
      ],
    },
    howTitle: { it: 'Come funziona', en: 'How it works' },
    howIntro: {
      it: 'Quattro passaggi. Il primo dura due minuti, gli altri tre li gestiamo noi.',
      en: 'Four steps. The first takes two minutes; we handle the other three.',
    },
    steps: {
      it: [
        { title: 'Raccontaci la festa', body: 'Data, zona, quante persone, che tipo di serata. Due minuti di form, nessun impegno.' },
        { title: 'Ricevi una proposta', body: 'Ti rispondiamo di persona con la formula consigliata, la carta dei cocktail e un prezzo chiuso.' },
        { title: 'Pensiamo noi al bar', body: 'Spesa, ghiaccio, bicchieri, bancone. Arriviamo in anticipo e montiamo tutto prima che entrino gli ospiti.' },
        { title: 'Goditi la serata', body: 'A fine festa smontiamo e portiamo via tutto. Tu non tocchi un bicchiere.' },
      ],
      en: [
        { title: 'Tell us about the party', body: 'Date, area, how many people, what kind of night. Two minutes of form, no commitment.' },
        { title: 'Get a proposal', body: 'We reply personally with a recommended format, a cocktail list and a fixed price.' },
        { title: 'We handle the bar', body: 'Shopping, ice, glassware, counter. We arrive early and build everything before guests walk in.' },
        { title: 'Enjoy your night', body: 'At the end we break it down and take it all away. You never touch a glass.' },
      ],
    },
    packagesTitle: { it: 'Le formule', en: 'The formats' },
    packagesIntro: {
      it: 'Prezzi a partire da, tutto compreso: bartender, attrezzatura, bottiglie, ghiaccio, bicchieri, allestimento. Il preventivo finale lo costruiamo insieme sulla tua festa.',
      en: 'Starting prices, all in: bartender, equipment, bottles, ice, glassware, set-up. We build the final quote together, around your party.',
    },
    cocktailsTitle: { it: 'La carta', en: 'The list' },
    cocktailsIntro: {
      it: 'Una selezione stretta, fatta bene. Scegli tu quali entrano nella carta della tua serata — o ne creiamo uno apposta.',
      en: 'A short list, done properly. You pick which ones make it onto your night — or we create one just for you.',
    },
    eventsTitle: { it: 'Per che tipo di serata', en: 'What kind of night' },
    eventsIntro: {
      it: 'Cambia la location, cambia il ritmo, cambia la carta. Il bar arriva comunque montato e pronto.',
      en: 'The venue changes, the pace changes, the list changes. The bar still turns up ready to go.',
    },
    galleryTitle: { it: 'Qualche serata', en: 'A few nights' },
    galleryIntro: {
      it: 'Setup, bancone, dettagli.',
      en: 'Set-ups, counters, details.',
    },
    testimonialsTitle: { it: 'Cosa dicono', en: 'What people say' },
    testimonialsIntro: {
      it: 'Recensioni di chi ci ha avuto alla propria festa.',
      en: 'Reviews from people who had us at their party.',
    },
    faqTitle: { it: 'Domande frequenti', en: 'Frequently asked' },
    faqIntro: {
      it: 'Le cose che ci chiedono davvero, prima di prenotare.',
      en: 'The things people actually ask before booking.',
    },
    finalCtaTitle: {
      it: 'Raccontaci la tua festa.',
      en: 'Tell us about your party.',
    },
    finalCtaBody: {
      it: 'Due minuti di form, poi ti risponde una persona — non un preventivo automatico. Nessun impegno, nessun anticipo per chiedere.',
      en: 'Two minutes of form, then a person replies — not an automated quote. No commitment, nothing to pay to ask.',
    },
  },

  about: {
    eyebrow: { it: 'Dietro al bancone', en: 'Behind the counter' },
    title: {
      it: 'C’è una persona, e quella persona sono io.',
      en: 'There is one person behind this, and it is me.',
    },
    body: {
      it: 'Faccio il bartender da anni, in bar veri, con turni veri. Quando ho iniziato a portare il banco a casa degli amici mi sono accorto di una cosa: quasi nessuno organizza il bar di una festa privata come si organizza un bar. Si comprano bottiglie a caso, il ghiaccio finisce alle undici e qualcuno passa la serata a versare invece che a divertirsi.\n\nCordiale nasce per risolvere esattamente quel problema. Rispondo io alle richieste, faccio io la spesa e sto io dietro al bancone. Se una sera non posso esserci, lo dico subito: preferisco perdere un evento che mandare qualcuno che non conosco a rappresentarmi.',
      en: 'I have been bartending for years, in real bars, on real shifts. When I started taking a counter to friends’ houses I noticed something: almost nobody sets up a private party’s bar the way a bar is set up. Bottles get bought at random, the ice runs out at eleven, and somebody spends the whole night pouring instead of enjoying it.\n\nCordiale exists to fix exactly that. I answer the enquiries, I do the shopping, and I am the one behind the counter. If I can’t make a date, I say so straight away — I would rather lose the booking than send someone I don’t know to stand in for me.',
    },
    facts: {
      it: [
        'Attrezzatura professionale di proprietà: bancone, frigo, ghiaccio, bicchieri',
        'Acquisto e trasporto delle bottiglie inclusi nel servizio',
        'Un solo interlocutore dalla richiesta alla fine della serata',
      ],
      en: [
        'Professional kit, owned outright: counter, fridge, ice, glassware',
        'Buying and transporting the bottles is part of the service',
        'One person to talk to, from enquiry to the end of the night',
      ],
    },
    imagePath: '/images/bartender/bartender-portrait.jpg',
    signature: 'FOUNDER_NAME_HERE',
  },

  partners: {
    title: { it: 'Location, planner, catering', en: 'Venues, planners, caterers' },
    intro: {
      it: 'Lavoriamo volentieri come fornitore bar per chi organizza eventi di mestiere. Arriviamo autonomi, ci coordiniamo con la cucina e con il vostro timing, e non parliamo mai con il cliente scavalcandovi.',
      en: 'We are happy to work as the bar supplier for people who organise events for a living. We arrive self-sufficient, we work to your timing and the kitchen’s, and we never go around you to talk to the client.',
    },
    bullets: {
      it: [
        'Listino dedicato e condizioni concordate per collaborazioni continuative',
        'Documentazione, assicurazione e requisiti della location gestiti da noi',
        'Disponibilità a sopralluogo congiunto e prova cocktail',
        'Nessun materiale nostro esposto se non lo volete',
      ],
      en: [
        'Dedicated rates and agreed terms for ongoing partnerships',
        'Paperwork, insurance and venue requirements handled on our side',
        'Happy to do joint site visits and tasting sessions',
        'No branding of ours on show unless you want it',
      ],
    },
    ctaLabel: { it: 'Scrivici come professionista', en: 'Get in touch as a professional' },
  },

  requestForm: {
    title: { it: 'Raccontaci la tua festa', en: 'Tell us about your party' },
    intro: {
      it: 'Cinque domande veloci. Ti rispondiamo di persona, di solito entro 24 ore, con la formula consigliata e un prezzo chiuso.',
      en: 'Five quick questions. We reply personally, usually within 24 hours, with a recommended format and a fixed price.',
    },
    submitLabel: { it: 'Richiedi il tuo preventivo', en: 'Request your quote' },
    reassurance: {
      it: 'Nessun pagamento, nessun impegno. La data viene verificata personalmente prima di ogni conferma.',
      en: 'No payment, no commitment. Availability is always checked personally before anything is confirmed.',
    },
    successTitle: { it: 'Richiesta ricevuta.', en: 'Request received.' },
    successBody: {
      it: 'Ti contatteremo personalmente per definire tutti i dettagli — di solito entro 24 ore. Se hai fretta, scrivici direttamente su WhatsApp.',
      en: 'We will get in touch personally to work out the details — usually within 24 hours. If you are in a hurry, message us on WhatsApp.',
    },
  },

  seo: {
    siteName: 'Cordiale',
    defaultTitle: {
      it: 'Cordiale — Private Cocktail Bar a Roma | Cocktail catering per eventi',
      en: 'Cordiale — Private Cocktail Bar in Rome | Cocktail catering for events',
    },
    titleTemplate: { it: '%s | Cordiale Roma', en: '%s | Cordiale Rome' },
    defaultDescription: {
      it: 'Un cocktail bar professionale al tuo evento a Roma e provincia: bartender, bancone, attrezzatura e bottiglie inclusi. Feste private, compleanni, lauree, matrimoni ed eventi aziendali. Richiedi un preventivo.',
      en: 'A professional cocktail bar at your event in Rome: bartender, counter, equipment and bottles included. Private parties, birthdays, graduations, weddings and corporate events. Request a quote.',
    },
    ogImagePath: '/images/og/og-default.jpg',
    focusKeywords: {
      it: 'cocktail bar a domicilio Roma, barman a domicilio Roma, cocktail catering Roma, open bar eventi privati',
      en: 'private cocktail bar Rome, mobile bar hire Rome, cocktail catering Rome, private party bartender',
    },
  },

  legal: {
    dataController: 'LEGAL_NAME_HERE',
    controllerAddress: 'ADDRESS_HERE',
    privacyEmail: 'EMAIL_HERE',
    lastUpdated: '2026-01-01',
    privacyBody: { it: '', en: '' },
    cookieBody: { it: '', en: '' },
  },
};
