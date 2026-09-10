import { FinalCta } from '@/components/blocks/FinalCta';
import { PageHero } from '@/components/blocks/PageHero';
import { StepList } from '@/components/blocks/StepList';
import { Media } from '@/components/Media';
import { d } from '@/lib/dictionary';
import { t, tList, type Locale } from '@/lib/i18n';
import { getSettings } from '@/lib/settings';
import { isPlaceholder, whatsappLink } from '@/lib/utils';

export async function AboutPage({ locale }: { locale: Locale }) {
  const settings = await getSettings();
  const copy = d(locale);
  const whatsappHref = whatsappLink(settings.contact.whatsapp, t(settings.contact.whatsappMessage, locale));
  const steps = settings.home.steps[locale]?.length ? settings.home.steps[locale] : settings.home.steps.it;

  return (
    <>
      <PageHero eyebrow={t(settings.about.eyebrow, locale)} title={t(settings.about.title, locale)} />

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="reveal relative aspect-[4/5] overflow-hidden rounded-[var(--radius-panel)]">
            <Media
              src={settings.about.imagePath}
              alt={t(settings.about.title, locale)}
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
              placeholderLabel={locale === 'en' ? 'Portrait of the bartender' : 'Ritratto del bartender'}
            />
          </div>
          <div className="reveal reveal-delay-1">
            <div className="space-y-5 text-[1.02rem] leading-relaxed text-bone-300">
              {t(settings.about.body, locale)
                .split('\n\n')
                .map((paragraph, index) => (
                  <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                ))}
            </div>
            <ul className="mt-9 space-y-3 border-t border-[var(--hairline)] pt-8 text-sm text-bone-200">
              {tList(settings.about.facts, locale).map((fact) => (
                <li key={fact} className="flex gap-3">
                  <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0 text-brass-500" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
            {!isPlaceholder(settings.about.signature) && (
              <p className="mt-8 font-[family-name:var(--font-display)] text-xl text-brass-400">
                {settings.about.signature}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="section border-t border-[var(--hairline)] bg-ink-900">
        <div className="container-page">
          <h2 className="display-2 reveal max-w-xl text-bone-50">{t(settings.home.howTitle, locale)}</h2>
          <div className="mt-10">
            <StepList steps={steps} />
          </div>
        </div>
      </section>

      <FinalCta
        locale={locale}
        copy={copy}
        title={t(settings.home.finalCtaTitle, locale)}
        body={t(settings.home.finalCtaBody, locale)}
        whatsappHref={whatsappHref}
      />
    </>
  );
}
