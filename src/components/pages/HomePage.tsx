import { Fragment } from 'react';
import Link from 'next/link';
import { Media, mediaExists } from '@/components/Media';
import { FinalCta } from '@/components/blocks/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { WhatsAppIcon } from '@/components/icons';
import { d } from '@/lib/dictionary';
import { t, type Locale } from '@/lib/i18n';
import { getFeaturedCocktails, getNavigationLandings } from '@/lib/queries';
import { landingNavLabel, landingPath, path } from '@/lib/routes';
import { absoluteUrl, serviceJsonLd } from '@/lib/seo';
import { getSettings } from '@/lib/settings';
import { whatsappLink } from '@/lib/utils';

/**
 * The home page: five sections, one main button.
 *
 *   1. who and what, in one line         (hero)
 *   2. who he is, with facts            (intro)
 *   3. what the service covers          (service)
 *   4. the one thing that is his        (method)
 *   5. how to get in touch              (FinalCta)
 *
 * The hero is the one full-bleed photograph, with the headline over it on a
 * night-coloured band, so the page is readable before the image arrives;
 * below it text and images alternate so two photographs never sit back to
 * back. See docs/04-design-system.md and docs/13-brand-voice.md for why each
 * section is here and what it may say.
 */
export async function HomePage({ locale }: { locale: Locale }) {
  const [settings, cocktails, landings] = await Promise.all([
    getSettings(),
    getFeaturedCocktails(),
    getNavigationLandings(),
  ]);
  const copy = d(locale);
  const whatsappHref = whatsappLink(settings.contact.whatsapp, t(settings.contact.whatsappMessage, locale));
  // A missing file would put the light placeholder under light type.
  const heroImage = mediaExists(settings.hero.imagePath) ? settings.hero.imagePath : '';
  // One sentence per line: balancing the whole title broke a two-sentence
  // headline mid-sentence ("Ai cocktail penso / io. Tu goditi…").
  const heroLines = t(settings.hero.title, locale).split(/(?<=[.!?])\s+/);

  const featured = cocktails.slice(0, 3);
  const eventLinks = landings.map((landing) => ({
    label: landingNavLabel(t(landing.heroTitle, locale), locale),
    href: landingPath(locale === 'en' ? landing.slugEn : landing.slugIt, locale),
  }));

  return (
    <>
      {/* ================= 1. HERO ================= */}
      {/* The photograph under the whole first screen, the header floating over
          it (-mt pulls the section up under the fixed bar). The band is night
          whatever the theme, so the copy is always light on dark — and with no
          photograph yet it is still a finished, dark opening. */}
      <section className="hero on-image relative isolate -mt-16 flex items-end overflow-hidden bg-night md:-mt-20">
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
              <Media
                src={heroImage}
                alt=""
                priority
                sizes="100vw"
                variant="background"
                // The glass sits right of centre: keep it in view on a phone.
                imageClassName="object-[62%_50%]"
              />
            )
          )}
          <div aria-hidden className="hero-scrim absolute inset-0" />
        </div>

        <div className="hero-content container-page w-full pb-14 pt-32 md:pb-20 md:pt-40 lg:pb-24">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* The kicker sits inside the h1 on purpose: the headline is a
                person talking ("La tua casa. I tuoi ospiti…") and carries no search terms,
                so what he does and where is read as part of the heading. */}
            <h1>
              <span className="eyebrow eyebrow-ruled block">{t(settings.hero.eyebrow, locale)}</span>
              {/* Invisible between two blocks, but without it the heading's
                  text reads "…Roma e provinciaLa tua casa" to a crawler. */}{' '}
              <span className="display-hero text-shadow-hero mt-5 block">
                {heroLines.map((line, index) => (
                  <Fragment key={index}>
                    {index > 0 && ' '}
                    <span className="block">{line}</span>
                  </Fragment>
                ))}
              </span>
            </h1>
            <p className="lede mt-6 max-w-xl">{t(settings.hero.subtitle, locale)}</p>

            <div className="hero-actions mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href={path('request', locale)}
                className="btn btn-primary"
                data-track="quote"
                data-track-location="hero"
              >
                {t(settings.hero.primaryCta, locale)}
              </Link>
              {/* The second way in, for whoever would rather send a message:
                  quieter than the button, and only once there is a number. */}
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-more"
                  data-track="whatsapp"
                  data-track-location="hero"
                >
                  <WhatsAppIcon />
                  <span className="label">{copy.cta.whatsappLong}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. CHI SONO, IN BREVE ================= */}
      <section className="section border-t border-[var(--hairline)]">
        <div className="container-page grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Text first on a phone: the hero has just ended on a photograph. */}
          <div className="lg:order-2 lg:col-span-7">
            <p className="eyebrow eyebrow-ruled">{t(settings.intro.eyebrow, locale)}</p>
            <h2 className="display-2 mt-4">{t(settings.intro.title, locale)}</h2>
            <p className="copy mt-6 max-w-xl">{t(settings.intro.body, locale)}</p>
            <Link href={path('about', locale)} className="link-more mt-6">
              <span className="label">{t(settings.intro.linkLabel, locale)}</span> <span aria-hidden className="arrow">→</span>
            </Link>
          </div>
          <div className="lg:order-1 lg:col-span-5">
            <div className="frame aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5]">
              <Media
                src={settings.about.imagePath}
                alt={t(settings.about.imageAlt, locale)}
                sizes="(min-width: 1024px) 40vw, 100vw"
                placeholderLabel={locale === 'en' ? 'Photo' : 'Foto'}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. COSA FACCIO ================= */}
      <section className="section bg-paper-2">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="display-2">{t(settings.service.homeTitle, locale)}</h2>
            <p className="copy mt-5 max-w-md">{t(settings.service.homeBody, locale)}</p>
            <Link href={path('packages', locale)} className="link-more mt-6">
              <span className="label">{t(settings.service.homeLinkLabel, locale)}</span> <span aria-hidden className="arrow">→</span>
            </Link>
          </div>
          {eventLinks.length > 0 && (
            // An index rather than a row of tags: each party has its own page,
            // and a list with a rule under every line reads as a table of
            // contents — which is what it is.
            <ul className="grid border-t border-[var(--hairline-strong)] sm:grid-cols-2 sm:gap-x-10 lg:col-span-7">
              {eventLinks.map((link) => (
                <li key={link.href} className="border-b border-[var(--hairline-strong)]">
                  <Link
                    href={link.href}
                    className="group flex min-h-14 items-center justify-between gap-4 py-3 text-ink transition-colors hover:text-accent-strong"
                  >
                    <span className="font-[family-name:var(--font-display)] text-lg md:text-xl">{link.label}</span>
                    <span aria-hidden className="text-accent transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ================= 4. IL MIO MODO DI LAVORARE ================= */}
      <section className="section">
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="eyebrow eyebrow-ruled">{t(settings.method.eyebrow, locale)}</p>
            {/* His own sentence, set as what it is: something he says. The
                quotation mark is drawn, not typed, so it is not read out. */}
            <span
              aria-hidden
              className="mt-6 block font-[family-name:var(--font-display)] text-6xl leading-[0.5] text-brass"
            >
              “
            </span>
            <h2 className="display-2 mt-2">{t(settings.method.title, locale)}</h2>
            <p className="copy mt-6 max-w-xl">{t(settings.method.body, locale)}</p>
          </div>

          {featured.length > 0 && (
            <ul className="section-body grid sm:grid-cols-3 sm:gap-6 lg:gap-8">
              {featured.map((cocktail) => (
                <li key={cocktail.id}>
                  {/* A thumbnail row on a phone, a framed picture from sm up:
                      three full images stacked would cost two screens for
                      three examples. */}
                  <article className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-4 border-b border-[var(--hairline)] py-3 sm:block sm:border-0 sm:py-0">
                    <div className="frame aspect-square sm:aspect-[4/5]">
                      <Media
                        src={cocktail.imagePath}
                        alt={cocktail.name}
                        sizes="(max-width: 640px) 72px, 30vw"
                        placeholderLabel={cocktail.name}
                      />
                    </div>
                    <div className="sm:mt-4">
                      <h3 className="font-[family-name:var(--font-display)] text-xl">{cocktail.name}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-3">{t(cocktail.ingredients, locale)}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}

          <Link href={path('cocktails', locale)} className="link-more mt-8">
            <span className="label">{t(settings.method.linkLabel, locale)}</span> <span aria-hidden className="arrow">→</span>
          </Link>
        </div>
      </section>

      {/* ================= 5. CONTATTO ================= */}
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
