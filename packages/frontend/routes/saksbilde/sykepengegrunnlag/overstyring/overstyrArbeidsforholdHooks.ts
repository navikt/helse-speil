import { BegrunnelseForOverstyring } from './overstyring.types';
import { useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import {
    ArbeidsforholdOverstyringHandlingInput,
    OverstyrArbeidsforholdMutationDocument,
    OverstyringArbeidsforholdInput,
} from '@io/graphql';
import { postAbonnerPåAktør } from '@io/http';
import { OverstyrtArbeidsforholdDTO } from '@io/http/types';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useCurrentPerson } from '@state/person';
import { useAddToast, useRemoveToast } from '@state/toasts';

type OverstyrtArbeidsforholdGetter = (
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
    const person = useCurrentPerson() as FetchedPerson;

    return (organisasjonsnummerGhost, skjæringstidspunkt, arbeidsforholdSkalDeaktiveres, forklaring, begrunnelse) => ({
        fødselsnummer: person?.fodselsnummer,
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

    const [overstyrMutation] = useMutation(OverstyrArbeidsforholdMutationDocument);

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
            const overstyring: ArbeidsforholdOverstyringHandlingInput = {
                aktorId: overstyrtArbeidsforhold.aktørId,
                overstyrteArbeidsforhold: overstyrtArbeidsforhold.overstyrteArbeidsforhold.map(
                    (arbeidsforhold): OverstyringArbeidsforholdInput => ({
                        begrunnelse: arbeidsforhold.begrunnelse,
                        deaktivert: arbeidsforhold.deaktivert,
                        forklaring: arbeidsforhold.forklaring,
                        orgnummer: arbeidsforhold.orgnummer,
                    }),
                ),
                fodselsnummer: overstyrtArbeidsforhold.fødselsnummer,
                skjaringstidspunkt: overstyrtArbeidsforhold.skjæringstidspunkt,
            };

            overstyrMutation({ variables: { overstyring: overstyring } })
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
