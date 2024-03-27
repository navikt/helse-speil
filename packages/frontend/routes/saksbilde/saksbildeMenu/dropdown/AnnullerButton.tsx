import React, { useState } from 'react';

import { Dropdown } from '@navikt/ds-react-internal';

import { useErBeslutteroppgaveOgHarTilgang } from '@hooks/useErBeslutteroppgaveOgHarTilgang';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Arbeidsgiver, Utbetaling, Utbetalingstatus } from '@io/graphql';
import { annulleringerEnabled } from '@utils/featureToggles';

import { Annulleringsmodal } from '../../annullering/Annulleringsmodal';

interface AnnullerButtonWithContentProps {
    utbetaling: Utbetaling;
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
}

const AnnullerButtonWithContent: React.FC<AnnullerButtonWithContentProps> = ({
    utbetaling,
    aktørId,
    fødselsnummer,
    organisasjonsnummer,
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
                    fagsystemId={utbetaling.arbeidsgiverFagsystemId}
                    utbetalingId={utbetaling.id}
                    utbetaling={utbetaling}
                    onClose={() => {
                        setShowModal(false);
                    }}
                />
            )}
        </>
    );
};

const kanAnnullere = (erBeslutterMedTilgang: boolean, erReadonly: boolean, utbetaling: Utbetaling): boolean => {
    return (
        annulleringerEnabled &&
        !erBeslutterMedTilgang &&
        !erReadonly &&
        utbetaling.status !== Utbetalingstatus.Annullert &&
        (utbetaling.vurdering?.godkjent ?? false)
    );
};

interface AnnullerButtonProps {
    person: FetchedPerson;
    periode: FetchedBeregnetPeriode;
    arbeidsgiver: Arbeidsgiver;
}

export const AnnullerButton: React.FC<AnnullerButtonProps> = ({ person, periode, arbeidsgiver }) => {
    const erReadonly = useIsReadOnlyOppgave();
    const erBeslutterMedTilgang = useErBeslutteroppgaveOgHarTilgang();

    console.log(!kanAnnullere(erBeslutterMedTilgang, erReadonly, periode.utbetaling));
    if (!kanAnnullere(erBeslutterMedTilgang, erReadonly, periode.utbetaling)) {
        return null;
    }

    return (
        <AnnullerButtonWithContent
            utbetaling={periode.utbetaling}
            aktørId={person.aktorId}
            fødselsnummer={person.fodselsnummer}
            organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
        />
    );
};
