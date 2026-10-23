import { useParams } from 'next/navigation';

import { Events } from '@navikt/analytics-types';

import { useFjernOppdatererToast } from '@hooks/useFjernOppdatererToast';
import { usePostSykepengegrunnlag } from '@io/rest/generated/personer/personer';
import { sporHendelse } from '@observability/hendelser';
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
    const { personPseudoId } = useParams<{ personPseudoId: string }>();

    const { mutate, error, isPending: loading } = usePostSykepengegrunnlag();

    useHåndterNyttEvent((event) => {
        if (erNyOppgaveEvent(event) && visningenOppdateres) {
            addToast(visningenErOppdatertToast({ callback: () => removeToast(visningenErOppdatertToastKey) }));
            setVisningenOppdateres(false);
            onVisningOppdatert();
        }
    });

    useFjernOppdatererToast(visningenOppdateres);

    return {
        isLoading: loading || visningenOppdateres,
        error: error && 'Kunne ikke skjønnsfastsette sykepengegrunnlaget. Prøv igjen senere.',
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
                    onSuccess: () => {
                        sporHendelse({
                            name: Events.SKJEMA_FULLFORT,
                            properties: {
                                skjemanavn: 'skjønnsfastsetting',
                                type: skjønnsfastsattSykepengegrunnlag.type,
                                ledd: skjønnsfastsattSykepengegrunnlag.lovhjemmel?.ledd,
                                antallArbeidsgivere: skjønnsfastsattSykepengegrunnlag.arbeidsgivere.length,
                                harFritekst: !!skjønnsfastsattSykepengegrunnlag.begrunnelseFritekst?.trim(),
                            },
                        });
                    },
                    onError: () => {
                        sporHendelse({
                            name: Events.SKJEMA_INNSENDING_FEILET,
                            properties: { skjemanavn: 'skjønnsfastsetting' },
                        });
                        setVisningenOppdateres(false);
                        removeToast(visningenOppdateresToastKey);
                    },
                },
            );
        },
    };
};
