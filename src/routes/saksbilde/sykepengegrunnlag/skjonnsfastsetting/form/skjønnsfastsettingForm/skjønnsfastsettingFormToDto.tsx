import { SkjønnsfastsettingMal } from '@external/sanity';
import { Arbeidsgiverinntekt, PersonFragment } from '@io/graphql';
import { Skjønnsfastsettingstype } from '@saksbilde/sykepengegrunnlag/skjonnsfastsetting/skjønnsfastsetting';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { SkjønnsfastsattSykepengegrunnlagDTO, SkjønnsfastsettingstypeDTO } from '@typer/overstyring';
import { ActivePeriod } from '@typer/shared';
import { toKronerOgØre } from '@utils/locale';
import { finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt } from '@utils/sykefraværstilfelle';

import { SkjønnsfastsettingFormFields, SkjønnsfastsettingFormFieldsArbeidsgiver } from './SkjønnsfastsettingForm';

export const skjønnsfastsettingFormToDto = (
    form: SkjønnsfastsettingFormFields,
    inntekter: Arbeidsgiverinntekt[],
    person: PersonFragment,
    period: ActivePeriod,
    omregnetÅrsinntekt: number,
    sammenligningsgrunnlag: number,
    malFraSanity?: SkjønnsfastsettingMal,
): SkjønnsfastsattSykepengegrunnlagDTO | undefined => {
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
        arbeidsgivere: form.arbeidsgivere.map(
            ({ årlig, organisasjonsnummer }: SkjønnsfastsettingFormFieldsArbeidsgiver) => ({
                organisasjonsnummer: organisasjonsnummer,
                årlig: årlig,
                fraÅrlig:
                    inntekter.find((it) => it.arbeidsgiver === organisasjonsnummer)?.omregnetArsinntekt?.belop ?? 0,
            }),
        ),
        vedtaksperiodeId: finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt(finnAlleInntektsforhold(person), period),
    };
};
