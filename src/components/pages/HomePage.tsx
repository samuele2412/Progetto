import Link from 'next/link';
import { Media } from '@/components/Media';
import { CocktailCard } from '@/components/blocks/CocktailCard';
import { FaqList } from '@/components/blocks/FaqList';
import { FinalCta } from '@/components/blocks/FinalCta';
import { PackageCard } from '@/components/blocks/PackageCard';
import { SectionHeader } from '@/components/blocks/SectionHeader';
import { StepList } from '@/components/blocks/StepList';
import { Testimonials } from '@/components/blocks/Testimonials';
import { JsonLd } from '@/components/JsonLd';
import { d } from '@/lib/dictionary';
import { t, tList, type Locale } from '@/lib/i18n';
import {
  getEventTypes,
  getFaqs,
  getFeaturedCocktails,
  getGalleryItems,
  getNavigationLandings,
  getPackages,
  getTestimonials,
} from '@/lib/queries';
import { landingPath, path } from '@/lib/routes';
import { absoluteUrl, faqJsonLd, serviceJsonLd } from '@/lib/seo';
import { getSettings } from '@/lib/settings';
import { cn, isPlaceholder, whatsappLink } from '@/lib/utils';

export async function HomePage({ locale }: { locale: Locale }) {
  const [settings, packages, cocktails, eventTypes, faqs, testimonials, gallery, landings] = await Promise.all([
    getSettings(),
    getPackages(),
    getFeaturedCocktails(),
    getEventTypes(),
    getFaqs('general'),
    getTestimonials(),
    getGalleryItems(),
    getNavigationLandings(),
  ]);

  const copy = d(locale);
  const whatsappHref = whatsappLink(settings.contact.whatsapp, t(settings.contact.whatsappMessage, locale));
  const homeFaqs = faqs.slice(0, 6);
  // `?? ` only catches undefined: an English list saved as empty from the panel
  // rendered an empty section instead of falling back to Italian.
  const pickList = <T,>(value: { it: T[]; en: T[] }) =>
    value[locale]?.length ? value[locale] : value.it;
  const valueProps = pickList(settings.home.valueProps);
  const steps = pickList(settings.home.steps);
  const badges = tList(settings.hero.badges, locale);

  const landingBySlug = new Map(
    landings.map((landing) => [landing.eventTypeSlug, locale === 'en' ? landing.slugEn : landing.slugIt]),
  );

  return (
    <>
      {/* ================= HERO ================= */}
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
              alt={t(settings.hero.title, locale)}
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
              // Tuned against the real photograph rather than against a blank
              // placeholder: the bottom stays almost opaque because the copy
              // sits there and has to clear AA contrast, while the top half is
              // let up from 0.45 to 0.32 so the photograph is actually visible
              // instead of being a dark texture.
              background:
                'linear-gradient(to top, rgba(10,9,8,0.96) 4%, rgba(10,9,8,0.80) 30%, rgba(10,9,8,0.55) 62%, rgba(10,9,8,0.32) 100%)',
            }}
          />
        </div>

        <div className="hero-content container-page pb-16 pt-28 md:pb-24">
          <div className="max-w-3xl">
            <p className="eyebrow fade-in-up">{t(settings.hero.eyebrow, locale)}</p>
            <h1 className="hero-title display-1 fade-in-up mt-5 text-bone-50 text-shadow-hero">
              {t(settings.hero.title, locale)}
            </h1>
            <p className="lede fade-in-up mt-6 max-w-xl text-bone-200">{t(settings.hero.subtitle, locale)}</p>

            <div className="hero-actions fade-in-up mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={path('request', locale)} className="btn btn-primary">
                {t(settings.hero.primaryCta, locale)}
              </Link>
              <Link href={path('cocktails', locale)} className="btn btn-ghost">
                {t(settings.hero.secondaryCta, locale)}
              </Link>
            </div>

            {badges.length > 0 && (
              <ul className="hero-badges fade-in-up mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-bone-400">
                {badges.map((badge) => (
                  <li key={badge} className="flex items-center gap-2">
                    <span aria-hidden className="h-1 w-1 rounded-full bg-brass-500" />
                    {badge}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* ================= VALUE PROPS ================= */}
      <section className="section">
        <div className="container-page">
          <SectionHeader
            title={t(settings.home.valuePropTitle, locale)}
            intro={t(settings.home.valuePropIntro, locale)}
          />
          <div className="section-body grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2">
            {valueProps.map((prop, index) => (
              <div
                key={`${index}-${prop.title}`}
                className={`reveal reveal-delay-${Math.min(index + 1, 4)} bg-ink-950 p-6 sm:p-7 md:p-9`}
              >
                <h3 className="font-[family-name:var(--font-display)] text-xl text-bone-50">{prop.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-bone-400">{prop.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="section border-t border-[var(--hairline)] bg-ink-900">
        <div className="container-page">
          <SectionHeader
            title={t(settings.home.howTitle, locale)}
            intro={t(settings.home.howIntro, locale)}
          />
          <div className="section-body">
            <StepList steps={steps} />
          </div>
        </div>
      </section>

      {/* ================= PACKAGES ================= */}
      <section id="pacchetti" className="section">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              title={t(settings.home.packagesTitle, locale)}
              intro={t(settings.home.packagesIntro, locale)}
            />
            <Link href={path('packages', locale)} className="btn btn-ghost !min-h-11 !py-2.5 text-sm">
              {copy.cta.seePackages}
            </Link>
          </div>
          <div className="section-body grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="reveal">
                <PackageCard pkg={pkg} locale={locale} copy={copy} compact />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COCKTAILS ================= */}
      <section className="section border-t border-[var(--hairline)] bg-ink-900">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              title={t(settings.home.cocktailsTitle, locale)}
              intro={t(settings.home.cocktailsIntro, locale)}
            />
            <Link href={path('cocktails', locale)} className="btn btn-ghost !min-h-11 !py-2.5 text-sm">
              {copy.cta.seeCocktails}
            </Link>
          </div>
          <div className="section-body grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {cocktails.slice(0, 8).map((cocktail, index) => (
              <div
                key={cocktail.id}
                className={cn(
                  `reveal reveal-delay-${Math.min((index % 4) + 1, 4)}`,
                  // Six on a phone: in two columns a seventh card sits alone on
                  // a fourth row, which costs a whole row of scrolling to show
                  // one more drink. The full list is one tap away in the link
                  // above, and every larger layout still shows all of them.
                  index >= 6 && 'hidden sm:block',
                )}
              >
                <CocktailCard cocktail={cocktail} locale={locale} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= EVENTS ================= */}
      <section className="section">
        <div className="container-page">
          <SectionHeader
            title={t(settings.home.eventsTitle, locale)}
            intro={t(settings.home.eventsIntro, locale)}
          />
          {/* Two columns from the smallest screen, matching the cocktail grid
              above it. As a single column these eight cards were 3.200px on
              a phone — a fifth of the whole page for one "which of these are
              you?" question. */}
          <ul className="section-body grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {eventTypes.map((eventType, index) => {
              const landingSlug = landingBySlug.get(eventType.slug);
              const href = landingSlug
                ? landingPath(landingSlug, locale)
                : path('request', locale, { evento: eventType.slug });
              return (
                <li key={eventType.id} className={`reveal reveal-delay-${Math.min(index % 4 + 1, 4)}`}>
                  <Link href={href} className="card card-hover group block h-full overflow-hidden">
                    <div className="relative aspect-[5/4] overflow-hidden">
                      <Media
                        src={eventType.imagePath}
                        alt={t(eventType.name, locale)}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        imageClassName="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        placeholderLabel={t(eventType.name, locale)}
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent"
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="font-[family-name:var(--font-display)] text-base text-bone-50 transition-colors group-hover:text-brass-300 sm:text-lg">
                        {t(eventType.name, locale)}
                      </h3>
                      {/* Clamped on a phone only: in a 160px column the full
                          blurb ran to five lines of 14px text, which reads as a
                          wall rather than a caption. The card links to the page
                          that carries the whole sentence. */}
                      <p className="mt-1.5 line-clamp-3 text-[0.82rem] leading-relaxed text-bone-400 sm:mt-2 sm:line-clamp-none sm:text-sm">
                        {t(eventType.blurb, locale)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ================= THE PERSON ================= */}
      <section className="section border-t border-[var(--hairline)] bg-ink-900">
        <div className="container-page grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
          {/* 4/5 full-bleed meant a 487px portrait on a 390px phone — half a
              screen of decoration before the text it belongs to. 4/3 keeps the
              framing and gives back ~190px; the desktop ratio is untouched. */}
          <div className="reveal relative aspect-[4/3] overflow-hidden rounded-[var(--radius-panel)] sm:aspect-[3/2] lg:aspect-[4/5]">
            <Media
              src={settings.about.imagePath}
              alt={t(settings.about.title, locale)}
              sizes="(max-width: 1024px) 100vw, 45vw"
              placeholderLabel={locale === 'en' ? 'Portrait of the bartender' : 'Ritratto del bartender'}
            />
          </div>
          <div className="reveal reveal-delay-1">
            <p className="eyebrow">{t(settings.about.eyebrow, locale)}</p>
            <h2 className="display-2 mt-3 text-bone-50">{t(settings.about.title, locale)}</h2>
            <div className="mt-6 space-y-4 text-[0.98rem] leading-relaxed text-bone-400">
              {t(settings.about.body, locale)
                .split('\n\n')
                .map((paragraph, index) => (
                  <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                ))}
            </div>
            <ul className="mt-8 space-y-2.5 text-sm text-bone-200">
              {tList(settings.about.facts, locale).map((fact) => (
                <li key={fact} className="flex gap-2.5">
                  <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0 text-brass-500" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
            {!isPlaceholder(settings.about.signature) && (
              <p className="mt-8 font-[family-name:var(--font-display)] text-lg text-brass-400">
                {settings.about.signature}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      {gallery.length > 0 && (
        <section className="section">
          <div className="container-page">
            <SectionHeader
              title={t(settings.home.galleryTitle, locale)}
              intro={t(settings.home.galleryIntro, locale)}
            />
            <div className="section-body grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {gallery.slice(0, 8).map((item, index) => (
                <figure
                  key={item.id}
                  className={`reveal reveal-delay-${Math.min(index % 4 + 1, 4)} relative aspect-square overflow-hidden rounded-xl`}
                >
                  <Media
                    src={item.imagePath}
                    alt={t(item.alt, locale)}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    placeholderLabel={t(item.caption, locale) || undefined}
                  />
                </figure>
              ))}
            </div>
            <div className="mt-8">
              <Link href={path('gallery', locale)} className="btn btn-ghost !min-h-11 !py-2.5 text-sm">
                {copy.cta.seeAll}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ================= TESTIMONIALS ================= */}
      <section className="section border-t border-[var(--hairline)] bg-ink-900">
        <div className="container-page">
          <SectionHeader
            title={t(settings.home.testimonialsTitle, locale)}
            intro={t(settings.home.testimonialsIntro, locale)}
          />
          <div className="section-body">
            <Testimonials testimonials={testimonials} locale={locale} copy={copy} />
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      {homeFaqs.length > 0 && (
        <section className="section">
          <div className="container-page">
            <SectionHeader
              title={t(settings.home.faqTitle, locale)}
              intro={t(settings.home.faqIntro, locale)}
            />
            <div className="reveal mt-12">
              <FaqList faqs={homeFaqs} locale={locale} />
            </div>
            <div className="mt-8">
              <Link href={path('faq', locale)} className="btn btn-ghost !min-h-11 !py-2.5 text-sm">
                {copy.cta.seeAll}
              </Link>
            </div>
          </div>
        </section>
      )}

      <FinalCta
        locale={locale}
        copy={copy}
        title={t(settings.home.finalCtaTitle, locale)}
        body={t(settings.home.finalCtaBody, locale)}
        whatsappHref={whatsappHref}
      />

      <JsonLd
        data={serviceJsonLd({
          name: t(settings.seo.defaultTitle, locale),
          description: t(settings.seo.defaultDescription, locale),
          url: absoluteUrl(path('home', locale)),
          settings,
          offers: packages.map((pkg) => ({
            name: t(pkg.name, locale),
            price: pkg.pricePerGuestFrom,
            description: t(pkg.description, locale),
          })),
        })}
      />
      <JsonLd
        data={faqJsonLd(
          homeFaqs.map((faq) => ({ question: t(faq.question, locale), answer: t(faq.answer, locale) })),
        )}
      />
    </>
  );
}
