import dayjs from 'dayjs';
import { useState } from 'react';

import { useFjernOppdatererToast } from '@hooks/useFjernOppdatererToast';
import { usePostOverstyrTidslinje } from '@io/rest/generated/overstyringer/overstyringer';
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

type UsePostOverstyringResult = {
    postOverstyring: (
        dager: Utbetalingstabelldag[],
        overstyrteDager: Utbetalingstabelldag[],
        begrunnelse: string,
        vedtaksperiodeId: string,
        callback?: () => void,
    ) => Promise<void>;
    error?: string;
    done: boolean;
};

export const useOverstyrDager = (): UsePostOverstyringResult => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const { mutateAsync: overstyrTidslinje, error: overstyrTidslinjeError } = usePostOverstyrTidslinje();
    const [visningenOppdateres, setVisningenOppdateres] = useVisningenOppdateresState();
    const [done, setDone] = useState(false);

    useHåndterNyttEvent((event) => {
        if (erNyOppgaveEvent(event) && visningenOppdateres) {
            addToast(visningenErOppdatertToast({ callback: () => removeToast(visningenErOppdatertToastKey) }));
            setVisningenOppdateres(false);
            setDone(true);
        } else if (erPersondataOppdatertEvent(event) && visningenOppdateres) {
            addToast(visningenErOppdatertToast({ callback: () => removeToast(visningenErOppdatertToastKey) }));
            setVisningenOppdateres(false);
            setDone(true);
        }
    });

    useFjernOppdatererToast(visningenOppdateres);

    const overstyrDager = async (
        dager: Utbetalingstabelldag[],
        overstyrteDager: Utbetalingstabelldag[],
        begrunnelse: string,
        vedtaksperiodeId: string,
        callback?: () => void,
    ): Promise<void> => {
        setDone(false);
        addToast(visningenOppdateresToast({}));
        setVisningenOppdateres(true);

        return overstyrTidslinje({
            vedtaksperiodeId,
            data: {
                begrunnelse,
                dager: tilOverstyrteDager(dager, overstyrteDager),
            },
        })
            .then(() => {
                callback?.();
            })
            .catch(() => Promise.resolve());
    };

    return {
        postOverstyring: overstyrDager,
        error: overstyrTidslinjeError ? 'Feil under sending av overstyring. Prøv igjen senere.' : undefined,
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
