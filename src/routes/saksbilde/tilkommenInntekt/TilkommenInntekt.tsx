import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { GhostPeriodeFragment, Maybe, PersonFragment } from '@io/graphql';
import { useVilkårsgrunnlag } from '@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag';
import { TilkommenAG } from '@saksbilde/tilkommenInntekt/tilkommen/TilkommenAG';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { getRequiredInntekt } from '@state/utils';

type TilkommenInntektProps = {
    person: PersonFragment;
    aktivPeriode: GhostPeriodeFragment;
};

const TilkommenInntektContainer = ({ person, aktivPeriode }: TilkommenInntektProps): Maybe<ReactElement> => {
    const arbeidsgiver = useCurrentArbeidsgiver();
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, aktivPeriode);
    if (!arbeidsgiver || !vilkårsgrunnlag) return null;
    const inntekt = getRequiredInntekt(vilkårsgrunnlag, arbeidsgiver.organisasjonsnummer);

    return (
        <TilkommenAG
            person={person}
            inntekt={inntekt}
            aktivPeriode={aktivPeriode as GhostPeriodeFragment}
            arbeidsgiver={arbeidsgiver!!}
        />
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
