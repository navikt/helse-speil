import dayjs from 'dayjs';
import { useMemo } from 'react';

import {
    ApiDag,
    ApiDagoverstyring,
    ApiDagtype,
    ApiOverstyrtDag,
    ApiSykdomsdagtype,
    ApiUtbetalingsdagtype,
} from '@io/rest/generated/spesialist.schemas';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import {
    AAPdag,
    ArbeidIkkeGjenopptattDag,
    Arbeidsdag,
    AvslattMeldingTilNavdag,
    Avslåttdag,
    AvvistEllerForeldetDag,
    Dagpengerdag,
    Egenmeldingsdag,
    Feriedag,
    Foreldrepengerdag,
    Helgedag,
    MeldingTilNavdag,
    Navhelgedag,
    Omsorgspengerdag,
    Opplæringspengerdag,
    Permisjonsdag,
    Pleiepengerdag,
    Speildag,
    Svangerskapspengerdag,
    Sykedag,
    SykedagNav,
    getSpeildag,
} from './utbetalingstabelldager';

const getUtbetalingstabelldagtypeFromOverstyrtDag = (dag: ApiOverstyrtDag): Speildag => {
    switch (dag.type) {
        case ApiDagtype.Helg:
            return Helgedag;
        case ApiDagtype.AAPdag:
            return AAPdag;
        case ApiDagtype.Dagpengerdag:
            return Dagpengerdag;
        case ApiDagtype.Foreldrepengerdag:
            return Foreldrepengerdag;
        case ApiDagtype.Omsorgspengerdag:
            return Omsorgspengerdag;
        case ApiDagtype.Opplaringspengerdag:
            return Opplæringspengerdag;
        case ApiDagtype.Pleiepengerdag:
            return Pleiepengerdag;
        case ApiDagtype.Svangerskapspengerdag:
            return Svangerskapspengerdag;
        case ApiDagtype.ArbeidIkkeGjenopptattDag:
            return ArbeidIkkeGjenopptattDag;
        case ApiDagtype.Egenmeldingsdag:
            return Egenmeldingsdag;
        case ApiDagtype.Feriedag:
            return Feriedag;
        case ApiDagtype.Permisjonsdag:
            return Permisjonsdag;
        case ApiDagtype.Sykedag:
            return Sykedag;
        case ApiDagtype.Arbeidsdag:
            return Arbeidsdag;
        case ApiDagtype.SykedagNav:
            return SykedagNav;
        case ApiDagtype.Avvistdag:
            return Avslåttdag;
        case ApiDagtype.MeldingTilNavdag:
            return MeldingTilNavdag;
        case ApiDagtype.AvslattMeldingTilNavdag:
            return AvslattMeldingTilNavdag;
    }
};

const getUtbetalingstabelldag = (dag: ApiDag): Speildag => {
    switch (dag.utbetalingsdagtype) {
        case ApiUtbetalingsdagtype.ARBEIDSDAG:
            return Arbeidsdag;
        case ApiUtbetalingsdagtype.NAVHELGDAG:
            return Navhelgedag;
        case ApiUtbetalingsdagtype.NAVDAG:
            return Sykedag;
        case ApiUtbetalingsdagtype.AVVIST_DAG:
            if (
                dag.sykdomsdagtype === ApiSykdomsdagtype.AVSLATTMELDINGTILNAVDAG ||
                dag.sykdomsdagtype === ApiSykdomsdagtype.MELDINGTILNAVDAG
            ) {
                return AvslattMeldingTilNavdag;
            }
            return AvvistEllerForeldetDag(dag.sykdomsdagtype, dag.utbetalingsdagtype);
        case ApiUtbetalingsdagtype.FORELDET_DAG:
            return AvvistEllerForeldetDag(dag.sykdomsdagtype, dag.utbetalingsdagtype);
    }

    return getSpeildag(dag.sykdomsdagtype, dag.utbetalingsdagtype);
};

