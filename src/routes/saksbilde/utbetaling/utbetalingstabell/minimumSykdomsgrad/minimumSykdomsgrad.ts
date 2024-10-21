import { useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import {
    ArbeidsgiverFragment,
    ArbeidsgiverInput,
    BeregnetPeriodeFragment,
    Maybe,
    MinimumSykdomsgradInput,
    MinimumSykdomsgradMutationDocument,
    OpprettAbonnementDocument,
    PersonFragment,
} from '@io/graphql';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { erOpptegnelseForNyOppgave, useHåndterOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { overlapper } from '@state/selectors/period';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { MinimumSykdomsgradArbeidsgiver, OverstyrtMinimumSykdomsgradDTO } from '@typer/overstyring';
import { isBeregnetPeriode } from '@utils/typeguards';

export const usePostOverstyringMinimumSykdomsgrad = (onFerdigKalkulert: () => void) => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const setPollingRate = useSetOpptegnelserPollingRate();
    const [calculating, setCalculating] = useState(false);
    const [timedOut, setTimedOut] = useState(false);

    const [overstyrMutation, { error, loading }] = useMutation(MinimumSykdomsgradMutationDocument);
    const [opprettAbonnement] = useMutation(OpprettAbonnementDocument);

    useHåndterOpptegnelser((opptegnelse) => {
        if (erOpptegnelseForNyOppgave(opptegnelse) && calculating) {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            setCalculating(false);
            onFerdigKalkulert();
        }
    });

    useEffect(() => {
        if (calculating) {
            const timeout: Maybe<NodeJS.Timeout | number> = setTimeout(() => {
                setTimedOut(true);
            }, 15000);
            return () => {
                removeToast(kalkulererToastKey);
                clearTimeout(timeout);
            };
        }
    }, [calculating]);

    return {
        isLoading: loading || calculating,
        error: error && 'Kunne ikke overstyre minimum sykdomsgrad. Prøv igjen senere.',
        timedOut,
        setTimedOut,
        postMinimumSykdomsgrad: (minimumSykdomsgrad?: OverstyrtMinimumSykdomsgradDTO) => {
            if (minimumSykdomsgrad === undefined) return;
            const overstyring: MinimumSykdomsgradInput = {
                aktorId: minimumSykdomsgrad.aktørId,
                arbeidsgivere: minimumSykdomsgrad.arbeidsgivere.map(
                    (arbeidsgiver: MinimumSykdomsgradArbeidsgiver): ArbeidsgiverInput => ({
                        organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                        berortVedtaksperiodeId: arbeidsgiver.berørtVedtaksperiodeId,
                    }),
                ),
                fodselsnummer: minimumSykdomsgrad.fødselsnummer,
                fom: minimumSykdomsgrad.fom,
                tom: minimumSykdomsgrad.tom,
                vurdering: minimumSykdomsgrad.vurdering,
                begrunnelse: minimumSykdomsgrad.begrunnelse,
                initierendeVedtaksperiodeId: minimumSykdomsgrad.initierendeVedtaksperiodeId,
            };

            void overstyrMutation({
                variables: { minimumSykdomsgrad: overstyring },
                onCompleted: () => {
                    setCalculating(true);
                    addToast(kalkulererToast({}));
                    void opprettAbonnement({
                        variables: { personidentifikator: minimumSykdomsgrad.aktørId },
                        onCompleted: () => {
                            setPollingRate(1000);
                        },
                    });
                },
            });
        },
    };
};

export const getOverlappendeArbeidsgivere = (person: PersonFragment, periode: BeregnetPeriodeFragment) =>
    person.arbeidsgivere.filter(
        (arbeidsgiver) =>
            arbeidsgiver.generasjoner[0]?.perioder
                .filter(isBeregnetPeriode)
                .filter((it) => overlapper(periode)(it) ?? []).length > 0,
    ) as Array<ArbeidsgiverFragment>;
