import { useEffect, useState } from 'react';

import { postAbonnerPåAktør, postOverstyrteDager } from '../../../../io/http';
import { OverstyrtDagDTO } from '../../../../io/types';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '../../../../state/kalkuleringstoasts';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '../../../../state/opptegnelser';
import { usePerson } from '../../../../state/person';
import { useAktivPeriode } from '../../../../state/tidslinje';
import { useAddToast, useRemoveToast } from '../../../../state/toasts';

type OverstyrtDagtype = 'Sykedag' | 'Feriedag' | 'Egenmeldingsdag' | 'Permisjonsdag' | 'Avvist';

const tilOverstyrtDagtype = (type: Dag['type']): OverstyrtDagtype => {
    switch (type) {
        case 'Syk':
            return 'Sykedag';
        case 'Ferie':
            return 'Feriedag';
        case 'Permisjon':
            return 'Permisjonsdag';
        case 'Egenmelding':
            return 'Egenmeldingsdag';
        case 'Avslått':
            return 'Avvist';
        default:
            throw Error(`Dag med type ${type} kan ikke overstyres.`);
    }
};

const tilOverstyrteDager = (dager: Dag[]): OverstyrtDagDTO[] =>
    dager.map((dag) => ({
        dato: dag.dato.format('YYYY-MM-DD'),
        type: tilOverstyrtDagtype(dag.type),
        grad: dag.gradering,
    }));

type UsePostOverstyringState = 'loading' | 'hasValue' | 'hasError' | 'initial' | 'timedOut' | 'done';

type UsePostOverstyringResult = {
    postOverstyring: (dager: Dag[], begrunnelse: string, callback?: () => void) => void;
    state: UsePostOverstyringState;
    error?: string;
};

export const usePostOverstyring = (): UsePostOverstyringResult => {
    const person = usePerson() as Person;
    const periode = useAktivPeriode() as Tidslinjeperiode;
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const opptegnelser = useOpptegnelser();
    const setPollingRate = useSetOpptegnelserPollingRate();
    const [state, setState] = useState<UsePostOverstyringState>('initial');
    const [error, setError] = useState<string>();
    const [calculating, setCalculating] = useState(false);

    useEffect(() => {
        if (opptegnelser && calculating) {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            setCalculating(false);
            setState('done');
        }
    }, [opptegnelser]);

    useEffect(() => {
        const timeout: NodeJS.Timeout | number | null = calculating
            ? setTimeout(() => {
                  setState('timedOut');
              }, 10000)
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

    const _postOverstyring = (dager: Dag[], begrunnelse: string, callback?: () => void) => {
        const overstyring = {
            aktørId: person.aktørId,
            fødselsnummer: person.fødselsnummer,
            organisasjonsnummer: periode.organisasjonsnummer,
            dager: tilOverstyrteDager(dager),
            begrunnelse: begrunnelse,
        };

        postOverstyrteDager(overstyring)
            .then(() => {
                setState('hasValue');
                addToast(kalkulererToast({}));
                setCalculating(true);
                callback?.();
                postAbonnerPåAktør(person.aktørId).then(() => setPollingRate(1000));
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
