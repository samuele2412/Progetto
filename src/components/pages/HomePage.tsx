import { Fragment, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { Media, mediaExists } from '@/components/Media';
import { FinalCta } from '@/components/blocks/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { d } from '@/lib/dictionary';
import { t, type Locale } from '@/lib/i18n';
import { getFeaturedCocktails, getNavigationLandings } from '@/lib/queries';
import { landingNavLabel, landingPath, path } from '@/lib/routes';
import { absoluteUrl, serviceJsonLd } from '@/lib/seo';
import { getSettings } from '@/lib/settings';
import { cn, typeset } from '@/lib/utils';

/** A stagger for `data-reveal` siblings, in seconds. */
const delay = (seconds: number) => ({ '--reveal-delay': `${seconds}s` }) as CSSProperties;

/**
 * A section's chapter mark: a Roman numeral and a rule for the eye, then the
 * label. The numeral only orders the page visually, so it is hidden from
 * screen readers, which already have the headings.
 */
function SectionMark({ numeral, children }: { numeral: string; children: ReactNode }) {
  return (
    <p className="eyebrow section-mark">
      <span aria-hidden className="numeral">
        {numeral}
      </span>
      <span>{children}</span>
    </p>
  );
}

/**
 * The home page, as an issue of a small magazine:
 *
 *   opening  the photograph, the promise, one button          (hero)
 *   I        what the service covers, in three pictures        (service)
 *   II       who he is, with the facts                         (intro)
 *   III      the one thing that is his, and three drinks       (method, dark band)
 *   IV       the atmosphere, in four pictures                  (gallery)
 *   V        how a party gets booked                           (steps)
 *   —        how to get in touch                               (FinalCta, dark band)
 *
 * Light and dark bands alternate in either theme (.tone-night). Every
 * photograph is a setting (Home · Fotografie, or the hero and portrait), so
 * the temporary stock pictures are replaced from the panel, not here. See
 * docs/04-design-system.md and docs/13-brand-voice.md for why each section is
 * here and what it may say.
 */
export async function HomePage({ locale }: { locale: Locale }) {
  const [settings, cocktails, landings] = await Promise.all([
    getSettings(),
    getFeaturedCocktails(),
    getNavigationLandings(),
  ]);
  const copy = d(locale);
  // A missing file would put the light placeholder under light type.
  const heroImage = mediaExists(settings.hero.imagePath) ? settings.hero.imagePath : '';
  // One sentence per line: balancing the whole title broke a two-sentence
  // headline mid-sentence ("Ai cocktail penso / io. Tu goditi…").
  const heroLines = t(settings.hero.title, locale).split(/(?<=[.!?])\s+/);
  const eyebrowParts = t(settings.hero.eyebrow, locale).split(' · ');

  const photos = settings.homePhotos;
  const serviceItems = (settings.service.homeItems[locale]?.length
    ? settings.service.homeItems[locale]
    : settings.service.homeItems.it
  ).slice(0, 3);
  const servicePhotos = [
    { src: photos.service1, alt: t(photos.service1Alt, locale) },
    { src: photos.service2, alt: t(photos.service2Alt, locale) },
    { src: photos.service3, alt: t(photos.service3Alt, locale) },
  ];
  // Three pictures of three shapes, set a little out of line with each other:
  // a portrait, a landscape lower down, a portrait in between. On a phone they
  // are all landscape, so three of them do not cost three screens.
  const serviceLayout = [
    { item: '', frame: 'aspect-[4/3] md:aspect-[4/5]' },
    { item: 'md:mt-28', frame: 'aspect-[4/3]' },
    { item: 'md:mt-12', frame: 'aspect-[4/3] md:aspect-[4/5]' },
  ];

  const facts = settings.about.facts[locale]?.length ? settings.about.facts[locale] : settings.about.facts.it;
  const steps = settings.home.steps[locale]?.length ? settings.home.steps[locale] : settings.home.steps.it;

  const featured = cocktails.slice(0, 3);
  const eventLinks = landings.map((landing) => ({
    label: landingNavLabel(t(landing.heroTitle, locale), locale),
    href: landingPath(locale === 'en' ? landing.slugEn : landing.slugIt, locale),
  }));

  return (
    <>
      {/* The headline's last line is in italic: fetch it with the other fonts
          rather than after the first paint. The layout preloads only the two
          faces every page needs; React moves this link into the <head>. */}
      <link rel="preload" href="/fonts/cormorant-italic-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

      {/* ================= OPENING ================= */}
      {/* The photograph under the whole first screen, the header floating over
          it (-mt pulls the section up under the fixed bar). The band is night
          whatever the theme, so the copy is always light on dark — and with no
          photograph yet it is still a finished, dark opening. The entrance is
          CSS only (globals.css, "The hero's opening") and ends on the page as
          it would be without it. */}
      <section className="hero on-image relative isolate -mt-16 flex flex-col justify-end overflow-hidden bg-night md:-mt-20">
        {/* Background only: nothing in it should catch a click or a tap. */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {settings.hero.videoPath ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              // Without a hint the browser downloads the whole file before
              // it knows whether the poster alone would have done.
              preload="metadata"
              poster={settings.hero.imagePath || undefined}
            >
              <source src={settings.hero.videoPath} type="video/mp4" />
            </video>
          ) : (
            heroImage && (
              <div className="hero-photo absolute inset-0">
                <Media
                  src={heroImage}
                  alt=""
                  priority
                  sizes="100vw"
                  variant="background"
                  // The glass sits right of centre: keep it in view on a phone.
                  imageClassName="object-[62%_50%]"
                />
              </div>
            )
          )}
          <div aria-hidden className="hero-veil absolute inset-0" />
          <div aria-hidden className="hero-scrim absolute inset-0" />
        </div>

        <div className="hero-content container-page w-full pt-32 md:pt-36">
          <div className="max-w-[62rem]">
            {/* The kicker sits inside the h1 on purpose: the headline is a
                person talking ("La tua casa. I tuoi ospiti…") and carries no
                search terms, so what he does and where is read as part of the
                heading. */}
            <h1>
              <span className="eyebrow eyebrow-ruled hero-in block" style={{ '--d': '0.1s' } as CSSProperties}>
                {/* On a phone the line breaks at the dot whatever the font:
                    left to the width, the fallback face (wider in capitals)
                    wrapped where the real one did not, and the whole opening
                    jumped when the font arrived. */}
                {eyebrowParts.map((part, index) => (
                  <Fragment key={index}>
                    {index > 0 && <span className="eyebrow-sep"> · </span>}
                    {part}
                  </Fragment>
                ))}
              </span>
              {/* Invisible between two blocks, but without it the heading's
                  text reads "…Roma e provinciaLa tua casa" to a crawler. */}{' '}
              <span className="display-hero hero-title mt-6 block md:mt-8">
                {heroLines.map((line, index) => (
                  <Fragment key={index}>
                    {index > 0 && ' '}
                    <span
                      className={cn('line', heroLines.length > 1 && index === heroLines.length - 1 && 'line-last')}
                      style={{ '--i': index } as CSSProperties}
                    >
                      <span className="line-inner">{typeset(line)}</span>
                    </span>
                  </Fragment>
                ))}
              </span>
            </h1>
            <p className="lede hero-in mt-7 max-w-[33rem] md:mt-9" style={{ '--d': '0.6s' } as CSSProperties}>
              {typeset(t(settings.hero.subtitle, locale))}
            </p>

            <div
              className="hero-actions hero-in mt-9 flex flex-wrap items-center gap-x-8 gap-y-5 md:mt-11"
              style={{ '--d': '0.7s' } as CSSProperties}
              data-cta-zone
            >
              <Link
                href={path('request', locale)}
                className="btn btn-primary"
                data-track="quote"
                data-track-location="hero"
              >
                {t(settings.hero.primaryCta, locale)}
                <span aria-hidden className="arrow">
                  →
                </span>
              </Link>
              <Link href={path('packages', locale)} className="link-more">
                <span className="label">{t(settings.hero.secondaryCta, locale)}</span>
              </Link>
            </div>
          </div>

          {/* A rule across the foot of the picture: the reassurance on the
              left, the way down on the right. */}
          <div
            className="hero-foot hero-in mt-12 flex min-h-16 items-center justify-between gap-6 border-t border-[var(--hairline)] md:mt-14"
            style={{ '--d': '0.85s' } as CSSProperties}
          >
            <p className="py-4 text-xs uppercase tracking-[0.18em] text-ink-3">{typeset(t(settings.hero.note, locale))}</p>
            <a href="#servizio" className="scroll-cue hidden py-2 md:inline-flex">
              <span>{copy.misc.scroll}</span>
              <span aria-hidden className="gauge">
                <span className="drop" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= I. IL SERVIZIO ================= */}
      <section id="servizio" className="section">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-7" data-reveal>
              <SectionMark numeral="I">{t(settings.service.homeEyebrow, locale)}</SectionMark>
              {/* Filled line by line, not balanced: balancing chose "Dal compleanno /
                  in casa al matrimonio.", splitting the party from its place. */}
              <h2 className="display-2 mt-6 max-w-[20ch] text-pretty">{typeset(t(settings.service.homeTitle, locale))}</h2>
            </div>
            <div className="lg:col-span-5 lg:pb-3" data-reveal style={delay(0.1)}>
              <p className="copy max-w-md">{typeset(t(settings.service.homeBody, locale))}</p>
              <Link href={path('packages', locale)} className="link-more mt-5">
                <span className="label">{t(settings.service.homeLinkLabel, locale)}</span>{' '}
                <span aria-hidden className="arrow">
                  →
                </span>
              </Link>
            </div>
          </div>

          <ul className="mt-14 grid gap-14 md:mt-20 md:grid-cols-3 md:gap-8 lg:gap-12">
            {serviceItems.map((item, index) => (
              <li key={`${index}-${item.title}`} className={serviceLayout[index]?.item}>
                <div
                  className={cn('frame', serviceLayout[index]?.frame ?? 'aspect-[4/3]')}
                  data-reveal="image"
                  style={delay(index * 0.12)}
                >
                  <Media
                    src={servicePhotos[index]?.src ?? ''}
                    alt={servicePhotos[index]?.alt ?? ''}
                    sizes="(min-width: 768px) 30vw, 100vw"
                    placeholderLabel={locale === 'en' ? 'Photo' : 'Foto'}
                  />
                </div>
                <div data-reveal style={delay(0.15 + index * 0.12)}>
                  <h3 className="display-3 mt-6">{typeset(item.title)}</h3>
                  <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-ink-2">{typeset(item.body)}</p>
                </div>
              </li>
            ))}
          </ul>

          {eventLinks.length > 0 && (
            // An index rather than a row of tags: each party has its own page,
            // and a list with a rule under every line reads as a table of
            // contents — which is what it is.
            <div className="mt-20 grid gap-8 border-t border-[var(--hairline-strong)] pt-10 md:mt-28 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4" data-reveal>
                <p className="eyebrow">{copy.nav.events}</p>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-3">
                  {t(settings.contact.serviceArea, locale)}
                </p>
              </div>
              <ul className="grid sm:grid-cols-2 sm:gap-x-10 lg:col-span-8" data-reveal style={delay(0.1)}>
                {eventLinks.map((link) => (
                  <li key={link.href} className="border-b border-[var(--hairline)]">
                    <Link
                      href={link.href}
                      className="group flex min-h-16 items-center justify-between gap-4 py-3 text-ink transition-colors duration-300 hover:text-accent-strong"
                    >
                      <span className="font-[family-name:var(--font-display)] text-[1.6rem] leading-tight md:text-[1.75rem]">
                        {link.label}
                      </span>
                      <span aria-hidden className="text-accent transition-transform duration-500 group-hover:translate-x-1.5">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ================= II. CHI SONO ================= */}
      <section className="section bg-paper-2">
        <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            {/* Landscape until the two columns sit side by side: a portrait
                frame filled a phone's screen, mostly with the dark top of the
                picture. Cropped from the centre, which also keeps the face of
                the portrait that will replace this stock photograph. */}
            <div className="frame aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5]" data-reveal="image">
              <Media
                src={settings.about.imagePath}
                alt={t(settings.about.imageAlt, locale)}
                sizes="(min-width: 1024px) 38vw, 100vw"
                placeholderLabel={locale === 'en' ? 'Photo' : 'Foto'}
              />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <div data-reveal>
              <SectionMark numeral="II">{t(settings.intro.eyebrow, locale)}</SectionMark>
              <h2 className="display-2 mt-6">{typeset(t(settings.intro.title, locale))}</h2>
              <p className="copy mt-7 max-w-xl">{typeset(t(settings.intro.body, locale))}</p>
            </div>
            {facts.length > 0 && (
              <div className="mt-10 max-w-xl" data-reveal style={delay(0.1)}>
                <p className="eyebrow">{t(settings.about.factsTitle, locale)}</p>
                <ul className="mt-4 border-t border-[var(--hairline-strong)]">
                  {facts.map((fact) => (
                    <li
                      key={fact}
                      className="flex items-baseline gap-4 border-b border-[var(--hairline)] py-3.5 text-[0.9375rem] text-ink-2"
                    >
                      <span aria-hidden className="h-px w-4 shrink-0 translate-y-[-0.3em] bg-brass" />
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link href={path('about', locale)} className="link-more mt-8" data-reveal style={delay(0.2)}>
              <span className="label">{t(settings.intro.linkLabel, locale)}</span>{' '}
              <span aria-hidden className="arrow">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= III. IL MIO MODO DI LAVORARE ================= */}
      <section className="section render-lazy tone-night bg-paper">
        <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7" data-reveal>
            <SectionMark numeral="III">{t(settings.method.eyebrow, locale)}</SectionMark>
            {/* His own sentence, set as what it is: something he says. The
                quotation marks are drawn in the gold and hidden from screen
                readers, so the heading is read as the sentence alone. The
                opening one hangs in the margin, as a compositor would set it:
                the words, not the mark, line up with the label and the text
                below. */}
            <h2 className="relative mt-8 text-[clamp(2.15rem,1.25rem+3.3vw,4.1rem)] font-normal italic leading-[1.06]">
              <span aria-hidden className="absolute right-full top-0 pr-[0.06em] text-brass">
                “
              </span>
              {typeset(t(settings.method.title, locale))}
              <span aria-hidden className="ml-[0.08em] text-brass">
                ”
              </span>
            </h2>
            <p className="copy mt-8 max-w-xl">{typeset(t(settings.method.body, locale))}</p>
          </div>

          {featured.length > 0 && (
            // The list as a printed menu card: names in the serif, what goes
            // in them in small capitals, a double rule round the edge.
            <aside
              className="lg:col-span-4 lg:col-start-9 lg:self-end"
              aria-label={t(settings.home.cocktailsTitle, locale)}
              data-reveal
              style={delay(0.15)}
            >
              <div className="menu-card px-6 py-9 text-center md:px-9">
                <p className="eyebrow">{t(settings.home.cocktailsTitle, locale)}</p>
                <ul className="mt-6">
                  {featured.map((cocktail) => (
                    <li key={cocktail.id} className="border-t border-[var(--hairline)] py-5 first:border-t-0">
                      <h3 className="text-[1.85rem] leading-tight">{cocktail.name}</h3>
                      <p className="mt-1.5 text-xs uppercase leading-relaxed tracking-[0.14em] text-ink-3">
                        {t(cocktail.ingredients, locale)}
                      </p>
                    </li>
                  ))}
                </ul>
                <Link href={path('cocktails', locale)} className="link-more mt-3">
                  <span className="label">{t(settings.method.linkLabel, locale)}</span>{' '}
                  <span aria-hidden className="arrow">
                    →
                  </span>
                </Link>
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* ================= IV. ATMOSFERA ================= */}
      {/* Four pictures of four sizes, out of line on purpose. They say what
          the gallery says — an idea of the atmosphere — and no more: none of
          them is one of his parties, and no caption claims it is. */}
      <section className="section render-lazy overflow-hidden">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-8" data-reveal>
              <SectionMark numeral="IV">{t(settings.home.galleryTitle, locale)}</SectionMark>
              <h2 className="display-2 mt-6 max-w-[19ch]">{typeset(t(settings.home.galleryIntro, locale))}</h2>
            </div>
            <div className="lg:col-span-4 lg:pb-3 lg:text-right" data-reveal style={delay(0.1)}>
              <Link href={path('gallery', locale)} className="link-more">
                <span className="label">{copy.cta.seeGallery}</span>{' '}
                <span aria-hidden className="arrow">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Half and half from a tablet up: the large portrait on the left
              against a landscape and two small pictures on the right, which
              come out at nearly the same height, so neither side leaves a
              hole. The offsets keep the edges from lining up like a grid. */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:mt-16 md:grid-cols-12 md:gap-6">
            <div className="col-span-2 md:col-span-6 md:row-span-2 md:mt-12">
              <div className="frame aspect-square md:aspect-[4/5]" data-reveal="image">
                <Media src={photos.mood1} alt={t(photos.mood1Alt, locale)} sizes="(min-width: 768px) 46vw, 100vw" />
              </div>
            </div>
            <div className="col-span-2 md:col-span-6">
              <div className="frame aspect-[3/2]" data-reveal="image" style={delay(0.1)}>
                <Media src={photos.mood4} alt={t(photos.mood4Alt, locale)} sizes="(min-width: 768px) 46vw, 100vw" />
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="frame aspect-[4/5] md:aspect-square" data-reveal="image" style={delay(0.15)}>
                <Media src={photos.mood2} alt={t(photos.mood2Alt, locale)} sizes="(min-width: 768px) 23vw, 50vw" />
              </div>
            </div>
            <div className="md:col-span-3 md:mt-10">
              <div className="frame aspect-[4/5]" data-reveal="image" style={delay(0.2)}>
                <Media src={photos.mood3} alt={t(photos.mood3Alt, locale)} sizes="(min-width: 768px) 23vw, 50vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= V. COME FUNZIONA ================= */}
      <section className="section render-lazy bg-paper-2">
        <div className="container-page">
          <div className="max-w-3xl" data-reveal>
            <SectionMark numeral="V">{t(settings.home.stepsEyebrow, locale)}</SectionMark>
            <h2 className="display-2 mt-6 max-w-[20ch] text-pretty">{typeset(t(settings.home.stepsTitle, locale))}</h2>
          </div>
          <ol className="mt-14 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-10 lg:gap-14">
            {steps.map((step, index) => (
              <li key={`${index}-${step.title}`} data-reveal style={delay(index * 0.12)}>
                <div className="flex items-center gap-5">
                  <span aria-hidden className="numeral text-[3.5rem] leading-none md:text-[4.25rem]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span aria-hidden className="h-px flex-1 bg-[var(--hairline-strong)]" />
                </div>
                <h3 className="display-3 mt-6">{typeset(step.title)}</h3>
                <p className="mt-3 max-w-sm leading-relaxed text-ink-2">{typeset(step.body)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= CONTATTO ================= */}
      <FinalCta locale={locale} />

      <JsonLd
        data={serviceJsonLd({
          name: t(settings.seo.defaultTitle, locale),
          description: t(settings.seo.defaultDescription, locale),
          url: absoluteUrl(path('home', locale)),
          settings,
        })}
      />
    </>
  );
}
