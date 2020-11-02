import React from 'react';
import dayjs from 'dayjs';
import { Periodetype, Vedtaksperiode, Vilkår } from 'internal-types';
import { useKategoriserteVilkår } from './useKategoriserteVilkår';
import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';
import { Vilkårdata, Vilkårstype } from '../../../mapping/vilkår';
import { mapVedtaksperiode } from '../../../mapping/vedtaksperiode';
import { umappetVedtaksperiode } from '../../../../test/data/vedtaksperiode';

const alder = {
    alderSisteSykedag: 50,
    oppfylt: true,
};

const dagerIgjen = {
    dagerBrukt: 0,
    skjæringstidspunkt: dayjs('2020-01-01'),
    førsteSykepengedag: dayjs('2020-01-01'),
    maksdato: dayjs('2021-01-01'),
    gjenståendeDager: 345,
    tidligerePerioder: [],
    oppfylt: true,
};

const sykepengegrunnlag = {
    sykepengegrunnlag: 654321,
    grunnebeløp: 100000,
    oppfylt: true,
};

const opptjening = {
    antallOpptjeningsdagerErMinst: 300,
    opptjeningFra: dayjs('2019-01-01'),
    oppfylt: true,
};

const søknadsfrist = {
    søknadTom: dayjs('2020-01-31'),
    sendtNav: dayjs('2020-01-31'),
    oppfylt: true,
};

const vilkår: Vilkår = {
    alder,
    dagerIgjen,
    sykepengegrunnlag,
    opptjening,
    søknadsfrist,
};

