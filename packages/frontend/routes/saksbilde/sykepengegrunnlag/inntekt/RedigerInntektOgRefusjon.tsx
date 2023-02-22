import React, { Dispatch, SetStateAction } from 'react';

import { EditButton } from '@components/EditButton';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { Arbeidsgiver, BeregnetPeriode, Utbetalingstatus, Vilkarsgrunnlagtype } from '@io/graphql';
import { usePeriodForSkjæringstidspunktForArbeidsgiver } from '@state/arbeidsgiver';
import { useCurrentPerson } from '@state/person';
import { isGodkjent, isInCurrentGeneration, isTilGodkjenning, isWaiting, overlapper } from '@state/selectors/period';
import { getVilkårsgrunnlag } from '@state/selectors/person';
import { isRevurdering } from '@state/selectors/utbetaling';
import { isBeregnetPeriode } from '@utils/typeguards';

export const perioderMedSkjæringstidspunktHarMaksÉnFagsystemId = (
    arbeidsgiver: Arbeidsgiver,
    skjæringstidspunkt: DateString
): boolean => {
    return (
        arbeidsgiver.generasjoner[0]?.perioder
            .filter(isBeregnetPeriode)
            .filter((periode) => periode.skjaeringstidspunkt === skjæringstidspunkt)
            .filter((periode) => periode.utbetaling.status !== Utbetalingstatus.Godkjentutenutbetaling)
            .reduce((ider, periode) => ider.add(periode.utbetaling.arbeidsgiverFagsystemId), new Set()).size <= 1
    );
};

export const harVilkårsgrunnlagFraSpleis = (person: FetchedPerson, grunnlagId: string): boolean => {
    return getVilkårsgrunnlag(person, grunnlagId)?.vilkarsgrunnlagtype === Vilkarsgrunnlagtype.Spleis;
};

export const periodeErTilGodkjenningMedOverlappendeAvsluttetPeriode = (
    periode: FetchedBeregnetPeriode,
    person: FetchedPerson
): boolean => {
    if (!isTilGodkjenning(periode) || isRevurdering(periode.utbetaling)) {
        return false;
    }

    const beregnedePerioder = person.arbeidsgivere.flatMap(
        (arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder.filter(isBeregnetPeriode) ?? []
    ) as Array<FetchedBeregnetPeriode>;

    return beregnedePerioder
        .filter((other) => other.vedtaksperiodeId !== periode.vedtaksperiodeId)
        .filter(overlapper(periode))
        .some(isGodkjent);
};

export const kanRedigereInntektEllerRefusjon = (
    person: FetchedPerson,
    arbeidsgiver: Arbeidsgiver,
    periode: FetchedBeregnetPeriode
): boolean => {
    return (
        !isWaiting(periode) &&
        !periodeErTilGodkjenningMedOverlappendeAvsluttetPeriode(periode, person) &&
        perioderMedSkjæringstidspunktHarMaksÉnFagsystemId(arbeidsgiver, periode.skjaeringstidspunkt)
    );
};

interface RedigerInntektProps {
    setEditing: Dispatch<SetStateAction<boolean>>;
    editing: boolean;
    erRevurdering: boolean;
    skjæringstidspunkt: DateString;
    organisasjonsnummer: string;
    arbeidsgiver: Arbeidsgiver;
}

export const RedigerInntektOgRefusjon = ({
    setEditing,
    editing,
    erRevurdering,
    skjæringstidspunkt,
    organisasjonsnummer,
    arbeidsgiver,
}: RedigerInntektProps) => {
    const person = useCurrentPerson() as FetchedPerson;
    const periode = usePeriodForSkjæringstidspunktForArbeidsgiver(
        skjæringstidspunkt,
        organisasjonsnummer
    ) as BeregnetPeriode;

    if (!isInCurrentGeneration(periode, arbeidsgiver)) return null;

    return kanRedigereInntektEllerRefusjon(person, arbeidsgiver, periode) ? (
        <EditButton
            isOpen={editing}
            openText="Avbryt"
            closedText={erRevurdering ? 'Revurder' : 'Endre'}
            onOpen={() => setEditing(true)}
            onClose={() => setEditing(false)}
            style={{ placeSelf: 'center flex-end' }}
        />
    ) : (
        <PopoverHjelpetekst ikon={<SortInfoikon />}>
            <p>
                {isWaiting(periode)
                    ? 'Det finnes andre endringer som må ferdigstilles før du kan endre inntekten'
                    : periodeErTilGodkjenningMedOverlappendeAvsluttetPeriode(periode, person)
                    ? 'Det er ikke støtte for endring av inntekt på førstegangsbehandlinger når det finnes avsluttede overlappende perioder for andre arbeidsgivere'
                    : 'Det er ikke mulig å overstyre sykepengegrunnlaget i denne saken. Meld saken til support'}
            </p>
        </PopoverHjelpetekst>
    );
};
