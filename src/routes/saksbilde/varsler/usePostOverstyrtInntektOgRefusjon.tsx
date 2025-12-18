import { useState } from 'react';

import { FetchResult, useMutation } from '@apollo/client';
import { useFjernKalkulerToast } from '@hooks/useFjernKalkulererToast';
import {
    OverstyrInntektOgRefusjonMutationDocument,
    OverstyrInntektOgRefusjonMutationMutation,
    OverstyringArbeidsgiverInput,
} from '@io/graphql';
import { useCalculatingState } from '@state/calculating';
import { kalkulererFerdigToastKey, kalkulererToast, kalkuleringFerdigToast } from '@state/kalkuleringstoasts';
import { erOpptegnelseForNyOppgave, useHåndterOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useSlettLokaleOverstyringer } from '@state/overstyring';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { OverstyrtInntektOgRefusjonDTO } from '@typer/overstyring';

interface PostOverstyrtInntektOgRefusjonResponse {
    isLoading: boolean;
    error: string | undefined;
    timedOut: boolean;
    setTimedOut: (nyTimedOut: boolean) => void;
    postOverstyring: (
        overstyrtInntekt: OverstyrtInntektOgRefusjonDTO,
    ) => Promise<void | FetchResult<OverstyrInntektOgRefusjonMutationMutation>>;
}

export const usePostOverstyrtInntektOgRefusjon = (): PostOverstyrtInntektOgRefusjonResponse => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const setPollingRate = useSetOpptegnelserPollingRate();
    const resetLokaleOverstyringer = useSlettLokaleOverstyringer();
    const [calculating, setCalculating] = useCalculatingState();
    const [timedOut, setTimedOut] = useState(false);

    const [overstyrMutation, { loading, error }] = useMutation(OverstyrInntektOgRefusjonMutationDocument);

    useHåndterOpptegnelser((opptegnelse) => {
        if (erOpptegnelseForNyOppgave(opptegnelse) && calculating) {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            setCalculating(false);
            resetLokaleOverstyringer();
        }
    });

    useFjernKalkulerToast(calculating, () => setTimedOut(true));

    const overstyrInntektOgRefusjon = async (
        overstyrtInntekt: OverstyrtInntektOgRefusjonDTO,
    ): Promise<void | FetchResult<OverstyrInntektOgRefusjonMutationMutation>> =>
        overstyrMutation({
            variables: {
                overstyring: {
                    aktorId: overstyrtInntekt.aktørId,
                    arbeidsgivere: overstyrtInntekt.arbeidsgivere.map(
                        (arbeidsgiver): OverstyringArbeidsgiverInput => ({
                            begrunnelse: arbeidsgiver.begrunnelse,
                            forklaring: arbeidsgiver.forklaring,
                            fraManedligInntekt: arbeidsgiver.fraMånedligInntekt,
                            manedligInntekt: arbeidsgiver.månedligInntekt,
                            organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                            fraRefusjonsopplysninger: arbeidsgiver.fraRefusjonsopplysninger.map((refusjon) => ({
                                fom: refusjon.fom,
                                tom: refusjon.tom,
                                belop: refusjon.beløp,
                            })),
                            refusjonsopplysninger: arbeidsgiver.refusjonsopplysninger.map((refusjon) => ({
                                fom: refusjon.fom,
                                tom: refusjon.tom,
                                belop: refusjon.beløp,
                            })),
                            lovhjemmel:
                                arbeidsgiver.lovhjemmel !== undefined
                                    ? {
                                          bokstav: arbeidsgiver.lovhjemmel.bokstav,
                                          ledd: arbeidsgiver.lovhjemmel.ledd,
                                          paragraf: arbeidsgiver.lovhjemmel.paragraf,
                                          lovverk: arbeidsgiver.lovhjemmel.lovverk,
                                          lovverksversjon: arbeidsgiver.lovhjemmel.lovverksversjon,
                                      }
                                    : undefined,
                            fom: arbeidsgiver.fom ?? null,
                            tom: arbeidsgiver.tom ?? null,
                        }),
                    ),
                    fodselsnummer: overstyrtInntekt.fødselsnummer,
                    skjaringstidspunkt: overstyrtInntekt.skjæringstidspunkt,
                    vedtaksperiodeId: overstyrtInntekt.vedtaksperiodeId,
                },
            },
            onCompleted: () => {
                setCalculating(true);
                addToast(kalkulererToast({}));
                setPollingRate(1000);
            },
        }).catch(() => Promise.resolve());

    return {
        postOverstyring: overstyrInntektOgRefusjon,
        isLoading: loading || calculating,
        error: error && 'Kunne ikke overstyre inntekt og/eller refusjon. Prøv igjen senere.',
        timedOut,
        setTimedOut,
    };
};
