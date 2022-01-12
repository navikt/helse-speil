import { Dayjs } from 'dayjs';

import { usePerson } from '../state/person';

const useHistorikkelement = (beregningId: string): HistorikkElement | undefined =>
    usePerson()
        ?.arbeidsgivere.flatMap((arb: Arbeidsgiver) => arb.utbetalingshistorikk)
        .find((element: HistorikkElement) => element.id === beregningId);

export const utbetalingshistorikkelement = (
    id: string,
    vilkårsgrunnlaghistorikkId: string,
    beregnettidslinje: Sykdomsdag[],
    hendelsetidslinje: Sykdomsdag[],
    utbetaling: UtbetalingshistorikkElement,
    tidsstempel: Dayjs
): HistorikkElement => ({
    id: id,
    vilkårsgrunnlaghistorikkId: vilkårsgrunnlaghistorikkId,
    beregnettidslinje: beregnettidslinje,
    hendelsetidslinje: hendelsetidslinje,
    utbetaling: utbetaling,
    kilde: utbetaling.type,
    tidsstempel: tidsstempel,
});

export const useUtbetaling = (beregningId: string): UtbetalingshistorikkElement | undefined => {
    const element = useHistorikkelement(beregningId);
    if (!element) return undefined;
    return element.utbetaling;
};

export const useErAnnullert = (beregningId: string): boolean => {
    const fagsystemId = useUtbetaling(beregningId)?.arbeidsgiverFagsystemId!;
    const annullerteFagsystemider = useAnnulleringer()?.flatMap(
        ({ utbetaling }: HistorikkElement) => utbetaling.arbeidsgiverFagsystemId
    );
    return annullerteFagsystemider?.includes(fagsystemId) ?? false;
};

export const useAnnulleringer = () =>
    usePerson()
        ?.arbeidsgivere.flatMap(({ utbetalingshistorikk }: Arbeidsgiver) => utbetalingshistorikk)
        .filter(({ utbetaling }: HistorikkElement) => utbetaling.type === 'ANNULLERING');

export const erUtbetaling = (utbetaling: UtbetalingshistorikkElement) => utbetaling.type === 'UTBETALING';

export const sykdomstidslinje = (sykdomstidslinje: Sykdomsdag[], fom: Dayjs, tom: Dayjs) =>
    sykdomstidslinje.filter(({ dato }) => fom.isSameOrBefore(dato) && tom.isSameOrAfter(dato));

export const utbetalingstidslinje = (utbetaling: UtbetalingshistorikkElement, fom: Dayjs, tom: Dayjs) =>
    utbetaling.utbetalingstidslinje.filter(({ dato }) => fom.isSameOrBefore(dato) && tom.isSameOrAfter(dato));

export const erRevurderingsperiode = (periode: TidslinjeperiodeMedSykefravær) => periode.type === 'REVURDERING';

export const useMaksdato = (beregningId: string) => useUtbetaling(beregningId)?.maksdato;

export const useGjenståendeDager = (beregningId: string): number | null =>
    useUtbetaling(beregningId)?.gjenståendeDager ?? null;
