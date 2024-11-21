import dayjs from 'dayjs';
import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { HStack, HelpText, Radio, RadioGroup, Table } from '@navikt/ds-react';

import styles from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/MinimumSykdomsgrad.module.scss';
import { DatePeriod } from '@typer/shared';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

interface Props {
    delperiode: DatePeriod;
    disabled: boolean;
    field?: UseFormRegisterReturn<string>;
    defaultValue?: 'Ja' | 'Nei';
    error?: string;
    visHjelpetekst?: boolean;
}

export const Delperiode = ({ delperiode, field, disabled, defaultValue, error, visHjelpetekst = false }: Props) => (
    <Table.Row key={delperiode.fom} className={styles.zebrarad}>
        <Table.DataCell scope="col">
            {dayjs(delperiode.fom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)} –{' '}
            {dayjs(delperiode.tom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)}
        </Table.DataCell>
        <Table.DataCell>
            <HStack align="center" gap="3">
                <RadioGroup
                    legend="Perioder"
                    error={error}
                    size="small"
                    hideLegend
                    name={`merEnn20periode.${delperiode.fom}`}
                    defaultValue={defaultValue}
                    readOnly={disabled}
                >
                    <HStack gap="8">
                        <Radio value="Ja" size="small" {...field}>
                            Ja (innvilgelse)
                        </Radio>
                        <Radio value="Nei" size="small" {...field}>
                            Nei (avslag)
                        </Radio>
                    </HStack>
                </RadioGroup>
                {visHjelpetekst && (
                    <HelpText>
                        Perioden er vurdert i overlappende periode. Hvis du ønsker å endre vurderingen, må du endre i
                        denne.
                    </HelpText>
                )}
            </HStack>
        </Table.DataCell>
    </Table.Row>
);
