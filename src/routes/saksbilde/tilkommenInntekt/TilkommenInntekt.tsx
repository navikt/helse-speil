import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { Alert, Box, Heading, VStack } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import {
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Maybe,
    NyttInntektsforholdPeriodeFragment,
    PersonFragment,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import { TilkommenAG } from '@saksbilde/tilkommenInntekt/tilkommen/TilkommenAG';
import { findArbeidsgiverWithNyttInntektsforholdPeriode } from '@state/arbeidsgiver';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

type TilkommenInntektProps = {
    person: PersonFragment;
    aktivPeriode:
        | BeregnetPeriodeFragment
        | UberegnetPeriodeFragment
        | GhostPeriodeFragment
        | NyttInntektsforholdPeriodeFragment;
};

const TilkommenInntektContainer = ({ person, aktivPeriode }: TilkommenInntektProps): Maybe<ReactElement> => {
    const tilkomnePerioder: NyttInntektsforholdPeriodeFragment[] = person.arbeidsgivere.flatMap(
        (it: ArbeidsgiverFragment) => it.nyeInntektsforholdPerioder.filter((it) => it.fom === aktivPeriode.fom),
    );

    if (!tilkomnePerioder) return null;

    return (
        <Box paddingBlock="8 6">
            <Box paddingInline="4">
                <Heading size="small" spacing>
                    Tilkommen inntekt {dayjs(tilkomnePerioder[0]?.fom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)} –
                    {dayjs(tilkomnePerioder[0]?.tom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)}
                </Heading>
            </Box>
            <VStack gap="8">
                {tilkomnePerioder.map((ag) => {
                    const arbeidsgiver = findArbeidsgiverWithNyttInntektsforholdPeriode(ag, person.arbeidsgivere);

                    if (!arbeidsgiver) return null;

                    return <TilkommenAG key={ag.id} person={person} periode={ag} arbeidsgiver={arbeidsgiver} />;
                }) ?? null}
            </VStack>
        </Box>
    );
};

const TilkommenInntektError = (): ReactElement => (
    <Alert variant="error" size="small">
        Noe gikk galt. Kan ikke vise arbeidsforholdet for denne perioden.
    </Alert>
);

export const TilkommenInntekt = ({ person, aktivPeriode }: TilkommenInntektProps): ReactElement => (
    <ErrorBoundary fallback={<TilkommenInntektError />}>
        <TilkommenInntektContainer person={person} aktivPeriode={aktivPeriode} />
    </ErrorBoundary>
);
