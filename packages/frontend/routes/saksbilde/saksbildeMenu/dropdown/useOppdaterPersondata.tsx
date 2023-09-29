import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { Loader } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { OppdaterPersonDocument } from '@io/graphql';
import { postAbonnerPåAktør } from '@io/http';
import { nyesteOpptegnelserState, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useCurrentPerson } from '@state/person';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { SpeilError } from '@utils/error';

const oppdatererPersondataToastKey = 'updating';

class PersonoppdateringAlert extends SpeilError {
    static key = 'personoppdatering';
    name = PersonoppdateringAlert.key;
}

const oppdatererPersondataMessage = () => {
    return (
        <>
            Oppdaterer persondata <Loader size="xsmall" variant="inverted" />
        </>
    );
};

export const useOppdaterPersondata = (): [forespørPersonoppdatering: () => Promise<void>] => {
    const person = useCurrentPerson() as FetchedPerson;
    const addVarsel = useAddVarsel();
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const setPollingRate = useSetOpptegnelserPollingRate();
    const removeVarsel = useRemoveVarsel();
    const opptegnelser = useRecoilValue(nyesteOpptegnelserState);
    const [polling, setPolling] = useState(false);
    const [oppdaterPerson] = useMutation(OppdaterPersonDocument);

    useEffect(() => {
        if (opptegnelser && polling) {
            const finnesOpptegnelseMedRiktigType = opptegnelser.find(
                (opptegnelse) => opptegnelse.type === 'PERSONDATA_OPPDATERT',
            );

            if (!finnesOpptegnelseMedRiktigType) {
                setPollingRate(1000);
                return;
            }
            removeToast(oppdatererPersondataToastKey);
            addToast({ key: 'doneUpdating', message: 'Persondata oppdatert', timeToLiveMs: 3000 });
            setPolling(false);
        }
    }, [opptegnelser]);

    useEffect(() => {
        return () => {
            removeToast(oppdatererPersondataToastKey);
        };
    }, []);

    const forespørPersonoppdatering = async (): Promise<void> => {
        removeVarsel(PersonoppdateringAlert.key);
        return oppdaterPerson({ variables: { fodselsnummer: person.fodselsnummer } })
            .then(() => {
                addToast({ key: oppdatererPersondataToastKey, message: oppdatererPersondataMessage() });
                setPolling(true);
                postAbonnerPåAktør(person.aktorId).then(() => setPollingRate(1000));
            })
            .catch(() => {
                addVarsel(
                    new PersonoppdateringAlert('Personoppdatering feilet. Prøv igjen om litt.', { severity: 'error' }),
                );
            });
    };

    return [forespørPersonoppdatering];
};
