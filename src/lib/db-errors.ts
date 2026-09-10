/**
 * Helpers for reading Postgres errors without leaking what caused them.
 *
 * Drizzle wraps driver errors as "Failed query: <sql> params: <values>", so
 * matching on the message both fails to spot a duplicate key *and*, if logged,
 * writes the bound parameters — a client's name, email and phone — into the
 * container logs. The driver error is still reachable through `cause`, and its
 * SQLSTATE is the thing worth branching on.
 */
const UNIQUE_VIOLATION = '23505';

function sqlState(error: unknown): string | undefined {
  const seen = new Set<unknown>();
  let current: unknown = error;
  while (current && typeof current === 'object' && !seen.has(current)) {
    seen.add(current);
    const code = (current as { code?: unknown }).code;
    if (typeof code === 'string') return code;
    current = (current as { cause?: unknown }).cause;
  }
  return undefined;
}

export function isUniqueViolation(error: unknown): boolean {
  return sqlState(error) === UNIQUE_VIOLATION;
}

/** A log line that identifies the failure without quoting any row data. */
export function describeDbError(error: unknown): string {
  const code = sqlState(error);
  if (code) return `postgres ${code}`;
  return error instanceof Error ? error.name : 'unknown error';
}
