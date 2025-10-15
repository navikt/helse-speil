import cn from 'classnames';
import React from 'react';

import { BodyShort, Box, HStack, Table } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import styles from '@saksbilde/tilkommenInntekt/TilkommenTable.module.css';
import { tilDagtypeTabell } from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { DagtypeCell } from '@saksbilde/utbetaling/utbetalingstabell/DagtypeCell';
import { Inntektsforhold, inntektsforholdReferanseTilKey } from '@state/inntektsforhold/inntektsforhold';
import { DatePeriod, DateString } from '@typer/shared';
import { erHelg, somNorskDato } from '@utils/date';

interface Props {
    inntektsforhold: Inntektsforhold[];
    periode: DatePeriod;
    ekskluderteUkedager: DateString[];
}

export const TilkommenInntektDagoversikt = ({ inntektsforhold, periode, ekskluderteUkedager }: Props) => {
    const { inntektsforholdReferanser, rader } = tilDagtypeTabell(periode, inntektsforhold);

    return (
        <Box
            borderWidth="1 1 1 1"
            borderColor="border-strong"
            width="max-content"
            height="max-content"
            minWidth="300px"
        >
            <Box background="surface-subtle" borderWidth="0 0 1 0" borderColor="border-strong">
                <HStack align="center" padding="2">
                    <BodyShort weight="semibold">Dagoversikt</BodyShort>
                </HStack>
            </Box>
            <Table size="small" className={cn(styles.tabell, styles.visning)}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Dato</Table.HeaderCell>
                        {inntektsforholdReferanser.map((inntektsforhold) => (
                            <Table.HeaderCell key={inntektsforholdReferanseTilKey(inntektsforhold)}>
                                <Inntektsforholdnavn inntektsforholdReferanse={inntektsforhold} weight="semibold" />
                            </Table.HeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {rader.map(({ dato, dagtypePerInntektsforhold }) => {
                        const helg = erHelg(dato);
                        const valgt = ekskluderteUkedager.includes(dato);
                        return (
                            <Table.Row
                                key={dato + 'row'}
                                className={cn(helg && styles.helg, valgt && styles.valgteDatoer)}
                            >
                                <Table.DataCell>
                                    <span id={`id-${dato}`}>{somNorskDato(dato)}</span>
                                </Table.DataCell>
                                {inntektsforholdReferanser.map((inntektsforhold) => {
                                    const dagtype = dagtypePerInntektsforhold.get(inntektsforhold);
                                    const key = dato + inntektsforholdReferanseTilKey(inntektsforhold);
                                    return dagtype ? (
                                        <DagtypeCell tabelldag={dagtype} key={key} />
                                    ) : (
                                        <Table.DataCell key={key} />
                                    );
                                })}
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </Box>
    );
};
