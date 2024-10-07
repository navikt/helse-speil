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
import { useVilkårsgrunnlag } from '@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag';
import { TilkommenAG } from '@saksbilde/tilkommenInntekt/tilkommen/TilkommenAG';
import { findArbeidsgiverWithNyttInntektsforholdPeriode } from '@state/arbeidsgiver';
import { getRequiredInntekt } from '@state/utils';

type TilkommenInntektProps = {
    person: PersonFragment;
    aktivPeriode: BeregnetPeriodeFragment | GhostPeriodeFragment | NyttInntektsforholdPeriodeFragment;
};

const TilkommenInntektContainer = ({ person, aktivPeriode }: TilkommenInntektProps): Maybe<ReactElement> => {
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, aktivPeriode);
    const tilkomnePerioder: NyttInntektsforholdPeriodeFragment[] = person.arbeidsgivere.flatMap(
        (it: ArbeidsgiverFragment) =>
            it.nyeInntektsforholdPerioder.filter((it) => it.skjaeringstidspunkt === aktivPeriode.skjaeringstidspunkt),
    );

    if (!tilkomnePerioder || !vilkårsgrunnlag) return null;

    return (
        <Box paddingBlock="8 6" paddingInline="16">
            {tilkomnePerioder
                // ?.sort((a, b) => (a.deaktivert && !b.deaktivert ? 1 : !a.deaktivert && b.deaktivert ? -1 : 0))
                .map((ag) => {
                    const inntekt = getRequiredInntekt(vilkårsgrunnlag, ag.organisasjonsnummer);
                    const arbeidsgiver = findArbeidsgiverWithNyttInntektsforholdPeriode(ag, person.arbeidsgivere);

                    if (!arbeidsgiver) return null;

                    return (
                        <TilkommenAG
                            key={ag.id}
                            person={person}
                            inntekt={inntekt}
                            periode={ag}
                            arbeidsgiver={arbeidsgiver}
                        />
                    );
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
