import dayjs from 'dayjs';

import {
    Dag,
    Dagoverstyring,
    Dagtype,
    Kildetype,
    Overstyring,
    OverstyrtDag,
    Periode,
    Sykdomsdagtype,
    Utbetalingsdagtype,
} from '@spesialist-mock/schemaTypes';

// Spleis beregner perioden på nytt etter en dagoverstyring. Mocken skriver bare de overstyrte dagene inn i
// tidslinja til nyeste behandling, uten å regne ut beløp, totaler eller arbeidsgiverperiode på nytt.
export function leggPåDagoverstyringer(
    inntektsforhold: { behandlinger: { perioder: Periode[] }[] },
    overstyringer: Overstyring[],
): void {
    const perioder = inntektsforhold.behandlinger[0]?.perioder ?? [];
    // Hver overstyring regnes fra den opprinnelige dagen, slik at en ny overstyring ikke arver forrige
    const opprinneligeDager = new Map(perioder.flatMap((periode) => periode.tidslinje).map((dag) => [dag.dato, dag]));
    overstyringer
        .filter(erDagoverstyring)
        .sort((a, b) => dayjs(a.timestamp).diff(dayjs(b.timestamp)))
        .forEach((overstyring) =>
            overstyring.dager.forEach((overstyrtDag) =>
                perioder.forEach((periode) => {
                    periode.tidslinje = periode.tidslinje.map((dag) =>
                        dag.dato === overstyrtDag.dato
                            ? overstyrDag(opprinneligeDager.get(dag.dato) ?? dag, overstyrtDag, overstyring.hendelseId)
                            : dag,
                    );
                }),
            ),
        );
}

function overstyrDag(dag: Dag, overstyrtDag: OverstyrtDag, hendelseId: string): Dag {
    const erHelg = [0, 6].includes(dayjs(dag.dato).day());
    const sykdomsdagtype = tilSykdomsdagtype(overstyrtDag.type, erHelg);
    const utbetalingsdagtype = tilUtbetalingsdagtype(sykdomsdagtype, dag.utbetalingsdagtype, erHelg);
    const utbetales = utbetalingsdagtype === Utbetalingsdagtype.Navdag;
    return {
        ...dag,
        sykdomsdagtype,
        utbetalingsdagtype,
        grad: overstyrtDag.grad ?? null,
        kilde: { id: hendelseId, type: Kildetype.Saksbehandler },
        utbetalingsinfo: utbetales ? dag.utbetalingsinfo : null,
    };
}

function tilSykdomsdagtype(dagtype: Dagtype, erHelg: boolean): Sykdomsdagtype {
    switch (dagtype) {
        case Dagtype.Sykedag:
            return erHelg ? Sykdomsdagtype.SykHelgedag : Sykdomsdagtype.Sykedag;
        case Dagtype.SykedagNav:
            return Sykdomsdagtype.SykedagNav;
        case Dagtype.Arbeidsdag:
            return erHelg ? Sykdomsdagtype.FriskHelgedag : Sykdomsdagtype.Arbeidsdag;
        case Dagtype.Helg:
            return Sykdomsdagtype.FriskHelgedag;
        case Dagtype.Feriedag:
            return Sykdomsdagtype.Feriedag;
        case Dagtype.Permisjonsdag:
            return Sykdomsdagtype.Permisjonsdag;
        case Dagtype.Egenmeldingsdag:
            return Sykdomsdagtype.Arbeidsgiverdag;
        case Dagtype.ArbeidIkkeGjenopptattDag:
            return Sykdomsdagtype.Arbeidikkegjenopptattdag;
        case Dagtype.MeldingTilNavdag:
            return Sykdomsdagtype.Meldingtilnavdag;
        case Dagtype.AvslattMeldingTilNavdag:
            return Sykdomsdagtype.Avslattmeldingtilnavdag;
        case Dagtype.Avvistdag:
            return Sykdomsdagtype.Avslatt;
        case Dagtype.AaPdag:
            return Sykdomsdagtype.AndreYtelserAap;
        case Dagtype.Dagpengerdag:
            return Sykdomsdagtype.AndreYtelserDagpenger;
        case Dagtype.Foreldrepengerdag:
            return Sykdomsdagtype.AndreYtelserForeldrepenger;
        case Dagtype.Omsorgspengerdag:
            return Sykdomsdagtype.AndreYtelserOmsorgspenger;
        case Dagtype.Opplaringspengerdag:
            return Sykdomsdagtype.AndreYtelserOpplaringspenger;
        case Dagtype.Pleiepengerdag:
            return Sykdomsdagtype.AndreYtelserPleiepenger;
        case Dagtype.Svangerskapspengerdag:
            return Sykdomsdagtype.AndreYtelserSvangerskapspenger;
    }
}

function tilUtbetalingsdagtype(
    sykdomsdagtype: Sykdomsdagtype,
    tidligere: Utbetalingsdagtype,
    erHelg: boolean,
): Utbetalingsdagtype {
    switch (sykdomsdagtype) {
        case Sykdomsdagtype.Sykedag:
        case Sykdomsdagtype.SykedagNav:
        case Sykdomsdagtype.SykHelgedag:
            if (
                tidligere === Utbetalingsdagtype.Navdag ||
                tidligere === Utbetalingsdagtype.Navhelgdag ||
                tidligere === Utbetalingsdagtype.Arbeidsgiverperiodedag
            )
                return tidligere;
            return erHelg ? Utbetalingsdagtype.Navhelgdag : Utbetalingsdagtype.Navdag;
        case Sykdomsdagtype.Arbeidsgiverdag:
            return Utbetalingsdagtype.Arbeidsgiverperiodedag;
        case Sykdomsdagtype.Feriedag:
        case Sykdomsdagtype.Permisjonsdag:
            return Utbetalingsdagtype.Feriedag;
        case Sykdomsdagtype.Arbeidsdag:
        case Sykdomsdagtype.Arbeidikkegjenopptattdag:
            return Utbetalingsdagtype.Arbeidsdag;
        case Sykdomsdagtype.FriskHelgedag:
            return Utbetalingsdagtype.Helgedag;
        default:
            return Utbetalingsdagtype.AvvistDag;
    }
}

function erDagoverstyring(overstyring: Overstyring): overstyring is Dagoverstyring {
    return (overstyring as Dagoverstyring).__typename === 'Dagoverstyring';
}
