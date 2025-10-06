import React, { ReactElement, useState } from 'react';

import { Dropdown } from '@navikt/ds-react';

import { BeregnetPeriodeFragment, PersonFragment, Utbetalingstatus } from '@io/graphql';
import { AnnulleringsModal } from '@saksbilde/annullering/AnnulleringsModal';
import { harPeriodeTilBeslutterFor } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import { Inntektsforhold } from '@state/arbeidsgiver';
import { isArbeidsgiver, isBeregnetPeriode } from '@utils/typeguards';

interface AnnullerButtonWithContentProps {
    vedtaksperiodeId: string;
    utbetalingId: string;
    arbeidsgiverFagsystemId: string;
    personFagsystemId: string;
    organisasjonsnummer: string;
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
}

const AnnullerButtonWithContent = ({
    utbetalingId,
    arbeidsgiverFagsystemId,
    personFagsystemId,
    vedtaksperiodeId,
    organisasjonsnummer,
    person,
    periode,
}: AnnullerButtonWithContentProps): ReactElement => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Dropdown.Menu.List.Item onClick={() => setShowModal(true)}>Annuller</Dropdown.Menu.List.Item>
            {showModal && (
                <AnnulleringsModal
                    closeModal={() => setShowModal(false)}
                    showModal={showModal}
                    organisasjonsnummer={organisasjonsnummer}
                    vedtaksperiodeId={vedtaksperiodeId}
                    utbetalingId={utbetalingId}
                    arbeidsgiverFagsystemId={arbeidsgiverFagsystemId}
                    personFagsystemId={personFagsystemId}
                    person={person}
                    periode={periode}
                />
            )}
        </>
    );
};

const kanAnnullere = (harBeslutteroppgavePåSykefraværet: boolean, harMinstEnUtbetaltPeriode: boolean): boolean => {
    return !harBeslutteroppgavePåSykefraværet && harMinstEnUtbetaltPeriode;
};

interface AnnullerButtonProps {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
    inntektsforhold: Inntektsforhold;
}

export const AnnullerButton = ({ person, periode, inntektsforhold }: AnnullerButtonProps): ReactElement | null => {
    const harMinstEnUtbetaltPeriode =
        inntektsforhold.generasjoner
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

    return (
        <AnnullerButtonWithContent
            vedtaksperiodeId={periode.vedtaksperiodeId}
            utbetalingId={periode.utbetaling.id}
            arbeidsgiverFagsystemId={periode.utbetaling.arbeidsgiverFagsystemId}
            personFagsystemId={periode.utbetaling.personFagsystemId}
            organisasjonsnummer={isArbeidsgiver(inntektsforhold) ? inntektsforhold.organisasjonsnummer : 'SELVSTENDIG'}
            person={person}
            periode={periode}
        />
    );
};
