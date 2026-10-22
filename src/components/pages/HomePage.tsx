import Link from 'next/link';
import { Media } from '@/components/Media';
import { FinalCta } from '@/components/blocks/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { t, type Locale } from '@/lib/i18n';
import { getFeaturedCocktails, getNavigationLandings } from '@/lib/queries';
import { landingNavLabel, landingPath, path } from '@/lib/routes';
import { absoluteUrl, serviceJsonLd } from '@/lib/seo';
import { getSettings } from '@/lib/settings';

/**
 * The home page: five sections, one main button.
 *
 *   1. who and what, in one line         (hero)
 *   2. who he is, with facts            (intro)
 *   3. what the service covers          (service)
 *   4. the one thing that is his        (method)
 *   5. how to get in touch              (FinalCta)
 *
 * Everything else the old home carried — formats, eight event cards, gallery,
 * FAQ, value props — lives on its own page now. See docs/13-brand-voice.md for
 * why each section is here and what it may not say.
 */
export async function HomePage({ locale }: { locale: Locale }) {
  const [settings, cocktails, landings] = await Promise.all([
    getSettings(),
    getFeaturedCocktails(),
    getNavigationLandings(),
  ]);

  const featured = cocktails.slice(0, 3);
  const eventLinks = landings.map((landing) => ({
    label: landingNavLabel(t(landing.heroTitle, locale), locale),
    href: landingPath(locale === 'en' ? landing.slugEn : landing.slugIt, locale),
  }));

  return (
    <>
      {/* ================= 1. HERO ================= */}
      <section className="hero-viewport relative isolate flex items-end overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {settings.hero.videoPath ? (
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              // Without a hint the browser downloads the whole file before it
              // knows whether the poster alone would have done.
              preload="metadata"
              poster={settings.hero.imagePath || undefined}
            >
              <source src={settings.hero.videoPath} type="video/mp4" />
            </video>
          ) : (
            <Media
              src={settings.hero.imagePath}
              alt=""
              priority
              sizes="100vw"
              variant="background"
              placeholderLabel={locale === 'en' ? 'Hero image' : 'Immagine hero'}
            />
          )}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              // Tuned against the real photograph: the bottom stays almost
              // opaque because the copy sits there and has to clear AA
              // contrast, while the top lets the picture through.
              background:
                'linear-gradient(to top, rgba(10,9,8,0.96) 4%, rgba(10,9,8,0.80) 30%, rgba(10,9,8,0.55) 62%, rgba(10,9,8,0.32) 100%)',
            }}
          />
        </div>

        <div className="hero-content container-page pb-16 pt-28 md:pb-24">
          <div className="max-w-3xl">
            {/* The kicker sits inside the h1 on purpose: the headline is a
                person talking ("Sono Samuele…") and carries no search terms,
                so what he does and where is read as part of the heading. */}
            <h1>
              <span className="eyebrow fade-in-up block">{t(settings.hero.eyebrow, locale)}</span>
              {/* Invisible between two blocks, but without it the heading's
                  text reads "…Roma e provinciaSono Samuele" to a crawler. */}{' '}
              <span className="hero-title display-1 fade-in-up mt-5 block text-bone-50 text-shadow-hero">
                {t(settings.hero.title, locale)}
              </span>
            </h1>
            <p className="lede fade-in-up mt-6 max-w-xl text-bone-200">{t(settings.hero.subtitle, locale)}</p>

            <div className="hero-actions fade-in-up mt-9 flex">
              <Link href={path('request', locale)} className="btn btn-primary">
                {t(settings.hero.primaryCta, locale)}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. CHI SONO, IN BREVE ================= */}
      <section className="section">
        <div className="container-page grid items-center gap-8 sm:gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="reveal relative aspect-[16/10] overflow-hidden rounded-[var(--radius-panel)] sm:aspect-[3/2] lg:aspect-[4/5]">
            <Media
              src={settings.about.imagePath}
              alt={t(settings.about.imageAlt, locale)}
              sizes="(max-width: 1024px) 100vw, 45vw"
              placeholderLabel={locale === 'en' ? 'Photo' : 'Foto'}
            />
          </div>
          <div className="reveal reveal-delay-1">
            <p className="eyebrow">{t(settings.intro.eyebrow, locale)}</p>
            <h2 className="display-2 mt-3 text-bone-50">{t(settings.intro.title, locale)}</h2>
            <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-bone-200">{t(settings.intro.body, locale)}</p>
            <Link href={path('about', locale)} className="tap-target gap-2 text-sm font-medium text-brass-300 transition-colors hover:text-bone-50 mt-6">
              {t(settings.intro.linkLabel, locale)} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 3. COSA FACCIO ================= */}
      <section className="section border-t border-[var(--hairline)] bg-ink-900">
        <div className="container-page">
          <div className="reveal max-w-2xl">
            <h2 className="display-2 text-bone-50">{t(settings.service.homeTitle, locale)}</h2>
            <p className="lede mt-5">{t(settings.service.homeBody, locale)}</p>
          </div>
          {eventLinks.length > 0 && (
            <ul className="reveal section-body flex flex-wrap gap-2.5">
              {eventLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center rounded-full border border-[var(--hairline-strong)] px-4 text-sm text-bone-200 transition-colors hover:border-brass-500 hover:text-brass-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href={path('packages', locale)} className="reveal tap-target gap-2 text-sm font-medium text-brass-300 transition-colors hover:text-bone-50 mt-6">
            {t(settings.service.homeLinkLabel, locale)} <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* ================= 4. IL MIO MODO DI LAVORARE ================= */}
      <section className="section">
        <div className="container-page">
          <div className="reveal max-w-3xl">
            <p className="eyebrow">{t(settings.method.eyebrow, locale)}</p>
            <h2 className="display-2 mt-3 text-bone-50">{t(settings.method.title, locale)}</h2>
            <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-bone-200">{t(settings.method.body, locale)}</p>
          </div>

          {featured.length > 0 && (
            <ul className="section-body grid gap-3 sm:grid-cols-3 sm:gap-5">
              {featured.map((cocktail, index) => (
                <li key={cocktail.id} className={`reveal reveal-delay-${index + 1}`}>
                  {/* A thumbnail row on a phone, a card from sm up: three full
                      cards stacked would cost two screens for three examples. */}
                  <article className="card grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-4 overflow-hidden p-2 pr-4 sm:block sm:p-0">
                    <div className="relative aspect-square overflow-hidden rounded-lg sm:aspect-[4/5] sm:rounded-none">
                      <Media
                        src={cocktail.imagePath}
                        alt={cocktail.name}
                        sizes="(max-width: 640px) 80px, 33vw"
                        placeholderLabel={cocktail.name}
                      />
                    </div>
                    <div className="sm:p-5">
                      <h3 className="font-[family-name:var(--font-display)] text-lg text-bone-50">{cocktail.name}</h3>
                      <p className="mt-1 text-xs uppercase tracking-wider text-brass-500">{t(cocktail.ingredients, locale)}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}

          <Link href={path('cocktails', locale)} className="reveal tap-target gap-2 text-sm font-medium text-brass-300 transition-colors hover:text-bone-50 mt-6">
            {t(settings.method.linkLabel, locale)} <span aria-hidden>→</span>
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
