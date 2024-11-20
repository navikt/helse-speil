import dayjs from 'dayjs';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { HStack, HelpText, Radio, RadioGroup, Table } from '@navikt/ds-react';

import { MinimumSykdomsgradOverstyring, PersonFragment } from '@io/graphql';
import styles from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/MinimumSykdomsgrad.module.scss';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { ActivePeriod, DatePeriod } from '@typer/shared';
import { ISO_DATOFORMAT, ISO_TIDSPUNKTFORMAT, NORSK_DATOFORMAT } from '@utils/date';
import { isBeregnetPeriode, isMinimumSykdomsgradsoverstyring } from '@utils/typeguards';

interface Props {
    person: PersonFragment;
    aktivPeriode: ActivePeriod;
    delperiode: DatePeriod;
}

export const Delperiode = ({ person, aktivPeriode, delperiode }: Props) => {
    const { register, clearErrors, formState } = useFormContext();
    const arbeidsgiver = useCurrentArbeidsgiver(person);
    const minimumSykdomsgradoverstyringer = arbeidsgiver?.overstyringer.filter(isMinimumSykdomsgradsoverstyring);
    const { onChange: onChangeMerEnn20perioder, ...merEnn20periodeValidation } = register(
        `merEnn20periode.${delperiode.fom}`,
        { required: 'Du må velge en vurdering' },
    );
    const harError =
        formState.errors.merEnn20periode &&
        (Object.entries(formState.errors.merEnn20periode).find(
            (errorPeriode) => errorPeriode[0] === delperiode.fom,
        )?.[1]?.message as string);

    const sisteOverstyring = minimumSykdomsgradoverstyringer
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
    const erReadOnly =
        defaultValue !== undefined &&
        isBeregnetPeriode(aktivPeriode) &&
        sisteOverstyring?.minimumSykdomsgrad.initierendeVedtaksperiodeId !== aktivPeriode.vedtaksperiodeId;

    return (
        <Table.Row key={delperiode.fom} className={styles.zebrarad}>
            <Table.DataCell scope="col">
                {dayjs(delperiode.fom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)} –{' '}
                {dayjs(delperiode.tom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)}
            </Table.DataCell>
            <Table.DataCell>
                <HStack align="center" gap="3">
                    <RadioGroup
                        legend="Perioder"
                        error={harError}
                        size="small"
                        hideLegend
                        {...merEnn20periodeValidation}
                        onChange={() => {
                            onChangeMerEnn20perioder;
                            clearErrors(`merEnn20periode.${delperiode.fom}`);
                        }}
                        defaultValue={defaultValue}
                        readOnly={erReadOnly}
                    >
                        <HStack gap="8">
                            <Radio value="Ja" size="small" {...merEnn20periodeValidation}>
                                Ja (innvilgelse)
                            </Radio>
                            <Radio value="Nei" size="small" {...merEnn20periodeValidation}>
                                Nei (avslag)
                            </Radio>
                        </HStack>
                    </RadioGroup>
                    {erReadOnly && (
                        <HelpText>
                            Perioden er vurdert i overlappende periode. Hvis du ønsker å endre vurderingen, må du endre
                            i denne.
                        </HelpText>
                    )}
                </HStack>
            </Table.DataCell>
        </Table.Row>
    );
};

const byTimestamp = (a: MinimumSykdomsgradOverstyring, b: MinimumSykdomsgradOverstyring): number => {
    return dayjs(a.timestamp, ISO_TIDSPUNKTFORMAT).isAfter(dayjs(b.timestamp, ISO_TIDSPUNKTFORMAT)) ? -1 : 1;
};
