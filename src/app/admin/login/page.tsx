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
    <div className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-[family-name:var(--font-display)] text-2xl text-stone-900">Cordiale</p>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-stone-500">Pannello</p>
        </div>
        {changed && (
          <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            Password aggiornata. Accedi con quella nuova.
          </p>
        )}
        <LoginForm next={next} />
      </div>
    </div>
  );
}
