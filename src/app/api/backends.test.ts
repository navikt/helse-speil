import { backends, kjørerLokalt, parseLokaleBackends, skalStubbe, validerBackendConfig } from '@app/api/backends';
import { backendUrl } from '@app/api/videresender';

const env = vi.hoisted(() => ({ backend: 'lokal' as 'mock' | 'lokal' | 'deployed' }));
vi.mock('@/env', () => ({
    get backend() {
        return env.backend;
    },
}));

describe('backends', () => {
    afterEach(() => {
        env.backend = 'lokal';
        vi.unstubAllEnvs();
    });

    describe('parseLokaleBackends', () => {
        it('tåler mellomrom og tomme verdier', () => {
            expect(parseLokaleBackends(' spesialist, sporhund ,,')).toEqual(['spesialist', 'sporhund']);
            expect(parseLokaleBackends(undefined)).toEqual([]);
        });

        it('feiler på ukjente backender og backender uten lokal port', () => {
            expect(() => parseLokaleBackends('finnesikke')).toThrow(/LOKALE_BACKENDS/);
            expect(() => parseLokaleBackends('spout')).toThrow(/LOKALE_BACKENDS/);
        });
    });

    it('stubber backender som ikke kjører lokalt', () => {
        vi.stubEnv('LOKALE_BACKENDS', 'sporhund');

        expect(kjørerLokalt('sporhund')).toBe(true);
        expect(skalStubbe('sporhund')).toBe(false);
        expect(skalStubbe('spesialist')).toBe(true);
        expect(skalStubbe('spout')).toBe(true);
    });

    it('stubber alt i mock og ingenting i dev/prod', () => {
        vi.stubEnv('LOKALE_BACKENDS', 'sporhund');

        env.backend = 'mock';
        expect(skalStubbe('sporhund')).toBe(true);

        env.backend = 'deployed';
        expect(skalStubbe('sporhund')).toBe(false);
        expect(skalStubbe('spout')).toBe(false);
    });

    describe('backendUrl', () => {
        it('bruker lokal port når backenden kjører lokalt', () => {
            vi.stubEnv('LOKALE_BACKENDS', 'sporhund');

            expect(backendUrl('sporhund', 'http://localhost:1234/api/sporhund/personer/1?x=y')).toBe(
                'http://localhost:8282/api/personer/1?x=y',
            );
        });

        it('bruker base-URL fra miljøet og målprefiks i dev/prod', () => {
            env.backend = 'deployed';
            vi.stubEnv('SPOUT_BASE_URL', 'http://spout');
            vi.stubEnv('SPORHUND_BASE_URL', 'http://sporhund');

            expect(backendUrl('spout', 'https://speil/api/spout/melding')).toBe('http://spout/melding');
            expect(backendUrl('sporhund', 'https://speil/api/sporhund/oppgaver')).toBe('http://sporhund/api/oppgaver');
        });

        it('feiler tydelig når base-URL mangler', () => {
            env.backend = 'deployed';
            vi.stubEnv('SPLEIS_API_BASE_URL', '');

            expect(() => backendUrl('spleis', 'https://speil/api/spleis/x')).toThrow(/SPLEIS_API_BASE_URL/);
        });
    });

    describe('validerBackendConfig', () => {
        it('lister alle manglende miljøvariabler i dev/prod', () => {
            env.backend = 'deployed';
            alleBackendEnv().forEach((envNavn) => vi.stubEnv(envNavn, 'satt'));
            vi.stubEnv('SPORHUND_BASE_URL', '');
            vi.stubEnv('CLIENT_ID_SPOUT', '');

            expect(() => validerBackendConfig()).toThrow('SPORHUND_BASE_URL, CLIENT_ID_SPOUT');
        });

        it('godtar komplett konfig i dev/prod', () => {
            env.backend = 'deployed';
            alleBackendEnv().forEach((envNavn) => vi.stubEnv(envNavn, 'satt'));

            expect(() => validerBackendConfig()).not.toThrow();
        });

        it('validerer LOKALE_BACKENDS lokalt', () => {
            vi.stubEnv('LOKALE_BACKENDS', 'finnesikke');

            expect(() => validerBackendConfig()).toThrow(/LOKALE_BACKENDS/);
        });
    });
});

function alleBackendEnv(): string[] {
    return Object.values(backends).flatMap(({ scopeEnv, baseUrlEnv }) => [scopeEnv, baseUrlEnv]);
}
