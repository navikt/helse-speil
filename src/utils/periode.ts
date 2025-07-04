import { ArbeidsgiverFragment, UberegnetPeriodeFragment, Utbetalingsdagtype } from '@io/graphql';

export const getAntallAGPDagerBruktFørPerioden = (
    arbeidsgiver: ArbeidsgiverFragment,
    periode: UberegnetPeriodeFragment,
) =>
    arbeidsgiver.generasjoner[0]?.perioder
        .filter((it) => it.skjaeringstidspunkt === periode.skjaeringstidspunkt)
        .filter((it) => it.fom < periode.fom)
        .reverse()
        .flatMap((it) => it.tidslinje)
        .filter(
            (dag) =>
                dag.utbetalingsdagtype === 'ARBEIDSGIVERPERIODEDAG' ||
                (['SYKEDAG', 'SYK_HELGEDAG'].includes(dag.sykdomsdagtype) &&
                    dag.utbetalingsdagtype === Utbetalingsdagtype.UkjentDag),
        ).length;
