import { SkjønnsfastsettingMal } from '@/external/sanity';
import { ActivePeriod } from '@/types/shared';
import { Arbeidsgiverinntekt, PersonFragment } from '@io/graphql';
import { SkjønnsfastsattSykepengegrunnlagDTO, SkjønnsfastsettingstypeDTO } from '@io/http';
import { toKronerOgØre } from '@utils/locale';
import { finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt } from '@utils/sykefraværstilfelle';
import { isBeregnetPeriode } from '@utils/typeguards';

import { ArbeidsgiverForm, Skjønnsfastsettingstype } from '../../skjønnsfastsetting';
import { SkjønnsfastsettingFormFields } from './SkjønnsfastsettingForm';

interface InitierendeVedtaksperiodeForArbeidsgiver {
    arbeidsgiver: string;
    initierendeVedtaksperiodeId: string | null;
}

const finnFørsteVilkårsprøvdePeriodePåSkjæringstidspunkt = (
    person: PersonFragment,
    period: ActivePeriod,
): InitierendeVedtaksperiodeForArbeidsgiver[] =>
    person?.arbeidsgivere.flatMap((arbeidsgiver) => ({
        arbeidsgiver: arbeidsgiver.organisasjonsnummer,
        initierendeVedtaksperiodeId:
            arbeidsgiver.generasjoner?.[0]?.perioder
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
        arbeidsgivere: form.arbeidsgivere.map(({ årlig, organisasjonsnummer }: ArbeidsgiverForm) => ({
            organisasjonsnummer: organisasjonsnummer,
            årlig: årlig,
            fraÅrlig: inntekter.find((it) => it.arbeidsgiver === organisasjonsnummer)?.omregnetArsinntekt?.belop ?? 0,
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
                )[0].initierendeVedtaksperiodeId ?? null,
        })),
        vedtaksperiodeId: finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt(person.arbeidsgivere, period),
    };
};
