import { useEffect, useState } from 'react';

import { FetchResult, useMutation } from '@apollo/client';
import {
    Maybe,
    OpprettAbonnementDocument,
    OverstyrInntektOgRefusjonMutationDocument,
    OverstyrInntektOgRefusjonMutationMutation,
    OverstyringArbeidsgiverInput,
} from '@io/graphql';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
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
    const [calculating, setCalculating] = useState(false);
    const [slettLokaleOverstyringer, setSlettLokaleOverstyringer] = useState(false);
    const [timedOut, setTimedOut] = useState(false);

    const [overstyrMutation, { loading, error }] = useMutation(OverstyrInntektOgRefusjonMutationDocument);
    const [opprettAbonnement] = useMutation(OpprettAbonnementDocument);

    useHåndterOpptegnelser((opptegnelse) => {
        const erFerdigOpptegnelse = erOpptegnelseForNyOppgave(opptegnelse);
        if (erFerdigOpptegnelse && calculating) {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            setCalculating(false);
            setSlettLokaleOverstyringer(true);
        }
    });

    useEffect(() => {
        if (slettLokaleOverstyringer) {
            resetLokaleOverstyringer();
            setSlettLokaleOverstyringer(false);
        }
    }, [resetLokaleOverstyringer, slettLokaleOverstyringer]);

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
                opprettAbonnement({
                    variables: { personidentifikator: overstyrtInntekt.aktørId },
                    onCompleted: () => {
                        setPollingRate(1000);
                    },
                });
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
