import dayjs from 'dayjs';
import { useMemo } from 'react';

import { Dag, Dagoverstyring, Dagtype, Maybe, OverstyrtDag, Sykdomsdagtype, Utbetalingsdagtype } from '@io/graphql';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { erHelg } from '@utils/date';

import {
    AAPdag,
    ArbeidIkkeGjenopptattDag,
    Arbeidsdag,
    Avslåttdag,
    AvvistEllerForeldetDag,
    Dagpengerdag,
    Egenmeldingsdag,
    Feriedag,
    Foreldrepengerdag,
    Helgedag,
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

const getUtbetalingstabelldagtypeFromOverstyrtDag = (dag: OverstyrtDag): Speildag => {
    switch (dag.type) {
        case Dagtype.Helg:
            return Helgedag;
        case Dagtype.AaPdag:
            return AAPdag;
        case Dagtype.Dagpengerdag:
            return Dagpengerdag;
        case Dagtype.Foreldrepengerdag:
            return Foreldrepengerdag;
        case Dagtype.Omsorgspengerdag:
            return Omsorgspengerdag;
        case Dagtype.Opplaringspengerdag:
            return Opplæringspengerdag;
        case Dagtype.Pleiepengerdag:
            return Pleiepengerdag;
        case Dagtype.Svangerskapspengerdag:
            return Svangerskapspengerdag;
        case Dagtype.ArbeidIkkeGjenopptattDag:
            return ArbeidIkkeGjenopptattDag;
        case Dagtype.Egenmeldingsdag:
            return Egenmeldingsdag;
        case Dagtype.Feriedag:
            return Feriedag;
        case Dagtype.Permisjonsdag:
            return Permisjonsdag;
        case Dagtype.Sykedag:
            return Sykedag;
        case Dagtype.Arbeidsdag:
            return Arbeidsdag;
        case Dagtype.SykedagNav:
            return SykedagNav;
        case Dagtype.Avvistdag:
            return Avslåttdag;
    }
};

const getUtbetalingstabelldag = (dag: Dag): Speildag => {
    switch (dag.utbetalingsdagtype) {
        case Utbetalingsdagtype.Arbeidsdag:
            return Arbeidsdag;
        case Utbetalingsdagtype.Navhelgdag:
            return Navhelgedag;
        case Utbetalingsdagtype.Navdag:
            return Sykedag;
        case Utbetalingsdagtype.AvvistDag:
        case Utbetalingsdagtype.ForeldetDag:
            return AvvistEllerForeldetDag(dag.sykdomsdagtype, dag.utbetalingsdagtype);
    }

    if (dag.sykdomsdagtype === Sykdomsdagtype.Ventetidsdag) {
        return erHelg(dag.dato) ? Navhelgedag : Sykedag;
    }

    return getSpeildag(dag.sykdomsdagtype, dag.utbetalingsdagtype);
};

export const createDagerMap = (
    dager: Array<Dag>,
    erSelvstendigNæringsdrivende: boolean,
    totaltAntallDagerIgjen: Maybe<number>,
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
            currentDag.utbetalingsdagtype === Utbetalingsdagtype.UkjentDag
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

export const antallSykedagerTilOgMedMaksdato = (dager: Array<Dag>, maksdato?: DateString): number =>
    maksdato
        ? dager.filter((it) => it.utbetalingsdagtype === 'NAVDAG' && dayjs(it.dato).isSameOrBefore(maksdato)).length
        : 0;

type UseTabelldagerMapOptions = {
    tidslinje: Array<Dag>;
    gjenståendeDager?: Maybe<number>;
    overstyringer?: Array<Dagoverstyring>;
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
        const antallDagerIgjen: Maybe<number> =
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
    }, [gjenståendeDager, tidslinje, maksdato, antallAGPDagerBruktFørPerioden, overstyringer]);
