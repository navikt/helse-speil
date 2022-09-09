import React, { Dispatch, SetStateAction } from 'react';
import {
    useActiveGenerationIsLast,
    useActivePeriodHasLatestSkjæringstidspunkt,
    useHarKunEnFagsystemIdPåArbeidsgiverIAktivPeriode,
} from '@hooks/revurdering';
import { EditButton } from '@components/EditButton';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { Inntektstype, Vilkarsgrunnlagtype } from '@io/graphql';
import { useCurrentPerson, useVilkårsgrunnlag } from '@state/person';
import { erDev, erLocal } from '@utils/featureToggles';
import { useActivePeriod } from '@state/periode';
import { getPeriodState } from '@utils/mapping';

interface RedigerInntektProps {
    setEditing: Dispatch<SetStateAction<boolean>>;
    editing: boolean;
    erRevurdering: boolean;
    inntektstype: Inntektstype;
    skjæringstidspunkt: DateString;
    vilkårsgrunnlagId: string;
}

export const RedigerInntekt = ({
    setEditing,
    editing,
    erRevurdering,
    inntektstype,
    skjæringstidspunkt,
    vilkårsgrunnlagId,
}: RedigerInntektProps) => {
    const harKunEnArbeidsgiver = inntektstype === Inntektstype.Enarbeidsgiver;

    const period = useActivePeriod();

    const aktivPeriodeVenter = ['venter', 'venterPåKiling'].includes(getPeriodState(period));

    const kanEndreInntektIDev = (erDev() || erLocal()) && !aktivPeriodeVenter;

    const erAktivPeriodeISisteSkjæringstidspunkt = useActivePeriodHasLatestSkjæringstidspunkt();
    const erTidslinjeperiodeISisteGenerasjon = useActiveGenerationIsLast();

    const erSpleisVilkårsgrunnlagtype =
        useVilkårsgrunnlag(vilkårsgrunnlagId, skjæringstidspunkt)?.vilkarsgrunnlagtype === Vilkarsgrunnlagtype.Spleis;
    const erIkkePingPong = useHarKunEnFagsystemIdPåArbeidsgiverIAktivPeriode();

    if (!erTidslinjeperiodeISisteGenerasjon) return null;

    const revurdereTidligereUtbetalinger = erDev() || erLocal() || erAktivPeriodeISisteSkjæringstidspunkt;
    const erIkkeRevurderingAvFlereArbeidsgivere = inntektstype !== 'FLEREARBEIDSGIVERE' || !erRevurdering;

    return (harKunEnArbeidsgiver || kanEndreInntektIDev) &&
        revurdereTidligereUtbetalinger &&
        erSpleisVilkårsgrunnlagtype &&
        erIkkePingPong &&
        (erIkkeRevurderingAvFlereArbeidsgivere || kanEndreInntektIDev) ? (
        <EditButton
            isOpen={editing}
            openText="Avbryt"
            closedText={erRevurdering ? 'Revurder' : 'Endre'}
            onOpen={() => setEditing(true)}
            onClose={() => setEditing(false)}
            style={{ justifySelf: 'flex-end' }}
        />
    ) : erTidslinjeperiodeISisteGenerasjon ? (
        <PopoverHjelpetekst ikon={<SortInfoikon />}>
            <p>
                {(erDev() || erLocal()) && aktivPeriodeVenter
                    ? 'Kan ikke endre inntekt på periode når overlappende perioder er i venter-status'
                    : !revurdereTidligereUtbetalinger
                    ? 'Kan ikke endre inntekt, det er foreløpig ikke støtte for endringer i saker i tidligere skjæringstidspunkt'
                    : !harKunEnArbeidsgiver
                    ? 'Kan ikke endre inntekt, det er foreløpig ikke støtte for saker med flere arbeidsgivere'
                    : 'Det er foreløpig ikke støtte for endringer i saker som har vært delvis behandlet i Infotrygd'}
            </p>
        </PopoverHjelpetekst>
    ) : (
        <></>
    );
};
