import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import {
    ArbeidsgiverFragment,
    ArbeidsgiverInput,
    BeregnetPeriodeFragment,
    Maybe,
    MinimumSykdomsgradInput,
    MinimumSykdomsgradMutationDocument,
    MinimumSykdomsgradOverstyring,
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
import { ISO_DATOFORMAT } from '@utils/date';
import { isBeregnetPeriode, isMinimumSykdomsgradsoverstyring } from '@utils/typeguards';

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

export const getOverlappendeOverstyringFraAnnenPeriode = (
    person: PersonFragment,
    aktivPeriode: BeregnetPeriodeFragment,
) =>
    person.arbeidsgivere.flatMap((arbeidsgiver) =>
        arbeidsgiver.overstyringer
            .filter(isMinimumSykdomsgradsoverstyring)
            .filter(
                (it) =>
                    dayjs(it.minimumSykdomsgrad.fom, ISO_DATOFORMAT).isBetween(
                        aktivPeriode?.fom,
                        aktivPeriode?.tom,
                        'day',
                        '[]',
                    ) ||
                    dayjs(it.minimumSykdomsgrad.tom, ISO_DATOFORMAT).isBetween(
                        aktivPeriode?.fom,
                        aktivPeriode?.tom,
                        'day',
                        '[]',
                    ),
            )
            .filter(
                (it) =>
                    it.minimumSykdomsgrad.initierendeVedtaksperiodeId !==
                    (aktivPeriode as BeregnetPeriodeFragment).vedtaksperiodeId,
            ),
    );

export const getOverlappendeArbeidsgivere = (person: PersonFragment, periode: BeregnetPeriodeFragment) =>
    person.arbeidsgivere.filter((arbeidsgiver) =>
        arbeidsgiver.generasjoner[0]?.perioder.filter(isBeregnetPeriode).filter((it) => overlapper(periode)(it) ?? []),
    ) as Array<ArbeidsgiverFragment>;

export const getGjeldendeFom = (overstyringer: MinimumSykdomsgradOverstyring[], fom: string) => {
    const overlappendeFom = overstyringer.find((it) =>
        dayjs(fom, ISO_DATOFORMAT).isBetween(it.minimumSykdomsgrad.fom, it.minimumSykdomsgrad.tom, 'day', '(]'),
    );

    return overlappendeFom ? dayjs(overlappendeFom?.minimumSykdomsgrad.tom).add(1, 'day').format(ISO_DATOFORMAT) : fom;
};
export const getGjeldendeTom = (overstyringer: MinimumSykdomsgradOverstyring[], tom: string) => {
    const overlappendeTom = overstyringer.find((it) =>
        dayjs(tom, ISO_DATOFORMAT).isBetween(it.minimumSykdomsgrad.fom, it.minimumSykdomsgrad.tom, 'day', '[)'),
    );
    return overlappendeTom
        ? dayjs(overlappendeTom?.minimumSykdomsgrad.fom).subtract(1, 'day').format(ISO_DATOFORMAT)
        : tom;
};
