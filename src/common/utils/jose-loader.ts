/**
 * Lazy-loader for the `jose` library.
 *
 * `jose` is an ESM-only package, but this NestJS project compiles to
 * CommonJS.  A top-level `import … from 'jose'` is transpiled to a
 * `require()` call which fails at runtime on environments like Vercel.
 *
 * The workaround:
 *   1. Call `await loadJose()` once during application bootstrap
 *      (before any route handler runs).
 *   2. After that, call `getJose()` synchronously anywhere you need
 *      the jose API – the module is already cached.
 */

let _jose: typeof import('jose') | null = null;

/**
 * Dynamically import jose and cache the module.
 * Must be called (and awaited) once before the first `getJose()` call.
 */
export async function loadJose(): Promise<typeof import('jose')> {
  if (!_jose) {
    _jose = await import('jose');
  }
  return _jose;
}

/**
 * Return the cached jose module **synchronously**.
 * Throws if `loadJose()` has not been awaited yet.
 */
export function getJose(): typeof import('jose') {
  if (!_jose) {
    throw new Error(
      'jose has not been loaded yet. Call `await loadJose()` during app bootstrap.',
    );
  }
  return _jose;
}