const enSpeilVedtaksperiode = async (
    vilkår: Vilkår,
    behandlet: boolean = false,
    forlengelseFraInfotrygd: boolean = false,
    automatiskBehandlet: boolean = false,
    periodetype: Periodetype = Periodetype.Førstegangsbehandling
): Promise<Vedtaksperiode> => ({
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

describe('useKategoriserteVilkår', () => {
    test('mapper oppfylte vilkår', async () => {
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode(vilkår);
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));
        expect(result.current.oppfylteVilkår).toHaveLength(6);
        expect(result.current.oppfylteVilkår?.filter(harVilkårstype(Vilkårstype.Alder))).toHaveLength(1);
        expect(result.current.oppfylteVilkår?.filter(harVilkårstype(Vilkårstype.Sykepengegrunnlag))).toHaveLength(1);
        expect(result.current.oppfylteVilkår?.filter(harVilkårstype(Vilkårstype.DagerIgjen))).toHaveLength(1);
        expect(result.current.oppfylteVilkår?.filter(harVilkårstype(Vilkårstype.Søknadsfrist))).toHaveLength(1);
        expect(result.current.oppfylteVilkår?.filter(harVilkårstype(Vilkårstype.Opptjeningstid))).toHaveLength(1);
    });
    test('mapper delvis oppfylte vilkår', async () => {
        const ikkeOppfylteVilkår = { dagerIgjen: { ...vilkår.dagerIgjen, oppfylt: false } };
        const delvisOppfylteVilkår = { ...vilkår, ...ikkeOppfylteVilkår };
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode(delvisOppfylteVilkår);
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));

        expect(result.current.oppfylteVilkår).toHaveLength(5);
        expect(result.current.oppfylteVilkår?.filter(harVilkårstype(Vilkårstype.Alder))).toHaveLength(1);
        expect(result.current.oppfylteVilkår?.filter(harVilkårstype(Vilkårstype.Sykepengegrunnlag))).toHaveLength(1);
        expect(result.current.oppfylteVilkår?.filter(harVilkårstype(Vilkårstype.Søknadsfrist))).toHaveLength(1);
        expect(result.current.oppfylteVilkår?.filter(harVilkårstype(Vilkårstype.Opptjeningstid))).toHaveLength(1);
        expect(result.current.ikkeOppfylteVilkår).toHaveLength(1);
        expect(result.current.ikkeOppfylteVilkår?.[0].type).toBe(Vilkårstype.DagerIgjen);
    });
    test('mapper ikke vurderte vilkår', async () => {
        const ikkeOppfylteVilkår = { søknadsfrist: { ...vilkår.søknadsfrist, oppfylt: false } };
        const ikkeVurderteVilkår = {
            dagerIgjen: { ...vilkår.dagerIgjen, oppfylt: undefined },
            medlemskap: { oppfylt: undefined },
            institusjonsopphold: { oppfylt: undefined },
        };
        const delvisVurderteVilkår = { ...vilkår, ...ikkeOppfylteVilkår, ...ikkeVurderteVilkår };
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode(delvisVurderteVilkår);
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));

        expect(result.current.oppfylteVilkår).toHaveLength(4);
        expect(result.current.oppfylteVilkår?.filter(harVilkårstype(Vilkårstype.Alder))).toHaveLength(1);
        expect(result.current.oppfylteVilkår?.filter(harVilkårstype(Vilkårstype.Sykepengegrunnlag))).toHaveLength(1);
        expect(result.current.oppfylteVilkår?.filter(harVilkårstype(Vilkårstype.Opptjeningstid))).toHaveLength(1);
        expect(result.current.ikkeVurderteVilkår).toHaveLength(3);
        expect(result.current.ikkeVurderteVilkår?.filter(harVilkårstype(Vilkårstype.DagerIgjen))).toHaveLength(1);
        expect(result.current.ikkeVurderteVilkår?.filter(harVilkårstype(Vilkårstype.Medlemskap))).toHaveLength(1);
        expect(result.current.ikkeVurderteVilkår?.filter(harVilkårstype(Vilkårstype.Institusjonsopphold))).toHaveLength(
            1
        );
        expect(result.current.ikkeOppfylteVilkår).toHaveLength(1);
        expect(result.current.ikkeOppfylteVilkår?.[0].type).toBe(Vilkårstype.Søknadsfrist);
    });

    test('mapper riktig når det er en behandlet forlengelse fra Infotrygd', async () => {
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode(vilkår, true, true);
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));

        const {
            vilkårVurdertAvSaksbehandler,
            vilkårVurdertIInfotrygd,
            oppfylteVilkår,
            ikkeVurderteVilkår,
            ikkeOppfylteVilkår,
        } = result.current;

        expect(vilkårVurdertAvSaksbehandler).toHaveLength(5);
        expect(vilkårVurdertAvSaksbehandler?.filter(harVilkårstype(Vilkårstype.Medlemskap))).toHaveLength(1);
        expect(vilkårVurdertAvSaksbehandler?.filter(harVilkårstype(Vilkårstype.Alder))).toHaveLength(1);
        expect(vilkårVurdertAvSaksbehandler?.filter(harVilkårstype(Vilkårstype.Institusjonsopphold))).toHaveLength(1);
        expect(vilkårVurdertAvSaksbehandler?.filter(harVilkårstype(Vilkårstype.DagerIgjen))).toHaveLength(1);
        expect(vilkårVurdertAvSaksbehandler?.filter(harVilkårstype(Vilkårstype.Søknadsfrist))).toHaveLength(1);

        expect(vilkårVurdertIInfotrygd).toHaveLength(2);
        expect(vilkårVurdertIInfotrygd?.filter(harVilkårstype(Vilkårstype.Sykepengegrunnlag))).toHaveLength(1);
        expect(vilkårVurdertIInfotrygd?.filter(harVilkårstype(Vilkårstype.Opptjeningstid))).toHaveLength(1);

        expect(oppfylteVilkår).toHaveLength(1);
        expect(oppfylteVilkår?.filter(harVilkårstype(Vilkårstype.Risikovurdering))).toHaveLength(1);

        expect(ikkeVurderteVilkår).toHaveLength(0);
        expect(ikkeOppfylteVilkår).toHaveLength(0);
    });

    test('mapper riktig når det er en automatisk behandling', async () => {
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode(vilkår, true, false, true);
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));

        const {
            vilkårVurdertAvSaksbehandler,
            vilkårVurdertIInfotrygd,
            vilkårVurdertAutomatisk,
            oppfylteVilkår,
            ikkeVurderteVilkår,
            ikkeOppfylteVilkår,
        } = result.current;

        expect(vilkårVurdertAutomatisk).toHaveLength(4);
        expect(vilkårVurdertAutomatisk?.filter(harVilkårstype(Vilkårstype.Alder))).toHaveLength(1);
        expect(vilkårVurdertAutomatisk?.filter(harVilkårstype(Vilkårstype.Institusjonsopphold))).toHaveLength(1);
        expect(vilkårVurdertAutomatisk?.filter(harVilkårstype(Vilkårstype.Søknadsfrist))).toHaveLength(1);
        expect(vilkårVurdertAutomatisk?.filter(harVilkårstype(Vilkårstype.DagerIgjen))).toHaveLength(1);

        expect(vilkårVurdertAvSaksbehandler).toHaveLength(0);
        expect(vilkårVurdertIInfotrygd).toHaveLength(0);
        expect(ikkeOppfylteVilkår).toHaveLength(0);

        expect(oppfylteVilkår).toHaveLength(3);
        expect(oppfylteVilkår?.filter(harVilkårstype(Vilkårstype.Opptjeningstid))).toHaveLength(1);
        expect(oppfylteVilkår?.filter(harVilkårstype(Vilkårstype.Sykepengegrunnlag))).toHaveLength(1);
        expect(oppfylteVilkår?.filter(harVilkårstype(Vilkårstype.Risikovurdering))).toHaveLength(1);

        expect(ikkeVurderteVilkår).toHaveLength(1);
        expect(ikkeVurderteVilkår?.filter(harVilkårstype(Vilkårstype.Medlemskap))).toHaveLength(1);
    });
    test('mapper riktig når det ikke er en automatisk behandling', async () => {
        const vedtaksperiode: Vedtaksperiode = await enSpeilVedtaksperiode(vilkår, true);
        const { result } = renderHook(() => useKategoriserteVilkår(vedtaksperiode));

        const {
            vilkårVurdertAvSaksbehandler,
            vilkårVurdertIInfotrygd,
            vilkårVurdertAutomatisk,
            oppfylteVilkår,
            ikkeVurderteVilkår,
            ikkeOppfylteVilkår,
        } = result.current;

        expect(vilkårVurdertAvSaksbehandler).toHaveLength(7);
        expect(vilkårVurdertAvSaksbehandler?.filter(harVilkårstype(Vilkårstype.DagerIgjen))).toHaveLength(1);
        expect(vilkårVurdertAvSaksbehandler?.filter(harVilkårstype(Vilkårstype.Sykepengegrunnlag))).toHaveLength(1);
        expect(vilkårVurdertAvSaksbehandler?.filter(harVilkårstype(Vilkårstype.Opptjeningstid))).toHaveLength(1);
        expect(vilkårVurdertAvSaksbehandler?.filter(harVilkårstype(Vilkårstype.Institusjonsopphold))).toHaveLength(1);
        expect(vilkårVurdertAvSaksbehandler?.filter(harVilkårstype(Vilkårstype.Søknadsfrist))).toHaveLength(1);
        expect(vilkårVurdertAvSaksbehandler?.filter(harVilkårstype(Vilkårstype.Alder))).toHaveLength(1);
        expect(vilkårVurdertAvSaksbehandler?.filter(harVilkårstype(Vilkårstype.Medlemskap))).toHaveLength(1);

        expect(oppfylteVilkår).toHaveLength(1);
        expect(oppfylteVilkår?.filter(harVilkårstype(Vilkårstype.Risikovurdering))).toHaveLength(1);

        expect(vilkårVurdertIInfotrygd).toHaveLength(0);
        expect(vilkårVurdertAutomatisk).toHaveLength(0);
        expect(ikkeVurderteVilkår).toHaveLength(0);
        expect(ikkeOppfylteVilkår).toHaveLength(0);
    });
});
