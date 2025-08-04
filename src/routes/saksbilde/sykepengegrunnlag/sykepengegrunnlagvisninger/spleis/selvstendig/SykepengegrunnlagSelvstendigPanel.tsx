import React from 'react';

import { BodyShort, Box, Detail, HStack, Table, VStack } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { LovdataLenke } from '@components/LovdataLenke';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { Sykepengegrunnlagsgrense } from '@io/graphql';
import { somDato } from '@utils/date';
import { somPenger, somPengerUtenDesimaler } from '@utils/locale';

import styles from './SykepengegrunnlagSelvstendigPanel.module.css';

interface SykepengegrunnlagSelvstendigPanel {
    beregningsgrunnlag: string;
    sykepengegrunnlag: number;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
}

export const SykepengegrunnlagSelvstendigPanel = ({
    beregningsgrunnlag,
    sykepengegrunnlag,
    sykepengegrunnlagsgrense,
}: SykepengegrunnlagSelvstendigPanel) => {
    const beregningsgrunnlagNumber = Number(beregningsgrunnlag);
    return (
        <VStack gap="16">
            <Table className={styles.Table}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell>Pensjonsgivende årsinntekt</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>
                            <Detail textColor="subtle" weight="regular">
                                Inntektskilde
                            </Detail>
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            <Detail textColor="subtle" weight="regular">
                                Ferdiglignet inntekt
                            </Detail>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row shadeOnHover={false} className={styles.SelvstendigNaeringRow}>
                        <Table.DataCell>
                            <HStack align="center" gap="2">
                                <Arbeidsgiverikon />
                                Selvstendig næring
                            </HStack>
                        </Table.DataCell>
                        <Table.DataCell>
                            <HStack align="center" gap="2">
                                {somPenger(beregningsgrunnlagNumber)}
                                <Kilde type="Skatteetaten">SE</Kilde>
                            </HStack>
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row shadeOnHover={false} className={styles.TotalRow}>
                        <Table.DataCell>
                            <BodyShort weight="semibold">Total</BodyShort>
                        </Table.DataCell>
                        <Table.DataCell>
                            <BodyShort weight="semibold">{somPenger(beregningsgrunnlagNumber)}</BodyShort>
                        </Table.DataCell>
                    </Table.Row>
                </Table.Body>
            </Table>
            <VStack>
                <Box background="surface-subtle" borderRadius="xlarge" padding="4" marginInline="0 4">
                    <HStack gap="32">
                        <BodyShort weight="semibold">Sykepengegrunnlag</BodyShort>
                        <HStack align="center" gap="2">
                            <BodyShort>{somPenger(sykepengegrunnlag)}</BodyShort>
                            <Kilde type="Skatteetaten">SE</Kilde>
                        </HStack>
                    </HStack>
                </Box>
                {beregningsgrunnlagNumber > sykepengegrunnlagsgrense.grense && (
                    <Detail className={styles.Detail}>
                        {`Sykepengegrunnlaget er begrenset til 6G: ${somPengerUtenDesimaler(sykepengegrunnlagsgrense.grense)}`}
                        <LovdataLenke paragraf="8-10">§ 8-10</LovdataLenke>
                    </Detail>
                )}
                <Detail className={styles.Detail}>
                    {`Grunnbeløp (G) ved skjæringstidspunkt: ${somPengerUtenDesimaler(sykepengegrunnlagsgrense.grunnbelop)}`}
                    <br />({getFormattedDate(sykepengegrunnlagsgrense.virkningstidspunkt)})
                </Detail>
            </VStack>
        </VStack>
    );
};

const getFormattedDate = (dato: string) => somDato(dato).locale('no').format('DD. MMM YYYY');
