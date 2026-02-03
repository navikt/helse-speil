import React, { ReactElement } from 'react';

import { Dropdown } from '@navikt/ds-react';

import { BeregnetPeriodeFragment, PersonFragment, Utbetalingstatus } from '@io/graphql';
import { harPeriodeTilBeslutterFor } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { isBeregnetPeriode } from '@utils/typeguards';

const kanAnnullere = (harBeslutteroppgavePåSykefraværet: boolean, harMinstEnUtbetaltPeriode: boolean): boolean => {
    return !harBeslutteroppgavePåSykefraværet && harMinstEnUtbetaltPeriode;
};

interface AnnullerButtonProps {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
    inntektsforhold: Inntektsforhold;
    showModal: () => void;
}

export const AnnullerButton = ({
    person,
    periode,
    inntektsforhold,
    showModal,
}: AnnullerButtonProps): ReactElement | null => {
    const harMinstEnUtbetaltPeriode =
        inntektsforhold.behandlinger
            .flatMap((it) => it.perioder)
            .filter(
                (it) =>
                    isBeregnetPeriode(it) &&
                    it.skjaeringstidspunkt === periode.skjaeringstidspunkt &&
                    it.utbetaling.vurdering?.godkjent === true &&
                    it.utbetaling.status !== Utbetalingstatus.Annullert,
            ).length !== 0;
    const harBeslutteroppgavePåSykefraværet = harPeriodeTilBeslutterFor(person, periode.skjaeringstidspunkt);

    if (!kanAnnullere(harBeslutteroppgavePåSykefraværet, harMinstEnUtbetaltPeriode)) {
        return null;
    }

    return <Dropdown.Menu.List.Item onClick={showModal}>Annuller</Dropdown.Menu.List.Item>;
};
