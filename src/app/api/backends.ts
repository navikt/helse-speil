import { z } from 'zod/v4';

import { backend, erDev } from '@/env';

type BackendConfig = {
    /** Miljøvariabel med Azure-scope for OBO-veksling */
    scopeEnv: string;
    /** Miljøvariabel med base-URL i dev/prod */
    baseUrlEnv: string;
    /** Porten backenden kjører på lokalt. Uten port kan den ikke kjøres lokalt, og blir alltid stubbet utenfor dev/prod. */
    lokalPort?: number;
    /** Prefiks foran stien i backenden: /api/<navn>/x videresendes til <baseUrl><målprefiks>/x */
    målprefiks: '/api' | '';
    ekstraHeadere?: Record<string, string>;
    /** Backenden er bare konfigurert i dev. I prod mangler miljøvariablene, og kall svarer 404. */
    kunIDev?: boolean;
};

/**
 * Alle backender Speil videresender til via /api/<navn>/. Ny backend: legg til en oppføring her,
 * lag src/app/api/<navn>/common.ts og et lokal-<navn>-script i package.json.
 */
export const backends = {
    spesialist: {
        scopeEnv: 'CLIENT_ID_SPESIALIST',
        baseUrlEnv: 'SPESIALIST_BASE_URL',
        lokalPort: 8080,
        målprefiks: '/api',
    },
    sporhund: {
        scopeEnv: 'CLIENT_ID_SPORHUND',
        baseUrlEnv: 'SPORHUND_BASE_URL',
        lokalPort: 8282,
        målprefiks: '/api',
    },
    vilkarsproving: {
        scopeEnv: 'CLIENT_ID_VILKARSPROVING',
        baseUrlEnv: 'VILKARSPROVING_BASE_URL',
        lokalPort: 8181,
        målprefiks: '/api',
    },
    spleis: {
        scopeEnv: 'CLIENT_ID_SPLEIS_API',
        baseUrlEnv: 'SPLEIS_API_BASE_URL',
        målprefiks: '/api',
    },
    sparsom: {
        scopeEnv: 'CLIENT_ID_SPARSOM_API',
        baseUrlEnv: 'SPARSOM_API_BASE_URL',
        målprefiks: '/api',
    },
    spoogle: {
        scopeEnv: 'CLIENT_ID_SPOOGLE',
        baseUrlEnv: 'SPOOGLE_BASE_URL',
        målprefiks: '/api',
    },
    spout: {
        scopeEnv: 'CLIENT_ID_SPOUT',
        baseUrlEnv: 'SPOUT_BASE_URL',
        målprefiks: '',
        ekstraHeadere: { Accept: 'application/json' },
    },
    'sp-forsikring': {
        scopeEnv: 'CLIENT_ID_SP_FORSIKRING',
        baseUrlEnv: 'SP_FORSIKRING_BASE_URL',
        målprefiks: '',
    },
    rettighetskategori: {
        scopeEnv: 'CLIENT_ID_RETTIGHETSKATEGORI',
        baseUrlEnv: 'RETTIGHETSKATEGORI_BASE_URL',
        målprefiks: '/api',
    },
    medlemskap: {
        scopeEnv: 'CLIENT_ID_MEDLEMSKAP',
        baseUrlEnv: 'MEDLEMSKAP_BASE_URL',
        lokalPort: 8383,
        målprefiks: '/api',
        kunIDev: true,
    },
} satisfies Record<string, BackendConfig>;

export type BackendNavn = keyof typeof backends;

export function backendConfig(navn: BackendNavn): BackendConfig {
    return backends[navn];
}

/** Backendene som kjører lokalt, styrt av LOKALE_BACKENDS (kommaseparert). Kun relevant når backend er 'lokal'. */
export function lokaleBackends(): BackendNavn[] {
    if (backend !== 'lokal') return [];
    return parseLokaleBackends(process.env.LOKALE_BACKENDS);
}

export function kjørerLokalt(navn: BackendNavn): boolean {
    return lokaleBackends().includes(navn);
}

/** Lokalt og i mock svarer vi med stub for alle backender som ikke kjører lokalt. */
export function skalStubbe(navn: BackendNavn): boolean {
    return backend !== 'deployed' && !kjørerLokalt(navn);
}

/** Backender med kunIDev er ikke tilgjengelige i prod. */
export function erTilgjengelig(navn: BackendNavn): boolean {
    return backend !== 'deployed' || erDev || !(backendConfig(navn).kunIDev ?? false);
}

export function backendBaseUrl(navn: BackendNavn): string {
    const { lokalPort, baseUrlEnv } = backendConfig(navn);
    if (kjørerLokalt(navn)) return `http://localhost:${lokalPort}`;
    return påkrevdEnv(baseUrlEnv, navn);
}

export function backendScope(navn: BackendNavn): string {
    return påkrevdEnv(backendConfig(navn).scopeEnv, navn);
}

/** Kalles fra readiness-proben, så en deploy med manglende miljøvariabler aldri blir klar. */
export function validerBackendConfig(): void {
    if (backend === 'lokal') {
        lokaleBackends();
        return;
    }
    if (backend !== 'deployed') return;

    const mangler = (Object.keys(backends) as BackendNavn[])
        .filter(erTilgjengelig)
        .map(backendConfig)
        .flatMap(({ scopeEnv, baseUrlEnv }) => [scopeEnv, baseUrlEnv])
        .filter((envNavn) => !process.env[envNavn]);
    if (mangler.length > 0) {
        throw new Error(`Mangler miljøvariabler for backender: ${mangler.join(', ')}`);
    }
}

export function parseLokaleBackends(verdi: string | undefined): BackendNavn[] {
    const navn = (verdi ?? '')
        .split(',')
        .map((it) => it.trim())
        .filter((it) => it !== '');
    const kanKjøreLokalt = Object.entries(backends)
        .filter(([, konfig]) => (konfig as BackendConfig).lokalPort !== undefined)
        .map(([navn]) => navn);

    const resultat = z.array(z.enum(kanKjøreLokalt as [BackendNavn, ...BackendNavn[]])).safeParse(navn);
    if (!resultat.success) {
        throw new Error(
            `LOKALE_BACKENDS=${verdi} er ugyldig. Gyldige verdier (kommaseparert): ${kanKjøreLokalt.join(', ')}`,
        );
    }
    return resultat.data;
}

function påkrevdEnv(envNavn: string, backendNavn: BackendNavn): string {
    const verdi = process.env[envNavn];
    if (!verdi) throw new Error(`Mangler miljøvariabelen ${envNavn} for backenden ${backendNavn}`);
    return verdi;
}
