import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import { FetchResult, useMutation } from '@apollo/client';
import {
    ArbeidsgiverFragment,
    Maybe,
    OpprettAbonnementDocument,
    OverstyrDagerMutationDocument,
    OverstyrDagerMutationMutation,
    PersonFragment,
} from '@io/graphql';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { erOpptegnelseForNyOppgave, useHåndterOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { Lovhjemmel, OverstyrtDagDTO, OverstyrtDagtype } from '@typer/overstyring';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

type UsePostOverstyringResult = {
    postOverstyring: (
        dager: Array<Utbetalingstabelldag>,
        overstyrteDager: Array<Utbetalingstabelldag>,
        begrunnelse: string,
        vedtaksperiodeId: string,
        callback?: () => void,
    ) => Promise<void | FetchResult<OverstyrDagerMutationMutation>>;
    error?: string;
    setTimedOut: (value: boolean) => void;
    timedOut: boolean;
    done: boolean;
};

export const useOverstyrDager = (
    person: PersonFragment,
    arbeidsgiver: ArbeidsgiverFragment,
): UsePostOverstyringResult => {
    const personFørRefetchRef = useRef(person);
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const setPollingRate = useSetOpptegnelserPollingRate();
    const [overstyrMutation, { error: overstyringError }] = useMutation(OverstyrDagerMutationDocument);
    const [opprettAbonnement] = useMutation(OpprettAbonnementDocument);
    const [calculating, setCalculating] = useState(false);
    const [timedOut, setTimedOut] = useState(false);
    const [done, setDone] = useState(false);

    useHåndterOpptegnelser((opptegnelse) => {
        if (erOpptegnelseForNyOppgave(opptegnelse) && calculating) {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            setCalculating(false);
        }
    });

    useEffect(() => {
        if (person !== personFørRefetchRef.current) {
            setTimedOut(false);
            setDone(true);
        }
    }, [person]);

    useEffect(() => {
        if (calculating) {
            const timeout: Maybe<NodeJS.Timeout | number> = setTimeout(() => {
                setTimedOut(true);
            }, 15000);
            return () => {
                removeToast(kalkulererToastKey);
                clearTimeout(timeout);
            };
        }
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
                personFørRefetchRef.current = person;
                addToast(kalkulererToast({}));
                setCalculating(true);
                callback?.();
                void opprettAbonnement({
                    variables: { personidentifikator: person.aktorId },
                    onCompleted: () => {
                        setPollingRate(1000);
                    },
                });
            },
        }).catch(() => Promise.resolve());
    return {
        postOverstyring: overstyrDager,
        error: overstyringError && 'Feil under sending av overstyring. Prøv igjen senere.',
        setTimedOut,
        timedOut,
        done,
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
