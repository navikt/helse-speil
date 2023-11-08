import { useEffect, useState } from 'react';
import { useResetRecoilState } from 'recoil';

import { FetchResult, useMutation } from '@apollo/client';
import {
    InntektOgRefusjonOverstyringInput,
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
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { inntektOgRefusjonState } from '@state/overstyring';
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
    const opptegnelser = useOpptegnelser();
    const setPollingRate = useSetOpptegnelserPollingRate();
    const slettLokaleOverstyringer = useResetRecoilState(inntektOgRefusjonState);
    const [isLoading, setIsLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [error, setError] = useState<string>();
    const [timedOut, setTimedOut] = useState(false);

    const [overstyrMutation] = useMutation(OverstyrInntektOgRefusjonMutationDocument);

    useEffect(() => {
        if (opptegnelser && calculating) {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            setIsLoading(false);
            setCalculating(false);
            slettLokaleOverstyringer();
        }
    }, [opptegnelser]);

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

    return {
        isLoading,
        error,
        timedOut,
        setTimedOut,
        postOverstyring: async (overstyrtInntekt: OverstyrtInntektOgRefusjonDTO) => {
            setIsLoading(true);

            const overstyring: InntektOgRefusjonOverstyringInput = {
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
            };
            return overstyrMutation({
                variables: { overstyring: overstyring },
                onCompleted: () => {
                    setCalculating(true);
                    addToast(kalkulererToast({}));
                    postAbonnerPåAktør(overstyrtInntekt.aktørId).then(() => setPollingRate(1000));
                },
                onError: () => {
                    setError('Kunne ikke overstyre inntekt og/eller refusjon. Prøv igjen senere.');
                    setIsLoading(false);
                },
            });
        },
    };
};
