import { Dag, Dagtype, Person } from 'internal-types';
import { useEffect, useState } from 'react';

import { postAbonnerPåAktør, postOverstyring } from '../../../../io/http';
import { OverstyrtDagDTO } from '../../../../io/types';
import { Tidslinjeperiode } from '../../../../modell/UtbetalingshistorikkElement';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '../../../../state/opptegnelser';
import { usePerson } from '../../../../state/person';
import { useAktivPeriode } from '../../../../state/tidslinje';
import { useAddToast, useRemoveToast } from '../../../../state/toasts';

import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from './kalkuleringstoasts';

type OverstyrtDagtype = 'Sykedag' | 'Feriedag' | 'Egenmeldingsdag' | 'Permisjonsdag' | Dagtype;

const tilOverstyrtDagtype = (type: Dagtype): OverstyrtDagtype => {
    switch (type) {
        case Dagtype.Syk:
            return 'Sykedag';
        case Dagtype.Ferie:
            return 'Feriedag';
        case Dagtype.Permisjon:
            return 'Permisjonsdag';
        case Dagtype.Egenmelding:
            return 'Egenmeldingsdag';
        default:
            return type;
    }
};

const tilOverstyrteDager = (dager: Dag[]): OverstyrtDagDTO[] =>
    dager.map((dag) => ({
        dato: dag.dato.format('YYYY-MM-DD'),
        type: tilOverstyrtDagtype(dag.type),
        grad: dag.gradering,
    }));

type UsePostOverstyringState = 'loading' | 'hasValue' | 'hasError' | 'initial' | 'timedOut';

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
            setState('initial');
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

    const _postOvestyring = (dager: Dag[], begrunnelse: string, callback?: () => void) => {
        const overstyring = {
            aktørId: person.aktørId,
            fødselsnummer: person.fødselsnummer,
            organisasjonsnummer: periode.organisasjonsnummer,
            dager: tilOverstyrteDager(dager),
            begrunnelse: begrunnelse,
        };

        postOverstyring(overstyring)
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
        postOverstyring: _postOvestyring,
        state: state,
        error: error,
    };
};
