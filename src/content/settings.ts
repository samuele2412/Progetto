/**
 * Default site copy and configuration.
 *
 * Everything here can be overridden from the admin panel (Contenuti); these
 * values are the fallback and the seed. Placeholders in SCREAMING_SNAKE_CASE
 * are meant to be replaced before going live — the admin panel flags them.
 *
 * The copy follows docs/13-brand-voice.md: first person singular, "tu" to the
 * reader, only facts Samuele confirmed. Nothing here may promise what the
 * service does not do today (no counter, no glassware, no invoices, no prices,
 * no fixed reply time) — the "Da evitare" section of that document lists them.
 * The previous copy is frozen in scripts/content/legacy-v1.json.
 */

export type L = { it: string; en: string };
export type LL = { it: string[]; en: string[] };
/** A localized list of small title + body pairs (steps). */
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
    /**
     * When Samuele is in Rome and taking parties, in his own words. He works
     * on cruise ships between these periods, so this changes a few times a
     * year; empty means nothing is shown anywhere.
     */
    periods: L;
    /** Prefix applied to national numbers before opening a WhatsApp chat. */
    defaultCountryCode: string;
  };
  social: { instagram: string; tiktok: string; facebook: string };
  /** Home, section 1. */
  hero: {
    eyebrow: L;
    title: L;
    subtitle: L;
    primaryCta: L;
    /** The quieter way on, next to the button: to the service page. */
    secondaryCta: L;
    /** One short line at the foot of the opening, e.g. that the quote is free. */
    note: L;
    imagePath: string;
    /** Optional short muted loop behind the hero. Leave empty to use the image. */
    videoPath: string;
  };
  /** Home, section 3: who he is, in three lines. The photo is the one in `about`. */
  intro: {
    eyebrow: L;
    title: L;
    body: L;
    linkLabel: L;
  };
  /** Home, section 2, and the service page (/pacchetti). */
  service: {
    homeEyebrow: L;
    homeTitle: L;
    homeBody: L;
    homeLinkLabel: L;
    /** The three columns under the home section, each with its photograph (homePhotos). */
    homeItems: LPairs;
    pageTitle: L;
    pageIntro: L;
    bringTitle: L;
    bringItems: LL;
    needTitle: L;
    needBody: L;
    drinksTitle: L;
    drinksBody: L;
    priceTitle: L;
    priceBody: L;
    stepsTitle: L;
    steps: LPairs;
  };
  /** Home, section 4: the one thing that is his. */
  method: {
    eyebrow: L;
    title: L;
    body: L;
    linkLabel: L;
  };
  /** Titles shared by pages, the home's own steps, and the closing call to action. */
  home: {
    /** Home, section 6: how a party gets booked, told from the guest's side. */
    stepsEyebrow: L;
    stepsTitle: L;
    steps: LPairs;
    cocktailsTitle: L;
    cocktailsIntro: L;
    galleryTitle: L;
    galleryIntro: L;
    faqTitle: L;
    faqIntro: L;
    finalCtaTitle: L;
    finalCtaBody: L;
    /** One short line under the call to action. */
    finalCtaNote: L;
  };
  /**
   * The home page's photographs other than the opening and the portrait: one
   * per column of the service section, and the four of the atmosphere
   * section. Paths into the media library, each with what it shows.
   */
  homePhotos: {
    service1: string;
    service1Alt: L;
    service2: string;
    service2Alt: L;
    service3: string;
    service3Alt: L;
    mood1: string;
    mood1Alt: L;
    mood2: string;
    mood2Alt: L;
    mood3: string;
    mood3Alt: L;
    mood4: string;
    mood4Alt: L;
  };
  about: {
    eyebrow: L;
    title: L;
    body: L;
    factsTitle: L;
    /** Training and roles, one per line, no adjectives. */
    facts: LL;
    approachTitle: L;
    approachBody: L;
    imagePath: string;
    /** Describes what the photo shows — not who it is meant to be. */
    imageAlt: L;
    signature: string;
  };
  partners: {
    title: L;
    intro: L;
    bullets: LL;
    ctaLabel: L;
    ctaBody: L;
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
      it: 'Bartender per feste private · Roma',
      en: 'Private party bartender · Rome',
    },
    claim: {
      it: 'Tu pensa alla festa, ai drink penso io.',
      en: 'You plan the party, I’ll handle the drinks.',
    },
    legalName: 'LEGAL_NAME_HERE',
    vatNumber: 'VAT_NUMBER_HERE',
  },

  contact: {
    phone: 'PHONE_NUMBER_HERE',
    whatsapp: 'WHATSAPP_NUMBER_HERE',
    whatsappMessage: {
      it: 'Ciao Samuele! Vorrei un bartender per una festa. Ti racconto: ',
      en: 'Hi Samuele! I’d like a bartender for a party. Here are the details: ',
    },
    email: 'EMAIL_HERE',
    serviceArea: {
      it: 'Roma e provincia. Più lontano? Chiedimi pure.',
      en: 'Rome and its province. Further away? Just ask.',
    },
    availability: {
      it: 'Rispondo io, anche quando sono a bordo.',
      en: 'I reply myself, even when I’m on board.',
    },
    periods: { it: '', en: '' },
    defaultCountryCode: '39',
  },

  social: {
    instagram: 'INSTAGRAM_URL_HERE',
    tiktok: 'TIKTOK_URL_HERE',
    facebook: '',
  },

  hero: {
    eyebrow: {
      it: 'Bartender privato · Roma e provincia',
      en: 'Private bartender · Rome and province',
    },
    title: {
      it: 'La tua casa. I tuoi ospiti. Il mio bancone.',
      en: 'Your home. Your guests. My bar.',
    },
    // The eyebrow says what and where; the sections under the opening say
    // what the service covers and who he is.
    subtitle: {
      it: 'Cocktail preparati al momento, un servizio bar su misura e tutta la libertà di goderti la tua festa.',
      en: 'Cocktails made on the spot, a bar service built around you, and all the freedom to enjoy your own party.',
    },
    primaryCta: { it: 'Parliamo della tua festa', en: 'Let’s talk about your party' },
    secondaryCta: { it: 'Scopri il servizio', en: 'Explore the service' },
    note: { it: 'Preventivo gratuito e senza impegno', en: 'Free quote, no obligation' },
    imagePath: '/images/hero/hero-main.jpg',
    videoPath: '',
  },

  service: {
    homeEyebrow: { it: 'Il servizio', en: 'The service' },
    homeTitle: {
      it: 'Dal compleanno in casa al matrimonio.',
      en: 'From a birthday at home to a wedding.',
    },
    homeBody: {
      it: 'Lavoro su un tavolo o un piano che trovo sul posto, e dalla prima domanda all’ultimo drink parli con me.',
      en: 'I work at a table or a counter I find on site, and from your first question to the last drink, you deal with me.',
    },
    homeLinkLabel: { it: 'Come funziona il servizio', en: 'How the service works' },
    // Only what the "Cosa porto io" list below already states: nothing here
    // may promise glassware, a counter or a second pair of hands.
    homeItems: {
      it: [
        {
          title: 'Preparati al momento',
          body: 'Ogni drink lo preparo sul posto, partendo da cosa piace a te e ai tuoi ospiti.',
        },
        {
          title: 'Attrezzatura e ghiaccio',
          body: 'Porto shaker e attrezzi da bar, e il ghiaccio con frigo o borse frigo per tenerlo. A te serve solo un tavolo o un piano dove lavorare.',
        },
        {
          title: 'Bottiglie e bicchieri',
          body: 'Le bottiglie le compro io. I bicchieri, monouso, li porto io.',
        },
      ],
      en: [
        {
          title: 'Made on the spot',
          body: 'I make every drink on site, starting from what you and your guests like.',
        },
        {
          title: 'Kit and ice',
          body: 'I bring a shaker and the bar tools, and the ice with a fridge or cool bags to keep it. All you need is a table or a counter for me to work at.',
        },
        {
          title: 'Bottles and cups',
          body: 'I buy the bottles. The cups, disposable ones, I bring myself.',
        },
      ],
    },
    pageTitle: { it: 'Come funziona il servizio', en: 'How the service works' },
    pageIntro: {
      it: 'Vengo alla tua festa e mi occupo di tutto il bere. Qui trovi cosa porto io, cosa serve a te e come scegliamo cosa preparare.',
      en: 'I come to your party and take care of all the drinks. Here is what I bring, what you need to provide and how we choose what to make.',
    },
    bringTitle: { it: 'Cosa porto io', en: 'What I bring' },
    bringItems: {
      it: [
        'Shaker e attrezzi da bar',
        'Il ghiaccio, con frigo o borse frigo per tenerlo',
        'Le bottiglie, che compro io',
        'I bicchieri, monouso',
      ],
      en: [
        'A shaker and the bar tools',
        'The ice, with a fridge or cool bags to keep it',
        'The bottles, which I buy',
        'The cups, disposable',
      ],
    },
    needTitle: { it: 'Cosa serve a te', en: 'What you need to provide' },
    needBody: {
      it: 'Un tavolo o un piano dove lavorare. Gli altri dettagli, come spazio e orari, li vediamo insieme quando mi scrivi.',
      en: 'A table or a counter to work at. The other details, like space and timings, we work out together when you get in touch.',
    },
    drinksTitle: { it: 'Come scegliamo i drink', en: 'How we choose the drinks' },
    drinksBody: {
      it: 'Mi dici cosa piace a te e ai tuoi ospiti, e da lì scegliamo cosa preparare. Se vuoi qualche idea, nella carta trovi da dove partire.',
      en: 'You tell me what you and your guests like, and we choose what to make from there. If you want a few ideas, the list is a good place to start.',
    },
    priceTitle: { it: 'Quanto costa', en: 'What it costs' },
    priceBody: {
      it: 'Ogni festa è diversa: dipende da quante persone siete, da cosa bevete e dal posto. Per questo faccio ogni preventivo su misura. È gratuito e non impegna.',
      en: 'Every party is different: it depends on how many of you there are, what you drink and where it is. That is why every quote is made to measure. It is free and commits you to nothing.',
    },
    stepsTitle: { it: 'Come si procede', en: 'What happens next' },
    steps: {
      it: [
        { title: 'Mi racconti la festa', body: 'Dal modulo: data, zona, quante persone, che tipo di serata.' },
        { title: 'Ti rispondo io', body: 'Con una proposta pensata per la tua festa.' },
        { title: 'Fissiamo la data', body: 'Solo quando la proposta ti convince. Nessuna data si conferma in automatico.' },
      ],
      en: [
        { title: 'Tell me about the party', body: 'Through the form: date, area, how many people, what kind of night.' },
        { title: 'I reply myself', body: 'With a proposal made for your party.' },
        { title: 'We fix the date', body: 'Only once the proposal works for you. No date is confirmed automatically.' },
      ],
    },
  },

  intro: {
    eyebrow: { it: 'Chi sono', en: 'About me' },
    title: {
      it: 'Dietro al bancone da quando avevo 16 anni.',
      en: 'Behind the bar since I was 16.',
    },
    body: {
      it: 'Ho 21 anni. Ho iniziato per caso, in un piccolo bistrot vicino Roma, e mi sono innamorato del mestiere. Oggi lavoro anche come barman sulle navi Costa Crociere, e tra un imbarco e l’altro porto lo stesso ritmo alle feste private.',
      en: 'I’m 21. I started by chance, in a small bistro just outside Rome, and fell in love with the job. Today I also work as a bartender on Costa Cruises ships, and between contracts I bring the same pace to private parties.',
    },
    linkLabel: { it: 'La mia storia', en: 'My story' },
  },

  method: {
    eyebrow: { it: 'Il mio modo di lavorare', en: 'How I work' },
    title: {
      it: 'Dimmi cosa bevi di solito. Ti preparo qualcosa di simile, ma più interessante.',
      en: 'Tell me what you usually drink. I’ll make you something similar, but more interesting.',
    },
    body: {
      it: 'Spesso capisco i gusti di una persona solo guardandola. Quando non ci riesco, chiedo. Poi lavoro veloce, senza lasciare niente al caso.',
      en: 'I can often tell what someone likes just by looking at them. When I can’t, I ask. Then I work fast, without leaving anything to chance.',
    },
    linkLabel: { it: 'Vedi la carta', en: 'See the list' },
  },

  home: {
    stepsEyebrow: { it: 'Come funziona', en: 'How it works' },
    stepsTitle: {
      it: 'Dalla prima domanda all’ultimo drink.',
      en: 'From your first question to the last drink.',
    },
    steps: {
      it: [
        {
          title: 'Raccontami la tua festa',
          body: 'Dal modulo: data, zona, quante persone e che tipo di serata.',
        },
        {
          title: 'Definiamo insieme il servizio',
          body: 'Ti rispondo io, con una proposta pensata per la tua festa. La data si fissa solo quando ti convince.',
        },
        {
          title: 'Tu accogli gli ospiti, io penso al bar',
          body: 'Arrivo con attrezzatura, ghiaccio e bottiglie e preparo i drink sul posto. Tu pensi solo alla tua festa.',
        },
      ],
      en: [
        {
          title: 'Tell me about your party',
          body: 'Through the form: date, area, how many people and what kind of night.',
        },
        {
          title: 'We shape the service together',
          body: 'I reply myself, with a proposal made for your party. The date is fixed only once it works for you.',
        },
        {
          title: 'You welcome your guests, I run the bar',
          body: 'I arrive with the kit, the ice and the bottles and make the drinks on site. You just enjoy your party.',
        },
      ],
    },
    cocktailsTitle: { it: 'La carta', en: 'The list' },
    cocktailsIntro: {
      it: 'Qualche idea da cui partire. Se cerchi qualcosa che non c’è, chiedimelo: di solito parto da quello che bevi tu.',
      en: 'A few ideas to start from. If what you want isn’t here, just ask: I usually start from what you already drink.',
    },
    galleryTitle: { it: 'Galleria', en: 'Gallery' },
    galleryIntro: {
      it: 'Qualche immagine per darti un’idea dell’atmosfera.',
      en: 'A few images to give you a feel for the atmosphere.',
    },
    faqTitle: { it: 'Domande frequenti', en: 'Frequently asked questions' },
    faqIntro: {
      it: 'Le cose da sapere prima di scrivermi.',
      en: 'What is worth knowing before you get in touch.',
    },
    finalCtaTitle: {
      it: 'Raccontami la tua festa.',
      en: 'Tell me about your party.',
    },
    finalCtaBody: {
      it: 'Mi scrivi dal modulo, ti rispondo con una proposta e, se ti convince, fissiamo la data. Il preventivo è gratuito e non impegna.',
      en: 'You write to me through the form, I reply with a proposal and, if it works for you, we fix the date. The quote is free and commits you to nothing.',
    },
    finalCtaNote: {
      it: 'Se sono a bordo, fisso la data per quando torno.',
      en: 'If I’m on board, I book the date for when I’m back.',
    },
  },

  // Temporary stock photographs (docs/photo-sources.md), chosen for one warm,
  // low light. None of them shows Samuele or one of his parties, and the copy
  // around them never says they do.
  homePhotos: {
    service1: '/images/stock/servizio-limone.webp',
    service1Alt: {
      it: 'Mani che spremono un limone con lo spremiagrumi direttamente nello shaker',
      en: 'Hands squeezing a lemon with a citrus press straight into the shaker',
    },
    service2: '/images/stock/servizio-attrezzatura.webp',
    service2Alt: {
      it: 'Strainer e shaker accanto a un cocktail con ghiaccio, bottiglie sfocate sullo sfondo',
      en: 'A strainer and a shaker beside a cocktail on ice, bottles blurred behind',
    },
    service3: '/images/stock/evento-aziendale.webp',
    service3Alt: {
      it: 'Parete di bottiglie illuminata dietro al bancone',
      en: 'Backlit wall of bottles behind the bar',
    },
    mood1: '/images/stock/atmosfera-sour.webp',
    mood1Alt: {
      it: 'Whisky sour in coppa con una fetta d’arancia essiccata, sul bancone di legno',
      en: 'A whisky sour in a coupe with a dried orange slice, on a wooden bar',
    },
    mood2: '/images/stock/galleria-ghiaccio-fiamma.webp',
    mood2Alt: {
      it: 'Bicchiere e ghiaccio illuminati da una fiamma su fondo nero',
      en: 'Glass and ice lit by a flame against a black background',
    },
    mood3: '/images/stock/evento-diciottesimo.webp',
    mood3Alt: {
      it: 'Cocktail ambrato in un bicchiere lavorato davanti alle luci del bar',
      en: 'Amber cocktail in a textured glass against bar lights',
    },
    mood4: '/images/stock/atmosfera-coppa.webp',
    mood4Alt: {
      it: 'Una mano posa una coppa di cristallo sul bancone, tra luci calde sfocate',
      en: 'A hand setting a crystal coupe down on the bar, warm lights blurred behind',
    },
  },

  about: {
    eyebrow: { it: 'Chi sono', en: 'About me' },
    title: { it: 'Sono Samuele.', en: 'I’m Samuele.' },
    body: {
      it: 'Ho 21 anni e lavoro dietro al bancone da quando ne avevo 16. All’inizio era un modo per guadagnare qualcosa, in un piccolo bistrot vicino Roma, e lo alternavo con la scuola. Poi mi sono innamorato del mestiere.\n\nDopo il bistrot ho fatto qualche serata in locali diversi e ho continuato a studiare. Oggi lavoro come barman sulle navi Costa Crociere.\n\nTra un imbarco e l’altro porto il mio lavoro alle feste private, a Roma e provincia. Si chiama Cordiale, e di solito lavoro da solo: dalla prima domanda all’ultimo drink, parli con me.',
      en: 'I’m 21 and I’ve been working behind a bar since I was 16. At first it was a way to earn some money, in a small bistro just outside Rome, alongside school. Then I fell in love with the job.\n\nAfter the bistro I worked a few nights in different venues and kept studying. Today I work as a bartender on Costa Cruises ships.\n\nBetween contracts I bring my work to private parties in Rome and its province. It’s called Cordiale, and I usually work alone: from your first question to the last drink, you deal with me.',
    },
    factsTitle: { it: 'Formazione', en: 'Training' },
    facts: {
      it: ['Corso alla Mixology Academy', 'Master sui cocktail sour', 'Corso da barman per Costa Crociere'],
      en: ['A course at Mixology Academy', 'A masterclass on sour cocktails', 'Bartender training for Costa Cruises'],
    },
    approachTitle: { it: 'Come lavoro', en: 'How I work' },
    approachBody: {
      it: 'Mi dicono spesso che sono molto veloce ma preciso, e che ho un modo elegante di fare da bere. Niente flair: il mio stile sta nei gesti e nel ritmo.\n\nLavoro in ordine e tengo pulito. Quando il lavoro lo permette chiacchiero con gli ospiti, senza esagerare: la serata deve essere più leggera per tutti, anche per chi la organizza.\n\nLa parte che preferisco è quando una serata riesce meglio grazie al mio lavoro. Bastano piccoli segnali: un sorriso, un complimento sincero, un grazie.',
      en: 'People often tell me I’m very fast but precise, and that I have an elegant way of making drinks. No flair: my style is in the gestures and the pace.\n\nI work tidily and keep things clean. When there’s time I chat with the guests, without overdoing it: the night should feel lighter for everyone, including whoever is hosting.\n\nThe part I love most is when a night goes better because of my work. The signs are small: a smile, a sincere compliment, a thank-you.',
    },
    imagePath: '/images/bartender/bartender-portrait.jpg',
    imageAlt: {
      it: 'Mani che completano un cocktail con menta fresca e ghiaccio tritato',
      en: 'Hands finishing a cocktail with fresh mint and crushed ice',
    },
    signature: '',
  },

  partners: {
    title: { it: 'Location, planner, catering', en: 'Venues, planners, caterers' },
    intro: {
      it: 'Se organizzi eventi per lavoro, posso essere il bartender delle tue serate. Arrivo con la mia attrezzatura e mi adeguo ai tuoi orari e al tuo modo di lavorare con i clienti.',
      en: 'If you organise events for a living, I can be the bartender at your events. I arrive with my own kit and fit around your timings and the way you work with your clients.',
    },
    bullets: {
      it: [
        'Orari e spazi concordati con te prima dell’evento',
        'Attrezzatura, ghiaccio e bottiglie li porto io',
        'Drink scelti sui gusti dei tuoi ospiti',
        'Disponibile tra un imbarco e l’altro: scrivimi per tempo',
      ],
      en: [
        'Timings and space agreed with you before the event',
        'I bring the kit, the ice and the bottles',
        'Drinks chosen around your guests’ tastes',
        'Available between contracts at sea: get in touch early',
      ],
    },
    ctaLabel: { it: 'Scrivimi come professionista', en: 'Get in touch as a professional' },
    ctaBody: {
      it: 'Raccontami che eventi organizzi e con che frequenza. Ti rispondo con le date in cui sono disponibile.',
      en: 'Tell me what kind of events you organise and how often. I’ll reply with the dates I’m available.',
    },
  },

  requestForm: {
    title: { it: 'Raccontami la tua festa', en: 'Tell me about your party' },
    intro: {
      it: 'Poche domande veloci: la festa, i dettagli che vuoi darmi e come ricontattarti.',
      en: 'A few quick questions: the party, any details you want to add, and how to reach you.',
    },
    submitLabel: { it: 'Invia la richiesta', en: 'Send the request' },
    reassurance: {
      it: 'Nessun pagamento e nessun impegno: mi stai solo raccontando la festa.',
      en: 'No payment and no commitment: you’re just telling me about the party.',
    },
    successTitle: { it: 'Richiesta ricevuta.', en: 'Request received.' },
    successBody: {
      it: 'Ti rispondo io appena posso, anche se sono a bordo.',
      en: 'I’ll reply as soon as I can, even if I’m on board.',
    },
  },

  seo: {
    siteName: 'Cordiale',
    defaultTitle: {
      it: 'Cordiale · Samuele, bartender per feste private a Roma',
      en: 'Cordiale · Samuele, private party bartender in Rome',
    },
    titleTemplate: { it: '%s | Cordiale Roma', en: '%s | Cordiale Rome' },
    defaultDescription: {
      it: 'Sono Samuele, bartender da quando avevo 16 anni. Vengo alla tua festa a Roma e provincia con attrezzatura, ghiaccio e bottiglie. Preventivo gratuito.',
      en: 'I’m Samuele, a bartender since I was 16. I come to your party in Rome with the kit, the ice and the bottles. Free, no-obligation quote.',
    },
    ogImagePath: '/images/og/og-default.jpg',
    focusKeywords: {
      it: 'barman a domicilio Roma, bartender per feste private Roma, cocktail bar a domicilio Roma, cocktail catering Roma',
      en: 'private bartender Rome, party bartender Rome, mobile cocktail bar Rome, cocktail catering Rome',
    },
  },

  legal: {
    dataController: 'LEGAL_NAME_HERE',
    controllerAddress: 'ADDRESS_HERE',
    privacyEmail: 'EMAIL_HERE',
    // The cookie policy gained the light/dark preference on this date.
    lastUpdated: '2026-10-23',
    privacyBody: { it: '', en: '' },
    cookieBody: { it: '', en: '' },
  },
};
