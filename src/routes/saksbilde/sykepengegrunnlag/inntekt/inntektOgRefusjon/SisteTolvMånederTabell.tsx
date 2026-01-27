import dayjs from 'dayjs';
import { ReactElement, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, Table, VStack } from '@navikt/ds-react';
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table';

import { InntektFraAOrdningen } from '@io/graphql';
import { getMonthName, somPenger } from '@utils/locale';

import styles from './SisteTolvMånederTabell.module.css';

interface SisteTolvMånederTabellProps {
    harInntekterForSammenligningsgrunnlag: boolean;
    sisteXmåneder: (InntektFraAOrdningen | { maned: string; sum: null })[];
    inntekterForSammenligningsgrunnlag: InntektFraAOrdningen[];
}

export function SisteTolvMånederTabell({
    harInntekterForSammenligningsgrunnlag,
    sisteXmåneder,
    inntekterForSammenligningsgrunnlag,
}: SisteTolvMånederTabellProps): ReactElement {
    const [isExpanded, setIsExpanded] = useState(false);

    const siste3mnd = sisteXmåneder.slice(0, 3);
    const restenAvMnd = sisteXmåneder.slice(3);

    const siste3mndInntekter830 = inntekterForSammenligningsgrunnlag?.filter((it) =>
        sisteXmåneder.slice(0, 3).some((siste3mnd) => siste3mnd.maned === it.maned),
    );

    const gjennomsnittSiste3Mnd828 =
        siste3mnd.filter((it) => it.sum !== null).reduce((acc, obj) => acc + (obj?.sum ?? 0), 0) / 3;

    const harSiste3Mnd830 = siste3mndInntekter830.length > 0;
    const gjennomsnittSiste3Mnd830 = harSiste3Mnd830
        ? siste3mndInntekter830.reduce((acc, obj) => acc + (obj?.sum ?? 0), 0) / 3
        : 0;

    return (
        <VStack gap="space-8" align="start">
            <Table size="small" className={styles.table}>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell />
                        <TableHeaderCell className={styles.textRight}>§ 8-28</TableHeaderCell>
                        {harInntekterForSammenligningsgrunnlag ? (
                            <TableHeaderCell className={styles.textRight}>§ 8-30</TableHeaderCell>
                        ) : (
                            <TableHeaderCell />
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow className={styles.gjennomsnittRow}>
                        <TableDataCell className={styles.bold}>Gjennomsnitt siste 3 mnd</TableDataCell>
                        <TableDataCell className={styles.textRight}>
                            {somPenger(gjennomsnittSiste3Mnd828)}
                        </TableDataCell>
                        {harInntekterForSammenligningsgrunnlag ? (
                            <TableDataCell className={styles.textRight}>
                                {somPenger(harSiste3Mnd830 ? gjennomsnittSiste3Mnd830 : 0)}
                            </TableDataCell>
                        ) : (
                            <TableDataCell />
                        )}
                    </TableRow>
                    {siste3mnd.map((inntekt) => (
                        <InntektRow
                            key={inntekt.maned}
                            inntekt={inntekt}
                            harInntekterForSammenligningsgrunnlag={harInntekterForSammenligningsgrunnlag}
                            inntekterForSammenligningsgrunnlag={inntekterForSammenligningsgrunnlag}
                        />
                    ))}
                    {isExpanded &&
                        restenAvMnd.map((inntekt) => (
                            <InntektRow
                                key={inntekt.maned}
                                inntekt={inntekt}
                                harInntekterForSammenligningsgrunnlag={harInntekterForSammenligningsgrunnlag}
                                inntekterForSammenligningsgrunnlag={inntekterForSammenligningsgrunnlag}
                            />
                        ))}
                </TableBody>
            </Table>
            <Button
                size="xsmall"
                variant="tertiary"
                icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                onClick={() => setIsExpanded((prev) => !prev)}
            >
                {isExpanded ? 'Vis færre måneder' : 'Vis flere måneder'}
            </Button>
        </VStack>
    );
}

interface InntektRowProps {
    inntekt: InntektFraAOrdningen | { maned: string; sum: null };
    harInntekterForSammenligningsgrunnlag: boolean;
    inntekterForSammenligningsgrunnlag: InntektFraAOrdningen[];
}

function InntektRow({
    inntekt,
    harInntekterForSammenligningsgrunnlag,
    inntekterForSammenligningsgrunnlag,
}: InntektRowProps): ReactElement {
    return (
        <TableRow>
            <TableDataCell className={styles.bold}>
                {getMonthName(inntekt.maned)} {inntekt.maned.split('-')[0]}
            </TableDataCell>
            <TableDataCell className={styles.textRight}>
                {inntekt.sum !== null ? somPenger(inntekt.sum) : 'Ikke rapportert'}
            </TableDataCell>
            {harInntekterForSammenligningsgrunnlag ? (
                <TableDataCell className={styles.textRight}>
                    {visningSammenligningsgrunnlag(inntekterForSammenligningsgrunnlag, inntekt.maned)}
                </TableDataCell>
            ) : (
                <TableDataCell />
            )}
        </TableRow>
    );
}

function visningSammenligningsgrunnlag(
    inntekterForSammenligningsgrunnlag: InntektFraAOrdningen[],
    maned: string,
): string {
    const inntekt = inntekterForSammenligningsgrunnlag.filter((d) => dayjs(d.maned, 'YYYY-MM').isSame(maned));
    const sum = inntekt.reduce((summert, { sum }) => summert + (sum ?? 0), 0);
    return inntekt.length !== 0 ? somPenger(sum) : 'Ikke rapportert';
}
