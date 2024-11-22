import dayjs from 'dayjs';
import React from 'react';

import { BriefcaseClockIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, HStack, List, ReadMore, Table } from '@navikt/ds-react';

import { MinimumSykdomsgradOverstyring, PersonFragment } from '@io/graphql';
import { Delperiode } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/Delperiode';
import { byTimestamp } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/DelperiodeWrapper';
import {
    getOppkuttedePerioder,
    getOverlappendeArbeidsgivere,
} from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/minimumSykdomsgrad';
import { ActivePeriod, DatePeriod } from '@typer/shared';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

import styles from './MinimumSykdomsgradVisning.module.scss';

interface Props {
    person: PersonFragment;
    periode: ActivePeriod;
    minimumSykdomsgradsoverstyringer: MinimumSykdomsgradOverstyring[];
}

export const MinimumSykdomsgradVisning = ({ person, periode, minimumSykdomsgradsoverstyringer }: Props) => {
    const overlappendeArbeidsgivere = getOverlappendeArbeidsgivere(person, periode);
    const oppkuttedePerioder = getOppkuttedePerioder(overlappendeArbeidsgivere, periode);

    const delperioder: {
        periode: DatePeriod;
        defaultValue?: 'Ja' | 'Nei';
        notat?: string;
    }[] =
        oppkuttedePerioder?.map((delperiode) => {
            const sisteOverstyring = minimumSykdomsgradsoverstyringer
                ?.filter((overstyring) =>
                    [
                        ...overstyring.minimumSykdomsgrad.perioderVurdertIkkeOk,
                        ...overstyring.minimumSykdomsgrad.perioderVurdertOk,
                    ].some((vurdering) => vurdering.fom === delperiode.fom && vurdering.tom === delperiode.tom),
                )
                .sort(byTimestamp)?.[0];
            const defaultValue =
                sisteOverstyring !== undefined
                    ? sisteOverstyring.minimumSykdomsgrad.perioderVurdertOk.some(
                          (vurdertOk) => vurdertOk.fom === delperiode.fom,
                      )
                        ? 'Ja'
                        : 'Nei'
                    : undefined;

            return {
                periode: delperiode,
                defaultValue: defaultValue,
                notat: sisteOverstyring?.minimumSykdomsgrad.begrunnelse,
            };
        }) ?? [];

    return (
        <ReadMore
            size="medium"
            className={styles.readmore}
            header={
                <HStack gap="2" align="center">
                    <BriefcaseClockIcon fontSize="1.3rem" /> Vis vurdert arbeidstid for perioden
                </HStack>
            }
        >
            <Box maxWidth="650px" paddingBlock="2 4" paddingInline="4">
                <Table size="small">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Vurdering</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {delperioder?.map((delperiode) => {
                            return (
                                <Delperiode
                                    key={delperiode.periode.fom}
                                    delperiode={delperiode.periode}
                                    defaultValue={delperiode.defaultValue}
                                    disabled
                                />
                            );
                        })}
                    </Table.Body>
                </Table>
                <List>
                    <BodyShort weight="semibold" as="h2">
                        Notat til beslutter
                    </BodyShort>
                    {delperioder.map((it) => (
                        <List.Item key={it.periode.fom}>
                            {dayjs(it.periode.fom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)} –{' '}
                            {dayjs(it.periode.tom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)} ({it.defaultValue}):
                            <br />
                            {it.notat}
                        </List.Item>
                    ))}
                </List>
            </Box>
        </ReadMore>
    );
};
