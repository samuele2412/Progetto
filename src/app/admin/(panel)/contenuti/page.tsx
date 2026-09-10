import { SettingsGroupForm } from '@/components/admin/SettingsGroupForm';
import { settingsGroupMeta } from '@/lib/admin/settings-groups';
import { getSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function ContentSettingsPage() {
  const settings = await getSettings();
  const groups = Object.entries(settings as unknown as Record<string, Record<string, unknown>>);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl">Testi e contatti</h1>
        <p className="mt-1 max-w-2xl text-sm text-stone-600">
          Tutti i testi principali del sito. Le modifiche sono immediate: non serve un nuovo deploy. Lascia vuoto un
          campo inglese solo se vuoi che ricada sull’italiano.
        </p>
      </header>

      <div className="space-y-3">
        {groups.map(([key, values]) => (
          <SettingsGroupForm
            key={key}
            group={key}
            title={settingsGroupMeta[key]?.title ?? key}
            description={settingsGroupMeta[key]?.description ?? ''}
            values={values}
          />
        ))}
      </div>
    </div>
  );
}