export const createDagerMap = (
    dager: ApiDag[],
    erSelvstendigNæringsdrivende: boolean,
    totaltAntallDagerIgjen: number | null,
    antallAGPDagerBruktFørPerioden?: number,
    maksdato?: DateString,
): Map<DateString, Utbetalingstabelldag> => {
    const map = new Map<DateString, Utbetalingstabelldag>();
    let dagerIgjen = totaltAntallDagerIgjen;
    let dagnummerAGP = antallAGPDagerBruktFørPerioden ?? 16;

    for (let i = 0; i < dager.length; i++) {
        const currentDag = dager[i];
        if (!currentDag) break;

        if (typeof dagerIgjen === 'number') {
            dagerIgjen = currentDag.utbetalingsdagtype === 'NAVDAG' ? dagerIgjen - 1 : dagerIgjen;
        }

        let erAGP = currentDag.utbetalingsdagtype === 'ARBEIDSGIVERPERIODEDAG';
        if (
            !erSelvstendigNæringsdrivende &&
            dagnummerAGP < 16 &&
            ['SYKEDAG', 'SYK_HELGEDAG'].includes(currentDag.sykdomsdagtype) &&
            currentDag.utbetalingsdagtype === ApiUtbetalingsdagtype.UKJENT_DAG
        ) {
            erAGP = true;
            dagnummerAGP++;
        }
        map.set(currentDag.dato, {
            dato: currentDag.dato,
            kilde: currentDag.kilde,
            dag: getUtbetalingstabelldag(currentDag),
            erAGP: erAGP,
            erVentetid: currentDag.utbetalingsdagtype === 'VENTETIDSDAG',
            erAvvist: currentDag.utbetalingsdagtype === 'AVVIST_DAG',
            erForeldet: currentDag.utbetalingsdagtype === 'FORELDET_DAG',
            erMaksdato: typeof maksdato === 'string' && dayjs(maksdato).isSame(currentDag.dato, 'day'),
            grad: currentDag.grad,
            dagerIgjen: typeof dagerIgjen === 'number' ? Math.max(dagerIgjen, 0) : null,
            totalGradering: currentDag.utbetalingsinfo?.totalGrad,
            arbeidsgiverbeløp: currentDag.utbetalingsinfo?.arbeidsgiverbelop,
            personbeløp: currentDag.utbetalingsinfo?.personbelop,
            begrunnelser: currentDag.begrunnelser,
        });
    }

    return map;
};

export const antallSykedagerTilOgMedMaksdato = (dager: ApiDag[], maksdato?: DateString): number =>
    maksdato
        ? dager.filter((it) => it.utbetalingsdagtype === 'NAVDAG' && dayjs(it.dato).isSameOrBefore(maksdato)).length
        : 0;

type UseTabelldagerMapOptions = {
    tidslinje: ApiDag[];
    gjenståendeDager?: number | null;
    overstyringer?: ApiDagoverstyring[];
    maksdato?: DateString;
    skjæringstidspunkt?: DateString;
    antallAGPDagerBruktFørPerioden?: number;
    erSelvstendigNæringsdrivende: boolean;
};

export const useTabelldagerMap = ({
    tidslinje,
    gjenståendeDager,
    overstyringer = [],
    maksdato,
    antallAGPDagerBruktFørPerioden,
    erSelvstendigNæringsdrivende,
}: UseTabelldagerMapOptions): Map<string, Utbetalingstabelldag> =>
    useMemo(() => {
        const antallDagerIgjen: number | null =
            typeof gjenståendeDager === 'number'
                ? gjenståendeDager + antallSykedagerTilOgMedMaksdato(tidslinje, maksdato)
                : null;

        const dager: Map<DateString, Utbetalingstabelldag> = createDagerMap(
            tidslinje,
            erSelvstendigNæringsdrivende,
            antallDagerIgjen,
            antallAGPDagerBruktFørPerioden,
        );

        for (const overstyring of overstyringer) {
            for (const overstyrtDag of overstyring.dager) {
                const existing = dager.get(overstyrtDag.dato);
                if (existing) {
                    dager.set(overstyrtDag.dato, {
                        ...existing,
                        overstyringer: (existing.overstyringer ?? []).concat([
                            {
                                vedtaksperiodeId: overstyring.vedtaksperiodeId,
                                hendelseId: overstyring.hendelseId,
                                begrunnelse: overstyring.begrunnelse,
                                saksbehandler: overstyring.saksbehandler,
                                timestamp: overstyring.timestamp,
                                grad: overstyrtDag.grad,
                                fraGrad: overstyrtDag.fraGrad,
                                dag: getUtbetalingstabelldagtypeFromOverstyrtDag(overstyrtDag),
                                dato: overstyrtDag.dato,
                                ferdigstilt: overstyring.ferdigstilt,
                            },
                        ]),
                    });
                }
            }
        }

        return dager;
    }, [
        gjenståendeDager,
        tidslinje,
        maksdato,
        erSelvstendigNæringsdrivende,
        antallAGPDagerBruktFørPerioden,
        overstyringer,
    ]);
