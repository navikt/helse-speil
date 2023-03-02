import { useEffect, useState } from 'react';
import { atom, useRecoilState } from 'recoil';

import { Arbeidsgiverrefusjon } from '@io/graphql';
import {
    OverstyrtInntektOgRefusjonArbeidsgiver,
    OverstyrtInntektOgRefusjonDTO,
    Refusjonsopplysning,
    postAbonnerPåAktør,
    postOverstyrtInntektOgRefusjon,
} from '@io/http';
import { useArbeidsgiver, usePeriodForSkjæringstidspunktForArbeidsgiver } from '@state/arbeidsgiver';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useCurrentPerson } from '@state/person';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { inntektOgRefusjonSteg4 } from '@utils/featureToggles';
import { isArbeidsgiver, isBeregnetPeriode, isGhostPeriode, isPerson } from '@utils/typeguards';

import { mapOgSorterRefusjoner } from '../routes/saksbilde/sykepengegrunnlag/inntekt/Inntekt';

export type OverstyrtInntektOgRefusjon = {
    aktørId: string | null;
    fødselsnummer: string | null;
    skjæringstidspunkt: string | null;
    arbeidsgivere: OverstyrtInntektOgRefusjonArbeidsgiver[] | [];
};

export const inntektOgRefusjonState = atom<OverstyrtInntektOgRefusjon>({
    key: 'inntektOgRefusjonState',
    default: {
        aktørId: null,
        fødselsnummer: null,
        skjæringstidspunkt: null,
        arbeidsgivere: [],
    },
});

export const usePostOverstyrtInntekt = (
    onFerdigKalkulert: () => void,
    showSlettLokaleOverstyringerModal: boolean,
    setShowSlettLokaleOverstyringerModal: (data: boolean) => void
) => {
    const person = useCurrentPerson();

    if (!isPerson(person)) {
        throw Error('Mangler persondata.');
    }

    const [lokaleInntektoverstyringer, setLokaleInntektoverstyringer] = useRecoilState(inntektOgRefusjonState);
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const opptegnelser = useOpptegnelser();
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
            onFerdigKalkulert();
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
        postOverstyring: (overstyrtInntekt: OverstyrtInntektOgRefusjonDTO, organisasjonsnummer?: string) => {
            setIsLoading(true);

            if (!inntektOgRefusjonSteg4) {
                postOverstyrtInntektOgRefusjon(overstyrtInntekt)
                    .then(() => {
                        setCalculating(true);
                        addToast(kalkulererToast({}));
                        postAbonnerPåAktør(person.aktorId).then(() => setPollingRate(1000));
                    })
                    .catch((error) => {
                        switch (error.statusCode) {
                            default: {
                                setError('Kunne ikke overstyre inntekt og/eller refusjon. Prøv igjen senere.');
                            }
                        }
                        setIsLoading(false);
                    });
            } else {
                if (
                    lokaleInntektoverstyringer.skjæringstidspunkt &&
                    overstyrtInntekt.skjæringstidspunkt !== lokaleInntektoverstyringer.skjæringstidspunkt &&
                    !showSlettLokaleOverstyringerModal
                ) {
                    setShowSlettLokaleOverstyringerModal(true);
                    setIsLoading(false);
                    return;
                }

                const overstyrtArbeidsgiver = (overstyrtInntekt as OverstyrtInntektOgRefusjonDTO).arbeidsgivere[0];
                const overstyrtArbeidsgiverRetyped = {
                    ...overstyrtArbeidsgiver,
                    refusjonsopplysninger: [
                        ...overstyrtArbeidsgiver.refusjonsopplysninger.map((refusjonsopplysning) => {
                            return { ...refusjonsopplysning } as Refusjonsopplysning;
                        }),
                    ],
                    fraRefusjonsopplysninger: [
                        ...overstyrtArbeidsgiver.fraRefusjonsopplysninger.map((fraRefusjonsopplysning) => {
                            return { ...fraRefusjonsopplysning } as Refusjonsopplysning;
                        }),
                    ],
                };

                const arbeidsgivereLagretPåSkjæringstidspunkt =
                    overstyrtInntekt.skjæringstidspunkt !== lokaleInntektoverstyringer.skjæringstidspunkt
                        ? []
                        : [...lokaleInntektoverstyringer.arbeidsgivere];

                setLokaleInntektoverstyringer({
                    ...overstyrtInntekt,
                    arbeidsgivere:
                        arbeidsgivereLagretPåSkjæringstidspunkt.length === 0
                            ? [overstyrtArbeidsgiverRetyped]
                            : arbeidsgivereLagretPåSkjæringstidspunkt.filter(
                                  (it) => it.organisasjonsnummer === organisasjonsnummer
                              ).length === 0
                            ? [...arbeidsgivereLagretPåSkjæringstidspunkt, overstyrtArbeidsgiverRetyped]
                            : [
                                  ...arbeidsgivereLagretPåSkjæringstidspunkt.filter(
                                      (it) => it.organisasjonsnummer !== organisasjonsnummer
                                  ),
                                  overstyrtArbeidsgiverRetyped,
                              ],
                });
                onFerdigKalkulert();
            }
        },
    };
};

type OverstyrtInntektMetadata = {
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
    skjæringstidspunkt: DateString;
    fraRefusjonsopplysninger: Refusjonsopplysning[];
};

export const useOverstyrtInntektMetadata = (
    skjæringstidspunkt: DateString,
    organisasjonsnummer: string
): OverstyrtInntektMetadata => {
    const person = useCurrentPerson();
    const period = usePeriodForSkjæringstidspunktForArbeidsgiver(skjæringstidspunkt, organisasjonsnummer);
    const arbeidsgiver = useArbeidsgiver(organisasjonsnummer);

    if (!isPerson(person) || !isArbeidsgiver(arbeidsgiver) || !(isBeregnetPeriode(period) || isGhostPeriode(period))) {
        throw Error('Mangler data for å kunne overstyre inntekt.');
    }

    const vilkårsgrunnlagRefusjonsopplysninger: Arbeidsgiverrefusjon = person.vilkarsgrunnlag
        .filter((it) => it.id === period.vilkarsgrunnlagId)[0]
        .arbeidsgiverrefusjoner.filter(
            (arbeidsgiverrefusjon) => arbeidsgiverrefusjon.arbeidsgiver === arbeidsgiver.organisasjonsnummer
        )[0];

    const refusjonsopplysninger = mapOgSorterRefusjoner(
        period,
        vilkårsgrunnlagRefusjonsopplysninger?.refusjonsopplysninger
    );

    return {
        aktørId: person.aktorId,
        fødselsnummer: person.fodselsnummer,
        organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
        skjæringstidspunkt: period.skjaeringstidspunkt,
        fraRefusjonsopplysninger: refusjonsopplysninger,
    };
};
