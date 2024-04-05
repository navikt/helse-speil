import React, { useState } from 'react';

import { Dropdown } from '@navikt/ds-react-internal';

import { useErBeslutteroppgaveOgHarTilgang } from '@hooks/useErBeslutteroppgaveOgHarTilgang';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Arbeidsgiver, Utbetaling, Utbetalingstatus } from '@io/graphql';
import { annulleringerEnabled } from '@utils/featureToggles';
import { isBeregnetPeriode } from '@utils/typeguards';

import { Annulleringsmodal } from '../../annullering/Annulleringsmodal';

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
    const sisteGodkjentePeriodePåSkjæringstidspunkt = arbeidsgiver.generasjoner[0].perioder
        .filter(
            (agperiode) =>
                agperiode.skjaeringstidspunkt === periode.skjaeringstidspunkt &&
                isBeregnetPeriode(agperiode) &&
                agperiode.utbetaling.vurdering?.godkjent === true,
        )
        .shift();

    if (
        sisteGodkjentePeriodePåSkjæringstidspunkt?.id !== periode.id ||
        !kanAnnullere(erBeslutterMedTilgang, erReadonly, periode.utbetaling)
    ) {
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
