import { useParams } from 'next/navigation';
import { useState } from 'react';

import { useFjernOppdatererToast } from '@hooks/useFjernOppdatererToast';
import { usePostSykepengegrunnlag } from '@io/rest/generated/personer/personer';
import {
    visningenErOppdatertToast,
    visningenErOppdatertToastKey,
    visningenOppdateresToast,
    visningenOppdateresToastKey,
} from '@state/oppdateringToasts';
import { erNyOppgaveEvent, useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { useVisningenOppdateresState } from '@state/visningenOppdateres';
import { SkjønnsfastsattSykepengegrunnlagDTO } from '@typer/overstyring';

export enum Skjønnsfastsettingstype {
    OMREGNET_ÅRSINNTEKT = 'OMREGNET_ÅRSINNTEKT',
    RAPPORTERT_ÅRSINNTEKT = 'RAPPORTERT_ÅRSINNTEKT',
    ANNET = 'ANNET',
}

export const usePostSkjønnsfastsattSykepengegrunnlag = (onVisningOppdatert: () => void) => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const [visningenOppdateres, setVisningenOppdateres] = useVisningenOppdateresState();
    const [timedOut, setTimedOut] = useState(false);
    const { personPseudoId } = useParams<{ personPseudoId: string }>();

    const { mutate, error, isPending: loading } = usePostSykepengegrunnlag();

    useHåndterNyttEvent((event) => {
        if (erNyOppgaveEvent(event) && visningenOppdateres) {
            addToast(visningenErOppdatertToast({ callback: () => removeToast(visningenErOppdatertToastKey) }));
            setVisningenOppdateres(false);
            onVisningOppdatert();
        }
    });

    useFjernOppdatererToast(visningenOppdateres, () => setTimedOut(true));

    return {
        isLoading: loading || visningenOppdateres,
        error: error && 'Kunne ikke skjønnsfastsette sykepengegrunnlaget. Prøv igjen senere.',
        timedOut,
        setTimedOut,
        postSkjønnsfastsetting: (skjønnsfastsattSykepengegrunnlag?: SkjønnsfastsattSykepengegrunnlagDTO) => {
            if (skjønnsfastsattSykepengegrunnlag === undefined) return;
            setVisningenOppdateres(true);
            addToast(visningenOppdateresToast({}));

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
                        setVisningenOppdateres(false);
                        removeToast(visningenOppdateresToastKey);
                    },
                },
            );
        },
    };
};
