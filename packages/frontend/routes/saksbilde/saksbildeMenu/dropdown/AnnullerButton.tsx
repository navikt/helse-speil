import React, { useState } from 'react';

import { Dropdown } from '@navikt/ds-react-internal';

import { Arbeidsgiver, Utbetalingstatus } from '@io/graphql';
import { annulleringerEnabled } from '@utils/featureToggles';
import { isBeregnetPeriode } from '@utils/typeguards';

import { Annulleringsmodal } from '../../annullering/Annulleringsmodal';
import { harPeriodeTilBeslutterFor } from '../../sykepengegrunnlag/inntekt/inntektOgRefusjonUtils';

interface AnnullerButtonWithContentProps {
    fagsystemId: string;
    utbetalingId: string;
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
    skjæringstidspunkt: string;
}

const AnnullerButtonWithContent: React.FC<AnnullerButtonWithContentProps> = ({
    utbetalingId,
    fagsystemId,
    aktørId,
    fødselsnummer,
    organisasjonsnummer,
    skjæringstidspunkt,
}) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Dropdown.Menu.List.Item onClick={() => setShowModal(true)}>Annuller</Dropdown.Menu.List.Item>
            {showModal && (
                <Annulleringsmodal
                    fødselsnummer={fødselsnummer}
                    aktørId={aktørId}
                    organisasjonsnummer={organisasjonsnummer}
                    skjæringstidspunkt={skjæringstidspunkt}
                    fagsystemId={fagsystemId}
                    utbetalingId={utbetalingId}
                    onClose={() => {
                        setShowModal(false);
                    }}
                />
            )}
        </>
    );
};

const kanAnnullere = (harBeslutteroppgavePåSykefraværet: boolean, harMinstEnUtbetaltPeriode: boolean): boolean => {
    return annulleringerEnabled && !harBeslutteroppgavePåSykefraværet && harMinstEnUtbetaltPeriode;
};

interface AnnullerButtonProps {
    person: FetchedPerson;
    periode: FetchedBeregnetPeriode;
    arbeidsgiver: Arbeidsgiver;
}

export const AnnullerButton: React.FC<AnnullerButtonProps> = ({ person, periode, arbeidsgiver }) => {
    const harMinstEnUtbetaltPeriode =
        arbeidsgiver.generasjoner
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
            fagsystemId={periode.utbetaling.arbeidsgiverFagsystemId}
            utbetalingId={periode.utbetaling.id}
            aktørId={person.aktorId}
            fødselsnummer={person.fodselsnummer}
            organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
            skjæringstidspunkt={periode.skjaeringstidspunkt}
        />
    );
};
