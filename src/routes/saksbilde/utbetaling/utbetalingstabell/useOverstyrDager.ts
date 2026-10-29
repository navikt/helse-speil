import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { useFjernOppdatererToast } from '@hooks/useFjernOppdatererToast';
import {
    getGetGraderteAndreYtelserForPersonQueryKey,
    usePostGraderteAndreYtelser,
} from '@io/rest/generated/graderte-andre-ytelser/graderte-andre-ytelser';
import { usePostOverstyrTidslinje } from '@io/rest/generated/overstyringer/overstyringer';
import {
    ApiHttpProblemDetailsApiPostGraderteAndreYtelserErrorCode,
    ApiPeriode,
    ApiPostGraderteAndreYtelserErrorCode,
} from '@io/rest/generated/spesialist.schemas';
import { useGraderteAndreYtelser } from '@state/graderteAndreYtelser';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import {
    visningenErOppdatertToast,
    visningenErOppdatertToastKey,
    visningenOppdateresToast,
} from '@state/oppdateringToasts';
import { erNyOppgaveEvent, erPersondataOppdatertEvent, useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { useVisningenOppdateresState } from '@state/visningenOppdateres';
import { useQueryClient } from '@tanstack/react-query';
import { Lovhjemmel, OverstyrtDagDTO, OverstyrtDagtype } from '@typer/overstyring';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { tilGraderteAndreYtelserRequest } from './graderteAndreYtelserRequest';

type UsePostOverstyringResult = {
    postOverstyring: (
        dager: Utbetalingstabelldag[],
        overstyrteDager: Utbetalingstabelldag[],
        begrunnelse: string,
        periode: ApiPeriode,
        inntektsforhold: Inntektsforhold,
        callback?: () => void,
    ) => Promise<void>;
    error?: string;
    done: boolean;
};

export const useOverstyrDager = (): UsePostOverstyringResult => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const queryClient = useQueryClient();
    const graderteAndreYtelser = useGraderteAndreYtelser();
    const {
        mutateAsync: endreGraderteAndreYtelser,
        error: graderteAndreYtelserError,
        reset: resetGraderteAndreYtelserMutation,
    } = usePostGraderteAndreYtelser({
        mutation: {
            onSettled: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetGraderteAndreYtelserForPersonQueryKey(personPseudoId!),
                });
            },
        },
    });
    const {
        mutateAsync: overstyrTidslinje,
        error: overstyrTidslinjeError,
        reset: resetOverstyrTidslinjeMutation,
    } = usePostOverstyrTidslinje();
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
        periode: ApiPeriode,
        inntektsforhold: Inntektsforhold,
        callback?: () => void,
    ): Promise<void> => {
        resetGraderteAndreYtelserMutation();
        resetOverstyrTidslinjeMutation();
        setDone(false);
        addToast(visningenOppdateresToast({}));
        setVisningenOppdateres(true);

        return lagreGraderteAndreYtelser(overstyrteDager, begrunnelse, periode, inntektsforhold)
            .then(() => lagreTidslinje(dager, overstyrteDager, begrunnelse, periode))
            .then(() => callback?.())
            .catch(() => Promise.resolve());
    };

    async function lagreGraderteAndreYtelser(
        overstyrteDager: Utbetalingstabelldag[],
        begrunnelse: string,
        periode: ApiPeriode,
        inntektsforhold: Inntektsforhold,
    ): Promise<void> {
        if (!overstyrteDager.some((dag) => dag.gradertAnnenYtelse)) return;
        await endreGraderteAndreYtelser({
            pseudoId: personPseudoId!,
            data: tilGraderteAndreYtelserRequest({
                overstyrteDager,
                inntektsforhold,
                graderteAndreYtelser,
                behandlingId: periode.behandlingId,
                notatTilBeslutter: begrunnelse,
            }),
        });
    }

    async function lagreTidslinje(
        dager: Utbetalingstabelldag[],
        overstyrteDager: Utbetalingstabelldag[],
        begrunnelse: string,
        periode: ApiPeriode,
    ): Promise<void> {
        const andreOverstyrteDager = overstyrteDager.filter((dag) => !dag.gradertAnnenYtelse);
        if (andreOverstyrteDager.length === 0) return;
        await overstyrTidslinje({
            vedtaksperiodeId: periode.vedtaksperiodeId,
            data: { begrunnelse, dager: tilOverstyrteDager(dager, andreOverstyrteDager) },
        });
    }

    return {
        postOverstyring: overstyrDager,
        error: opprettFeilmelding(graderteAndreYtelserError, overstyrTidslinjeError),
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

function opprettFeilmelding(
    graderteAndreYtelserError: { info?: ApiHttpProblemDetailsApiPostGraderteAndreYtelserErrorCode } | null,
    overstyrTidslinjeError: Error | null,
): string | undefined {
    if (graderteAndreYtelserError?.info?.code === ApiPostGraderteAndreYtelserErrorCode.UTDATERT_TILSTAND) {
        return 'Graderte andre ytelser er endret siden du åpnet saken. Se over endringene og prøv igjen.';
    }
    if (graderteAndreYtelserError || overstyrTidslinjeError) {
        return 'Feil under sending av overstyring. Prøv igjen senere.';
    }
    return undefined;
}
