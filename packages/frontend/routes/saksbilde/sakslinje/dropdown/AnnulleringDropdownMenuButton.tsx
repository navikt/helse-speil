import React, { useContext, useState } from 'react';

import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { Utbetaling, Utbetalingstatus } from '@io/graphql';
import { DropdownButton, DropdownContext } from '@components/dropdown';
import { isArbeidsgiver, isBeregnetPeriode, isPerson } from '@utils/typeguards';
import { annulleringerEnabled } from '@utils/featureToggles';

import { Annulleringsmodal } from '../annullering/Annulleringsmodal';
import { useArbeidsgiveroppdrag } from '../../utbetalingshistorikk/state';
import { useErBeslutteroppgaveOgHarTilgang } from '@hooks/useErBeslutteroppgaveOgHarTilgang';

interface AnnullerButtonWithContentProps {
    utbetaling: Utbetaling;
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
}

const AnnullerButtonWithContent: React.VFC<AnnullerButtonWithContentProps> = ({
    utbetaling,
    aktørId,
    fødselsnummer,
    organisasjonsnummer,
}) => {
    const [showModal, setShowModal] = useState(false);

    const oppdrag = useArbeidsgiveroppdrag(fødselsnummer, utbetaling.arbeidsgiverFagsystemId);

    const { lukk } = useContext(DropdownContext);

    if (!oppdrag?.arbeidsgiveroppdrag || utbetaling.status === Utbetalingstatus.Annullert) {
        return null;
    }

    return (
        <>
            <DropdownButton onClick={() => setShowModal(true)}>Annuller</DropdownButton>
            {showModal && (
                <Annulleringsmodal
                    fødselsnummer={fødselsnummer}
                    aktørId={aktørId}
                    organisasjonsnummer={organisasjonsnummer}
                    fagsystemId={utbetaling.arbeidsgiverFagsystemId}
                    linjer={oppdrag.arbeidsgiveroppdrag.linjer}
                    onClose={() => {
                        setShowModal(false);
                        lukk();
                    }}
                />
            )}
        </>
    );
};

const AnnullerButtonContainer: React.VFC = () => {
    const person = useCurrentPerson();
    const arbeidsgiver = useCurrentArbeidsgiver();
    const period = useActivePeriod();
    const erBeslutteroppgaveOgHarTilgang = useErBeslutteroppgaveOgHarTilgang();

    if (
        !annulleringerEnabled ||
        !isPerson(person) ||
        !isArbeidsgiver(arbeidsgiver) ||
        !isBeregnetPeriode(period) ||
        erBeslutteroppgaveOgHarTilgang
    ) {
        return null;
    } else {
        return (
            <AnnullerButtonWithContent
                utbetaling={period.utbetaling}
                aktørId={person.aktorId}
                fødselsnummer={person.fodselsnummer}
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
            />
        );
    }
};

export const AnnullerButton: React.VFC = () => {
    return (
        <React.Suspense fallback={null}>
            <AnnullerButtonContainer />
        </React.Suspense>
    );
};

export default AnnullerButton;
