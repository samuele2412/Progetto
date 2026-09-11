import { FaqList } from '@/components/blocks/FaqList';
import { FinalCta } from '@/components/blocks/FinalCta';
import { PackageCard } from '@/components/blocks/PackageCard';
import { PageHero } from '@/components/blocks/PageHero';
import { SectionHeader } from '@/components/blocks/SectionHeader';
import { JsonLd } from '@/components/JsonLd';
import { d } from '@/lib/dictionary';
import { t, type Locale } from '@/lib/i18n';
import { getAddons, getFaqs, getPackages } from '@/lib/queries';
import { path } from '@/lib/routes';
import { absoluteUrl, faqJsonLd, serviceJsonLd } from '@/lib/seo';
import { getSettings } from '@/lib/settings';
import { whatsappLink } from '@/lib/utils';

export async function PackagesPage({ locale }: { locale: Locale }) {
  const [settings, packages, addons, faqs] = await Promise.all([
    getSettings(),
    getPackages(),
    getAddons(),
    getFaqs('pricing'),
  ]);
  const copy = d(locale);
  const whatsappHref = whatsappLink(settings.contact.whatsapp, t(settings.contact.whatsappMessage, locale));

  return (
    <>
      <PageHero
        eyebrow={t(settings.brand.descriptor, locale)}
        title={t(settings.home.packagesTitle, locale)}
        intro={t(settings.home.packagesIntro, locale)}
      />

      <section className="section">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="reveal">
                <PackageCard pkg={pkg} locale={locale} copy={copy} headingLevel={2} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {addons.length > 0 && (
        <section className="section border-t border-[var(--hairline)] bg-ink-900">
          <div className="container-page">
            <SectionHeader title={copy.packages.addons} intro={copy.packages.addonsIntro} />
            <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
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

      {faqs.length > 0 && (
        <section className="section">
          <div className="container-page">
            <SectionHeader title={t(settings.home.faqTitle, locale)} />
            <div className="reveal mt-10">
              <FaqList faqs={faqs} locale={locale} />
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
          name: `${settings.brand.name} — ${t(settings.home.packagesTitle, locale)}`,
          description: t(settings.home.packagesIntro, locale),
          url: absoluteUrl(path('packages', locale)),
          settings,
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
