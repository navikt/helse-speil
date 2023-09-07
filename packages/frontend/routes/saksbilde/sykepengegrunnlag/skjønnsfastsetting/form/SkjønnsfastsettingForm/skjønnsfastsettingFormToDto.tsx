import { SkjønnsfastsettingFormFields } from './SkjønnsfastsettingForm';

import { Arbeidsgiverinntekt } from '@io/graphql';
import { SkjønnsfastsattSykepengegrunnlagDTO } from '@io/http';
import { isBeregnetPeriode, isUberegnetVilkarsprovdPeriode } from '@utils/typeguards';

import { ArbeidsgiverForm, skjønnsfastsettelseBegrunnelser } from '../../skjønnsfastsetting';

interface InitierendeVedtaksperiodeForArbeidsgiver {
    arbeidsgiver: string;
    initierendeVedtaksperiodeId: string | null;
}

const finnFørsteVilkårsprøvdePeriodePåSkjæringstidspunkt = (
    person: FetchedPerson,
    period: ActivePeriod,
): InitierendeVedtaksperiodeForArbeidsgiver[] =>
    person?.arbeidsgivere.flatMap((arbeidsgiver) => ({
        arbeidsgiver: arbeidsgiver.organisasjonsnummer,
        initierendeVedtaksperiodeId:
            arbeidsgiver.generasjoner?.[0]?.perioder
                ?.filter(
                    (periode) =>
                        periode.skjaeringstidspunkt === period.skjaeringstidspunkt &&
                        (isBeregnetPeriode(periode) || isUberegnetVilkarsprovdPeriode(periode)),
                )
                .pop()?.vedtaksperiodeId ?? null,
    }));
export const skjønnsfastsettingFormToDto = (
    form: SkjønnsfastsettingFormFields,
    inntekter: Arbeidsgiverinntekt[],
    person: FetchedPerson,
    period: ActivePeriod,
    omregnetÅrsinntekt: number,
    sammenligningsgrunnlag: number,
): SkjønnsfastsattSykepengegrunnlagDTO => {
    const førsteVilkårsprøvdePeriodePåSkjæringstidspunkt = finnFørsteVilkårsprøvdePeriodePåSkjæringstidspunkt(
        person,
        period,
    );

    const manueltBeløp = form.arbeidsgivere.reduce((n: number, { årlig }: { årlig: number }) => n + årlig, 0);
    const begrunnelse = skjønnsfastsettelseBegrunnelser(
        omregnetÅrsinntekt,
        sammenligningsgrunnlag,
        manueltBeløp,
        form.arbeidsgivere.length,
    ).find((it) => it.id === form.begrunnelseId);
    return {
        fødselsnummer: person.fodselsnummer,
        aktørId: person.aktorId,
        skjæringstidspunkt: period.skjaeringstidspunkt,
        arbeidsgivere: form.arbeidsgivere.map(({ årlig, organisasjonsnummer }: ArbeidsgiverForm) => ({
            organisasjonsnummer: organisasjonsnummer,
            årlig: årlig,
            fraÅrlig: inntekter.find((it) => it.arbeidsgiver === organisasjonsnummer)?.omregnetArsinntekt?.belop ?? 0,
            årsak: form.årsak,
            type: begrunnelse?.type,
            begrunnelseMal: begrunnelse?.mal,
            begrunnelseFritekst: form.begrunnelseFritekst,
            ...(begrunnelse?.subsumsjon?.paragraf && {
                subsumsjon: {
                    paragraf: begrunnelse.subsumsjon.paragraf,
                    ledd: begrunnelse.subsumsjon?.ledd,
                    bokstav: begrunnelse.subsumsjon?.bokstav,
                },
            }),
            begrunnelseKonklusjon: begrunnelse?.konklusjon,
            initierendeVedtaksperiodeId:
                førsteVilkårsprøvdePeriodePåSkjæringstidspunkt.filter(
                    (it) => it.arbeidsgiver === organisasjonsnummer,
                )[0].initierendeVedtaksperiodeId ?? null,
        })),
    };
};
