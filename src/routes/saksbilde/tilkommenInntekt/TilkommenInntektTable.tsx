import cn from 'classnames';
import React, { ReactElement, useEffect, useState } from 'react';

import { BodyShort, Box, Checkbox, HStack, Table, VStack } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { ArbeidsgiverFragment } from '@io/graphql';
import { dekorerTekst, getTypeIcon, tabellArbeidsdager } from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { DateString } from '@typer/shared';
import { erHelg, somNorskDato } from '@utils/date';
import { capitalizeArbeidsgiver } from '@utils/locale';

import styles from './TilkommenTable.module.css';

interface TilkommenInntektTableProps {
    arbeidsgivere: ArbeidsgiverFragment[];
    fom: DateString;
    tom: DateString;
    setDagerSomSkalEkskluderes: (datoer: DateString[]) => void;
}

export const TilkommenInntektTable = ({
    arbeidsgivere,
    fom,
    tom,
    setDagerSomSkalEkskluderes,
}: TilkommenInntektTableProps): ReactElement => {
    const [valgteDatoer, setValgteDatoer] = useState<DateString[]>([]);
    const arbeidsgiverdager = tabellArbeidsdager(arbeidsgivere).filter((dag) => dag.dato >= fom && dag.dato <= tom);
    const valgbareArbeidsdager = arbeidsgiverdager.filter((dag) => !erHelg(dag.dato));
    const toggleValgtDato = (dato: DateString) =>
        setValgteDatoer((prev) => (prev.includes(dato) ? prev.filter((value) => value !== dato) : [...prev, dato]));

    useEffect(() => {
        setDagerSomSkalEkskluderes(valgteDatoer);
    }, [valgteDatoer, setDagerSomSkalEkskluderes]);

    return (
        <VStack paddingBlock="18 6">
            <Box background={'surface-subtle'} borderWidth="0 0 0 2" borderColor="border-default" paddingBlock="4 0">
                <BodyShort weight="semibold" className={styles.tabellTittel} spacing>
                    Velg hvilke dager som ikke skal graderes
                </BodyShort>
                <Table size="small" className={styles.tabell}>
                    <Table.Header className={styles.tabellHeader}>
                        <Table.Row>
                            <Table.HeaderCell className={styles.datoKolonne}>
                                <HStack gap="2" align="center">
                                    <Checkbox
                                        checked={valgbareArbeidsdager.length === valgteDatoer.length}
                                        indeterminate={
                                            valgteDatoer.length > 0 &&
                                            valgteDatoer.length !== valgbareArbeidsdager.length
                                        }
                                        onChange={() => {
                                            if (valgteDatoer.length > 0) {
                                                setValgteDatoer([]);
                                            } else {
                                                setValgteDatoer(valgbareArbeidsdager.map((dag) => dag.dato));
                                            }
                                        }}
                                        hideLabel
                                        size="small"
                                    >
                                        Valg alle rader
                                    </Checkbox>
                                    Dato
                                </HStack>
                            </Table.HeaderCell>
                            {arbeidsgiverdager[0]?.arbeidsgivere.map((arbeidsgiver) => (
                                <Table.HeaderCell key={arbeidsgiver.navn}>
                                    <AnonymizableTextWithEllipsis className={styles.arbeidsgiverNavn}>
                                        {capitalizeArbeidsgiver(arbeidsgiver.navn)}
                                    </AnonymizableTextWithEllipsis>
                                </Table.HeaderCell>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body className={styles.tabelBody}>
                        {arbeidsgiverdager.map((dag) => (
                            <Table.Row
                                key={dag.dato + 'row'}
                                className={cn(
                                    erHelg(dag.dato) && styles.helg,
                                    valgteDatoer.includes(dag.dato) && styles.valgteDatoer,
                                )}
                            >
                                <Table.DataCell>
                                    <HStack align="center" paddingInline="2 0">
                                        {!erHelg(dag.dato) && (
                                            <Checkbox
                                                checked={valgteDatoer.includes(dag.dato)}
                                                onChange={() => toggleValgtDato(dag.dato)}
                                                aria-labelledby={`id-${dag.dato}`}
                                                size="small"
                                            >
                                                {' '}
                                            </Checkbox>
                                        )}
                                        <span id={`id-${dag.dato}`}>{somNorskDato(dag.dato)}</span>
                                    </HStack>
                                </Table.DataCell>
                                {dag.arbeidsgivere.map((arbeidsgiver) => (
                                    <Table.DataCell key={dag.dato + arbeidsgiver.navn}>
                                        <HStack gap="1" align="center" paddingInline="1 0">
                                            <div className={styles.icon}>
                                                {getTypeIcon(arbeidsgiver.dagtype, erHelg(dag.dato))}
                                            </div>
                                            <BodyShort>
                                                {dekorerTekst(arbeidsgiver.dagtype, erHelg(dag.dato))}
                                            </BodyShort>
                                        </HStack>
                                    </Table.DataCell>
                                ))}
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Box>
        </VStack>
    );
};
