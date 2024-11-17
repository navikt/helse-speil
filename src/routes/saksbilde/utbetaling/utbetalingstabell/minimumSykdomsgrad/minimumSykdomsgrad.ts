import dayjs from 'dayjs';
import { useState } from 'react';

import { useMutation } from '@apollo/client';
import { useFjernKalkulerToast } from '@hooks/useFjernKalkulererToast';
import {
    ArbeidsgiverFragment,
    ArbeidsgiverInput,
    Maybe,
    MinimumSykdomsgradInput,
    MinimumSykdomsgradMutationDocument,
    OpprettAbonnementDocument,
    PersonFragment,
} from '@io/graphql';
import { kalkulererFerdigToastKey, kalkulererToast, kalkuleringFerdigToast } from '@state/kalkuleringstoasts';
import { erOpptegnelseForNyOppgave, useHåndterOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { overlapper } from '@state/selectors/period';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { MinimumSykdomsgradArbeidsgiver, OverstyrtMinimumSykdomsgradDTO } from '@typer/overstyring';
import { ActivePeriod, DatePeriod } from '@typer/shared';
import { ISO_DATOFORMAT } from '@utils/date';
import { isBeregnetPeriode, isNotUndefined, isUberegnetPeriode } from '@utils/typeguards';

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

    useFjernKalkulerToast(calculating, () => setTimedOut(true));

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
                perioderVurdertOk: minimumSykdomsgrad.perioderVurdertOk,
                perioderVurdertIkkeOk: minimumSykdomsgrad.perioderVurdertIkkeOk,
                fodselsnummer: minimumSykdomsgrad.fødselsnummer,
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

export const getOverlappendeArbeidsgivere = (person: PersonFragment, periode: ActivePeriod) =>
    person.arbeidsgivere.filter(
        (arbeidsgiver) =>
            (
                arbeidsgiver.generasjoner[0]?.perioder
                    ?.filter(isBeregnetPeriode || isUberegnetPeriode)
                    ?.filter(overlapper(periode)) ?? []
            ).length > 0,
    ) as Array<ArbeidsgiverFragment>;

export const getOppkuttedePerioder = (
    overlappendeArbeidsgivere: ArbeidsgiverFragment[],
    aktivPeriode: ActivePeriod,
): Maybe<DatePeriod[]> => {
    const datoer: string[] = [];
    overlappendeArbeidsgivere.map((ag) =>
        ag.generasjoner[0]?.perioder.forEach((periode) => {
            if (dayjs(periode.fom, ISO_DATOFORMAT).isBetween(aktivPeriode.fom, aktivPeriode.tom, 'day', '[]')) {
                datoer.push(periode.fom);
                if (dayjs(periode.fom, ISO_DATOFORMAT).isAfter(aktivPeriode.fom))
                    datoer.push(dayjs(periode.fom, ISO_DATOFORMAT).subtract(1, 'day').format(ISO_DATOFORMAT));
            }
            if (dayjs(periode.tom, ISO_DATOFORMAT).isBetween(aktivPeriode.fom, aktivPeriode.tom, 'day', '[]')) {
                datoer.push(periode.tom);
                if (dayjs(periode.tom, ISO_DATOFORMAT).isBefore(aktivPeriode.tom))
                    datoer.push(dayjs(periode.tom, ISO_DATOFORMAT).add(1, 'day').format(ISO_DATOFORMAT));
            }
        }),
    );
    const unikeDatoer = [...new Set(datoer)]
        .sort(byDate)
        .filter((it) => it !== undefined)
        .filter(isNotUndefined);

    if (unikeDatoer.length % 2 !== 0) return null;

    const oppkuttedePerioder: DatePeriod[] = [];
    for (let i = 0; i < unikeDatoer.length; i += 2) {
        const fom = unikeDatoer[i];
        const tom = unikeDatoer[i + 1];

        if (!fom || !tom) return null;
        oppkuttedePerioder.push({ fom, tom });
    }

    return oppkuttedePerioder;
};

const byDate = (a: string, b: string): number => {
    return dayjs(a, ISO_DATOFORMAT).isBefore(b) ? -1 : 1;
};
