import { Lovhjemmel } from '../../sykepengegrunnlag/overstyring/overstyring.types';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import { FetchResult, useMutation } from '@apollo/client';
import { Arbeidsgiver, OverstyrDagerMutationDocument, OverstyrDagerMutationMutation } from '@io/graphql';
import { OverstyrtDagDTO, OverstyrtDagtype, postAbonnerPåAktør } from '@io/http';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { erOpptegnelseForNyOppgave, useHåndterOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useCurrentPerson } from '@state/person';
import { useAddToast, useRemoveToast } from '@state/toasts';

type UsePostOverstyringState = 'loading' | 'hasValue' | 'hasError' | 'initial' | 'timedOut' | 'done';

type UsePostOverstyringResult = {
    postOverstyring: (
        dager: Array<Utbetalingstabelldag>,
        overstyrteDager: Array<Utbetalingstabelldag>,
        begrunnelse: string,
        vedtaksperiodeId: string,
        callback?: () => void,
    ) => Promise<void | FetchResult<OverstyrDagerMutationMutation>>;
    state: UsePostOverstyringState;
    error?: string;
};

export const useOverstyrDager = (): UsePostOverstyringResult => {
    const person = useCurrentPerson();
    const arbeidsgiver = useCurrentArbeidsgiver() as Arbeidsgiver;
    const personFørRefetchRef = useRef(person);
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const setPollingRate = useSetOpptegnelserPollingRate();
    const [overstyrMutation, { error }] = useMutation(OverstyrDagerMutationDocument);
    const [calculating, setCalculating] = useState(false);
    const [state, setState] = useState<UsePostOverstyringState>('initial');

    useHåndterOpptegnelser((opptegnelse) => {
        if (erOpptegnelseForNyOppgave(opptegnelse) && calculating) {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            setCalculating(false);
        }
    });

    useEffect(() => {
        if (person !== personFørRefetchRef.current) {
            setState('done');
        }
    }, [person]);

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

    const overstyrDager = async (
        dager: Array<Utbetalingstabelldag>,
        overstyrteDager: Array<Utbetalingstabelldag>,
        begrunnelse: string,
        vedtaksperiodeId: string,
        callback?: () => void,
    ): Promise<void | FetchResult<OverstyrDagerMutationMutation>> =>
        overstyrMutation({
            variables: {
                overstyring: {
                    aktorId: person.aktorId,
                    fodselsnummer: person.fodselsnummer,
                    organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                    dager: tilOverstyrteDager(dager, overstyrteDager),
                    begrunnelse: begrunnelse,
                    vedtaksperiodeId,
                },
            },
            onCompleted: () => {
                setState('hasValue');
                personFørRefetchRef.current = person;
                addToast(kalkulererToast({}));
                setCalculating(true);
                callback?.();
                postAbonnerPåAktør(person.aktorId).then(() => setPollingRate(1000));
            },
            onError: () => setState('hasError'),
        });
    return {
        postOverstyring: overstyrDager,
        state: state,
        error: error && 'Feil under sending av overstyring. Prøv igjen senere.',
    };
};

export const tilOverstyrteDager = (
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
            lovhjemmel: finnLovhjemmelForDagoverstyring(fraDag.erForeldet, overstyrtDag.dag.overstyrtDagtype),
        };
    });

const finnLovhjemmelForDagoverstyring = (
    fraDagForeldet: boolean,
    overstyrtDagtype: OverstyrtDagtype,
): Lovhjemmel | undefined => {
    if (fraDagForeldet && overstyrtDagtype === 'Sykedag') {
        return {
            paragraf: '22-13',
            ledd: '7',
            lovverk: 'folketrygdloven',
            lovverksversjon: '2019-06-21',
        };
    }
    return undefined;
};
