import React, { useEffect, useState } from 'react';

import { Loader } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { OppdaterPersonDocument, OpprettAbonnementDocument } from '@io/graphql';
import { useHåndterOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useCurrentPerson } from '@state/person';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { SpeilError } from '@utils/error';

const oppdatererPersondataToastKey = 'updating';

class PersonoppdateringAlert extends SpeilError {
    static key = 'personoppdatering';
    name = PersonoppdateringAlert.key;
}

const oppdatererPersondataMessage = () => (
    <>
        Oppdaterer persondata <Loader size="xsmall" variant="inverted" />
    </>
);

export const useOppdaterPersondata = (): [forespørPersonoppdatering: () => Promise<void>] => {
    const person = useCurrentPerson() as FetchedPerson;
    const addVarsel = useAddVarsel();
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const setPollingRate = useSetOpptegnelserPollingRate();
    const removeVarsel = useRemoveVarsel();
    const [polling, setPolling] = useState(false);
    const [oppdaterPerson] = useMutation(OppdaterPersonDocument);
    const [opprettAbonnement] = useMutation(OpprettAbonnementDocument);

    useHåndterOpptegnelser((opptegnelse) => {
        if (polling) {
            if (opptegnelse.type !== 'PERSONDATA_OPPDATERT') {
                setPollingRate(1000);
                return;
            }

            removeToast(oppdatererPersondataToastKey);
            addToast({ key: 'doneUpdating', message: 'Persondata oppdatert', timeToLiveMs: 3000 });
            setPolling(false);
        }
    });

    useEffect(() => {
        return () => {
            removeToast(oppdatererPersondataToastKey);
        };
    }, []);

    const forespørPersonoppdatering = async (): Promise<void> => {
        addToast({ key: oppdatererPersondataToastKey, message: oppdatererPersondataMessage() });
        removeVarsel(PersonoppdateringAlert.key);
        return void oppdaterPerson({
            variables: { fodselsnummer: person.fodselsnummer },
            onCompleted: () => {
                setPolling(true);
                opprettAbonnement({
                    variables: { personidentifikator: person.aktorId },
                    onCompleted: () => setPollingRate(1000),
                });
            },
            onError: () => {
                addVarsel(
                    new PersonoppdateringAlert('Personoppdatering feilet. Prøv igjen om litt.', { severity: 'error' }),
                );
            },
        });
    };

    return [forespørPersonoppdatering];
};
