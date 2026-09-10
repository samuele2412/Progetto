import { FinalCta } from '@/components/blocks/FinalCta';
import { PageHero } from '@/components/blocks/PageHero';
import { Media } from '@/components/Media';
import { d } from '@/lib/dictionary';
import { t, type Locale } from '@/lib/i18n';
import { getGalleryItems } from '@/lib/queries';
import { getSettings } from '@/lib/settings';
import { whatsappLink } from '@/lib/utils';

export async function GalleryPage({ locale }: { locale: Locale }) {
  const [settings, items] = await Promise.all([getSettings(), getGalleryItems()]);
  const copy = d(locale);
  const whatsappHref = whatsappLink(settings.contact.whatsapp, t(settings.contact.whatsappMessage, locale));

  return (
    <>
      <PageHero
        eyebrow={t(settings.brand.descriptor, locale)}
        title={t(settings.home.galleryTitle, locale)}
        intro={t(settings.home.galleryIntro, locale)}
        compact
      />

      <section className="section">
        <div className="container-page">
          {items.length === 0 ? (
            <p className="text-sm text-bone-500">
              {locale === 'en'
                ? 'Photographs from the first events will appear here.'
                : 'Qui arriveranno le foto delle prime serate.'}
            </p>
          ) : (
            <div className="columns-2 gap-3 md:columns-3 lg:columns-4 [&>figure]:mb-3">
              {items.map((item, index) => (
                <figure
                  key={item.id}
                  className={`reveal reveal-delay-${Math.min(index % 4 + 1, 4)} break-inside-avoid overflow-hidden rounded-xl`}
                >
                  <div className={`relative ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
                    <Media
                      src={item.imagePath}
                      alt={t(item.alt, locale)}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      placeholderLabel={t(item.caption, locale) || undefined}
                    />
                  </div>
                  {t(item.caption, locale) && (
                    <figcaption className="px-1 pt-2 text-xs text-bone-500">{t(item.caption, locale)}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
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
