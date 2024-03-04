import { Arbeidsgiverinntekt } from '@io/graphql';
import { SkjønnsfastsattSykepengegrunnlagDTO, SkjønnsfastsettingstypeDTO } from '@io/http';
import { toKronerOgØre } from '@utils/locale';
import { isBeregnetPeriode, isUberegnetVilkarsprovdPeriode } from '@utils/typeguards';

import { ArbeidsgiverForm, Skjønnsfastsettingstype, skjønnsfastsettelseBegrunnelser } from '../../skjønnsfastsetting';
import { SkjønnsfastsettingMal } from '../../state';
import { SkjønnsfastsettingFormFields } from './SkjønnsfastsettingForm';

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
    malFraSanity?: SkjønnsfastsettingMal,
): SkjønnsfastsattSykepengegrunnlagDTO | undefined => {
    const førsteVilkårsprøvdePeriodePåSkjæringstidspunkt = finnFørsteVilkårsprøvdePeriodePåSkjæringstidspunkt(
        person,
        period,
    );
    const manueltBeløp = form.arbeidsgivere.reduce((n: number, { årlig }: { årlig: number }) => n + årlig, 0);
    const skjønnsfastsatt =
        form.begrunnelseId === '0'
            ? omregnetÅrsinntekt
            : form.begrunnelseId === '1'
              ? sammenligningsgrunnlag
              : manueltBeløp;
    const begrunnelse = skjønnsfastsettelseBegrunnelser().find((it) => it.id === form.begrunnelseId);

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
                begrunnelse === undefined
                    ? SkjønnsfastsettingstypeDTO.ANNET
                    : begrunnelse.type === Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT
                      ? SkjønnsfastsettingstypeDTO.RAPPORTERT_ÅRSINNTEKT
                      : begrunnelse.type === Skjønnsfastsettingstype.OMREGNET_ÅRSINNTEKT
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
    };
};
