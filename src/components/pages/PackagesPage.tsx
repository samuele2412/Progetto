import Link from 'next/link';
import { FaqList } from '@/components/blocks/FaqList';
import { FinalCta } from '@/components/blocks/FinalCta';
import { PackageCard } from '@/components/blocks/PackageCard';
import { PageHero } from '@/components/blocks/PageHero';
import { SectionHeader } from '@/components/blocks/SectionHeader';
import { StepList } from '@/components/blocks/StepList';
import { JsonLd } from '@/components/JsonLd';
import { d } from '@/lib/dictionary';
import { t, tList, type Locale } from '@/lib/i18n';
import { getAddons, getFaqs, getPackages } from '@/lib/queries';
import { path } from '@/lib/routes';
import { absoluteUrl, faqJsonLd, serviceJsonLd } from '@/lib/seo';
import { getSettings } from '@/lib/settings';

/**
 * The service page. It still lives at /pacchetti so no link or search result
 * breaks, but it no longer sells four priced formats: until Samuele sets his
 * prices every quote is made to measure, and the page says what he brings,
 * what the host provides and how a date gets fixed.
 *
 * Formats, extras and pricing questions come back on their own as soon as
 * they are switched on in the panel — the sections below render only when
 * there is something to show.
 */
export async function PackagesPage({ locale }: { locale: Locale }) {
  const [settings, packages, addons, faqs] = await Promise.all([
    getSettings(),
    getPackages(),
    getAddons(),
    getFaqs('pricing'),
  ]);
  const copy = d(locale);
  const service = settings.service;
  const bring = tList(service.bringItems, locale);
  // `??` only catches undefined: an English list saved as empty from the panel
  // would render an empty block instead of falling back to Italian.
  const steps = service.steps[locale]?.length ? service.steps[locale] : service.steps.it;

  return (
    <>
      <PageHero
        eyebrow={t(settings.brand.descriptor, locale)}
        title={t(service.pageTitle, locale)}
        intro={t(service.pageIntro, locale)}
      />

      <section className="section">
        <div className="container-page grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-14">
          <div className="reveal">
            <h2 className="display-3 text-bone-50">{t(service.bringTitle, locale)}</h2>
            <ul className="mt-5 space-y-3 text-[0.98rem] leading-relaxed text-bone-200">
              {bring.map((item) => (
                <li key={item} className="flex gap-3">
                  <svg viewBox="0 0 16 16" className="mt-1.5 h-3.5 w-3.5 shrink-0 text-brass-500" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal reveal-delay-1">
            <h2 className="display-3 text-bone-50">{t(service.needTitle, locale)}</h2>
            <p className="mt-5 text-[0.98rem] leading-relaxed text-bone-200">{t(service.needBody, locale)}</p>
          </div>
          <div className="reveal reveal-delay-2">
            <h2 className="display-3 text-bone-50">{t(service.drinksTitle, locale)}</h2>
            <p className="mt-5 text-[0.98rem] leading-relaxed text-bone-200">{t(service.drinksBody, locale)}</p>
            <Link
              href={path('cocktails', locale)}
              className="tap-target mt-4 gap-2 text-sm font-medium text-brass-300 transition-colors hover:text-bone-50"
            >
              {copy.cta.seeCocktails} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section border-t border-[var(--hairline)] bg-ink-900">
        <div className="container-page grid gap-5 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <h2 className="display-2 reveal text-bone-50">{t(service.priceTitle, locale)}</h2>
          <p className="lede reveal reveal-delay-1 lg:pt-2">{t(service.priceBody, locale)}</p>
        </div>
      </section>

      {packages.length > 0 && (
        <section className="section">
          <div className="container-page">
            <SectionHeader title={copy.packages.title} />
            <div className="section-body grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="reveal">
                  <PackageCard pkg={pkg} locale={locale} copy={copy} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {addons.length > 0 && (
        <section className="section border-t border-[var(--hairline)] bg-ink-900">
          <div className="container-page">
            <SectionHeader title={copy.packages.addons} intro={copy.packages.addonsIntro} />
            <ul className="section-body grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
              {addons.map((addon, index) => (
                <li
                  key={addon.id}
                  className={`reveal reveal-delay-${Math.min(index % 4 + 1, 4)} flex flex-col bg-ink-900 p-6`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-[family-name:var(--font-display)] text-lg text-bone-50">
                      {t(addon.name, locale)}
                    </h3>
                    <span className="shrink-0 whitespace-nowrap text-sm font-medium text-brass-400">
                      {t(addon.price, locale)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-bone-400">{t(addon.description, locale)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {steps.length > 0 && (
        <section className="section border-t border-[var(--hairline)]">
          <div className="container-page">
            <h2 className="display-2 reveal max-w-xl text-bone-50">{t(service.stepsTitle, locale)}</h2>
            <div className="section-body">
              <StepList steps={steps} />
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="section border-t border-[var(--hairline)]">
          <div className="container-page">
            <SectionHeader title={t(settings.home.faqTitle, locale)} />
            <div className="reveal mt-10">
              <FaqList faqs={faqs} locale={locale} />
            </div>
          </div>
        </section>
      )}

      <FinalCta locale={locale} brief />

      <JsonLd
        data={serviceJsonLd({
          name: `${settings.brand.name} — ${t(settings.brand.descriptor, locale)}`,
          description: t(service.pageIntro, locale),
          url: absoluteUrl(path('packages', locale)),
          settings,
          // Offers only for formats that really exist: the catalogue used to
          // be built from estimates, and structured data is a public claim.
          offers: packages.map((pkg) => ({
            name: t(pkg.name, locale),
            price: pkg.pricePerGuestFrom,
            description: t(pkg.description, locale),
          })),
        })}
      />
      <JsonLd
        data={faqJsonLd(faqs.map((faq) => ({ question: t(faq.question, locale), answer: t(faq.answer, locale) })))}
      />
    </>
  );
}
