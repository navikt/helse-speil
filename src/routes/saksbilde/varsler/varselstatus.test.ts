import { ApiSaksbildeVarselstatus, ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';

import { VisSomFeilRegler, finnVarselstatus, oppsummerVarsler } from './varselstatus';

describe('oppsummerVarsler', () => {
    it('teller varslene som må løses, må vurderes og er vurdert', () => {
        expect(oppsummerVarsler(['feil', 'aktiv', 'aktiv', 'vurdert'])).toEqual({
            måLøses: 1,
            måVurderes: 2,
            vurdert: 1,
            farge: 'danger',
        });
    });

    it('teller godkjente varsler som vurdert', () => {
        expect(oppsummerVarsler(['ferdig-behandlet', 'vurdert'])).toEqual({
            måLøses: 0,
            måVurderes: 0,
            vurdert: 2,
            farge: 'success',
        });
    });

    it('er gul når ingen varsler må løses, men noen må vurderes', () => {
        expect(oppsummerVarsler(['aktiv', 'ferdig-behandlet']).farge).toBe('warning');
    });

    it('er rød når et varsel må løses, selv om andre er vurdert', () => {
        expect(oppsummerVarsler(['vurdert', 'feil']).farge).toBe('danger');
    });
});

describe('finnVarselstatus', () => {
    it('gir status etter vurderingen av varselet', () => {
        expect(finnVarselstatus(varsel, ingenFeilregler)).toBe('aktiv');
        expect(finnVarselstatus(medVurdering(ApiSaksbildeVarselstatus.AKTIV), ingenFeilregler)).toBe('aktiv');
        expect(finnVarselstatus(medVurdering(ApiSaksbildeVarselstatus.AVVIST), ingenFeilregler)).toBe('aktiv');
        expect(finnVarselstatus(medVurdering(ApiSaksbildeVarselstatus.VURDERT), ingenFeilregler)).toBe('vurdert');
        expect(finnVarselstatus(medVurdering(ApiSaksbildeVarselstatus.GODKJENT), ingenFeilregler)).toBe(
            'ferdig-behandlet',
        );
    });

    it('viser avviksvarselet som feil, også når det er vurdert', () => {
        const avviksvarsel = { ...medVurdering(ApiSaksbildeVarselstatus.GODKJENT), kode: 'RV_IV_2' };
        expect(finnVarselstatus(avviksvarsel, { ...ingenFeilregler, avviksvarsel: true })).toBe('feil');
    });

    it.each(['RV_VV_4', 'RV_MV_1'])('viser %s som feil til det er godkjent', (kode) => {
        const regler: VisSomFeilRegler = {
            avviksvarsel: false,
            under20Sykdomsgradsvarsel: true,
            medlemskapsvarsel: true,
        };
        expect(finnVarselstatus({ ...varsel, kode }, regler)).toBe('feil');
        expect(finnVarselstatus({ ...medVurdering(ApiSaksbildeVarselstatus.VURDERT), kode }, regler)).toBe('feil');
        expect(finnVarselstatus({ ...medVurdering(ApiSaksbildeVarselstatus.GODKJENT), kode }, regler)).toBe(
            'ferdig-behandlet',
        );
    });

    it('viser ikke varselet som feil når regelen ikke gjelder', () => {
        expect(finnVarselstatus({ ...varsel, kode: 'RV_MV_1' }, ingenFeilregler)).toBe('aktiv');
    });

    it('viser ikke varsler uten forklaring og handling som feil', () => {
        const regler: VisSomFeilRegler = {
            avviksvarsel: true,
            under20Sykdomsgradsvarsel: true,
            medlemskapsvarsel: true,
        };
        expect(finnVarselstatus({ ...varsel, kode: 'RV_IV_2', forklaring: null, handling: null }, regler)).toBe(
            'aktiv',
        );
    });
});

const ingenFeilregler: VisSomFeilRegler = {
    avviksvarsel: false,
    under20Sykdomsgradsvarsel: false,
    medlemskapsvarsel: false,
};

const varsel: ApiVarselDTO = {
    id: '61b4e00e-497b-4454-ba9b-c59cda9a462f',
    definisjonId: 'EN_ID',
    behandlingId: 'EN_ID',
    opprettet: '2020-01-01',
    kode: 'EN_KODE',
    tittel: 'Et varsel',
    forklaring: 'En forklaring',
    handling: 'En handling',
    vurdering: null,
};

function medVurdering(status: ApiSaksbildeVarselstatus): ApiVarselDTO {
    return { ...varsel, vurdering: { ident: 'A123456', status, tidsstempel: '2020-01-02' } };
}
