import { NORSK_DATOFORMAT } from '../utils/date';

import { umappetVedtaksperiode } from '../test/data/vedtaksperiode';
import { mapVilkår } from './vilkår';

const { vilkår } = mapVilkår(umappetVedtaksperiode()) as { vilkår: Vilkår };

describe('mapVilkår', () => {
    test('mapper alder', () => {
        const { alder } = vilkår;
        expect(alder.alderSisteSykedag).toEqual(28);
        expect(alder.oppfylt).toBeTruthy();
    });
    test('mapper sykepengegrunnlag', () => {
        const { sykepengegrunnlag } = vilkår;
        expect(sykepengegrunnlag.grunnebeløp).toEqual(99858);
        expect(sykepengegrunnlag.sykepengegrunnlag).toEqual(372000);
        expect(sykepengegrunnlag.oppfylt).toBeTruthy();
    });
    test('mapper dager igjen', () => {
        const { dagerIgjen } = vilkår;
        expect(dagerIgjen.dagerBrukt).toEqual(3);
        expect(dagerIgjen.førsteSykepengedag?.format(NORSK_DATOFORMAT)).toEqual('01.01.2018');
        expect(dagerIgjen.gjenståendeDager).toBeUndefined();
        expect(dagerIgjen.maksdato?.format(NORSK_DATOFORMAT)).toEqual('08.10.2018');
        expect(dagerIgjen.skjæringstidspunkt.format(NORSK_DATOFORMAT)).toEqual('01.01.2018');
        expect(dagerIgjen.tidligerePerioder).toHaveLength(0);
        expect(dagerIgjen.oppfylt).toBeTruthy();
    });
    test('mapper søknadsfrist', () => {
        const { søknadsfrist } = vilkår;
        expect(søknadsfrist?.sendtNav?.format(NORSK_DATOFORMAT)).toEqual('01.02.2018');
        expect(søknadsfrist?.søknadFom?.format(NORSK_DATOFORMAT)).toEqual('01.01.2018');
        expect(søknadsfrist?.oppfylt).toBeTruthy();
    });
    test('mapper opptjening', () => {
        const { opptjening } = vilkår;
        expect((opptjening as Opptjening).antallOpptjeningsdagerErMinst).toEqual(3539);
        expect((opptjening as Opptjening).opptjeningFra.format(NORSK_DATOFORMAT)).toEqual('24.04.2008');
        expect(opptjening?.oppfylt).toBeTruthy();
    });
    test('mapper medlemskap', () => {
        const { medlemskap } = vilkår;
        expect(medlemskap?.oppfylt).toBeTruthy();
    });
    test('fanger feil og legger til i problems', () => {
        const vedtaksperiode = umappetVedtaksperiode();
        const korruptVedtaksperiode = {
            ...vedtaksperiode,
            // @ts-ignore
            vilkår: {
                ...vedtaksperiode.vilkår,
                sykepengedager: undefined,
            } as ExternalVedtaksperiode['vilkår'],
        };
        const { problems, vilkår } = mapVilkår(korruptVedtaksperiode);
        expect(problems).toHaveLength(1);
        expect(problems.pop()?.message).toContain('forbrukteSykedager');
        expect(vilkår?.dagerIgjen).toBeUndefined();
        expect(vilkår?.alder).toBeTruthy();
        expect(vilkår?.sykepengegrunnlag).toBeTruthy();
        expect(vilkår?.søknadsfrist).toBeTruthy();
        expect(vilkår?.opptjening).toBeTruthy();
        expect(vilkår?.medlemskap).toBeTruthy();
    });
});
