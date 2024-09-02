import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { GhostPeriodeFragment, Maybe, PersonFragment } from '@io/graphql';
import { TilkommenInntekt } from '@saksbilde/arbeidsforhold/tilkommen/TilkommenInntekt';
import { useVilkårsgrunnlag } from '@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { getRequiredInntekt } from '@state/utils';

type ArbeidsforholdProps = {
    person: PersonFragment;
    aktivPeriode: GhostPeriodeFragment;
};

const ArbeidsforholdContainer = ({ person, aktivPeriode }: ArbeidsforholdProps): Maybe<ReactElement> => {
    const arbeidsgiver = useCurrentArbeidsgiver();
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, aktivPeriode);
    if (!arbeidsgiver || !vilkårsgrunnlag) return null;
    const inntekt = getRequiredInntekt(vilkårsgrunnlag, arbeidsgiver.organisasjonsnummer);

    return (
        <TilkommenInntekt
            person={person}
            inntekt={inntekt}
            aktivPeriode={aktivPeriode as GhostPeriodeFragment}
            arbeidsgiver={arbeidsgiver!!}
        />
    );
};

const ArbeidsforholdError = (): ReactElement => {
    return (
        <Alert variant="error" size="small">
            Noe gikk galt. Kan ikke vise arbeidsforholdet for denne perioden.
        </Alert>
    );
};

export const Arbeidsforhold = ({ person, aktivPeriode }: ArbeidsforholdProps): ReactElement => {
    return (
        <ErrorBoundary fallback={<ArbeidsforholdError />}>
            <ArbeidsforholdContainer person={person} aktivPeriode={aktivPeriode} />
        </ErrorBoundary>
    );
};
