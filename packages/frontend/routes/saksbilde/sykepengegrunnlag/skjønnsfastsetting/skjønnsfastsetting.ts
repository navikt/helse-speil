import { Lovhjemmel } from '../overstyring/overstyring.types';
import { useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import {
    OpprettAbonnementDocument,
    SkjonnsfastsettelseArbeidsgiverInput,
    SkjonnsfastsettelseInput,
    SkjonnsfastsettelseMutationDocument,
    SkjonnsfastsettelseType,
} from '@io/graphql';
import { SkjønnsfastsattArbeidsgiver, SkjønnsfastsattSykepengegrunnlagDTO, SkjønnsfastsettingstypeDTO } from '@io/http';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { erOpptegnelseForNyOppgave, useHåndterOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { toKronerOgØre } from '@utils/locale';

export interface BegrunnelseForSkjønnsfastsetting {
    id: string;
    valg: string;
    mal: string;
    konklusjon: string;
    lovhjemmel: Lovhjemmel;
    sykepengegrunnlag: number;
    type: Skjønnsfastsettingstype;
}

export const skjønnsfastsettelseBegrunnelser = (
    omregnetÅrsinntekt = 0,
    sammenligningsgrunnlag = 0,
    annet = 0,
    antallArbeidsgivere = 1,
): BegrunnelseForSkjønnsfastsetting[] => [
    {
        id: '0',
        valg: 'Skjønnsfastsette til omregnet årsinntekt ',
        mal:
            antallArbeidsgivere === 1
                ? malEnArbeidsgiver(omregnetÅrsinntekt, sammenligningsgrunnlag)
                : malFlereArbeidsgivere(omregnetÅrsinntekt, sammenligningsgrunnlag),
        konklusjon: `Vi har skjønnsfastsatt årsinntekten din til ${toKronerOgØre(omregnetÅrsinntekt)} kroner.`,
        lovhjemmel: { paragraf: '8-30', ledd: '2', lovverk: 'folketrygdloven', lovverksversjon: '2019-01-01' },
        sykepengegrunnlag: omregnetÅrsinntekt,
        type: Skjønnsfastsettingstype.OMREGNET_ÅRSINNTEKT,
    },
    {
        id: '1',
        valg: 'Skjønnsfastsette til rapportert årsinntekt ',
        mal:
            antallArbeidsgivere === 1
                ? malEnArbeidsgiver(omregnetÅrsinntekt, sammenligningsgrunnlag)
                : malFlereArbeidsgivere(omregnetÅrsinntekt, sammenligningsgrunnlag),
        konklusjon: `Vi har skjønnsfastsatt årsinntekten din til ${toKronerOgØre(sammenligningsgrunnlag)} kroner.`,
        lovhjemmel: { paragraf: '8-30', ledd: '2', lovverk: 'folketrygdloven', lovverksversjon: '2019-01-01' },
        sykepengegrunnlag: sammenligningsgrunnlag,
        type: Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT,
    },
    {
        id: '2',
        valg: 'Skjønnsfastsette til annet ',
        mal:
            antallArbeidsgivere === 1
                ? malEnArbeidsgiver(omregnetÅrsinntekt, sammenligningsgrunnlag)
                : malFlereArbeidsgivere(omregnetÅrsinntekt, sammenligningsgrunnlag),
        konklusjon: `Vi har skjønnsfastsatt årsinntekten din til ${toKronerOgØre(annet)} kroner.`,
        lovhjemmel: { paragraf: '8-30', ledd: '2', lovverk: 'folketrygdloven', lovverksversjon: '2019-01-01' },
        sykepengegrunnlag: annet,
        type: Skjønnsfastsettingstype.ANNET,
    },
];

const malEnArbeidsgiver = (omregnetÅrsinntekt = 0, sammenligningsgrunnlag = 0) => {
    return `Månedsinntekten som er beregnet for arbeidsforholdet ditt er totalt ${toKronerOgØre(
        omregnetÅrsinntekt / 12,
    )} kroner. Regnet om til årsinntekt blir det ${toKronerOgØre(
        omregnetÅrsinntekt,
    )} kroner. Denne årsinntekten avviker med mer enn 25 prosent fra inntekten som er rapportert til Skatteetaten på ${toKronerOgØre(
        sammenligningsgrunnlag,
    )} kroner de siste tolv månedene før måneden du ble syk.\n\nNår årsinntekten avviker med mer enn 25 prosent fra rapportert inntekt, skal sykepengegrunnlaget fastsettes ved skjønn ut fra den årsinntekten som kan sannsynliggjøres på det tidspunktet du ble syk. Se folketrygdloven § 8-30 andre avsnitt.\n\nNår vi fastsetter sykepengegrunnlaget ditt ved skjønn, legger vi vekt på om avviket skyldes endringer i arbeidssituasjonen din. Målet med den skjønnsmessige vurderingen er å komme frem til inntekten du ville hatt om du ikke hadde blitt syk.`;
};

const malFlereArbeidsgivere = (omregnetÅrsinntekt = 0, sammenligningsgrunnlag = 0) => {
    return `Månedsinntekten som er beregnet for arbeidsforholdene dine er totalt ${toKronerOgØre(
        omregnetÅrsinntekt / 12,
    )} kroner. Regnet om til årsinntekt blir det ${toKronerOgØre(
        omregnetÅrsinntekt,
    )} kroner. Denne årsinntekten avviker med mer enn 25 prosent fra inntekten som er rapportert til Skatteetaten på ${toKronerOgØre(
        sammenligningsgrunnlag,
    )} kroner de siste tolv månedene før måneden du ble syk.\n\nNår årsinntekten avviker med mer enn 25 prosent fra rapportert inntekt, skal sykepengegrunnlaget fastsettes ved skjønn ut fra den årsinntekten som kan sannsynliggjøres på det tidspunktet du ble syk. Se folketrygdloven § 8-30 andre avsnitt.\n\nNår vi fastsetter sykepengegrunnlaget ditt ved skjønn, legger vi vekt på om avviket skyldes endringer i arbeidssituasjonen din. Målet med den skjønnsmessige vurderingen er å komme frem til inntekten du ville hatt om du ikke hadde blitt syk.`;
};

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
