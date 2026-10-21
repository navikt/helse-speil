import dayjs from 'dayjs';

import {
    ApiDag,
    ApiDagoverstyring,
    ApiDagtype,
    ApiKildetype,
    ApiOverstyring,
    ApiOverstyrtDag,
    ApiPeriode,
    ApiSykdomsdagtype,
    ApiUtbetalingsdagtype,
} from '@io/rest/generated/spesialist.schemas';

// Spleis beregner perioden på nytt etter en dagoverstyring. Mocken skriver bare de overstyrte dagene inn i
// tidslinja til nyeste behandling, uten å regne ut beløp, totaler eller arbeidsgiverperiode på nytt.
export function leggPåDagoverstyringer(
    inntektsforhold: { behandlinger: { perioder: ApiPeriode[] }[] },
    overstyringer: ApiOverstyring[],
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

function overstyrDag(dag: ApiDag, overstyrtDag: ApiOverstyrtDag, hendelseId: string): ApiDag {
    const erHelg = [0, 6].includes(dayjs(dag.dato).day());
    const sykdomsdagtype = tilSykdomsdagtype(overstyrtDag.type, erHelg);
    const utbetalingsdagtype = tilUtbetalingsdagtype(sykdomsdagtype, dag.utbetalingsdagtype, erHelg);
    const utbetales = utbetalingsdagtype === ApiUtbetalingsdagtype.NAVDAG;
    return {
        ...dag,
        sykdomsdagtype,
        utbetalingsdagtype,
        grad: overstyrtDag.grad ?? null,
        kilde: { id: hendelseId, type: ApiKildetype.SAKSBEHANDLER },
        utbetalingsinfo: utbetales ? dag.utbetalingsinfo : null,
    };
}

function tilSykdomsdagtype(dagtype: ApiDagtype, erHelg: boolean): ApiSykdomsdagtype {
    switch (dagtype) {
        case ApiDagtype.Sykedag:
            return erHelg ? ApiSykdomsdagtype.SYK_HELGEDAG : ApiSykdomsdagtype.SYKEDAG;
        case ApiDagtype.SykedagNav:
            return ApiSykdomsdagtype.SYKEDAG_NAV;
        case ApiDagtype.Arbeidsdag:
            return erHelg ? ApiSykdomsdagtype.FRISK_HELGEDAG : ApiSykdomsdagtype.ARBEIDSDAG;
        case ApiDagtype.Helg:
            return ApiSykdomsdagtype.FRISK_HELGEDAG;
        case ApiDagtype.Feriedag:
            return ApiSykdomsdagtype.FERIEDAG;
        case ApiDagtype.Permisjonsdag:
            return ApiSykdomsdagtype.PERMISJONSDAG;
        case ApiDagtype.Egenmeldingsdag:
            return ApiSykdomsdagtype.ARBEIDSGIVERDAG;
        case ApiDagtype.ArbeidIkkeGjenopptattDag:
            return ApiSykdomsdagtype.ARBEIDIKKEGJENOPPTATTDAG;
        case ApiDagtype.MeldingTilNavdag:
            return ApiSykdomsdagtype.MELDINGTILNAVDAG;
        case ApiDagtype.AvslattMeldingTilNavdag:
            return ApiSykdomsdagtype.AVSLATTMELDINGTILNAVDAG;
        case ApiDagtype.Avvistdag:
            return ApiSykdomsdagtype.AVSLATT;
        case ApiDagtype.AAPdag:
            return ApiSykdomsdagtype.ANDRE_YTELSER_AAP;
        case ApiDagtype.Dagpengerdag:
            return ApiSykdomsdagtype.ANDRE_YTELSER_DAGPENGER;
        case ApiDagtype.Foreldrepengerdag:
            return ApiSykdomsdagtype.ANDRE_YTELSER_FORELDREPENGER;
        case ApiDagtype.Omsorgspengerdag:
            return ApiSykdomsdagtype.ANDRE_YTELSER_OMSORGSPENGER;
        case ApiDagtype.Opplaringspengerdag:
            return ApiSykdomsdagtype.ANDRE_YTELSER_OPPLARINGSPENGER;
        case ApiDagtype.Pleiepengerdag:
            return ApiSykdomsdagtype.ANDRE_YTELSER_PLEIEPENGER;
        case ApiDagtype.Svangerskapspengerdag:
            return ApiSykdomsdagtype.ANDRE_YTELSER_SVANGERSKAPSPENGER;
    }
}

function tilUtbetalingsdagtype(
    sykdomsdagtype: ApiSykdomsdagtype,
    tidligere: ApiUtbetalingsdagtype,
    erHelg: boolean,
): ApiUtbetalingsdagtype {
    switch (sykdomsdagtype) {
        case ApiSykdomsdagtype.SYKEDAG:
        case ApiSykdomsdagtype.SYKEDAG_NAV:
        case ApiSykdomsdagtype.SYK_HELGEDAG:
            if (
                tidligere === ApiUtbetalingsdagtype.NAVDAG ||
                tidligere === ApiUtbetalingsdagtype.NAVHELGDAG ||
                tidligere === ApiUtbetalingsdagtype.ARBEIDSGIVERPERIODEDAG
            )
                return tidligere;
            return erHelg ? ApiUtbetalingsdagtype.NAVHELGDAG : ApiUtbetalingsdagtype.NAVDAG;
        case ApiSykdomsdagtype.ARBEIDSGIVERDAG:
            return ApiUtbetalingsdagtype.ARBEIDSGIVERPERIODEDAG;
        case ApiSykdomsdagtype.FERIEDAG:
        case ApiSykdomsdagtype.PERMISJONSDAG:
            return ApiUtbetalingsdagtype.FERIEDAG;
        case ApiSykdomsdagtype.ARBEIDSDAG:
        case ApiSykdomsdagtype.ARBEIDIKKEGJENOPPTATTDAG:
            return ApiUtbetalingsdagtype.ARBEIDSDAG;
        case ApiSykdomsdagtype.FRISK_HELGEDAG:
            return ApiUtbetalingsdagtype.HELGEDAG;
        default:
            return ApiUtbetalingsdagtype.AVVIST_DAG;
    }
}

function erDagoverstyring(overstyring: ApiOverstyring): overstyring is ApiDagoverstyring {
    return overstyring.type === 'ApiDagoverstyring';
}
