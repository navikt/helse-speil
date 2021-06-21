import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import { Dag, Dagtype, Kildetype, OverstyrtDag, Sykdomsdag } from 'internal-types';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Tidslinjeperiode } from '../../../../modell/UtbetalingshistorikkElement';
import { NORSK_DATOFORMAT } from '../../../../utils/date';

import { Header } from '../../table/Header';
import { Row } from '../../table/Row';
import { Table } from '../../table/Table';
import { DateCell } from './DateCell';
import { GjenståendeDagerCell } from './GjenståendeDagerCell';
import { KildeCell } from './KildeCell';
import { MerknaderCell } from './MerknaderCell';
import { OverstyrbarDagtypeCell } from './OverstyrbarDagtypeCell';
import { OverstyrbarGradCell } from './OverstyrbarGradCell';
import { Overstyringsskjema } from './Overstyringsskjema';
import { TotalGradCell } from './TotalGradCell';
import { TotalRow } from './TotalRow';
import { UtbetalingCell } from './UtbetalingCell';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';
import { getMatchingSykdomsdag, withDagerIgjen } from './Utbetalingstabell.utils';
import { useOverstyrteDager } from './useOverstyrteDager';

const Container = styled.section`
    flex: 1;
    overflow-x: scroll;
    margin: 0;
    height: 100%;
    width: 400px;
`;

const OverstyrbarRow = styled(Row)<{ overstyrt: boolean }>`
    ${(props) =>
        props.overstyrt &&
        css`
            > td {
                font-style: italic;
            }
        `}
`;

const getMatchingOverstyrtDag = (sykdomsdag: Sykdomsdag, overstyrteDager: OverstyrtDag[]): OverstyrtDag | undefined =>
    overstyrteDager.find((overstyrtDag) => overstyrtDag.dato.isSame(sykdomsdag.dato));

interface OverstyrbarUtbetalingstabellProps {
    periode: Tidslinjeperiode;
    onPostOverstyring: (dager: Dag[], begrunnelse: string, callback: () => void) => void;
    onCloseOverstyring: () => void;
    erRevurdering: boolean;
    gjenståendeDager?: number;
    maksdato?: Dayjs;
}

export const OverstyrbarUtbetalingstabell = ({
    periode,
    onPostOverstyring,
    onCloseOverstyring,
    erRevurdering,
    gjenståendeDager,
    maksdato,
}: OverstyrbarUtbetalingstabellProps) => {
    const fom = periode.fom.format(NORSK_DATOFORMAT);
    const tom = periode.tom.format(NORSK_DATOFORMAT);

    const form = useForm({ shouldFocusError: false, mode: 'onBlur' });

    const { dager, addDag } = useOverstyrteDager(periode.utbetalingstidslinje);

    const antallDagerIgjen = maksdato
        ? periode.utbetalingstidslinje.filter((it) => it.type === Dagtype.Syk && it.dato.isSameOrBefore(maksdato))
              .length + (gjenståendeDager ?? 0)
        : gjenståendeDager ?? 0;

    const utbetalingsdager = gjenståendeDager
        ? withDagerIgjen(periode.utbetalingstidslinje, antallDagerIgjen)
        : periode.utbetalingstidslinje;

    const rader: [UtbetalingstabellDag, Sykdomsdag, OverstyrtDag | undefined][] = utbetalingsdager.map((it) => [
        it,
        getMatchingSykdomsdag(it, periode.sykdomstidslinje),
        getMatchingOverstyrtDag(it, dager),
    ]);

    const onFormSubmit = () => {
        onPostOverstyring(dager, form.getValues().begrunnelse, onCloseOverstyring);
    };

    return (
        <Container>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onFormSubmit)}>
                    <Table aria-label={`Utbetalinger for sykmeldingsperiode fra ${fom} til ${tom}`}>
                        <thead>
                            <tr>
                                <Header scope="col" colSpan={1}>
                                    Dato
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Utbet. dager
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Grad
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Kilde
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Total grad
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Utbetaling
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Dager igjen
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Merknader
                                </Header>
                            </tr>
                        </thead>
                        <tbody>
                            <TotalRow
                                utbetalingstidslinje={periode.utbetalingstidslinje}
                                maksdato={maksdato}
                                gjenståendeDager={gjenståendeDager}
                            />
                            {rader.map(([utbetalingsdag, sykdomsdag, maybeOverstyrtDag], i) => (
                                <OverstyrbarRow type={utbetalingsdag.type} key={i} overstyrt={!!maybeOverstyrtDag}>
                                    <DateCell date={utbetalingsdag.dato} erOverstyrt={!!maybeOverstyrtDag} />
                                    <OverstyrbarDagtypeCell
                                        sykdomsdag={sykdomsdag}
                                        utbetalingsdag={utbetalingsdag}
                                        onOverstyr={addDag}
                                        erRevurdering={erRevurdering}
                                    />
                                    <OverstyrbarGradCell
                                        sykdomsdag={sykdomsdag}
                                        utbetalingsdag={utbetalingsdag}
                                        onOverstyr={addDag}
                                        erRevurdering={erRevurdering}
                                        overstyrtDag={maybeOverstyrtDag}
                                    />
                                    <KildeCell
                                        type={sykdomsdag.type}
                                        kilde={maybeOverstyrtDag ? Kildetype.Saksbehandler : sykdomsdag.kilde}
                                    />
                                    <TotalGradCell
                                        type={utbetalingsdag.type}
                                        totalGradering={utbetalingsdag.totalGradering}
                                        erOverstyrt={!!maybeOverstyrtDag}
                                    />
                                    <UtbetalingCell
                                        utbetaling={utbetalingsdag.utbetaling}
                                        erOverstyrt={!!maybeOverstyrtDag}
                                    />
                                    <GjenståendeDagerCell
                                        gjenståendeDager={utbetalingsdag.dagerIgjen}
                                        erOverstyrt={!!maybeOverstyrtDag}
                                    />
                                    <MerknaderCell
                                        style={{ width: '100%' }}
                                        dag={utbetalingsdag}
                                        isMaksdato={!!maksdato && maksdato?.isSame(utbetalingsdag.dato)}
                                    />
                                </OverstyrbarRow>
                            ))}
                        </tbody>
                    </Table>
                    <Overstyringsskjema avbrytOverstyring={onCloseOverstyring} overstyrteDager={dager} />
                </form>
            </FormProvider>
        </Container>
    );
};
