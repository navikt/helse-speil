import React from 'react';
import dayjs from 'dayjs';
import { mapVedtaksperiode } from '../../../mapping/vedtaksperiode';
import { umappetVedtaksperiode } from '../../../../test/data/vedtaksperiode';
import { HookResult, renderHook } from '@testing-library/react-hooks';
import { Vilkårdata, Vilkårstype } from '../../../mapping/vilkår';
import { Periodetype, Vedtaksperiode, Vilkår } from 'internal-types';
import { KategoriserteVilkår, useKategoriserteVilkår } from './useKategoriserteVilkår';
import '@testing-library/jest-dom/extend-expect';

const alder = {
    alderSisteSykedag: 19,
    oppfylt: true,
};

const dagerIgjen = {
    dagerBrukt: 50,
    skjæringstidspunkt: dayjs('2020-01-20'),
    førsteSykepengedag: dayjs('2020-03-02'),
    maksdato: dayjs('2020-12-30'),
    gjenståendeDager: 198,
    tidligerePerioder: [],
    oppfylt: true,
};

const sykepengegrunnlag = {
    sykepengegrunnlag: 300000,
    grunnebeløp: 99858,
    oppfylt: true,
};

const opptjening = {
    antallOpptjeningsdagerErMinst: 0,
    opptjeningFra: dayjs('2018-11-21'),
    oppfylt: false,
};

const søknadsfrist = {
    søknadTom: dayjs('2020-03-27'),
    sendtNav: dayjs('2020-04-16T00:00:00'),
    oppfylt: true,
};

const medlemskap = {
    oppfylt: true,
};

const vilkår: Vilkår = {
    alder,
    dagerIgjen,
    sykepengegrunnlag,
    opptjening,
    søknadsfrist,
    medlemskap,
};

interface EnSpeilVedtaksperiodeOptions {
    vilkår: Vilkår;
    behandlet?: boolean;
    forlengelseFraInfotrygd?: boolean;
    automatiskBehandlet?: boolean;
    periodetype?: Periodetype;
}

const enSpeilVedtaksperiode = async ({
    vilkår,
    behandlet = false,
    forlengelseFraInfotrygd = false,
    automatiskBehandlet = false,
    periodetype = Periodetype.Førstegangsbehandling,
}: EnSpeilVedtaksperiodeOptions): Promise<Vedtaksperiode> => ({
    ...(await mapVedtaksperiode({
        ...umappetVedtaksperiode(),
        organisasjonsnummer: '123456789',
        overstyringer: [],
    })),
    vilkår,
    behandlet,
    forlengelseFraInfotrygd,
    automatiskBehandlet,
    periodetype,
});

const harVilkårstype = (vilkårstype: Vilkårstype) => (vilkårdata: Vilkårdata) => vilkårdata.type === vilkårstype;

const assertHarOppfyltVilkår = (type: Vilkårstype, result: HookResult<KategoriserteVilkår>) =>
    expect(result.current.oppfylteVilkår?.filter(harVilkårstype(type))).toHaveLength(1);

const assertHarIkkeOppfyltVilkår = (type: Vilkårstype, result: HookResult<KategoriserteVilkår>) =>
    expect(result.current.ikkeOppfylteVilkår?.filter(harVilkårstype(type))).toHaveLength(1);

const assertHarIkkeVurdertVilkår = (type: Vilkårstype, result: HookResult<KategoriserteVilkår>) =>
    expect(result.current.ikkeVurderteVilkår?.filter(harVilkårstype(type))).toHaveLength(1);

const assertHarAutomatiskVurdertVilkår = (type: Vilkårstype, result: HookResult<KategoriserteVilkår>) =>
    expect(result.current.vilkårVurdertAutomatisk?.filter(harVilkårstype(type))).toHaveLength(1);

const assertHarVilkårVurdertAvSaksbehandler = (type: Vilkårstype, result: HookResult<KategoriserteVilkår>) =>
    expect(result.current.vilkårVurdertAvSaksbehandler?.filter(harVilkårstype(type))).toHaveLength(1);

const assertHarVilkårVurdertIInfotrygd = (type: Vilkårstype, result: HookResult<KategoriserteVilkår>) =>
    expect(result.current.vilkårVurdertIInfotrygd?.filter(harVilkårstype(type))).toHaveLength(1);

const assertHarVilkårVurdertFørstePeriode = (type: Vilkårstype, result: HookResult<KategoriserteVilkår>) =>
    expect(result.current.vilkårVurdertFørstePeriode?.filter(harVilkårstype(type))).toHaveLength(1);

