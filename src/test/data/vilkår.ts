import { somDato } from '../../client/mapping/vedtaksperiode';
import {
    SpesialistVedtaksperiode,
    SpleisForlengelseFraInfotrygd,
    SpleisMedlemskapstatus,
    SpleisSykdomsdag,
    SpleisSykdomsdagtype,
    SpleisVilkår,
} from 'external-types';
import dayjs from 'dayjs';
import { mapVilkår } from '../../client/mapping/vilkår';

export const umappedeVilkår = (tidslinje: SpleisSykdomsdag[]): SpleisVilkår => {
    const førsteDag = tidslinje[0];
    const sisteDag = tidslinje.slice(-1).pop()!;
    const førsteSykedag = tidslinje.find(({ type }) => type === SpleisSykdomsdagtype.SYKEDAG)!;
    return {
        sykepengedager: {
            forbrukteSykedager: 3,
            beregningsdato: førsteSykedag.dagen,
            førsteSykepengedag: førsteSykedag.dagen,
            maksdato: dayjs(førsteSykedag.dagen).add(280, 'day').format('YYYY-MM-DD'),
            oppfylt: true,
        },
        alder: {
            alderSisteSykedag: 28,
            oppfylt: true,
        },
        opptjening: {
            antallKjenteOpptjeningsdager: 3539,
            fom: somDato(førsteSykedag.dagen).subtract(3539, 'day').format('YYYY-MM-DD'),
            oppfylt: true,
        },
        søknadsfrist: {
            sendtNav: dayjs(sisteDag.dagen).add(1, 'day').format('YYYY-MM-DD'),
            søknadFom: førsteDag.dagen,
            søknadTom: sisteDag.dagen,
            oppfylt: true,
        },
        sykepengegrunnlag: {
            sykepengegrunnlag: 372000.0,
            grunnbeløp: 99858,
            oppfylt: true,
        },
        medlemskapstatus: SpleisMedlemskapstatus.JA,
    };
};

export const dataForVilkårsvurdering = () => ({
    antallOpptjeningsdagerErMinst: 3539,
    avviksprosent: 0.0,
    beregnetÅrsinntektFraInntektskomponenten: 372000.0,
    erEgenAnsatt: false,
    harOpptjening: true,
    medlemskapstatus: SpleisMedlemskapstatus.JA,
});

export const risikovurdering = () => ({
    arbeidsuførhetvurdering: ['en testvurdering'],
    ufullstendig: false,
});

interface MappedeVilkårOptions {
    forlengelseFraInfotrygd?: SpleisForlengelseFraInfotrygd;
    vilkår?: SpleisVilkår;
}

export const mappedeVilkår = (options?: MappedeVilkårOptions) =>
    mapVilkår({
        forlengelseFraInfotrygd: options?.forlengelseFraInfotrygd ?? SpleisForlengelseFraInfotrygd.NEI,
        ...(options?.vilkår ?? umappedeVilkår),
    } as SpesialistVedtaksperiode);
