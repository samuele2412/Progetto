import { PasswordForm } from '@/components/admin/PasswordForm';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await getSession();

  return (
    <div className="max-w-lg space-y-6">
      <header>
        <h1 className="text-2xl">Account</h1>
        <p className="mt-1 text-sm text-stone-600">Sei connesso come {session?.email}.</p>
      </header>

      <PasswordForm />

      <section className="admin-card p-5 text-sm text-stone-600">
        <h2 className="mb-2 text-base text-stone-900">Nota sulla sicurezza</h2>
        <p>
          Cambiare la password disconnette tutte le sessioni aperte, comprese quelle su altri dispositivi. Se sospetti
          un accesso non autorizzato, cambiala: è il modo più rapido per chiudere tutto.
        </p>
      </section>
    </div>
  );
}
