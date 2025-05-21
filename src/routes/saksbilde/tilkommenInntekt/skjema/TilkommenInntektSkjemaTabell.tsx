import cn from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort, Box, Checkbox, HStack, Table } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { ArbeidsgiverFragment } from '@io/graphql';
import { dekorerTekst, getTypeIcon, tabellArbeidsdager } from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { DatePeriod, DateString } from '@typer/shared';
import { erHelg, erIPeriode, somNorskDato, tilUkedager } from '@utils/date';
import { capitalizeArbeidsgiver } from '@utils/locale';

import styles from '../TilkommenTable.module.css';

interface TilkommenInntektTableProps {
    arbeidsgivere: ArbeidsgiverFragment[];
    periode: DatePeriod;
    error: boolean;
    ekskluderteUkedager: DateString[];
    setEkskluderteUkedager: (ekskluderteUkedager: DateString[]) => void;
}

export const TilkommenInntektSkjemaTabell = ({
    arbeidsgivere,
    periode,
    error,
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
    const valgbareDatoer = tilUkedager(periode);
    return (
        <Box width="max-content" height="max-content" minWidth="300px">
            <Box background="surface-subtle" borderWidth="0 0 0 1" borderColor="border-strong">
                <HStack align="center" padding="2">
                    <BodyShort weight="semibold">Velg hvilke dager som ikke skal tas med</BodyShort>
                </HStack>
            </Box>
            <Box borderWidth={error ? '2' : '1'} borderColor={error ? 'border-danger' : 'border-strong'}>
                <Table size="small" className={cn(styles.tabell, styles.redigering)}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>
                                <HStack gap="2" align="center" wrap={false}>
                                    <Checkbox
                                        checked={valgbareDatoer.length === ekskluderteUkedager.length}
                                        indeterminate={
                                            ekskluderteUkedager.length > 0 &&
                                            ekskluderteUkedager.length !== valgbareDatoer.length
                                        }
                                        onChange={() => {
                                            if (ekskluderteUkedager.length > 0) {
                                                setEkskluderteUkedager([]);
                                            } else {
                                                setEkskluderteUkedager(valgbareDatoer);
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
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        setEkskluderteUkedager([...ekskluderteUkedager, dag.dato]);
                                                    } else {
                                                        setEkskluderteUkedager(
                                                            ekskluderteUkedager.filter((ukedag) => ukedag !== dag.dato),
                                                        );
                                                    }
                                                }}
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
