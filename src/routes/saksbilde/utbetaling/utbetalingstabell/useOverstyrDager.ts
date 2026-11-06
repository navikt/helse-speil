import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { useFjernOppdatererToast } from '@hooks/useFjernOppdatererToast';
import {
    PostGraderteAndreYtelserMutationError,
    getGetGraderteAndreYtelserQueryKey,
    usePostGraderteAndreYtelser,
} from '@io/rest/generated/andre-ytelser/graderte-andre-ytelser/graderte-andre-ytelser';
import { usePostOverstyrTidslinje } from '@io/rest/generated/overstyringer/overstyringer';
import { ApiPeriode } from '@io/rest/generated/spesialist.schemas';
import { useGraderteAndreYtelser } from '@state/graderteAndreYtelser';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import {
    visningenErOppdatertToast,
    visningenErOppdatertToastKey,
    visningenOppdateresToast,
    visningenOppdateresToastKey,
} from '@state/oppdateringToasts';
import { erNyOppgaveEvent, erPersondataOppdatertEvent, useHåndterNyttEvent } from '@state/serverSentEvents';
import { ToastObject, useAddToast, useRemoveToast } from '@state/toasts';
import { useVisningenOppdateresState } from '@state/visningenOppdateres';
import { useQueryClient } from '@tanstack/react-query';
import { Lovhjemmel, OverstyrtDagDTO, OverstyrtDagtype } from '@typer/overstyring';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { generateId } from '@utils/generateId';

import { erEndretITidslinjen } from './erReellEndring';
import { tilGraderteAndreYtelserRequest } from './graderteAndreYtelserRequest';
import { somGraderteAndreYtelserFeilmelding } from './graderteAndreYtelserUtils';

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
                    queryKey: getGetGraderteAndreYtelserQueryKey(personPseudoId!),
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
            .then(async (fordelingeneVarAlleredeLagret) => {
                const tidslinjenErLagret = await lagreTidslinje(dager, overstyrteDager, begrunnelse, periode);
                if (fordelingeneVarAlleredeLagret && !tidslinjenErLagret) {
                    fjernVisningenOppdateres();
                    setDone(true);
                    addToast(fordelingeneErAlleredeLagretToast);
                }
            })
            .then(() => callback?.())
            .catch(fjernVisningenOppdateres);
    };

    function fjernVisningenOppdateres() {
        setVisningenOppdateres(false);
        removeToast(visningenOppdateresToastKey);
    }

    // Svarer sp-andre-ytelser med samme versjon som Speil sendte, ble ingenting endret, og Spleis revurderer ikke
    async function lagreGraderteAndreYtelser(
        overstyrteDager: Utbetalingstabelldag[],
        begrunnelse: string,
        periode: ApiPeriode,
        inntektsforhold: Inntektsforhold,
    ): Promise<boolean> {
        const request = tilGraderteAndreYtelserRequest({
            overstyrteDager,
            inntektsforhold,
            graderteAndreYtelser,
            behandlingId: periode.behandlingId,
            begrunnelse,
        });
        if (request.dager.length === 0) return false;
        const { versjon } = await endreGraderteAndreYtelser({ personPseudoId: personPseudoId!, data: request });
        return versjon === request.versjon;
    }

    async function lagreTidslinje(
        dager: Utbetalingstabelldag[],
        overstyrteDager: Utbetalingstabelldag[],
        begrunnelse: string,
        periode: ApiPeriode,
    ): Promise<boolean> {
        const andreOverstyrteDager = overstyrteDager.filter((dag) => skalOverstyreTidslinjen(dag, dager));
        if (andreOverstyrteDager.length === 0) return false;
        await overstyrTidslinje({
            vedtaksperiodeId: periode.vedtaksperiodeId,
            data: { begrunnelse, dager: tilOverstyrteDager(dager, andreOverstyrteDager) },
        });
        return true;
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
    graderteAndreYtelserError: PostGraderteAndreYtelserMutationError | null,
    overstyrTidslinjeError: Error | null,
): string | undefined {
    if (graderteAndreYtelserError)
        return somGraderteAndreYtelserFeilmelding(graderteAndreYtelserError) ?? generellFeilmelding;
    if (overstyrTidslinjeError) return generellFeilmelding;
    return undefined;
}

const generellFeilmelding = 'Feil under sending av overstyring. Prøv igjen senere.';

const fordelingeneErAlleredeLagretToast: ToastObject = {
    key: generateId(),
    message: 'Fordelingene er allerede lagret',
    timeToLiveMs: 5000,
};

// Graderte andre ytelser lagres bare i sp-andre-ytelser. En dag som bare mister fordelingen, er uendret i Spleis.
function skalOverstyreTidslinjen(dag: Utbetalingstabelldag, dager: Utbetalingstabelldag[]): boolean {
    if (dag.gradertAnnenYtelse) return false;
    const fraDag = dager.find((it) => it.dato === dag.dato);
    return fraDag === undefined || dag.erNyDag === true || erEndretITidslinjen(dag, fraDag);
}
