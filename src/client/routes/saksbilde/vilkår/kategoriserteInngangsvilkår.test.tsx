import '@testing-library/jest-dom/extend-expect';
import dayjs from 'dayjs';
import React from 'react';

import { VedtaksperiodeBuilder } from '../../../mapping/vedtaksperiode';
import { Vilkårdata, Vilkårstype } from '../../../mapping/vilkår';

import { umappetVedtaksperiode } from '../../../../test/data/vedtaksperiode';
import { kategoriserteInngangsvilkår } from './kategoriserteInngangsvilkår';

interface EnSpeilVedtaksperiodeOptions {
    vilkår: Vilkår;
    behandlet?: boolean;
    forlengelseFraInfotrygd?: boolean;
    automatiskBehandlet?: boolean;
    periodetype?: Periodetype;
}

const enSpeilVedtaksperiode = ({
    vilkår,
    behandlet = false,
    forlengelseFraInfotrygd = false,
    automatiskBehandlet = false,
    periodetype = 'førstegangsbehandling',
}: EnSpeilVedtaksperiodeOptions): Vedtaksperiode => {
    const { vedtaksperiode } = new VedtaksperiodeBuilder()
        .setVedtaksperiode(umappetVedtaksperiode())
        .setArbeidsgiver({ organisasjonsnummer: '123456789' } as ExternalArbeidsgiver)
        .setAnnullertUtbetalingshistorikk([])
        .setOverstyringer([])
        .build();
    return {
        ...vedtaksperiode,
        vilkår,
        behandlet,
        forlengelseFraInfotrygd,
        automatiskBehandlet,
        periodetype,
    } as Vedtaksperiode;
};

const defaultVilkår: Vilkår = {
    alder: {
        alderSisteSykedag: 19,
        oppfylt: true,
    },
    dagerIgjen: {
        dagerBrukt: 50,
        skjæringstidspunkt: dayjs('2020-01-20'),
        førsteSykepengedag: dayjs('2020-03-02'),
        maksdato: dayjs('2020-12-30'),
        gjenståendeDager: 198,
        tidligerePerioder: [],
        oppfylt: true,
    },
    sykepengegrunnlag: {
        sykepengegrunnlag: 300000,
        grunnebeløp: 99858,
        oppfylt: true,
    },
    opptjening: {
        antallOpptjeningsdagerErMinst: 0,
        opptjeningFra: dayjs('2018-11-21'),
        oppfylt: false,
    },
    søknadsfrist: {
        søknadFom: dayjs('2020-03-27'),
        sendtNav: dayjs('2020-04-16T00:00:00'),
        oppfylt: true,
    },
    medlemskap: {
        oppfylt: true,
    },
};

const vilkårOfType = (type: Vilkårstype) => (vilkår: Vilkårdata) => vilkår.type === type;

describe('useKategoriserteVilkår', () => {
    test('førstegangsperiode, ikke behandlet', () => {
        const vedtaksperiode: Vedtaksperiode = enSpeilVedtaksperiode({ vilkår: defaultVilkår });
        const { ikkeOppfylteVilkår, oppfylteVilkår, ...rest } = kategoriserteInngangsvilkår(vedtaksperiode);

        expect(ikkeOppfylteVilkår).toHaveLength(1);
        expect(ikkeOppfylteVilkår!.find(vilkårOfType(Vilkårstype.Opptjeningstid))).toBeTruthy();

        expect(oppfylteVilkår).toHaveLength(2);
        expect(oppfylteVilkår!.find(vilkårOfType(Vilkårstype.Medlemskap))).toBeTruthy();
        expect(oppfylteVilkår!.find(vilkårOfType(Vilkårstype.Sykepengegrunnlag))).toBeTruthy();

        expect(Object.values(rest).flat()).toHaveLength(0);
    });

    test('førstegangsperiode, behandlet av saksbehandler', () => {
        const vedtaksperiode: Vedtaksperiode = enSpeilVedtaksperiode({ vilkår: defaultVilkår, behandlet: true });
        const { vilkårVurdertAvSaksbehandler, ...rest } = kategoriserteInngangsvilkår(vedtaksperiode);

        expect(vilkårVurdertAvSaksbehandler).toHaveLength(3);
        expect(vilkårVurdertAvSaksbehandler!.find(vilkårOfType(Vilkårstype.Medlemskap))).toBeTruthy();
        expect(vilkårVurdertAvSaksbehandler!.find(vilkårOfType(Vilkårstype.Opptjeningstid))).toBeTruthy();
        expect(vilkårVurdertAvSaksbehandler!.find(vilkårOfType(Vilkårstype.Sykepengegrunnlag))).toBeTruthy();

        expect(Object.values(rest).flat()).toHaveLength(0);
    });

    test('førstegangsperiode, behandlet automatisk', () => {
        const vedtaksperiode: Vedtaksperiode = enSpeilVedtaksperiode({
            vilkår: defaultVilkår,
            behandlet: true,
            automatiskBehandlet: true,
        });
        const { vilkårVurdertAutomatisk, ...rest } = kategoriserteInngangsvilkår(vedtaksperiode);

        expect(vilkårVurdertAutomatisk).toHaveLength(3);
        expect(vilkårVurdertAutomatisk!.find(vilkårOfType(Vilkårstype.Medlemskap))).toBeTruthy();
        expect(vilkårVurdertAutomatisk!.find(vilkårOfType(Vilkårstype.Opptjeningstid))).toBeTruthy();
        expect(vilkårVurdertAutomatisk!.find(vilkårOfType(Vilkårstype.Sykepengegrunnlag))).toBeTruthy();

        expect(Object.values(rest).flat()).toHaveLength(0);
    });

    test('forlengelse fra Infotrygd', () => {
        const vedtaksperiode: Vedtaksperiode = enSpeilVedtaksperiode({
            vilkår: defaultVilkår,
            behandlet: true,
            forlengelseFraInfotrygd: true,
        });
        const { vilkårVurdertIInfotrygd, ...rest } = kategoriserteInngangsvilkår(vedtaksperiode);

        expect(vilkårVurdertIInfotrygd).toHaveLength(3);
        expect(vilkårVurdertIInfotrygd!.find(vilkårOfType(Vilkårstype.Medlemskap))).toBeTruthy();
        expect(vilkårVurdertIInfotrygd!.find(vilkårOfType(Vilkårstype.Opptjeningstid))).toBeTruthy();
        expect(vilkårVurdertIInfotrygd!.find(vilkårOfType(Vilkårstype.Sykepengegrunnlag))).toBeTruthy();

        expect(Object.values(rest).flat()).toHaveLength(0);
    });

    test('vanlig forlengelse', () => {
        const vedtaksperiode: Vedtaksperiode = enSpeilVedtaksperiode({
            vilkår: defaultVilkår,
            behandlet: false,
            automatiskBehandlet: false,
            periodetype: 'forlengelse',
        });
        const { vilkårVurdertFørstePeriode, ...rest } = kategoriserteInngangsvilkår(vedtaksperiode);

        expect(vilkårVurdertFørstePeriode).toHaveLength(3);
        expect(vilkårVurdertFørstePeriode!.find(vilkårOfType(Vilkårstype.Medlemskap))).toBeTruthy();
        expect(vilkårVurdertFørstePeriode!.find(vilkårOfType(Vilkårstype.Opptjeningstid))).toBeTruthy();
        expect(vilkårVurdertFørstePeriode!.find(vilkårOfType(Vilkårstype.Sykepengegrunnlag))).toBeTruthy();

        expect(Object.values(rest).flat()).toHaveLength(0);
    });
});
