import React, { Dispatch, SetStateAction } from 'react';

import { EditButton } from '@components/EditButton';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { Arbeidsgiver, BeregnetPeriode, Utbetalingstatus } from '@io/graphql';
import { usePeriodForSkjæringstidspunktForArbeidsgiver } from '@state/arbeidsgiver';
import { useCurrentPerson } from '@state/person';
import { isInCurrentGeneration, isWaiting } from '@state/selectors/period';
import { isBeregnetPeriode } from '@utils/typeguards';

export const perioderMedSkjæringstidspunktHarMaksÉnFagsystemId = (
    arbeidsgiver: Arbeidsgiver,
    skjæringstidspunkt: DateString,
): boolean => {
    return (
        arbeidsgiver.generasjoner[0]?.perioder
            .filter(isBeregnetPeriode)
            .filter((periode) => periode.skjaeringstidspunkt === skjæringstidspunkt)
            .filter((periode) => periode.utbetaling.status !== Utbetalingstatus.Godkjentutenutbetaling)
            .reduce((ider, periode) => ider.add(periode.utbetaling.arbeidsgiverFagsystemId), new Set()).size <= 1
    );
};

export const kanRedigereInntektEllerRefusjon = (
    person: FetchedPerson,
    arbeidsgiver: Arbeidsgiver,
    periode: FetchedBeregnetPeriode,
): boolean => {
    return (
        !isWaiting(periode) &&
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
        organisasjonsnummer,
    ) as BeregnetPeriode;

    if (!isInCurrentGeneration(periode, arbeidsgiver)) return null;

    return kanRedigereInntektEllerRefusjon(person, arbeidsgiver, periode) ? (
        <EditButton
            isOpen={editing}
            openText="Avbryt"
            closedText={erRevurdering ? 'Revurder' : 'Endre'}
            onOpen={() => setEditing(true)}
            onClose={() => setEditing(false)}
        />
    ) : (
        <PopoverHjelpetekst ikon={<SortInfoikon />}>
            <p>
                {isWaiting(periode)
                    ? 'Det finnes andre endringer som må ferdigstilles før du kan endre inntekten'
                    : 'Det er ikke mulig å overstyre sykepengegrunnlaget i denne saken. Meld saken til support'}
            </p>
        </PopoverHjelpetekst>
    );
};
