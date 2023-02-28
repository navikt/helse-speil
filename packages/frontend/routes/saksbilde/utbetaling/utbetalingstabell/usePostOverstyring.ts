import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import type { Arbeidsgiver } from '@io/graphql';
import type { OverstyrtDagDTO, OverstyrtDagtype } from '@io/http';
import { postAbonnerPåAktør, postOverstyrteDager } from '@io/http';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useCurrentPerson } from '@state/person';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { useAddVarsel } from '@state/varsler';
import { ErrorAlert } from '@utils/error';

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
        case 'Arbeid':
            return 'Arbeidsdag';
        default:
            throw Error(`Dag med type ${type} kan ikke overstyres.`);
    }
};

const tilOverstyrteDager = (
    dager: Array<UtbetalingstabellDag>,
    overstyrteDager: Array<UtbetalingstabellDag>
): OverstyrtDagDTO[] =>
    overstyrteDager.map((overstyrtDag) => {
        const fraDag = dager.find((fraDag) => fraDag.dato === overstyrtDag.dato);
        if (fraDag === undefined) throw Error(`Finner ikke fraDag som matcher overstyrtDag ${overstyrtDag.dato}.`);
        return {
            dato: dayjs(overstyrtDag.dato).format('YYYY-MM-DD'),
            type: tilOverstyrtDagtype(overstyrtDag.type),
            fraType: tilOverstyrtDagtype(fraDag.type),
            grad: overstyrtDag.grad ?? undefined,
            fraGrad: fraDag.grad ?? undefined,
        };
    });

type UsePostOverstyringState = 'loading' | 'hasValue' | 'hasError' | 'initial' | 'timedOut' | 'done';

type UsePostOverstyringResult = {
    postOverstyring: (
        dager: Array<UtbetalingstabellDag>,
        overstyrteDager: Array<UtbetalingstabellDag>,
        begrunnelse: string,
        callback?: () => void
    ) => Promise<void>;
    state: UsePostOverstyringState;
    error?: string;
};

export const usePostOverstyring = (): UsePostOverstyringResult => {
    const person = useCurrentPerson() as FetchedPerson;
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
                    new ErrorAlert('Revurderingen gikk ikke gjennom. Ta kontakt med support dersom du trenger hjelp.')
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

    const _postOverstyring = (
        dager: Array<UtbetalingstabellDag>,
        overstyrteDager: Array<UtbetalingstabellDag>,
        begrunnelse: string,
        callback?: () => void
    ): Promise<void> => {
        const overstyring = {
            aktørId: person.aktorId,
            fødselsnummer: person.fodselsnummer,
            organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
            dager: tilOverstyrteDager(dager, overstyrteDager),
            begrunnelse: begrunnelse,
        };

        return postOverstyrteDager(overstyring)
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
