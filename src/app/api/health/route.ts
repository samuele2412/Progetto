import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Container healthcheck. Reports the database as well as the process, because
 * a web server that answers while Postgres is unreachable is not healthy in any
 * way that matters here.
 */
export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return NextResponse.json({ status: 'ok', database: 'up', time: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: 'degraded', database: 'down' }, { status: 503 });
  }
}
