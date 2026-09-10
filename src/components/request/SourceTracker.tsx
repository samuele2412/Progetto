'use client';

import { useEffect } from 'react';
import { captureSource } from './source';

/**
 * Records the entry point of the session as early as possible, so a visitor who
 * lands on an ad page and only fills the form later is still attributed to that
 * campaign. Renders nothing.
 */
export function SourceTracker() {
  useEffect(() => {
    captureSource();
  }, []);
  return null;
}
