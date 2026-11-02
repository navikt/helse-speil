// Next.js kan laste samme modul flere ganger (hot reload, ulike route-bundles). Ved å lagre instansen på
// globalThis får alle samme instans, f.eks. slik at prometheus-metrikker ikke registreres to ganger.
export function singleton<T>(key: string, create: () => T): T {
    const globals = globalThis as Record<string, unknown>;
    globals[key] ??= create();
    return globals[key] as T;
}
