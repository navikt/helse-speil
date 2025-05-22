import cn from 'classnames';
import React from 'react';

import { BodyShort, Box, HStack, Table } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { ArbeidsgiverFragment } from '@io/graphql';
import styles from '@saksbilde/tilkommenInntekt/TilkommenTable.module.css';
import { dekorerTekst, getTypeIcon, tabellArbeidsdager } from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { DatePeriod, DateString } from '@typer/shared';
import { erHelg, erIPeriode, somNorskDato, tilDatoer } from '@utils/date';
import { capitalizeArbeidsgiver } from '@utils/locale';

interface Props {
    arbeidsgivere: ArbeidsgiverFragment[];
    periode: DatePeriod;
    ekskluderteUkedager: DateString[];
}

export const TilkommenInntektDagoversikt = ({ arbeidsgivere, periode, ekskluderteUkedager }: Props) => {
    const arbeidsgiverdager = tabellArbeidsdager(arbeidsgivere).filter((dag) => erIPeriode(dag.dato, periode));
    const arbeidsgiverrad = arbeidsgiverdager.reduce((acc: string[], arbeidsgierdag) => {
        if (arbeidsgierdag.arbeidsgivere.length > acc.length) {
            return arbeidsgierdag.arbeidsgivere.map((dag) => dag.navn);
        } else {
            return acc;
        }
    }, []);
    const datoer = tilDatoer(periode);

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
                        {arbeidsgiverrad.map((arbeidsgiver) => (
                            <Table.HeaderCell key={arbeidsgiver}>
                                <AnonymizableTextWithEllipsis weight="semibold">
                                    {capitalizeArbeidsgiver(arbeidsgiver)}
                                </AnonymizableTextWithEllipsis>
                            </Table.HeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {datoer.map((dato) => {
                        const dag = arbeidsgiverdager.find((dag) => dag.dato === dato)!;
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
                                {dag.arbeidsgivere.map((arbeidsgiver) => (
                                    <Table.DataCell key={dato + arbeidsgiver.navn}>
                                        <HStack gap="2" wrap={false}>
                                            <div className={styles.icon}>{getTypeIcon(arbeidsgiver.dagtype, helg)}</div>
                                            <BodyShort>{dekorerTekst(arbeidsgiver.dagtype, helg)}</BodyShort>
                                        </HStack>
                                    </Table.DataCell>
                                ))}
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </Box>
    );
};
