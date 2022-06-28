import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import type { OverstyrtDagDTO } from '@io/http';
import type { Arbeidsgiver, Person } from '@io/graphql';
import { postAbonnerPåAktør, postOverstyrteDager } from '@io/http';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useCurrentPerson } from '@state/person';
import { useAddVarsel } from '@state/varsler';
import { ErrorAlert } from '@utils/error';

type OverstyrtDagtype = 'Sykedag' | 'Feriedag' | 'Egenmeldingsdag' | 'Permisjonsdag' | 'Avvist';

const tilOverstyrtDagtype = (type: Utbetalingstabelldagtype): OverstyrtDagtype => {
    switch (type) {
        case 'Syk':
            return 'Sykedag';
        case 'Ferie':
            return 'Feriedag';
        case 'Permisjon':
            return 'Permisjonsdag';
        case 'Egenmelding':
            return 'Egenmeldingsdag';
        default:
            throw Error(`Dag med type ${type} kan ikke overstyres.`);
    }
};

const tilOverstyrteDager = (dager: Array<UtbetalingstabellDag>): OverstyrtDagDTO[] =>
    dager.map((dag) => ({
        dato: dayjs(dag.dato).format('YYYY-MM-DD'),
        type: tilOverstyrtDagtype(dag.type),
        grad: dag.grad ?? undefined,
    }));

type UsePostOverstyringState = 'loading' | 'hasValue' | 'hasError' | 'initial' | 'timedOut' | 'done';

type UsePostOverstyringResult = {
    postOverstyring: (dager: Array<UtbetalingstabellDag>, begrunnelse: string, callback?: () => void) => void;
    state: UsePostOverstyringState;
    error?: string;
};

export const usePostOverstyring = (): UsePostOverstyringResult => {
    const person = useCurrentPerson() as Person;
    const arbeidsgiver = useCurrentArbeidsgiver() as Arbeidsgiver;
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const opptegnelser = useOpptegnelser();
    const setPollingRate = useSetOpptegnelserPollingRate();
    const [state, setState] = useState<UsePostOverstyringState>('initial');
    const [error, setError] = useState<string>();
    const [calculating, setCalculating] = useState(false);
    const addVarsel = useAddVarsel();

    useEffect(() => {
        if (opptegnelser && calculating) {
            if (opptegnelser.type === 'REVURDERING_AVVIST') {
                removeToast(kalkulererFerdigToastKey);
                addVarsel(
                    new ErrorAlert('Revurderingen gikk ikke gjennom. Ta kontakt med support dersom du trenger hjelp.'),
                );
            } else {
                addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            }
            setCalculating(false);
            setState('done');
        }
    }, [opptegnelser]);

    useEffect(() => {
        const timeout: NodeJS.Timeout | number | null = calculating
            ? setTimeout(() => {
                  setState('timedOut');
              }, 15000)
            : null;
        return () => {
            !!timeout && clearTimeout(timeout);
        };
    }, [calculating]);

    useEffect(() => {
        return () => {
            calculating && removeToast(kalkulererToastKey);
        };
    }, [calculating]);

    const _postOverstyring = (dager: Array<UtbetalingstabellDag>, begrunnelse: string, callback?: () => void) => {
        const overstyring = {
            aktørId: person.aktorId,
            fødselsnummer: person.fodselsnummer,
            organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
            dager: tilOverstyrteDager(dager),
            begrunnelse: begrunnelse,
        };

        postOverstyrteDager(overstyring)
            .then(() => {
                setState('hasValue');
                addToast(kalkulererToast({}));
                setCalculating(true);
                callback?.();
                postAbonnerPåAktør(person.aktorId).then(() => setPollingRate(1000));
            })
            .catch(() => {
                setState('hasError');
                setError('Feil under sending av overstyring. Prøv igjen senere.');
            });
    };

    return {
        postOverstyring: _postOverstyring,
        state: state,
        error: error,
    };
};
