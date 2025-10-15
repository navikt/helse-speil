import dayjs from 'dayjs';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import * as R from 'remeda';

import { useMutation } from '@apollo/client';
import { useFjernKalkulerToast } from '@hooks/useFjernKalkulererToast';
import {
    ArbeidsgiverFragment,
    ArbeidsgiverInput,
    MinimumSykdomsgradInput,
    MinimumSykdomsgradMutationDocument,
    PeriodeFragment,
    PersonFragment,
} from '@io/graphql';
import { useCalculatingState } from '@state/calculating';
import { Inntektsforhold, finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { kalkulererFerdigToastKey, kalkulererToast, kalkuleringFerdigToast } from '@state/kalkuleringstoasts';
import { erOpptegnelseForNyOppgave, useHåndterOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { overlapper } from '@state/selectors/period';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { MinimumSykdomsgradArbeidsgiver, OverstyrtMinimumSykdomsgradDTO } from '@typer/overstyring';
import { ActivePeriod, DatePeriod } from '@typer/shared';
import { ISO_DATOFORMAT, erEtter, erFør, erIPeriode, minusEnDag, plussEnDag } from '@utils/date';
import { isBeregnetPeriode, isNotNullOrUndefined, isUberegnetPeriode } from '@utils/typeguards';

export const usePostOverstyringMinimumSykdomsgrad = (onFerdigKalkulert: () => void) => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const setPollingRate = useSetOpptegnelserPollingRate();
    const [calculating, setCalculating] = useCalculatingState();
    const [timedOut, setTimedOut] = useState(false);

    const [overstyrMutation, { error, loading }] = useMutation(MinimumSykdomsgradMutationDocument);
    const fjernNotat = useFjernNotat();

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
                    setPollingRate(1000);
                    fjernNotat(minimumSykdomsgrad.initierendeVedtaksperiodeId);
                },
            });
        },
    };
};

export const getOverlappendeArbeidsgivere = (person: PersonFragment, periode: ActivePeriod) =>
    finnAlleInntektsforhold(person).filter(
        (inntektsforhold) =>
            (
                inntektsforhold.generasjoner[0]?.perioder
                    ?.filter(isBeregnetPeriode || isUberegnetPeriode)
                    ?.filter(overlapper(periode)) ?? []
            ).length > 0,
    ) as ArbeidsgiverFragment[];

export const harPeriodeDagerMedUnder20ProsentTotalGrad = (
    periode: DatePeriod,
    arbeidsgivere: Inntektsforhold[],
    skjæringstidspunkt: string,
): boolean => {
    const alleOverlappendePerioderPåSkjæringstidspunkt: PeriodeFragment[] = R.pipe(
        arbeidsgivere,
        R.flatMap((ag) => ag.generasjoner?.[0]?.perioder),
        R.filter((it) => isBeregnetPeriode(it) || isUberegnetPeriode(it)),
        R.filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt),
        R.filter((it) => overlapper(it)(periode)),
    );

    return R.pipe(
        alleOverlappendePerioderPåSkjæringstidspunkt,
        R.flatMap((it) => it.tidslinje),
        R.filter((it) => erIPeriode(it.dato, periode)),
        R.filter((dag) => dag?.sykdomsdagtype === 'SYKEDAG' || dag?.sykdomsdagtype === 'SYKEDAG_NAV'),
    ).some((dag) => (dag?.utbetalingsinfo?.totalGrad ?? 100) < 20);
};

const kappOverlappendePerioder = (
    overlappendePerioder: DatePeriod[],
    aktivPeriode: DatePeriod,
): DatePeriod[] | undefined => {
    const fomdatoer: string[] = [];
    const tomdatoer: string[] = [];

    overlappendePerioder.forEach((periode) => {
        if (erIPeriode(periode.fom, aktivPeriode)) {
            fomdatoer.push(periode.fom);
            if (erEtter(periode.fom, aktivPeriode.fom)) {
                tomdatoer.push(minusEnDag(periode.fom));
            }
        }
        if (erIPeriode(periode.tom, aktivPeriode)) {
            tomdatoer.push(periode.tom);
            if (erFør(periode.tom, aktivPeriode.tom)) {
                fomdatoer.push(plussEnDag(periode.tom));
            }
        }
    });

    const unikeFomdatoer = [...new Set(fomdatoer)];
    const unikeTomdatoer = [...new Set(tomdatoer)];

    const alleDatoerSortertStigende = [...unikeFomdatoer, ...unikeTomdatoer].sort(byDate).filter(isNotNullOrUndefined);

    if (alleDatoerSortertStigende.length % 2 !== 0) return undefined;

    const oppkuttedePerioder: DatePeriod[] = [];
    for (let i = 0; i < alleDatoerSortertStigende.length; i += 2) {
        const fom = alleDatoerSortertStigende[i];
        const tom = alleDatoerSortertStigende[i + 1];

        if (!fom || !tom) return undefined;
        oppkuttedePerioder.push({ fom, tom });
    }

    return oppkuttedePerioder;
};

export const getOppkuttedePerioder = (
    overlappendeArbeidsgivere: ArbeidsgiverFragment[],
    aktivPeriode: ActivePeriod,
): DatePeriod[] | undefined =>
    kappOverlappendePerioder(allePerioder(overlappendeArbeidsgivere), tilDatePeriod(aktivPeriode));

const allePerioder = (overlappendeArbeidsgivere: ArbeidsgiverFragment[]): DatePeriod[] =>
    R.pipe(
        overlappendeArbeidsgivere,
        R.flatMap((ag) => ag.generasjoner[0]?.perioder),
        R.filter((periode) => periode !== undefined),
        R.map(tilDatePeriod),
    );

const tilDatePeriod = (periode: { fom: string; tom: string }): DatePeriod => ({ fom: periode.fom, tom: periode.tom });

const byDate = (a: string, b: string): number => {
    return dayjs(a, ISO_DATOFORMAT).isBefore(b) ? -1 : 1;
};

interface LagretNotat {
    vedtaksperiodeId: string;
    tekst: string;
}

const lokaleArbeidstidsvurderingNotaterState = atom<LagretNotat[]>([]);

export const useNotater = () => useAtomValue(lokaleArbeidstidsvurderingNotaterState);

export const useReplaceNotat = () => {
    const setNotat = useSetAtom(lokaleArbeidstidsvurderingNotaterState);
    return (nyttNotat: LagretNotat) => {
        setNotat((currentState: LagretNotat[]) => [
            ...currentState.filter((notat) => notat.vedtaksperiodeId !== nyttNotat.vedtaksperiodeId),
            nyttNotat,
        ]);
    };
};

export const useFjernNotat = () => {
    const setNotat = useSetAtom(lokaleArbeidstidsvurderingNotaterState);
    return (vedtaksperiodeId: string) => {
        setNotat((currentValue) => [...currentValue.filter((notat) => notat.vedtaksperiodeId !== vedtaksperiodeId)]);
    };
};

export const useGetNotatTekst = (vedtaksperiodeId: string): string | undefined => {
    const notater = useNotater();
    return notater.find((notat) => notat.vedtaksperiodeId === vedtaksperiodeId)?.tekst;
};