describe('useKategoriserteVilkår', () => {
    test('førstegangsperiode, ikke behandlet', async () => {
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode({ vilkår: vilkår });
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));

        expect(result.current.ikkeVurderteVilkår).toHaveLength(1);
        assertHarIkkeVurdertVilkår(Vilkårstype.Institusjonsopphold, result);

        expect(result.current.ikkeOppfylteVilkår).toHaveLength(1);
        assertHarIkkeOppfyltVilkår(Vilkårstype.Opptjeningstid, result);

        expect(result.current.oppfylteVilkår).toHaveLength(6);
        assertHarOppfyltVilkår(Vilkårstype.Alder, result);
        assertHarOppfyltVilkår(Vilkårstype.DagerIgjen, result);
        assertHarOppfyltVilkår(Vilkårstype.Medlemskap, result);
        assertHarOppfyltVilkår(Vilkårstype.Søknadsfrist, result);
        assertHarOppfyltVilkår(Vilkårstype.Sykepengegrunnlag, result);

        expect(result.current.vilkårVurdertIInfotrygd).toHaveLength(0);
        expect(result.current.vilkårVurdertAutomatisk).toHaveLength(0);
        expect(result.current.vilkårVurdertAvSaksbehandler).toHaveLength(0);
    });
    test('førstegangsperiode, behandlet av saksbehandler', async () => {
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode({ vilkår: vilkår, behandlet: true });
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));

        expect(result.current.vilkårVurdertAvSaksbehandler).toHaveLength(8);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Arbeidsuførhet, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Medlemskap, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Alder, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Søknadsfrist, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Institusjonsopphold, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Opptjeningstid, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Sykepengegrunnlag, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.DagerIgjen, result);

        expect(result.current.oppfylteVilkår).toHaveLength(0);
        expect(result.current.ikkeOppfylteVilkår).toHaveLength(0);
        expect(result.current.ikkeVurderteVilkår).toHaveLength(0);
        expect(result.current.vilkårVurdertAutomatisk).toHaveLength(0);
        expect(result.current.vilkårVurdertIInfotrygd).toHaveLength(0);
    });
    test('førstegangsperiode, behandlet automatisk', async () => {
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode({
            vilkår: vilkår,
            behandlet: true,
            automatiskBehandlet: true,
        });
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));

        expect(result.current.vilkårVurdertAutomatisk).toHaveLength(8);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Arbeidsuførhet, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Medlemskap, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Alder, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Søknadsfrist, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Institusjonsopphold, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Opptjeningstid, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Sykepengegrunnlag, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.DagerIgjen, result);

        expect(result.current.oppfylteVilkår).toHaveLength(0);
        expect(result.current.ikkeOppfylteVilkår).toHaveLength(0);
        expect(result.current.ikkeVurderteVilkår).toHaveLength(0);
        expect(result.current.vilkårVurdertAvSaksbehandler).toHaveLength(0);
        expect(result.current.vilkårVurdertIInfotrygd).toHaveLength(0);
    });
    test('forlengelse fra Infotrygd, behandlet', async () => {
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode({
            vilkår: vilkår,
            behandlet: true,
            forlengelseFraInfotrygd: true,
        });
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));

        expect(result.current.vilkårVurdertAvSaksbehandler).toHaveLength(6);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Arbeidsuførhet, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Medlemskap, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Alder, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Søknadsfrist, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Institusjonsopphold, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.DagerIgjen, result);

        expect(result.current.vilkårVurdertIInfotrygd).toHaveLength(2);
        assertHarVilkårVurdertIInfotrygd(Vilkårstype.Opptjeningstid, result);
        assertHarVilkårVurdertIInfotrygd(Vilkårstype.Sykepengegrunnlag, result);

        expect(result.current.oppfylteVilkår).toHaveLength(0);
        expect(result.current.ikkeOppfylteVilkår).toHaveLength(0);
        expect(result.current.ikkeVurderteVilkår).toHaveLength(0);
        expect(result.current.vilkårVurdertAutomatisk).toHaveLength(0);
    });
    test('forlengelse fra Infotrygd, behandlet automatisk', async () => {
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode({
            vilkår: vilkår,
            behandlet: true,
            forlengelseFraInfotrygd: true,
            automatiskBehandlet: true,
        });
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));

        expect(result.current.vilkårVurdertAutomatisk).toHaveLength(6);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Arbeidsuførhet, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Medlemskap, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Alder, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Søknadsfrist, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Institusjonsopphold, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.DagerIgjen, result);

        expect(result.current.vilkårVurdertIInfotrygd).toHaveLength(2);
        assertHarVilkårVurdertIInfotrygd(Vilkårstype.Opptjeningstid, result);
        assertHarVilkårVurdertIInfotrygd(Vilkårstype.Sykepengegrunnlag, result);

        expect(result.current.oppfylteVilkår).toHaveLength(0);
        expect(result.current.ikkeOppfylteVilkår).toHaveLength(0);
        expect(result.current.ikkeVurderteVilkår).toHaveLength(0);
        expect(result.current.vilkårVurdertAvSaksbehandler).toHaveLength(0);
    });
    test('forlengelse fra Infotrygd, ikke behandlet', async () => {
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode({
            vilkår: vilkår,
            forlengelseFraInfotrygd: true,
            periodetype: Periodetype.Infotrygdforlengelse,
        });
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));

        expect(result.current.vilkårVurdertIInfotrygd).toHaveLength(2);
        assertHarVilkårVurdertIInfotrygd(Vilkårstype.Opptjeningstid, result);
        assertHarVilkårVurdertIInfotrygd(Vilkårstype.Sykepengegrunnlag, result);

        expect(result.current.vilkårVurdertAutomatisk).toHaveLength(0);
        expect(result.current.vilkårVurdertAvSaksbehandler).toHaveLength(0);
    });
    test('vanlig forlengelse, behandlet automatisk', async () => {
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode({
            vilkår: vilkår,
            behandlet: true,
            automatiskBehandlet: true,
            periodetype: Periodetype.Forlengelse,
        });
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));

        expect(result.current.vilkårVurdertAutomatisk).toHaveLength(5);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Arbeidsuførhet, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Alder, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Søknadsfrist, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.DagerIgjen, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Institusjonsopphold, result);

        expect(result.current.vilkårVurdertFørstePeriode).toHaveLength(3);
        assertHarVilkårVurdertFørstePeriode(Vilkårstype.Sykepengegrunnlag, result);
        assertHarVilkårVurdertFørstePeriode(Vilkårstype.Medlemskap, result);
        assertHarVilkårVurdertFørstePeriode(Vilkårstype.Opptjeningstid, result);

        expect(result.current.oppfylteVilkår).toHaveLength(0);
        expect(result.current.ikkeOppfylteVilkår).toHaveLength(0);
        expect(result.current.ikkeVurderteVilkår).toHaveLength(0);
        expect(result.current.vilkårVurdertIInfotrygd).toHaveLength(0);
        expect(result.current.vilkårVurdertAvSaksbehandler).toHaveLength(0);
    });
    test('vanlig forlengelse, behandlet', async () => {
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode({
            vilkår: vilkår,
            behandlet: true,
            periodetype: Periodetype.Forlengelse,
        });
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));

        expect(result.current.vilkårVurdertAvSaksbehandler).toHaveLength(5);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Arbeidsuførhet, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Alder, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Søknadsfrist, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.DagerIgjen, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Institusjonsopphold, result);

        expect(result.current.vilkårVurdertFørstePeriode).toHaveLength(3);
        assertHarVilkårVurdertFørstePeriode(Vilkårstype.Sykepengegrunnlag, result);
        assertHarVilkårVurdertFørstePeriode(Vilkårstype.Medlemskap, result);
        assertHarVilkårVurdertFørstePeriode(Vilkårstype.Opptjeningstid, result);

        expect(result.current.oppfylteVilkår).toHaveLength(0);
        expect(result.current.ikkeOppfylteVilkår).toHaveLength(0);
        expect(result.current.ikkeVurderteVilkår).toHaveLength(0);
        expect(result.current.vilkårVurdertAutomatisk).toHaveLength(0);
        expect(result.current.vilkårVurdertIInfotrygd).toHaveLength(0);
    });
    test('vanlig forlengelse, ikke behandlet', async () => {
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode({
            vilkår: vilkår,
            periodetype: Periodetype.Forlengelse,
        });
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));

        expect(result.current.vilkårVurdertFørstePeriode).toHaveLength(3);
        assertHarVilkårVurdertFørstePeriode(Vilkårstype.Sykepengegrunnlag, result);
        assertHarVilkårVurdertFørstePeriode(Vilkårstype.Medlemskap, result);
        assertHarVilkårVurdertFørstePeriode(Vilkårstype.Opptjeningstid, result);

        expect(result.current.vilkårVurdertAutomatisk).toHaveLength(0);
        expect(result.current.vilkårVurdertIInfotrygd).toHaveLength(0);
        expect(result.current.vilkårVurdertAvSaksbehandler).toHaveLength(0);
    });
});
