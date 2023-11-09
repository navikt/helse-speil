import { useEffect, useState } from 'react';
import { useResetRecoilState } from 'recoil';

import { FetchResult, useMutation } from '@apollo/client';
import {
    OverstyrInntektOgRefusjonMutationDocument,
    OverstyrInntektOgRefusjonMutationMutation,
    OverstyringArbeidsgiverInput,
} from '@io/graphql';
import { OverstyrtInntektOgRefusjonDTO, postAbonnerPåAktør } from '@io/http';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { erOpptegnelseForNyOppgave, useHåndterOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { inntektOgRefusjonState } from '@state/overstyring';
import { useLazyFetchPersonQuery } from '@state/person';
import { useAddToast, useRemoveToast } from '@state/toasts';

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
    const slettLokaleOverstyringer = useResetRecoilState(inntektOgRefusjonState);
    const [calculating, setCalculating] = useState(false);
    const [timedOut, setTimedOut] = useState(false);
    const [hentPerson] = useLazyFetchPersonQuery();

    const [overstyrMutation, { loading, error }] = useMutation(OverstyrInntektOgRefusjonMutationDocument);

    useHåndterOpptegnelser((opptegnelse) => {
        const erFerdigOpptegnelse = erOpptegnelseForNyOppgave(opptegnelse);
        if (erFerdigOpptegnelse && calculating) {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            setCalculating(false);
            slettLokaleOverstyringer();
            void hentPerson({ fetchPolicy: 'network-only' });
        }
    });

    useEffect(() => {
        const timeout: NodeJS.Timeout | number | null = calculating
            ? setTimeout(() => {
                  setTimedOut(true);
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
                                arbeidsgiver.subsumsjon !== undefined
                                    ? {
                                          bokstav: arbeidsgiver.subsumsjon.bokstav,
                                          ledd: arbeidsgiver.subsumsjon.ledd,
                                          paragraf: arbeidsgiver.subsumsjon.paragraf,
                                          lovverk: arbeidsgiver.subsumsjon.lovverk,
                                          lovverksversjon: arbeidsgiver.subsumsjon.lovverksversjon,
                                      }
                                    : undefined,
                        }),
                    ),
                    fodselsnummer: overstyrtInntekt.fødselsnummer,
                    skjaringstidspunkt: overstyrtInntekt.skjæringstidspunkt,
                },
            },
            onCompleted: () => {
                setCalculating(true);
                addToast(kalkulererToast({}));
                postAbonnerPåAktør(overstyrtInntekt.aktørId).then(() => setPollingRate(1000));
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
