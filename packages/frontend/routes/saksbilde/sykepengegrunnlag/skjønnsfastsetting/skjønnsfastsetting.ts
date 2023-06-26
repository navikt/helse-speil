import { useEffect, useState } from 'react';

import {
    SkjønnsfastsattSykepengegrunnlagDTO,
    postAbonnerPåAktør,
    postSkjønnsfastsattSykepengegrunnlag,
} from '@io/http';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { toKronerOgØre } from '@utils/locale';

import { Subsumsjon } from '../overstyring/overstyring.types';

export interface BegrunnelseForSkjønnsfastsetting {
    id: string;
    valg: string;
    mal: string;
    subsumsjon?: Subsumsjon;
}

export const skjønnsfastsettelseBegrunnelser = (
    omregnetÅrsinntekt: number,
    sammenligningsgrunnlag: number,
): BegrunnelseForSkjønnsfastsetting[] => [
    {
        id: '0',
        valg: 'Skjønnsfastsette til omregnet årsinntekt ',
        mal: `Månedsinntekten som er oppgitt av din arbeidsgiver på kr ${toKronerOgØre(
            omregnetÅrsinntekt,
        )} utgjør kr ${toKronerOgØre(
            omregnetÅrsinntekt / 12,
        )} i årsinntekt. Denne årsinntekten avviker med mer enn 25 prosent fra inntekten som er rapportert til Skatteetaten på kr ${toKronerOgØre(
            sammenligningsgrunnlag,
        )} de siste tolv månedene før du ble syk.\n\nNår årsinntekten avviker med mer enn 25 prosent fra rapportert inntekt, skal NAV fastsette sykepengegrunnlaget ved skjønn ut fra den årsinntekten som kan godtgjøres på det tidspunktet du ble syk. Det fremgår av folketrygdloven § 8-30 andre ledd.\n\nVi har fastsatt sykepengerunnlaget ditt til kr ${toKronerOgØre(
            omregnetÅrsinntekt,
        )}. Beløpet vi har kommet frem til er årsinntekten vi mener du ville hatt hvis du ikke hadde blitt syk.`,
        subsumsjon: { paragraf: '8-30', ledd: '2' },
    },
];

export interface ArbeidsgiverForm {
    organisasjonsnummer: string;
    årlig: number;
}

export const usePostSkjønnsfastsattSykepengegrunnlag = () => {
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
        postSkjønnsfastsetting: (skjønnsfastsattSykepengegrunnlag: SkjønnsfastsattSykepengegrunnlagDTO) => {
            setIsLoading(true);

            postSkjønnsfastsattSykepengegrunnlag(skjønnsfastsattSykepengegrunnlag)
                .then(() => {
                    setCalculating(true);
                    addToast(kalkulererToast({}));
                    postAbonnerPåAktør(skjønnsfastsattSykepengegrunnlag.aktørId).then(() => setPollingRate(1000));
                })
                .catch((error) => {
                    switch (error.statusCode) {
                        default: {
                            setError('Kunne ikke skjønnsfastsette sykepengegrunnlaget. Prøv igjen senere.');
                        }
                    }
                    setIsLoading(false);
                });
        },
    };
};
