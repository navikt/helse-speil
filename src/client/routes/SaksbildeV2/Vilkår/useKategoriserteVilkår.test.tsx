import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Vilkårstype } from '../../../mapping/vilkår';
import { Periodetype, Vedtaksperiode, Vilkår } from 'internal-types';
import { useKategoriserteVilkår } from './useKategoriserteVilkår';
import '@testing-library/jest-dom/extend-expect';
import {
    assertHarAutomatiskVurdertVilkår,
    assertHarIkkeOppfyltVilkår,
    assertHarIkkeVurdertVilkår,
    assertHarOppfyltVilkår,
    assertHarVilkårVurdertAvSaksbehandler,
    assertHarVilkårVurdertFørstePeriode,
    assertHarVilkårVurdertIInfotrygd,
    enSpeilVedtaksperiode,
    ikkeOppfyltOpptjening,
    oppfyltAlder,
    oppfyltDagerIgjen,
    oppfyltMedlemskap,
    oppfyltSykepengegrunnlag,
    oppfyltSøknadsfrist,
} from './testutils';

const defaultVilkår: Vilkår = {
    alder: oppfyltAlder(),
    dagerIgjen: oppfyltDagerIgjen(),
    sykepengegrunnlag: oppfyltSykepengegrunnlag(),
    opptjening: ikkeOppfyltOpptjening(),
    søknadsfrist: oppfyltSøknadsfrist(),
    medlemskap: oppfyltMedlemskap(),
};

describe('useKategoriserteVilkår', () => {
    test('førstegangsperiode, ikke behandlet', async () => {
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode({ vilkår: defaultVilkår });
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
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode({ vilkår: defaultVilkår, behandlet: true });
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
            vilkår: defaultVilkår,
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
            vilkår: defaultVilkår,
            behandlet: true,
            forlengelseFraInfotrygd: true,
        });
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));

        expect(result.current.vilkårVurdertAvSaksbehandler).toHaveLength(5);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Arbeidsuførhet, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Alder, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Søknadsfrist, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.Institusjonsopphold, result);
        assertHarVilkårVurdertAvSaksbehandler(Vilkårstype.DagerIgjen, result);

        expect(result.current.vilkårVurdertIInfotrygd).toHaveLength(3);
        assertHarVilkårVurdertIInfotrygd(Vilkårstype.Opptjeningstid, result);
        assertHarVilkårVurdertIInfotrygd(Vilkårstype.Sykepengegrunnlag, result);
        assertHarVilkårVurdertIInfotrygd(Vilkårstype.Medlemskap, result);

        expect(result.current.oppfylteVilkår).toHaveLength(0);
        expect(result.current.ikkeOppfylteVilkår).toHaveLength(0);
        expect(result.current.ikkeVurderteVilkår).toHaveLength(0);
        expect(result.current.vilkårVurdertAutomatisk).toHaveLength(0);
    });
    test('forlengelse fra Infotrygd, behandlet automatisk', async () => {
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode({
            vilkår: defaultVilkår,
            behandlet: true,
            forlengelseFraInfotrygd: true,
            automatiskBehandlet: true,
        });
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));

        expect(result.current.vilkårVurdertAutomatisk).toHaveLength(5);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Arbeidsuførhet, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Alder, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Søknadsfrist, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.Institusjonsopphold, result);
        assertHarAutomatiskVurdertVilkår(Vilkårstype.DagerIgjen, result);

        expect(result.current.vilkårVurdertIInfotrygd).toHaveLength(3);
        assertHarVilkårVurdertIInfotrygd(Vilkårstype.Medlemskap, result);
        assertHarVilkårVurdertIInfotrygd(Vilkårstype.Opptjeningstid, result);
        assertHarVilkårVurdertIInfotrygd(Vilkårstype.Sykepengegrunnlag, result);

        expect(result.current.oppfylteVilkår).toHaveLength(0);
        expect(result.current.ikkeOppfylteVilkår).toHaveLength(0);
        expect(result.current.ikkeVurderteVilkår).toHaveLength(0);
        expect(result.current.vilkårVurdertAvSaksbehandler).toHaveLength(0);
    });
    test('forlengelse fra Infotrygd, ikke behandlet', async () => {
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode({
            vilkår: defaultVilkår,
            forlengelseFraInfotrygd: true,
            periodetype: Periodetype.Infotrygdforlengelse,
        });
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));

        expect(result.current.vilkårVurdertIInfotrygd).toHaveLength(3);
        assertHarVilkårVurdertIInfotrygd(Vilkårstype.Medlemskap, result);
        assertHarVilkårVurdertIInfotrygd(Vilkårstype.Opptjeningstid, result);
        assertHarVilkårVurdertIInfotrygd(Vilkårstype.Sykepengegrunnlag, result);

        expect(result.current.vilkårVurdertAutomatisk).toHaveLength(0);
        expect(result.current.vilkårVurdertAvSaksbehandler).toHaveLength(0);
    });
    test('vanlig forlengelse, behandlet automatisk', async () => {
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode({
            vilkår: defaultVilkår,
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
            vilkår: defaultVilkår,
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
            vilkår: defaultVilkår,
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
