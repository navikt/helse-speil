import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { HStack, HelpText, Radio, RadioGroup, Table } from '@navikt/ds-react';

import styles from '@saksbilde/utbetaling/utbetalingstabell/arbeidstidsvurdering/Arbeidstidsvurdering.module.scss';
import { DatePeriod } from '@typer/shared';
import { somNorskDato } from '@utils/date';

interface Props {
    delperiode: DatePeriod;
    erReadOnly: boolean;
    field?: UseFormRegisterReturn<string>;
    defaultValue?: 'Ja' | 'Nei';
    error?: string;
    visHjelpetekst?: boolean;
    erAktivPeriodeIkkeBestemmendeForDelperioden?: boolean;
}

export const Delperiode = ({
    delperiode,
    field,
    erReadOnly,
    defaultValue,
    error,
    visHjelpetekst = false,
    erAktivPeriodeIkkeBestemmendeForDelperioden = false,
}: Props) => (
    <Table.Row key={delperiode.fom} className={styles.zebrarad}>
        <Table.DataCell scope="col">
            {somNorskDato(delperiode.fom)} – {somNorskDato(delperiode.tom)}
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
                    readOnly={erReadOnly || erAktivPeriodeIkkeBestemmendeForDelperioden}
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
                    <HelpText className={styles.readonly}>
                        {erReadOnly
                            ? 'Perioden er vurdert i overlappende periode. Hvis du ønsker å endre vurderingen, må du endre i denne.'
                            : 'Perioden må vurderes i overlappende periode.'}
                    </HelpText>
                )}
            </HStack>
        </Table.DataCell>
    </Table.Row>
);
