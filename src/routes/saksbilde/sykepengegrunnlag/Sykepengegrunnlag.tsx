import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { BeregnetPeriodeFragment, GhostPeriodeFragment, PersonFragment } from '@io/graphql';
import { SykepengegrunnlagSelvstendig } from '@saksbilde/sykepengegrunnlag/sykepengegrunnlagvisninger/spleis/selvstendig/SykepengegrunnlagSelvstendig';
import { useAktivtInntektsforhold } from '@state/arbeidsgiver';
import { isArbeidsgiver, isBeregnetPeriode, isSelvstendigNaering } from '@utils/typeguards';

import { SykepengegrunnlagFraInfogtrygd } from './sykepengegrunnlagvisninger/infotrygd/SykepengegrunnlagFraInfotrygd';
import { SykepengegrunnlagFraSpleis } from './sykepengegrunnlagvisninger/spleis/SykepengegrunnlagFraSpleis';
import { useVilkårsgrunnlag } from './useVilkårsgrunnlag';

type SykepengegrunnlagProps = {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment | GhostPeriodeFragment;
};

const SykepengegrunnlagContainer = ({ person, periode }: SykepengegrunnlagProps): ReactElement | null => {
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, periode);
    const inntektsforhold = useAktivtInntektsforhold(person);

    if (!inntektsforhold) return null;

    switch (vilkårsgrunnlag?.__typename) {
        case 'VilkarsgrunnlagSpleisV2':
            if (!isSelvstendigNaering(inntektsforhold)) {
                return (
                    <SykepengegrunnlagFraSpleis
                        vilkårsgrunnlag={vilkårsgrunnlag}
                        organisasjonsnummer={inntektsforhold.organisasjonsnummer}
                        data-testid="ubehandlet-sykepengegrunnlag"
                        person={person}
                        periode={periode}
                    />
                );
            } else if (isBeregnetPeriode(periode)) {
                return <SykepengegrunnlagSelvstendig vilkårsgrunnlag={vilkårsgrunnlag} beregnetPeriode={periode} />;
            }
            return null;
        case 'VilkarsgrunnlagInfotrygdV2':
            return (
                <SykepengegrunnlagFraInfogtrygd
                    person={person}
                    vilkårsgrunnlag={vilkårsgrunnlag}
                    organisasjonsnummer={
                        isArbeidsgiver(inntektsforhold) ? inntektsforhold.organisasjonsnummer : 'SELVSTENDIG'
                    }
                />
            );
        case undefined:
            return null;
    }
};

const SykepengegrunnlagError = (): ReactElement => (
    <Alert variant="error" size="small">
        Noe gikk galt. Kan ikke vise sykepengegrunnlag for denne perioden.
    </Alert>
);

export const Sykepengegrunnlag = ({ person, periode }: SykepengegrunnlagProps): ReactElement => (
    <ErrorBoundary fallback={<SykepengegrunnlagError />}>
        <SykepengegrunnlagContainer person={person} periode={periode} />
    </ErrorBoundary>
);
