import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import {
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Maybe,
    PersonFragment,
} from '@io/graphql';
import { useVilkårsgrunnlag } from '@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag';
import { TilkommenAG } from '@saksbilde/tilkommenInntekt/tilkommen/TilkommenAG';
import { findArbeidsgiverWithGhostPeriode } from '@state/arbeidsgiver';
import { getRequiredInntekt } from '@state/utils';
import { isTilkommenInntekt } from '@utils/typeguards';

type TilkommenInntektProps = {
    person: PersonFragment;
    aktivPeriode: BeregnetPeriodeFragment | GhostPeriodeFragment;
};

const TilkommenInntektContainer = ({ person, aktivPeriode }: TilkommenInntektProps): Maybe<ReactElement> => {
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, aktivPeriode);
    const tilkomnePerioder: GhostPeriodeFragment[] = person.arbeidsgivere.flatMap((it: ArbeidsgiverFragment) =>
        it.ghostPerioder.filter(
            (it) =>
                it.skjaeringstidspunkt === aktivPeriode.skjaeringstidspunkt && isTilkommenInntekt(it, vilkårsgrunnlag),
        ),
    );

    if (!tilkomnePerioder || !vilkårsgrunnlag) return null;

    return (
        <>
            {tilkomnePerioder
                ?.sort((a, b) => (a.deaktivert && !b.deaktivert ? 1 : !a.deaktivert && b.deaktivert ? -1 : 0))
                .map((ag) => {
                    const inntekt = getRequiredInntekt(vilkårsgrunnlag, ag.organisasjonsnummer);
                    const arbeidsgiver = findArbeidsgiverWithGhostPeriode(ag, person.arbeidsgivere);

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
        </>
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
