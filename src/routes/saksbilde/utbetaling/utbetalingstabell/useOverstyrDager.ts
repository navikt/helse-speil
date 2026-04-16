import dayjs from 'dayjs';
import { useState } from 'react';

import { FetchResult, useMutation } from '@apollo/client';
import { useFjernOppdatererToast } from '@hooks/useFjernOppdatererToast';
import { OverstyrDagerMutationDocument, OverstyrDagerMutationMutation, PersonFragment } from '@io/graphql';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import {
    visningenErOppdatertToast,
    visningenErOppdatertToastKey,
    visningenOppdateresToast,
} from '@state/oppdateringToasts';
import { erNyOppgaveEvent, erPersondataOppdatertEvent, useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { useVisningenOppdateresState } from '@state/visningenOppdateres';
import { Lovhjemmel, OverstyrtDagDTO, OverstyrtDagtype } from '@typer/overstyring';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { isArbeidsgiver } from '@utils/typeguards';

type UsePostOverstyringResult = {
    postOverstyring: (
        dager: Utbetalingstabelldag[],
        overstyrteDager: Utbetalingstabelldag[],
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
    inntektsforhold: Inntektsforhold,
): UsePostOverstyringResult => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const [overstyrMutation, { error: overstyringError }] = useMutation(OverstyrDagerMutationDocument);
    const [visningenOppdateres, setVisningenOppdateres] = useVisningenOppdateresState();
    const [timedOut, setTimedOut] = useState(false);
    const [done, setDone] = useState(false);

    useHåndterNyttEvent((event) => {
        if (erNyOppgaveEvent(event) && visningenOppdateres) {
            addToast(visningenErOppdatertToast({ callback: () => removeToast(visningenErOppdatertToastKey) }));
            setVisningenOppdateres(false);
            setTimedOut(false);
            setDone(true);
        } else if (erPersondataOppdatertEvent(event) && visningenOppdateres) {
            addToast(visningenErOppdatertToast({ callback: () => removeToast(visningenErOppdatertToastKey) }));
            setVisningenOppdateres(false);
            setTimedOut(false);
            setDone(true);
        }
    });

    useFjernOppdatererToast(visningenOppdateres, () => setTimedOut(true));

    const overstyrDager = async (
        dager: Utbetalingstabelldag[],
        overstyrteDager: Utbetalingstabelldag[],
        begrunnelse: string,
        vedtaksperiodeId: string,
        callback?: () => void,
    ): Promise<void | FetchResult<OverstyrDagerMutationMutation>> => {
        setDone(false);
        addToast(visningenOppdateresToast({}));
        setVisningenOppdateres(true);
        return overstyrMutation({
            variables: {
                overstyring: {
                    aktorId: person.aktorId,
                    fodselsnummer: person.fodselsnummer,
                    organisasjonsnummer: isArbeidsgiver(inntektsforhold)
                        ? inntektsforhold.organisasjonsnummer
                        : 'SELVSTENDIG',
                    dager: tilOverstyrteDager(dager, overstyrteDager),
                    begrunnelse: begrunnelse,
                    vedtaksperiodeId,
                },
            },
            onCompleted: () => {
                callback?.();
            },
        }).catch(() => Promise.resolve());
    };

    return {
        postOverstyring: overstyrDager,
        error: overstyringError && 'Feil under sending av overstyring. Prøv igjen senere.',
        setTimedOut,
        timedOut,
        done,
    };
};

export const tilOverstyrteDager = (
    dager: Utbetalingstabelldag[],
    overstyrteDager: Utbetalingstabelldag[],
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
