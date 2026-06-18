import { describe, expect, it } from 'vitest';

import { nyDialogmeldingSchema } from '@/form-schemas/nyDialogmeldingSkjema';
import { ApiBehandlerKategori, ApiFagomrade, type ApiNyDialogmelding } from '@io/rest/generated/sporhund.schemas';

const gyldigSkjema: ApiNyDialogmelding = {
    behandler: {
        id: 'behandler-id',
        hprNummer: 1234567,
        kategori: ApiBehandlerKategori.LEGE,
        navn: {
            fornavn: 'Ola',
            etternavn: 'Nordmann',
            mellomnavn: null,
        },
        legekontor: {
            kontor: 'Legesenteret',
            orgnummer: '123456789',
            adresse: 'Gate 1',
            postnummer: '0101',
            poststed: 'Oslo',
        },
        telefonnummer: null,
        type: null,
    },
    fagomrade: ApiFagomrade.TILBAKEDATERING,
    melding: 'Hei',
    soker: {
        fodselsdato: '1990-01-01',
        navn: {
            fornavn: 'Kari',
            etternavn: 'Hansen',
            mellomnavn: null,
        },
    },
};

describe('nyDialogmeldingSchema', () => {
    it('validerer gyldig skjema', () => {
        const result = nyDialogmeldingSchema.safeParse(gyldigSkjema);
        expect(result.success).toBe(true);
    });

    it('feiler uten fagomrade', () => {
        const result = nyDialogmeldingSchema.safeParse({ ...gyldigSkjema, fagomrade: undefined });
        expect(result.success).toBe(false);
    });
});
