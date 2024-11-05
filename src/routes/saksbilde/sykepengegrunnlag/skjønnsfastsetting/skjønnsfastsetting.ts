import { useState } from 'react';

import { useMutation } from '@apollo/client';
import { useFjernKalkulerToast } from '@hooks/useFjernKalkulererToast';
import {
    OpprettAbonnementDocument,
    SkjonnsfastsettelseArbeidsgiverInput,
    SkjonnsfastsettelseInput,
    SkjonnsfastsettelseMutationDocument,
    SkjonnsfastsettelseType,
} from '@io/graphql';
import { kalkulererFerdigToastKey, kalkulererToast, kalkuleringFerdigToast } from '@state/kalkuleringstoasts';
import { erOpptegnelseForNyOppgave, useHåndterOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
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

export interface ArbeidsgiverForm {
    organisasjonsnummer: string;
    årlig: number;
}

export const usePostSkjønnsfastsattSykepengegrunnlag = (onFerdigKalkulert: () => void) => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const setPollingRate = useSetOpptegnelserPollingRate();
    const [calculating, setCalculating] = useState(false);
    const [timedOut, setTimedOut] = useState(false);

    const [overstyrMutation, { error, loading }] = useMutation(SkjonnsfastsettelseMutationDocument);
    const [opprettAbonnement] = useMutation(OpprettAbonnementDocument);

    useHåndterOpptegnelser((opptegnelse) => {
        if (erOpptegnelseForNyOppgave(opptegnelse) && calculating) {
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
                    void opprettAbonnement({
                        variables: { personidentifikator: skjønnsfastsattSykepengegrunnlag.aktørId },
                        onCompleted: () => {
                            setPollingRate(1000);
                        },
                    });
                },
            });
        },
    };
};
