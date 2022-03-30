import dayjs from 'dayjs';

import { somDato } from '@utils/date';

export const umappedeVilkår = (
    tidslinje: ExternalSykdomsdag[],
    skjæringstidspunkt = tidslinje.find(({ type }) => type === 'SYKEDAG')!.dagen,
): ExternalVedtaksperiode['vilkår'] => {
    const førsteDag = tidslinje[0];
    const sisteDag = tidslinje.slice(-1).pop()!;
    const førsteSykedag = tidslinje.find(({ type }) => type === 'SYKEDAG')!;
    return {
        sykepengedager: {
            forbrukteSykedager: 3,
            skjæringstidspunkt: skjæringstidspunkt,
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
        medlemskapstatus: 'JA',
    };
};

export const dataForVilkårsvurdering = (): ExternalVedtaksperiode['dataForVilkårsvurdering'] => ({
    antallOpptjeningsdagerErMinst: 3539,
    avviksprosent: 0.0,
    beregnetÅrsinntektFraInntektskomponenten: 372000.0,
    erEgenAnsatt: false,
    harOpptjening: true,
    medlemskapstatus: 'JA',
});

export const risikovurdering = () => ({
    arbeidsuførhetvurdering: ['en testvurdering'],
    ufullstendig: false,
});
