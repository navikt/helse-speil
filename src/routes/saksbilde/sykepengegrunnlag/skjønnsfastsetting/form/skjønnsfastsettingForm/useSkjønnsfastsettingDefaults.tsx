import {
    ArbeidsgiverFragment,
    Arbeidsgiverinntekt,
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Maybe,
    PersonFragment,
    Skjonnsfastsettingstype,
} from '@io/graphql';
import { Skjønnsfastsettingstype } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/skjønnsfastsetting';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { isSykepengegrunnlagskjønnsfastsetting } from '@utils/typeguards';

import { SkjønnsfastsettingFormFields } from './SkjønnsfastsettingForm';

export const useSkjønnsfastsettingDefaults = (
    person: PersonFragment,
    period: BeregnetPeriodeFragment | GhostPeriodeFragment,
    inntekter: Arbeidsgiverinntekt[],
): {
    aktiveArbeidsgivere?: ArbeidsgiverFragment[];
    aktiveArbeidsgivereInntekter?: Arbeidsgiverinntekt[];
    defaults: SkjønnsfastsettingFormFields;
} => {
    const arbeidsgiver = useCurrentArbeidsgiver(person);

    if (!arbeidsgiver)
        return {
            aktiveArbeidsgivere: undefined,
            aktiveArbeidsgivereInntekter: undefined,
            defaults: {
                begrunnelseFritekst: '',
                type: undefined,
                årsak: '',
                arbeidsgivere: [],
            },
        };

    // Finner alle aktive arbeidsgivere ved å først filtrere ut dem som ikke har perioder || ghostperioder på aktivt skjæringstidspunkt
    // og deretter filtrere ut dem som ikke har omregnet årsinntekt for gitt skjæringstidspunkt
    const aktiveArbeidsgivere =
        person?.arbeidsgivere
            .filter(
                (arbeidsgiver) =>
                    arbeidsgiver.generasjoner?.[0]?.perioder.some(
                        (it) => it.skjaeringstidspunkt === period.skjaeringstidspunkt,
                    ) ||
                    arbeidsgiver.ghostPerioder.some(
                        (it) => it.skjaeringstidspunkt === period.skjaeringstidspunkt && !it.deaktivert,
                    ),
            )
            .filter(
                (arbeidsgiver) =>
                    inntekter.find((inntekt) => inntekt.arbeidsgiver === arbeidsgiver.organisasjonsnummer)
                        ?.omregnetArsinntekt !== null,
            ) ?? [];

    const aktiveArbeidsgivereInntekter = inntekter.filter((inntekt) =>
        aktiveArbeidsgivere.some(
            (arbeidsgiver) =>
                arbeidsgiver.organisasjonsnummer === inntekt.arbeidsgiver && inntekt.omregnetArsinntekt !== null,
        ),
    );

    const mapType = (type: Maybe<Skjonnsfastsettingstype> = Skjonnsfastsettingstype.Annet): Skjønnsfastsettingstype => {
        switch (type) {
            case Skjonnsfastsettingstype.OmregnetArsinntekt:
                return Skjønnsfastsettingstype.OMREGNET_ÅRSINNTEKT;
            case Skjonnsfastsettingstype.RapportertArsinntekt:
                return Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT;
            case Skjonnsfastsettingstype.Annet:
            default:
                return Skjønnsfastsettingstype.ANNET;
        }
    };

    const erReturoppgave = (period as BeregnetPeriodeFragment)?.totrinnsvurdering?.erRetur ?? false;
    const forrigeSkjønnsfastsettelse = erReturoppgave
        ? arbeidsgiver?.overstyringer
              .filter(isSykepengegrunnlagskjønnsfastsetting)
              .filter((overstyring) => !overstyring.ferdigstilt)
              .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
              .pop()
        : undefined;
    const forrigeSkjønnsfastsettelseFritekst = forrigeSkjønnsfastsettelse?.skjonnsfastsatt?.begrunnelseFritekst ?? '';
    const forrigeType = mapType(forrigeSkjønnsfastsettelse?.skjonnsfastsatt?.type);

    return {
        aktiveArbeidsgivere: aktiveArbeidsgivere,
        aktiveArbeidsgivereInntekter: aktiveArbeidsgivereInntekter,
        defaults: {
            begrunnelseFritekst: forrigeSkjønnsfastsettelseFritekst,
            type: forrigeType ?? '',
            årsak: '',
            arbeidsgivere: aktiveArbeidsgivereInntekter.map((inntekt) => ({
                organisasjonsnummer: inntekt.arbeidsgiver,
                årlig: 0,
            })),
        },
    };
};
