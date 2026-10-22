import Link from 'next/link';
import { FaqList } from '@/components/blocks/FaqList';
import { FinalCta } from '@/components/blocks/FinalCta';
import { PackageCard } from '@/components/blocks/PackageCard';
import { PageHero } from '@/components/blocks/PageHero';
import { JsonLd } from '@/components/JsonLd';
import type { LandingPage } from '@/db/schema';
import { d } from '@/lib/dictionary';
import { t, tList, type Locale } from '@/lib/i18n';
import { renderMarkdown } from '@/lib/markdown';
import { getFaqs, getPackages } from '@/lib/queries';
import { landingPath, path } from '@/lib/routes';
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/seo';
import { getSettings } from '@/lib/settings';
import { whatsappLink } from '@/lib/utils';

export async function LandingPageView({ locale, landing }: { locale: Locale; landing: LandingPage }) {
  const [settings, packages, faqs] = await Promise.all([
    getSettings(),
    getPackages(),
    getFaqs(landing.faqTopic || 'general'),
  ]);
  const copy = d(locale);
  const whatsappHref = whatsappLink(settings.contact.whatsapp, t(settings.contact.whatsappMessage, locale));
  const recommended = packages.find((pkg) => pkg.slug === landing.recommendedPackage);
  // Only a format that is actually on offer travels to the form: a landing can
  // still name one that has since been switched off in the panel.
  const packageSlug = recommended?.slug;
  const highlights = tList(landing.highlights, locale);
  const slug = locale === 'en' ? landing.slugEn : landing.slugIt;
  // Every landing shares the general questions now; four is enough on a page
  // that exists to answer one kind of party, the rest are a link away.
  const shownFaqs = faqs.slice(0, 4);

  return (
    <>
      <PageHero
        // The descriptor ("Bartender per feste private") right above "Bartender
        // per matrimoni a Roma" said the same word twice and named the wrong
        // party; the menu section the page belongs to reads as orientation.
        eyebrow={copy.nav.events}
        title={t(landing.heroTitle, locale)}
        intro={t(landing.heroSubtitle, locale)}
        imagePath={landing.heroImagePath}
      >
        <div className="fade-in-up mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={path('request', locale, {
              evento: landing.eventTypeSlug || undefined,
              pacchetto: packageSlug,
            })}
            className="btn btn-primary"
          >
            {copy.cta.quoteLong}
          </Link>
          {whatsappHref && (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              {copy.cta.whatsappLong}
            </a>
          )}
        </div>
      </PageHero>

      {highlights.length > 0 && (
        <section className="border-b border-[var(--hairline)] bg-ink-900">
          <div className="container-page">
            <ul className="grid gap-px bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map((item, index) => (
                <li
                  key={item}
                  className={`reveal reveal-delay-${Math.min(index + 1, 4)} flex items-start gap-3 bg-ink-900 px-5 py-6`}
                >
                  <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0 text-brass-500" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm leading-relaxed text-bone-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section">
        <div className={`container-page grid gap-14 lg:gap-20 ${recommended ? 'lg:grid-cols-[1.5fr_1fr]' : ''}`}>
          <article className="prose-cordiale reveal max-w-2xl">
            {renderMarkdown(t(landing.body, locale))}
          </article>

          {recommended && (
            <aside className="reveal reveal-delay-1 h-fit lg:sticky lg:top-28">
              <p className="eyebrow mb-4">
                {locale === 'en' ? 'Recommended format' : 'Formula consigliata'}
              </p>
              <PackageCard pkg={recommended} locale={locale} copy={copy} compact />
            </aside>
          )}
        </div>
      </section>

      {shownFaqs.length > 0 && (
        <section className="section border-t border-[var(--hairline)] bg-ink-900">
          <div className="container-page max-w-4xl">
            <h2 className="display-2 reveal text-bone-50">{t(settings.home.faqTitle, locale)}</h2>
            <div className="reveal mt-8">
              <FaqList faqs={shownFaqs} locale={locale} />
            </div>
            {faqs.length > shownFaqs.length && (
              <Link
                href={path('faq', locale)}
                className="tap-target mt-6 gap-2 text-sm font-medium text-brass-300 transition-colors hover:text-bone-50"
              >
                {copy.cta.seeAll} <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        </section>
      )}

      <FinalCta
        locale={locale}
        packageSlug={packageSlug}
        eventTypeSlug={landing.eventTypeSlug || undefined}
        brief
      />

      <JsonLd
        data={serviceJsonLd({
          name: t(landing.heroTitle, locale),
          description: t(landing.seoDescription, locale),
          url: absoluteUrl(landingPath(slug, locale)),
          settings,
          offers: recommended
            ? [
                {
                  name: t(recommended.name, locale),
                  price: recommended.pricePerGuestFrom,
                  description: t(recommended.description, locale),
                },
              ]
            : [],
        })}
      />
      <JsonLd
        data={faqJsonLd(shownFaqs.map((faq) => ({ question: t(faq.question, locale), answer: t(faq.answer, locale) })))}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: settings.brand.name, path: path('home', locale) },
          { name: t(landing.heroTitle, locale), path: landingPath(slug, locale) },
        ])}
      />
    </>
  );
}
