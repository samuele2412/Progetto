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
    packages: { it: 'Pacchetti', en: 'Packages' },
    cocktails: { it: 'Cocktail', en: 'Cocktails' },
    events: { it: 'Eventi', en: 'Events' },
    about: { it: 'Chi siamo', en: 'About' },
    gallery: { it: 'Galleria', en: 'Gallery' },
    journal: { it: 'Journal', en: 'Journal' },
    partners: { it: 'Collaboriamo', en: 'Partners' },
    faq: { it: 'Domande frequenti', en: 'FAQ' },
    menu: { it: 'Apri il menu', en: 'Open menu' },
    close: { it: 'Chiudi il menu', en: 'Close menu' },
  },
  cta: {
    quote: { it: 'Richiedi il preventivo', en: 'Request a quote' },
    quoteLong: { it: 'Richiedi il tuo preventivo', en: 'Request your quote' },
    availability: { it: 'Verifica la disponibilità', en: 'Check availability' },
    whatsapp: { it: 'WhatsApp', en: 'WhatsApp' },
    whatsappLong: { it: 'Scrivici su WhatsApp', en: 'Message us on WhatsApp' },
    call: { it: 'Parla con noi', en: 'Talk to us' },
    seeAll: { it: 'Vedi tutto', en: 'See all' },
    seePackages: { it: 'Vedi le formule', en: 'See the formats' },
    seeCocktails: { it: 'Vedi la carta', en: 'See the list' },
    readMore: { it: 'Continua a leggere', en: 'Read more' },
    back: { it: 'Torna indietro', en: 'Go back' },
    backHome: { it: 'Torna alla home', en: 'Back to home' },
  },
  footer: {
    explore: { it: 'Il servizio', en: 'The service' },
    events: { it: 'Eventi', en: 'Events' },
    contact: { it: 'Contatti', en: 'Contact' },
    follow: { it: 'Seguici', en: 'Follow' },
    rights: { it: 'Tutti i diritti riservati', en: 'All rights reserved' },
    privacy: { it: 'Privacy policy', en: 'Privacy policy' },
    cookies: { it: 'Cookie policy', en: 'Cookie policy' },
  },
  packages: {
    from: { it: 'a partire da', en: 'from' },
    perGuest: { it: 'a ospite', en: 'per guest' },
    minimum: { it: 'Investimento minimo', en: 'Minimum spend' },
    guests: { it: 'ospiti', en: 'guests' },
    guestsOver: { it: 'oltre', en: 'over' },
    includes: { it: 'Cosa comprende', en: 'What’s included' },
    notIncluded: { it: 'Non incluso (si può aggiungere)', en: 'Not included (can be added)' },
    onRequest: { it: 'Su preventivo', en: 'On request' },
    mostRequested: { it: 'La più richiesta', en: 'Most requested' },
    choose: { it: 'Richiedi questa formula', en: 'Request this format' },
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
    custom: { it: 'Su misura', en: 'Bespoke' },
    customBody: {
      it: 'Per le occasioni che lo meritano creiamo un cocktail apposta, con il nome che scegli tu, stampato sulla carta della serata.',
      en: 'For occasions that deserve it we create a cocktail on purpose, named by you, printed on the menu for the night.',
    },
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
    stepDetails: { it: 'I dettagli', en: 'The details' },
    stepContact: { it: 'I tuoi contatti', en: 'Your details' },

    eventType: { it: 'Che tipo di evento è?', en: 'What kind of event is it?' },
    eventDate: { it: 'Data dell’evento', en: 'Date of the event' },
    dateFlexible: { it: 'La data è ancora da definire', en: 'The date is not fixed yet' },
    dateNote: {
      it: 'La disponibilità viene verificata personalmente: nessuna data è confermata automaticamente.',
      en: 'Availability is checked personally: no date is confirmed automatically.',
    },
    area: { it: 'Dove si svolge?', en: 'Where is it happening?' },
    venueNote: { it: 'Casa, villa, terrazzo, sala… (facoltativo)', en: 'House, villa, terrace, hall… (optional)' },
    guests: { it: 'Quante persone?', en: 'How many people?' },
    package: { it: 'Formula', en: 'Format' },
    packageHint: {
      it: 'Te ne suggeriamo una in base agli ospiti. Puoi cambiarla o lasciare decidere a noi.',
      en: 'We suggest one based on your guest count. Change it, or let us decide.',
    },
    packageUndecided: { it: 'Consigliatemi voi', en: 'Recommend one for me' },
    serviceMode: { it: 'Le bevande', en: 'The drinks' },
    preferences: { it: 'Che cocktail vi piacerebbe?', en: 'What kind of cocktails?' },
    preferencesHint: { it: 'Scegli quello che vuoi, anche più di uno.', en: 'Pick as many as you like.' },
    message: { it: 'Qualcos’altro che dovremmo sapere?', en: 'Anything else we should know?' },
    messagePlaceholder: {
      it: 'Numero di ospiti approssimativo, orari, se c’è un ascensore, allergie, un’idea che avete in mente…',
      en: 'Rough guest numbers, timings, whether there is a lift, allergies, an idea you have in mind…',
    },
    name: { it: 'Nome e cognome', en: 'Full name' },
    phone: { it: 'Telefono', en: 'Phone' },
    email: { it: 'Email', en: 'Email' },
    prefersWhatsapp: { it: 'Preferisco essere contattato su WhatsApp', en: 'I would rather be contacted on WhatsApp' },
    consent: {
      it: 'Ho letto l’informativa privacy e acconsento al trattamento dei miei dati per essere ricontattato.',
      en: 'I have read the privacy notice and consent to my data being used to contact me back.',
    },
    consentLink: { it: 'informativa privacy', en: 'privacy notice' },
    summary: { it: 'Riepilogo', en: 'Summary' },
  },
  errors: {
    name_short: { it: 'Serve almeno un nome.', en: 'We need at least a name.' },
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
    guests_required: { it: 'Indica quante persone.', en: 'Please tell us how many people.' },
    message_long: { it: 'Messaggio troppo lungo.', en: 'That message is too long.' },
    consent_required: {
      it: 'Serve il consenso per poterti ricontattare.',
      en: 'We need your consent in order to reply.',
    },
    spam_detected: { it: 'Richiesta non valida.', en: 'Invalid request.' },
    too_fast: {
      it: 'Richiesta inviata troppo in fretta. Riprova.',
      en: 'That was submitted too quickly. Please try again.',
    },
    rate_limited: {
      it: 'Hai già inviato diverse richieste. Riprova più tardi o scrivici su WhatsApp.',
      en: 'You have already sent several requests. Try again later, or message us on WhatsApp.',
    },
    turnstile_failed: {
      it: 'Verifica anti-spam non riuscita. Ricarica la pagina e riprova.',
      en: 'Anti-spam check failed. Reload the page and try again.',
    },
    server: {
      it: 'Qualcosa è andato storto da parte nostra. Riprova, oppure scrivici su WhatsApp.',
      en: 'Something went wrong on our side. Try again, or message us on WhatsApp.',
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
      it: 'Riprova fra un istante. Se il problema resta, scrivici su WhatsApp.',
      en: 'Try again in a moment. If it persists, message us on WhatsApp.',
    },
    retry: { it: 'Riprova', en: 'Try again' },
    noReviewsYet: {
      it: 'Le prime recensioni arriveranno qui appena i clienti le lasceranno. Non pubblichiamo recensioni che non esistono.',
      en: 'The first reviews will appear here as soon as clients leave them. We do not publish reviews that do not exist.',
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
  };
}

export type Dictionary = ReturnType<typeof d>;
export type DictionaryShape = Dict;

/** Maps a validation key coming back from the API to a readable sentence. */
export function errorMessage(key: string, locale: Locale): string {
  const errors = dictionary.errors as Record<string, { it: string; en: string }>;
  return (errors[key] ?? errors.generic)[locale];
}
