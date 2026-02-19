import { useState } from 'react';

import { useMutation } from '@apollo/client';
import { useFjernKalkulerToast } from '@hooks/useFjernKalkulererToast';
import {
    SkjonnsfastsettelseArbeidsgiverInput,
    SkjonnsfastsettelseInput,
    SkjonnsfastsettelseMutationDocument,
    SkjonnsfastsettelseType,
} from '@io/graphql';
import { useCalculatingState } from '@state/calculating';
import { kalkulererFerdigToastKey, kalkulererToast, kalkuleringFerdigToast } from '@state/kalkuleringstoasts';
import { erOpptegnelseForNyOppgave, useHåndterOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { erNyOppgaveEvent, useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useRemoveToast } from '@state/toasts';
import {
    SkjønnsfastsattArbeidsgiver,
    SkjønnsfastsattSykepengegrunnlagDTO,
    SkjønnsfastsettingstypeDTO,
} from '@typer/overstyring';

export enum Skjønnsfastsettingstype {
    OMREGNET_ÅRSINNTEKT = 'OMREGNET_ÅRSINNTEKT',
    RAPPORTERT_ÅRSINNTEKT = 'RAPPORTERT_ÅRSINNTEKT',
    ANNET = 'ANNET',
}

export const usePostSkjønnsfastsattSykepengegrunnlag = (onFerdigKalkulert: () => void) => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const setPollingRate = useSetOpptegnelserPollingRate();
    const [calculating, setCalculating] = useCalculatingState();
    const [timedOut, setTimedOut] = useState(false);

    const [overstyrMutation, { error, loading }] = useMutation(SkjonnsfastsettelseMutationDocument);

    useHåndterOpptegnelser((opptegnelse) => {
        if (erOpptegnelseForNyOppgave(opptegnelse) && calculating) {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            setCalculating(false);
            onFerdigKalkulert();
        }
    });
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
            const skjønnsfastsettelse: SkjonnsfastsettelseInput = {
                aktorId: skjønnsfastsattSykepengegrunnlag.aktørId,
                arbeidsgivere: skjønnsfastsattSykepengegrunnlag.arbeidsgivere.map(
                    (arbeidsgiver: SkjønnsfastsattArbeidsgiver): SkjonnsfastsettelseArbeidsgiverInput => ({
                        arlig: arbeidsgiver.årlig,
                        arsak: arbeidsgiver.årsak,
                        lovhjemmel:
                            arbeidsgiver.lovhjemmel !== undefined
                                ? {
                                      bokstav: arbeidsgiver.lovhjemmel.bokstav,
                                      ledd: arbeidsgiver.lovhjemmel.ledd,
                                      paragraf: arbeidsgiver.lovhjemmel.paragraf,
                                      lovverk: arbeidsgiver.lovhjemmel.lovverk,
                                      lovverksversjon: arbeidsgiver.lovhjemmel.lovverksversjon,
                                  }
                                : undefined,
                        begrunnelseFritekst: arbeidsgiver.begrunnelseFritekst,
                        begrunnelseKonklusjon: arbeidsgiver.begrunnelseKonklusjon,
                        begrunnelseMal: arbeidsgiver.begrunnelseMal,
                        fraArlig: arbeidsgiver.fraÅrlig,
                        initierendeVedtaksperiodeId: arbeidsgiver.initierendeVedtaksperiodeId,
                        organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                        type:
                            arbeidsgiver.type === SkjønnsfastsettingstypeDTO.OMREGNET_ÅRSINNTEKT
                                ? SkjonnsfastsettelseType.OmregnetArsinntekt
                                : arbeidsgiver.type === SkjønnsfastsettingstypeDTO.RAPPORTERT_ÅRSINNTEKT
                                  ? SkjonnsfastsettelseType.RapportertArsinntekt
                                  : SkjonnsfastsettelseType.Annet,
                    }),
                ),
                fodselsnummer: skjønnsfastsattSykepengegrunnlag.fødselsnummer,
                skjaringstidspunkt: skjønnsfastsattSykepengegrunnlag.skjæringstidspunkt,
                vedtaksperiodeId: skjønnsfastsattSykepengegrunnlag.vedtaksperiodeId,
            };

            void overstyrMutation({
                variables: { skjonnsfastsettelse: skjønnsfastsettelse },
                onCompleted: () => {
                    setCalculating(true);
                    addToast(kalkulererToast({}));
                    setPollingRate(1000);
                },
            });
        },
    };
};
