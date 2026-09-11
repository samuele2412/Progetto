import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { LoginForm } from '@/components/admin/LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (await getSession()) redirect('/admin');

  const query = await searchParams;
  const next = typeof query.next === 'string' ? query.next : '/admin';
  const changed = query.changed === '1';

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          {/* The brand is the page's only title, so it is the h1: the login
              screen had no heading and no landmark at all. */}
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-normal text-stone-900">Cordiale</h1>
          {/* stone-500 at this size is 4.4:1 on white — just under AA. */}
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-stone-600">Pannello</p>
        </div>
        {changed && (
          <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            Password aggiornata. Accedi con quella nuova.
          </p>
        )}
        <LoginForm next={next} />
      </div>
    </main>
  );
}
