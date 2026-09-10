import { FaqList } from '@/components/blocks/FaqList';
import { FinalCta } from '@/components/blocks/FinalCta';
import { PageHero } from '@/components/blocks/PageHero';
import { JsonLd } from '@/components/JsonLd';
import { d } from '@/lib/dictionary';
import { t, type Locale } from '@/lib/i18n';
import { getFaqs } from '@/lib/queries';
import { faqJsonLd } from '@/lib/seo';
import { getSettings } from '@/lib/settings';
import { whatsappLink } from '@/lib/utils';

export async function FaqPage({ locale }: { locale: Locale }) {
  const [settings, general, pricing, wedding, corporate] = await Promise.all([
    getSettings(),
    getFaqs('general'),
    getFaqs('pricing'),
    getFaqs('wedding'),
    getFaqs('corporate'),
  ]);
  const copy = d(locale);
  const whatsappHref = whatsappLink(settings.contact.whatsapp, t(settings.contact.whatsappMessage, locale));

  const groups = [
    { title: locale === 'en' ? 'The service' : 'Il servizio', faqs: general },
    { title: locale === 'en' ? 'Prices' : 'Prezzi', faqs: pricing },
    { title: locale === 'en' ? 'Weddings' : 'Matrimoni', faqs: wedding },
    { title: locale === 'en' ? 'Corporate' : 'Eventi aziendali', faqs: corporate },
  ].filter((group) => group.faqs.length > 0);

  const all = groups.flatMap((group) => group.faqs);

  return (
    <>
      <PageHero
        eyebrow={t(settings.brand.descriptor, locale)}
        title={t(settings.home.faqTitle, locale)}
        intro={t(settings.home.faqIntro, locale)}
        compact
      />

      <section className="section">
        <div className="container-page max-w-4xl">
          {groups.map((group) => (
            <div key={group.title} className="mb-14 last:mb-0">
              <h2 className="display-3 reveal mb-6 text-bone-50">{group.title}</h2>
              <div className="reveal">
                <FaqList faqs={group.faqs} locale={locale} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <FinalCta
        locale={locale}
        copy={copy}
        title={t(settings.home.finalCtaTitle, locale)}
        body={t(settings.home.finalCtaBody, locale)}
        whatsappHref={whatsappHref}
      />

      <JsonLd
        data={faqJsonLd(all.map((faq) => ({ question: t(faq.question, locale), answer: t(faq.answer, locale) })))}
      />
    </>
  );
}
