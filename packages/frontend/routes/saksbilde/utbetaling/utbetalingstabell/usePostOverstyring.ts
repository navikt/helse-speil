import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import type { Arbeidsgiver } from '@io/graphql';
import type { OverstyrtDagDTO } from '@io/http';
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

import { Subsumsjon } from '../../sykepengegrunnlag/overstyring/overstyring.types';

const tilOverstyrteDager = (
    dager: Array<Utbetalingstabelldag>,
    overstyrteDager: Array<Utbetalingstabelldag>,
): OverstyrtDagDTO[] =>
    overstyrteDager.map((overstyrtDag) => {
        const fraDag = dager.find((fraDag) => fraDag.dato === overstyrtDag.dato);
        if (fraDag === undefined) throw Error(`Finner ikke fraDag som matcher overstyrtDag ${overstyrtDag.dato}.`);
        if (overstyrtDag.dag.overstyrtDagtype === undefined || fraDag.dag.overstyrtDagtype === undefined)
            throw Error(`Dag med undefined overstyrtDagtype kan ikke overstyres.`);
        return {
            dato: dayjs(overstyrtDag.dato).format('YYYY-MM-DD'),
            type: overstyrtDag.dag.overstyrtDagtype,
            fraType: fraDag.dag.overstyrtDagtype,
            grad: overstyrtDag.grad ?? undefined,
            fraGrad: fraDag.grad ?? undefined,
            subsumsjon: finnSubsumsjonParagrafLeddBokstavForDagoverstyring(fraDag, overstyrtDag),
        };
    });

const finnSubsumsjonParagrafLeddBokstavForDagoverstyring = (
    fraDag: Utbetalingstabelldag,
    overstyrtDag: Utbetalingstabelldag,
): Subsumsjon | undefined => {
    if (fraDag.erForeldet && overstyrtDag.dag.overstyrtDagtype === 'Sykedag') {
        return {
            paragraf: '22-13',
            ledd: '7',
        };
    }
    return undefined;
};

type UsePostOverstyringState = 'loading' | 'hasValue' | 'hasError' | 'initial' | 'timedOut' | 'done';

type UsePostOverstyringResult = {
    postOverstyring: (
        dager: Array<Utbetalingstabelldag>,
        overstyrteDager: Array<Utbetalingstabelldag>,
        begrunnelse: string,
        callback?: () => void,
    ) => Promise<void>;
    state: UsePostOverstyringState;
    error?: string;
};

export const usePostOverstyring = (): UsePostOverstyringResult => {
    const person = useCurrentPerson() as FetchedPerson;
    const personFørRefetchRef = useRef(person);
    const arbeidsgiver = useCurrentArbeidsgiver() as Arbeidsgiver;
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
        }
        if (opptegnelser && person !== personFørRefetchRef.current) setState('done');
    }, [opptegnelser, person, personFørRefetchRef]);

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
        dager: Array<Utbetalingstabelldag>,
        overstyrteDager: Array<Utbetalingstabelldag>,
        begrunnelse: string,
        callback?: () => void,
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
                personFørRefetchRef.current = person;
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
