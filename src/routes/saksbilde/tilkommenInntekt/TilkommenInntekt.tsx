import React, { ReactElement } from 'react';

import { Alert, Box } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import {
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Maybe,
    NyttInntektsforholdPeriodeFragment,
    PersonFragment,
} from '@io/graphql';
import { TilkommenAG } from '@saksbilde/tilkommenInntekt/tilkommen/TilkommenAG';
import { findArbeidsgiverWithNyttInntektsforholdPeriode } from '@state/arbeidsgiver';

type TilkommenInntektProps = {
    person: PersonFragment;
    aktivPeriode: BeregnetPeriodeFragment | GhostPeriodeFragment | NyttInntektsforholdPeriodeFragment;
};

const TilkommenInntektContainer = ({ person, aktivPeriode }: TilkommenInntektProps): Maybe<ReactElement> => {
    const tilkomnePerioder: NyttInntektsforholdPeriodeFragment[] = person.arbeidsgivere.flatMap(
        (it: ArbeidsgiverFragment) =>
            it.nyeInntektsforholdPerioder.filter((it) => it.skjaeringstidspunkt === aktivPeriode.skjaeringstidspunkt),
    );

    if (!tilkomnePerioder) return null;

    return (
        <Box paddingBlock="8 6">
            {tilkomnePerioder.map((ag) => {
                const arbeidsgiver = findArbeidsgiverWithNyttInntektsforholdPeriode(ag, person.arbeidsgivere);

                if (!arbeidsgiver) return null;

                return <TilkommenAG key={ag.id} person={person} periode={ag} arbeidsgiver={arbeidsgiver} />;
            }) ?? null}
        </Box>
    );
};

const TilkommenInntektError = (): ReactElement => {
    return (
        <Alert variant="error" size="small">
            Noe gikk galt. Kan ikke vise arbeidsforholdet for denne perioden.
        </Alert>
    );
};

export const TilkommenInntekt = ({ person, aktivPeriode }: TilkommenInntektProps): ReactElement => {
    return (
        <ErrorBoundary fallback={<TilkommenInntektError />}>
            <TilkommenInntektContainer person={person} aktivPeriode={aktivPeriode} />
        </ErrorBoundary>
    );
};
