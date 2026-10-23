/**
 * Functional UI strings — labels, buttons, validation messages.
 *
 * Marketing copy lives in the database so the owner can rewrite it; this file
 * is the plumbing that should never need editing to change the pitch. Keeping
 * the two apart is what stops the admin panel from turning into a translation
 * tool nobody wants to use.
 */
import type { Locale } from './i18n';

export const dictionary = {
  nav: {
    packages: { it: 'Il servizio', en: 'The service' },
    cocktails: { it: 'Cocktail', en: 'Cocktails' },
    events: { it: 'Eventi', en: 'Events' },
    about: { it: 'Chi sono', en: 'About me' },
    gallery: { it: 'Galleria', en: 'Gallery' },
    journal: { it: 'Journal', en: 'Journal' },
    partners: { it: 'Collaboriamo', en: 'Partners' },
    faq: { it: 'Domande frequenti', en: 'FAQ' },
    menu: { it: 'Apri il menu', en: 'Open menu' },
    close: { it: 'Chiudi il menu', en: 'Close menu' },
    quickActions: { it: 'Azioni rapide', en: 'Quick actions' },
    // The switch is named by what it turns on; aria-pressed says whether it is.
    darkTheme: { it: 'Tema scuro', en: 'Dark theme' },
    toLightTheme: { it: 'Passa al tema chiaro', en: 'Switch to the light theme' },
    toDarkTheme: { it: 'Passa al tema scuro', en: 'Switch to the dark theme' },
  },
  cta: {
    quote: { it: 'Chiedimi un preventivo', en: 'Ask me for a quote' },
    quoteLong: { it: 'Chiedimi un preventivo', en: 'Ask me for a quote' },
    availability: { it: 'Verifica la disponibilità', en: 'Check availability' },
    whatsapp: { it: 'WhatsApp', en: 'WhatsApp' },
    whatsappLong: { it: 'Scrivimi su WhatsApp', en: 'Message me on WhatsApp' },
    call: { it: 'Chiamami', en: 'Call me' },
    seeAll: { it: 'Vedi tutto', en: 'See all' },
    seePackages: { it: 'Come funziona', en: 'How it works' },
    seeCocktails: { it: 'Vedi la carta', en: 'See the list' },
    readMore: { it: 'Continua a leggere', en: 'Read more' },
    back: { it: 'Torna indietro', en: 'Go back' },
    backHome: { it: 'Torna alla home', en: 'Back to home' },
  },
  footer: {
    explore: { it: 'Esplora', en: 'Explore' },
    events: { it: 'Eventi', en: 'Events' },
    contact: { it: 'Contatti', en: 'Contact' },
    follow: { it: 'Seguimi', en: 'Follow me' },
    rights: { it: 'Tutti i diritti riservati', en: 'All rights reserved' },
    privacy: { it: 'Privacy policy', en: 'Privacy policy' },
    cookies: { it: 'Cookie policy', en: 'Cookie policy' },
  },
  packages: {
    /** Heading of the formats section, shown only once formats exist. */
    title: { it: 'Le formule', en: 'Formats' },
    from: { it: 'a partire da', en: 'from' },
    perGuest: { it: 'a ospite', en: 'per guest' },
    minimum: { it: 'Investimento minimo', en: 'Minimum spend' },
    guests: { it: 'ospiti', en: 'guests' },
    guestsOver: { it: 'oltre', en: 'over' },
    includes: { it: 'Cosa comprende', en: 'What’s included' },
    notIncluded: { it: 'Non incluso (si può aggiungere)', en: 'Not included (can be added)' },
    onRequest: { it: 'Su preventivo', en: 'On request' },
    mostRequested: { it: 'In evidenza', en: 'Featured' },
    choose: { it: 'Chiedimi questa formula', en: 'Ask me about this format' },
    addons: { it: 'Extra', en: 'Add-ons' },
    addonsIntro: {
      it: 'Si aggiungono a qualsiasi formula. Nessuno è obbligatorio.',
      en: 'They can be added to any format. None of them is compulsory.',
    },
  },
  cocktails: {
    classics: { it: 'Grandi classici', en: 'The classics' },
    fresh: { it: 'Freschi', en: 'Fresh' },
    signature: { it: 'Signature', en: 'Signature' },
    zero: { it: 'Analcolici', en: 'Alcohol-free' },
  },
  form: {
    step: { it: 'Passo', en: 'Step' },
    of: { it: 'di', en: 'of' },
    next: { it: 'Continua', en: 'Continue' },
    previous: { it: 'Indietro', en: 'Back' },
    optional: { it: 'facoltativo', en: 'optional' },
    required: { it: 'obbligatorio', en: 'required' },
    sending: { it: 'Invio in corso…', en: 'Sending…' },

    stepEvent: { it: 'La festa', en: 'The party' },
    stepDetails: { it: 'I dettagli (facoltativi)', en: 'The details (optional)' },
    nextTitle: { it: 'Cosa succede dopo', en: 'What happens next' },
    stepContact: { it: 'I tuoi contatti', en: 'Your details' },

    eventType: { it: 'Che tipo di evento è?', en: 'What kind of event is it?' },
    eventDate: { it: 'Data dell’evento', en: 'Date of the event' },
    dateFlexible: { it: 'La data è ancora da definire', en: 'The date is not fixed yet' },
    dateNote: {
      it: 'La data la verifico io: nessuna data si conferma in automatico.',
      en: 'I check the date myself: no date is confirmed automatically.',
    },
    area: { it: 'Dove si svolge?', en: 'Where is it happening?' },
    venueNote: { it: 'Casa, villa, terrazzo, sala… (facoltativo)', en: 'House, villa, terrace, hall… (optional)' },
    guests: { it: 'Quante persone?', en: 'How many people?' },
    package: { it: 'Formula', en: 'Format' },
    packageHint: {
      it: 'Te ne suggerisco una in base agli ospiti. Puoi cambiarla o lasciare decidere a me.',
      en: 'I suggest one based on your guest count. Change it, or let me decide.',
    },
    packageUndecided: { it: 'Consigliami tu', en: 'You recommend one' },
    serviceMode: { it: 'Le bevande', en: 'The drinks' },
    preferences: { it: 'Che drink piacciono a te e ai tuoi ospiti?', en: 'What do you and your guests like to drink?' },
    preferencesHint: { it: 'Scegli quello che vuoi, anche più di uno.', en: 'Pick as many as you like.' },
    message: { it: 'C’è altro che dovrei sapere?', en: 'Anything else I should know?' },
    messagePlaceholder: {
      it: 'Orari, com’è il posto, allergie, un’idea che hai in mente…',
      en: 'Timings, what the place is like, allergies, an idea you have in mind…',
    },
    name: { it: 'Nome e cognome', en: 'Full name' },
    phone: { it: 'Telefono', en: 'Phone' },
    email: { it: 'Email', en: 'Email' },
    emailHint: {
      it: 'Ti mando una conferma della richiesta. Ti rispondo comunque al telefono o su WhatsApp.',
      en: 'I’ll send you a confirmation of your request. I’ll reply by phone or WhatsApp either way.',
    },
    prefersWhatsapp: { it: 'Preferisco essere contattato su WhatsApp', en: 'I would rather be contacted on WhatsApp' },
    consent: {
      it: 'Ho letto l’informativa privacy e acconsento al trattamento dei miei dati per essere ricontattato.',
      en: 'I have read the privacy notice and consent to my data being used to contact me back.',
    },
    consentLink: { it: 'informativa privacy', en: 'privacy notice' },
    summary: { it: 'Riepilogo', en: 'Summary' },
  },
  errors: {
    name_short: { it: 'Serve almeno un nome.', en: 'I need at least a name.' },
    name_long: { it: 'Nome troppo lungo.', en: 'That name is too long.' },
    email_invalid: { it: 'Controlla l’indirizzo email.', en: 'Please check the email address.' },
    phone_invalid: { it: 'Controlla il numero di telefono.', en: 'Please check the phone number.' },
    date_invalid: { it: 'Scegli una data valida.', en: 'Please choose a valid date.' },
    date_out_of_range: {
      it: 'La data deve essere futura e entro due anni.',
      en: 'The date must be in the future and within two years.',
    },
    event_type_required: { it: 'Scegli il tipo di evento.', en: 'Please choose the event type.' },
    area_required: { it: 'Scegli la zona.', en: 'Please choose an area.' },
    guests_required: { it: 'Indica quante persone.', en: 'Please tell me how many people.' },
    message_long: { it: 'Messaggio troppo lungo.', en: 'That message is too long.' },
    consent_required: {
      it: 'Serve il consenso per poterti ricontattare.',
      en: 'I need your consent in order to reply.',
    },
    spam_detected: { it: 'Richiesta non valida.', en: 'Invalid request.' },
    too_fast: {
      it: 'Richiesta inviata troppo in fretta. Riprova.',
      en: 'That was submitted too quickly. Please try again.',
    },
    rate_limited: {
      it: 'Hai già inviato diverse richieste. Riprova più tardi o scrivimi su WhatsApp.',
      en: 'You have already sent several requests. Try again later, or message me on WhatsApp.',
    },
    turnstile_failed: {
      it: 'Verifica anti-spam non riuscita. Ricarica la pagina e riprova.',
      en: 'Anti-spam check failed. Reload the page and try again.',
    },
    server: {
      it: 'Qualcosa è andato storto. Riprova, oppure scrivimi su WhatsApp.',
      en: 'Something went wrong. Try again, or message me on WhatsApp.',
    },
    network: {
      it: 'Connessione interrotta. Controlla la rete e riprova.',
      en: 'The connection dropped. Check your network and try again.',
    },
    generic: { it: 'Controlla i campi evidenziati.', en: 'Please check the highlighted fields.' },
  },
  misc: {
    reference: { it: 'Riferimento', en: 'Reference' },
    published: { it: 'Pubblicato il', en: 'Published on' },
    readingTime: { it: 'min di lettura', en: 'min read' },
    notFoundTitle: { it: 'Pagina non trovata', en: 'Page not found' },
    notFoundBody: {
      it: 'Il link che hai seguito non porta da nessuna parte. Può capitare.',
      en: 'The link you followed does not lead anywhere. It happens.',
    },
    errorTitle: { it: 'Qualcosa è andato storto', en: 'Something went wrong' },
    errorBody: {
      it: 'Riprova fra un istante. Se il problema resta, scrivimi su WhatsApp.',
      en: 'Try again in a moment. If it persists, message me on WhatsApp.',
    },
    retry: { it: 'Riprova', en: 'Try again' },
    noReviewsYet: {
      it: 'Le prime recensioni arriveranno qui appena i clienti le lasceranno. Non pubblico recensioni che non esistono.',
      en: 'The first reviews will appear here as soon as clients leave them. I don’t publish reviews that don’t exist.',
    },
    noReviewsTitle: {
      it: 'Non ho ancora recensioni da mostrarti',
      en: 'I have no reviews to show you yet',
    },
    /**
     * Replace the section's own title and intro while the list is empty: with
     * the owner's copy ("Cosa dicono — recensioni di chi ci ha avuto alla
     * propria festa") the heading promised reviews that the card underneath
     * then said do not exist.
     */
    promisesTitle: { it: 'Cosa posso prometterti', en: 'What I can promise you' },
    promisesIntro: {
      it: 'Queste sono le cose su cui puoi contare da subito.',
      en: 'These are the things you can count on from the start.',
    },
  },
  /**
   * What Samuele promises, before anyone has reviewed him.
   *
   * Every line here restates a commitment already made elsewhere on the site
   * (the value props, the request page): it is what the service does, not a
   * claim about a past it does not have yet. Nothing in this group may become
   * a testimonial, a number or a credential.
   */
  promises: {
    noAutoBooking: {
      it: 'Nessuna data si conferma in automatico: la verifico io.',
      en: 'No date is confirmed automatically: I check it myself.',
    },
    freeQuote: {
      it: 'Chiedere un preventivo non costa nulla e non impegna.',
      en: 'Asking for a quote costs nothing and commits you to nothing.',
    },
    onePerson: {
      it: 'Ti rispondo io, dalla prima domanda all’ultimo drink.',
      en: 'I reply myself, from your first question to the last drink.',
    },
    fromBoard: {
      it: 'Rispondo anche quando sono a bordo, e fisso la data per quando torno.',
      en: 'I reply even when I’m on board, and fix the date for when I’m back.',
    },
    inAHurry: { it: 'Hai fretta?', en: 'In a hurry?' },
    inAHurryBody: {
      it: 'Scrivimi direttamente: rispondo io, come al modulo.',
      en: 'Message me directly: I reply myself, just as I do to the form.',
    },
  },
} as const;

type Dict = typeof dictionary;

/** `d(locale).cta.quote` reads better than `dictionary.cta.quote[locale]`. */
export function d(locale: Locale) {
  const resolve = <T extends Record<string, { it: string; en: string }>>(group: T) =>
    Object.fromEntries(Object.entries(group).map(([key, value]) => [key, value[locale]])) as {
      [K in keyof T]: string;
    };

  return {
    nav: resolve(dictionary.nav),
    cta: resolve(dictionary.cta),
    footer: resolve(dictionary.footer),
    packages: resolve(dictionary.packages),
    cocktails: resolve(dictionary.cocktails),
    form: resolve(dictionary.form),
    errors: resolve(dictionary.errors),
    misc: resolve(dictionary.misc),
    promises: resolve(dictionary.promises),
  };
}

export type Dictionary = ReturnType<typeof d>;
export type DictionaryShape = Dict;

/** Maps a validation key coming back from the API to a readable sentence. */
export function errorMessage(key: string, locale: Locale): string {
  const errors = dictionary.errors as Record<string, { it: string; en: string }>;
  return (errors[key] ?? errors.generic)[locale];
}
