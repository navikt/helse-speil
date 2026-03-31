import { useParams } from 'next/navigation';
import { useState } from 'react';

import { useFjernKalkulerToast } from '@hooks/useFjernKalkulererToast';
import { usePostSykepengegrunnlag } from '@io/rest/generated/personer/personer';
import { useCalculatingState } from '@state/calculating';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { erNyOppgaveEvent, useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { SkjønnsfastsattSykepengegrunnlagDTO } from '@typer/overstyring';

export enum Skjønnsfastsettingstype {
    OMREGNET_ÅRSINNTEKT = 'OMREGNET_ÅRSINNTEKT',
    RAPPORTERT_ÅRSINNTEKT = 'RAPPORTERT_ÅRSINNTEKT',
    ANNET = 'ANNET',
}

export const usePostSkjønnsfastsattSykepengegrunnlag = (onFerdigKalkulert: () => void) => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const [calculating, setCalculating] = useCalculatingState();
    const [timedOut, setTimedOut] = useState(false);
    const { personPseudoId } = useParams<{ personPseudoId: string }>();

    const { mutate, error, isPending: loading } = usePostSykepengegrunnlag();

    useHåndterNyttEvent((event) => {
        if (erNyOppgaveEvent(event) && calculating) {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            setCalculating(false);
            onFerdigKalkulert();
        }
    });

    useFjernKalkulerToast(calculating, () => setTimedOut(true));

    return {
        isLoading: loading || calculating,
        error: error && 'Kunne ikke skjønnsfastsette sykepengegrunnlaget. Prøv igjen senere.',
        timedOut,
        setTimedOut,
        postSkjønnsfastsetting: (skjønnsfastsattSykepengegrunnlag?: SkjønnsfastsattSykepengegrunnlagDTO) => {
            if (skjønnsfastsattSykepengegrunnlag === undefined) return;
            setCalculating(true);
            addToast(kalkulererToast({}));

            void mutate(
                {
                    pseudoId: personPseudoId,
                    skjaeringstidspunkt: skjønnsfastsattSykepengegrunnlag.skjæringstidspunkt,
                    data: {
                        sykepengegrunnlagstype: {
                            discriminatorType: 'ApiSkjønnsfastsatt',
                            skjønnsfastsettelsestype: skjønnsfastsattSykepengegrunnlag.type,
                            skjønnsfastsatteInntekter: skjønnsfastsattSykepengegrunnlag.arbeidsgivere.map((ag) => ({
                                organisasjonsnummer: ag.organisasjonsnummer,
                                fraÅrlig: ag.fraÅrlig,
                                årlig: ag.årlig,
                            })),
                            lovverksreferanse: skjønnsfastsattSykepengegrunnlag.lovhjemmel!,
                        },
                        årsak: skjønnsfastsattSykepengegrunnlag.årsak,
                        intierendeVedtaksperiodeId: skjønnsfastsattSykepengegrunnlag.vedtaksperiodeId,
                        begrunnelseMal: skjønnsfastsattSykepengegrunnlag.begrunnelseMal,
                        begrunnelseFritekst: skjønnsfastsattSykepengegrunnlag.begrunnelseFritekst,
                        begrunnelseKonklusjon: skjønnsfastsattSykepengegrunnlag.begrunnelseKonklusjon,
                    },
                },
                {
                    onError: () => {
                        setCalculating(false);
                        removeToast(kalkulererToastKey);
                    },
                },
            );
        },
    };
};
