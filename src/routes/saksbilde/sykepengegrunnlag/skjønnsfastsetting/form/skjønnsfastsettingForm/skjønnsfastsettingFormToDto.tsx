import { SkjønnsfastsettingMal } from '@external/sanity';
import { Arbeidsgiverinntekt, Maybe, PersonFragment } from '@io/graphql';
import { Skjønnsfastsettingstype } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/skjønnsfastsetting';
import { finnAlleInntektsforhold } from '@state/selectors/arbeidsgiver';
import { SkjønnsfastsattSykepengegrunnlagDTO, SkjønnsfastsettingstypeDTO } from '@typer/overstyring';
import { ActivePeriod } from '@typer/shared';
import { toKronerOgØre } from '@utils/locale';
import { finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt } from '@utils/sykefraværstilfelle';
import { isArbeidsgiver, isBeregnetPeriode } from '@utils/typeguards';

import { SkjønnsfastsettingFormFields, SkjønnsfastsettingFormFieldsArbeidsgiver } from './SkjønnsfastsettingForm';

interface InitierendeVedtaksperiodeForArbeidsgiver {
    arbeidsgiver: string;
    initierendeVedtaksperiodeId: Maybe<string>;
}

const finnFørsteVilkårsprøvdePeriodePåSkjæringstidspunkt = (
    person: PersonFragment,
    period: ActivePeriod,
): InitierendeVedtaksperiodeForArbeidsgiver[] =>
    finnAlleInntektsforhold(person).flatMap((inntektsforhold) => ({
        arbeidsgiver: isArbeidsgiver(inntektsforhold) ? inntektsforhold.organisasjonsnummer : 'SELVSTENDIG',
        initierendeVedtaksperiodeId:
            inntektsforhold.generasjoner?.[0]?.perioder
                ?.filter(
                    (periode) =>
                        periode.skjaeringstidspunkt === period.skjaeringstidspunkt && isBeregnetPeriode(periode),
                )
                .pop()?.vedtaksperiodeId ?? null,
    }));

export const skjønnsfastsettingFormToDto = (
    form: SkjønnsfastsettingFormFields,
    inntekter: Arbeidsgiverinntekt[],
    person: PersonFragment,
    period: ActivePeriod,
    omregnetÅrsinntekt: number,
    sammenligningsgrunnlag: number,
    malFraSanity?: SkjønnsfastsettingMal,
): SkjønnsfastsattSykepengegrunnlagDTO | undefined => {
    const førsteVilkårsprøvdePeriodePåSkjæringstidspunkt = finnFørsteVilkårsprøvdePeriodePåSkjæringstidspunkt(
        person,
        period,
    );
    const manueltBeløp = form.arbeidsgivere.reduce((n: number, { årlig }: { årlig: number }) => n + årlig, 0);
    const skjønnsfastsatt =
        form.type === Skjønnsfastsettingstype.OMREGNET_ÅRSINNTEKT
            ? omregnetÅrsinntekt
            : form.type === Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT
              ? sammenligningsgrunnlag
              : manueltBeløp;

    if (malFraSanity === undefined) return;
    return {
        fødselsnummer: person.fodselsnummer,
        aktørId: person.aktorId,
        skjæringstidspunkt: period.skjaeringstidspunkt,
        arbeidsgivere: form.arbeidsgivere.map(
            ({ årlig, organisasjonsnummer }: SkjønnsfastsettingFormFieldsArbeidsgiver) => ({
                organisasjonsnummer: organisasjonsnummer,
                årlig: årlig,
                fraÅrlig:
                    inntekter.find((it) => it.arbeidsgiver === organisasjonsnummer)?.omregnetArsinntekt?.belop ?? 0,
                årsak: form.årsak,
                type:
                    form.type === undefined
                        ? SkjønnsfastsettingstypeDTO.ANNET
                        : form.type === Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT
                          ? SkjønnsfastsettingstypeDTO.RAPPORTERT_ÅRSINNTEKT
                          : form.type === Skjønnsfastsettingstype.OMREGNET_ÅRSINNTEKT
                            ? SkjønnsfastsettingstypeDTO.OMREGNET_ÅRSINNTEKT
                            : SkjønnsfastsettingstypeDTO.ANNET,
                begrunnelseMal: malFraSanity?.begrunnelse
                    .replace('${omregnetÅrsinntekt}', toKronerOgØre(omregnetÅrsinntekt))
                    .replace('${omregnetMånedsinntekt}', toKronerOgØre(omregnetÅrsinntekt / 12))
                    .replace('${sammenligningsgrunnlag}', toKronerOgØre(sammenligningsgrunnlag)),
                begrunnelseFritekst: form.begrunnelseFritekst,
                lovhjemmel: { ...malFraSanity.lovhjemmel },
                begrunnelseKonklusjon: malFraSanity?.konklusjon.replace(
                    '${skjønnsfastsattÅrsinntekt}',
                    toKronerOgØre(skjønnsfastsatt),
                ),
                initierendeVedtaksperiodeId:
                    førsteVilkårsprøvdePeriodePåSkjæringstidspunkt.filter(
                        (it) => it.arbeidsgiver === organisasjonsnummer,
                    )[0]?.initierendeVedtaksperiodeId ?? null,
            }),
        ),
        vedtaksperiodeId: finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt(finnAlleInntektsforhold(person), period),
    };
};
