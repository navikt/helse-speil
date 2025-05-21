import cn from 'classnames';
import React, { Dispatch, ReactElement, SetStateAction, useEffect } from 'react';

import { BodyShort, Box, Checkbox, HStack, Table } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { ArbeidsgiverFragment } from '@io/graphql';
import { dekorerTekst, getTypeIcon, tabellArbeidsdager } from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { DatePeriod, DateString } from '@typer/shared';
import { erHelg, erIPeriode, somNorskDato } from '@utils/date';
import { capitalizeArbeidsgiver } from '@utils/locale';

import styles from '../TilkommenTable.module.css';

interface TilkommenInntektTableProps {
    arbeidsgivere: ArbeidsgiverFragment[];
    periode: DatePeriod;
    ekskluderteUkedager: DateString[];
    setEkskluderteUkedager: Dispatch<SetStateAction<DateString[]>>;
}

export const TilkommenInntektSkjemaTabell = ({
    arbeidsgivere,
    periode,
    ekskluderteUkedager,
    setEkskluderteUkedager,
}: TilkommenInntektTableProps): ReactElement => {
    const arbeidsgiverdager = tabellArbeidsdager(arbeidsgivere).filter((dag) => erIPeriode(dag.dato, periode));
    const arbeidsgiverrad = arbeidsgiverdager.reduce((acc: string[], arbeidsgierdag) => {
        if (arbeidsgierdag.arbeidsgivere.length > acc.length) {
            return arbeidsgierdag.arbeidsgivere.map((dag) => dag.navn);
        } else {
            return acc;
        }
    }, []);
    const valgbareArbeidsdager = arbeidsgiverdager.filter((dag) => !erHelg(dag.dato));
    const toggleValgtdato = (dato: DateString) => {
        setEkskluderteUkedager((prev) =>
            prev.includes(dato) ? prev.filter((value) => value !== dato) : [...prev, dato],
        );
    };

    useEffect(() => {
        setEkskluderteUkedager(ekskluderteUkedager);
    }, [ekskluderteUkedager, setEkskluderteUkedager]);

    return (
        <Box width="max-content" height="max-content" minWidth="300px">
            <Box background="surface-subtle" borderWidth="0 0 0 1" borderColor="border-strong">
                <HStack align="center" padding="2">
                    <BodyShort weight="semibold">Velg hvilke dager som ikke skal tas med</BodyShort>
                </HStack>
            </Box>
            <Box borderWidth="1 1 1 1" borderColor="border-strong">
                <Table size="small" className={cn(styles.tabell, styles.redigering)}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>
                                <HStack gap="2" align="center" wrap={false}>
                                    <Checkbox
                                        checked={valgbareArbeidsdager.length === ekskluderteUkedager.length}
                                        indeterminate={
                                            ekskluderteUkedager.length > 0 &&
                                            ekskluderteUkedager.length !== valgbareArbeidsdager.length
                                        }
                                        onChange={() => {
                                            if (ekskluderteUkedager.length > 0) {
                                                setEkskluderteUkedager([]);
                                            } else {
                                                setEkskluderteUkedager(valgbareArbeidsdager.map((dag) => dag.dato));
                                            }
                                        }}
                                        hideLabel
                                        size="small"
                                    >
                                        Valg alle rader
                                    </Checkbox>
                                    <BodyShort weight="semibold">Dato</BodyShort>
                                </HStack>
                            </Table.HeaderCell>
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
                        {arbeidsgiverdager.map((dag) => {
                            const helg = erHelg(dag.dato);
                            const valgt = ekskluderteUkedager.includes(dag.dato);
                            return (
                                <Table.Row
                                    key={dag.dato + 'row'}
                                    className={cn(helg && styles.helg, valgt && styles.valgteDatoer)}
                                >
                                    <Table.DataCell>
                                        <HStack gap="2" align="center" wrap={false}>
                                            <Checkbox
                                                checked={valgt}
                                                disabled={helg}
                                                onChange={() => toggleValgtdato(dag.dato)}
                                                aria-labelledby={`id-${dag.dato}`}
                                                hideLabel={true}
                                                size="small"
                                            >
                                                {''}
                                            </Checkbox>
                                            <BodyShort id={`id-${dag.dato}`}>{somNorskDato(dag.dato)}</BodyShort>
                                        </HStack>
                                    </Table.DataCell>
                                    {dag.arbeidsgivere.map((arbeidsgiver) => (
                                        <Table.DataCell key={dag.dato + arbeidsgiver.navn}>
                                            <HStack gap="1" align="center" paddingInline="1 0" wrap={false}>
                                                <div className={styles.icon}>
                                                    {getTypeIcon(arbeidsgiver.dagtype, helg)}
                                                </div>
                                                <BodyShort style={{ whiteSpace: 'nowrap' }}>
                                                    {dekorerTekst(arbeidsgiver.dagtype, helg)}
                                                </BodyShort>
                                            </HStack>
                                        </Table.DataCell>
                                    ))}
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            </Box>
        </Box>
    );
};
