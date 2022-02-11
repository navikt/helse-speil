import { usePerson } from '../../../state/person';
import { useAddToast, useRemoveToast } from '../../../state/toasts';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '../../../state/opptegnelser';
import { useEffect, useState } from 'react';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '../../../state/kalkuleringstoasts';
import { OverstyrtArbeidsforholdDTO } from '../../../io/types';
import { postAbonnerPåAktør, postOverstyrtArbeidsforhold } from '../../../io/http';

export const useGetOverstyrtArbeidsforhold = () => {
    const { aktørId, fødselsnummer } = usePerson() as Person;

    return (
        begrunnelse: string,
        forklaring: string,
        organisasjonsnummerPeriodeTilGodkjenning: string,
        organisasjonsnummerGhost: string,
        skjæringstidspunkt: string,
        arbeidsforholdSkalDeaktiveres: boolean
    ) => ({
        fødselsnummer: fødselsnummer,
        organisasjonsnummer: organisasjonsnummerPeriodeTilGodkjenning,
        aktørId: aktørId,
        skjæringstidspunkt: skjæringstidspunkt,
        overstyrteArbeidsforhold: [
            {
                orgnummer: organisasjonsnummerGhost,
                deaktivert: arbeidsforholdSkalDeaktiveres,
                begrunnelse: begrunnelse,
                forklaring: forklaring,
            },
        ],
    });
};

export const usePostOverstyrtArbeidsforhold = (onFerdigKalkulert?: () => void) => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const opptegnelser = useOpptegnelser();
    const { aktørId } = usePerson() as Person;
    const setPollingRate = useSetOpptegnelserPollingRate();

    const [isLoading, setIsLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [error, setError] = useState<string | null>();
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        if (opptegnelser && calculating) {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            setIsLoading(false);
            setCalculating(false);
            onFerdigKalkulert && onFerdigKalkulert();
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
        postOverstyring: (overstyrtArbeidsforhold: OverstyrtArbeidsforholdDTO) => {
            setIsLoading(true);
            postOverstyrtArbeidsforhold(overstyrtArbeidsforhold)
                .then(() => {
                    setCalculating(true);
                    addToast(kalkulererToast({}));
                    postAbonnerPåAktør(aktørId).then(() => setPollingRate(1000));
                })
                .catch((error) => {
                    switch (error.statusCode) {
                        default: {
                            setError('Kunne ikke overstyre arbeidsforhold. Prøv igjen senere. ');
                        }
                    }
                    setIsLoading(false);
                });
        },
    };
};
