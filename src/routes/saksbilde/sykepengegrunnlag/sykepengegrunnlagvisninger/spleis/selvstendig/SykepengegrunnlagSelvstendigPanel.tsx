import React from 'react';

import { PersonSuitIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Detail, HStack, Table, VStack } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { LovdataLenke } from '@components/LovdataLenke';
import { Sykepengegrunnlagsgrense } from '@io/graphql';
import { somDato } from '@utils/date';
import { somPenger, somPengerUtenDesimaler } from '@utils/locale';

import styles from './SykepengegrunnlagSelvstendigPanel.module.css';

interface SykepengegrunnlagSelvstendigPanel {
    beregningsgrunnlag: string;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
}

export const SykepengegrunnlagSelvstendigPanel = ({
    beregningsgrunnlag,
    sykepengegrunnlagsgrense,
}: SykepengegrunnlagSelvstendigPanel) => {
    const beregningsgrunnlagNumber = Number(beregningsgrunnlag);
    return (
        <Box width="655px" paddingBlock="4" paddingInline="4 0">
            <VStack gap="16">
                <Table className={styles.Table}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell>Pensjonsgivende årsinntekt</Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell>
                                <Detail textColor="subtle">
                                    <BodyShort weight="regular">Inntektskilde</BodyShort>
                                </Detail>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <Detail textColor="subtle">
                                    <BodyShort weight="regular">Ferdiglignet inntekt</BodyShort>
                                </Detail>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row shadeOnHover={false} className={styles.SelvstendigNaeringRow}>
                            <Table.DataCell>
                                <HStack align="center" gap="2">
                                    <PersonSuitIcon width="20" height="20" />
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
                                <BodyShort>{somPenger(Number(beregningsgrunnlag))}</BodyShort>
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
        </Box>
    );
};

const getFormattedDate = (dato: string) => somDato(dato).locale('no').format('DD. MMM YYYY');
