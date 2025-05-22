import cn from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort, Box, Checkbox, HStack, Table } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { ArbeidsgiverFragment } from '@io/graphql';
import { dekorerTekst, getTypeIcon, tilDagtypeTabell } from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { DatePeriod, DateString } from '@typer/shared';
import { erHelg, somNorskDato } from '@utils/date';
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
    const { kolonneDefinisjoner, rader } = tilDagtypeTabell(periode, arbeidsgivere);
    const alleUkedager = rader.map((rad) => rad.dato).filter((dato) => !erHelg(dato));

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
                                        checked={alleUkedager.length === ekskluderteUkedager.length}
                                        indeterminate={
                                            ekskluderteUkedager.length > 0 &&
                                            ekskluderteUkedager.length !== alleUkedager.length
                                        }
                                        onChange={() => {
                                            if (ekskluderteUkedager.length > 0) {
                                                setEkskluderteUkedager([]);
                                            } else {
                                                setEkskluderteUkedager(alleUkedager);
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
                            {kolonneDefinisjoner.map((arbeidsgiver) => (
                                <Table.HeaderCell key={arbeidsgiver.organisasjonsnummer}>
                                    <AnonymizableTextWithEllipsis weight="semibold">
                                        {capitalizeArbeidsgiver(arbeidsgiver.navn)}
                                    </AnonymizableTextWithEllipsis>
                                </Table.HeaderCell>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {rader.map(({ dato, dagtypePerOrganisasjonsnummer }) => {
                            const helg = erHelg(dato);
                            const valgt = ekskluderteUkedager.includes(dato);
                            return (
                                <Table.Row
                                    key={dato + 'row'}
                                    className={cn(helg && styles.helg, valgt && styles.valgteDatoer)}
                                >
                                    <Table.DataCell>
                                        <HStack gap="2" align="center" wrap={false}>
                                            <Checkbox
                                                checked={valgt}
                                                disabled={helg}
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        setEkskluderteUkedager([...ekskluderteUkedager, dato]);
                                                    } else {
                                                        setEkskluderteUkedager(
                                                            ekskluderteUkedager.filter(
                                                                (ekskludertUkedag) => ekskludertUkedag !== dato,
                                                            ),
                                                        );
                                                    }
                                                }}
                                                aria-labelledby={`id-${dato}`}
                                                hideLabel={true}
                                                size="small"
                                            >
                                                {''}
                                            </Checkbox>
                                            <BodyShort id={`id-${dato}`}>{somNorskDato(dato)}</BodyShort>
                                        </HStack>
                                    </Table.DataCell>
                                    {kolonneDefinisjoner.map((arbeidsgiver) => {
                                        const dagtype = dagtypePerOrganisasjonsnummer.get(
                                            arbeidsgiver.organisasjonsnummer,
                                        );
                                        return (
                                            <Table.DataCell key={dato + arbeidsgiver.organisasjonsnummer}>
                                                <HStack gap="1" align="center" paddingInline="1 0" wrap={false}>
                                                    {dagtype && (
                                                        <>
                                                            <div className={styles.icon}>
                                                                {getTypeIcon(dagtype, helg)}
                                                            </div>
                                                            <BodyShort style={{ whiteSpace: 'nowrap' }}>
                                                                {dekorerTekst(dagtype, helg)}
                                                            </BodyShort>
                                                        </>
                                                    )}
                                                </HStack>
                                            </Table.DataCell>
                                        );
                                    })}
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            </Box>
        </Box>
    );
};
