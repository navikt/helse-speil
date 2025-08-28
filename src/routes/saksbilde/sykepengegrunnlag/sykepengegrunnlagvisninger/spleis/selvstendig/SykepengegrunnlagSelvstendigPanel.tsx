import React from 'react';

import { BodyShort, Box, Detail, HStack, HelpText, Table, VStack } from '@navikt/ds-react';

import { LovdataLenke } from '@components/LovdataLenke';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { Sykepengegrunnlagsgrense } from '@io/graphql';
import { SykepengegrunnlagsgrenseView } from '@saksbilde/sykepengegrunnlag/inntektsgrunnlagTable/sykepengegrunnlagsgrenseView/SykepengegrunnlagsgrenseView';
import { somPenger } from '@utils/locale';

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
                        <Table.HeaderCell>
                            <BodyShort weight="semibold">Pensj. årsinntekt</BodyShort>
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row className={styles.RegularWeightHeader}>
                        <Table.HeaderCell>
                            <Detail textColor="subtle">Inntektskilde</Detail>
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            <HStack gap="space-4" align="center">
                                <Detail textColor="subtle">Beregnet årsinntekt</Detail>
                                <HelpText title="Forklaring av begrep">
                                    <VStack gap="space-8">
                                        <BodyShort>
                                            Pensjonsgivende årsinntekt beregnet på grunnlag av gjennomsnittet av den
                                            pensjonsgivende årsinntekten som er fastsatt for de tre siste årene.
                                        </BodyShort>
                                        <Detail>
                                            Se <LovdataLenke paragraf="8-35">§ 8-35</LovdataLenke> andre ledd.
                                        </Detail>
                                    </VStack>
                                </HelpText>
                            </HStack>
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
            <VStack gap="space-8">
                <Box background="surface-subtle" borderRadius="xlarge" padding="4" marginInline="0 4">
                    <HStack gap="space-56">
                        <BodyShort weight="semibold">Sykepengegrunnlag</BodyShort>
                        <HStack align="center" gap="2">
                            <BodyShort>{somPenger(sykepengegrunnlag)}</BodyShort>
                        </HStack>
                    </HStack>
                </Box>
                <SykepengegrunnlagsgrenseView
                    sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                    sykepengegrunnlagFørBegrensning={beregningsgrunnlagNumber}
                />
            </VStack>
        </VStack>
    );
};
