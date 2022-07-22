import { useEffect, useState } from 'react';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { OverstyrtArbeidsforholdDTO } from '@io/http/types';
import { postAbonnerPåAktør, postOverstyrtArbeidsforhold } from '@io/http';
import { Person } from '@io/graphql';
import { useCurrentPerson } from '@state/person';
import { BegrunnelseForOverstyring } from './overstyring.types';

type OverstyrtArbeidsforholdGetter = (
    organisasjonsnummerPeriodeTilGodkjenning: string,
    organisasjonsnummerGhost: string,
    skjæringstidspunkt: string,
    arbeidsforholdSkalDeaktiveres: boolean,
    forklaring: string,
    begrunnelse: BegrunnelseForOverstyring,
    paragraf?: string,
    ledd?: string,
    bokstav?: string,
) => OverstyrtArbeidsforholdDTO;

export const useGetOverstyrtArbeidsforhold = (): OverstyrtArbeidsforholdGetter => {
    const person = useCurrentPerson() as Person;

    return (
        organisasjonsnummerPeriodeTilGodkjenning,
        organisasjonsnummerGhost,
        skjæringstidspunkt,
        arbeidsforholdSkalDeaktiveres,
        forklaring,
        begrunnelse,
    ) => ({
        fødselsnummer: person?.fodselsnummer,
        organisasjonsnummer: organisasjonsnummerPeriodeTilGodkjenning,
        aktørId: person?.aktorId,
        skjæringstidspunkt: skjæringstidspunkt,
        overstyrteArbeidsforhold: [
            {
                orgnummer: organisasjonsnummerGhost,
                deaktivert: arbeidsforholdSkalDeaktiveres,
                forklaring: forklaring,
                begrunnelse: begrunnelse.forklaring,
            },
        ],
    });
};

export const usePostOverstyrtArbeidsforhold = (onFerdigKalkulert?: () => void) => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const opptegnelser = useOpptegnelser();
    const aktørId = useCurrentPerson()?.aktorId;
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
                    if (aktørId) {
                        setCalculating(true);
                        addToast(kalkulererToast({}));
                        postAbonnerPåAktør(aktørId).then(() => setPollingRate(1000));
                    }
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
