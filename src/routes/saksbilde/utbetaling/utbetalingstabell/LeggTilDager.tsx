import dayjs from 'dayjs';
import React, { ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, DatePicker, TextField, useDatepicker } from '@navikt/ds-react';

import { Kilde, Kildetype } from '@io/graphql';
import {
    OverstyrbarDagtype,
    getDagFromType,
} from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endringFormUtils';
import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { ISO_DATOFORMAT } from '@utils/date';

import { DagtypeSelect } from './DagtypeSelect';
import { Speildag, Sykedag } from './utbetalingstabelldager';

import styles from './LeggTilDager.module.css';

type EndringType = {
    dag: Speildag;
    fom: DateString;
    grad?: number;
};

interface LeggTilDagerProps {
    periodeFom: DateString;
    onSubmitPølsestrekk: (nyeDager: Map<string, Utbetalingstabelldag>) => void;
    erSelvstendig: boolean;
}

export const LeggTilDagerForm = React.memo(
    ({ periodeFom, onSubmitPølsestrekk, erSelvstendig }: LeggTilDagerProps): ReactElement => {
        const periodeFomMinusEnDag = dayjs(periodeFom, ISO_DATOFORMAT).subtract(1, 'day');

        const defaultEndring = { dag: Sykedag, fom: periodeFomMinusEnDag.format(ISO_DATOFORMAT), grad: undefined };
        const [endring, setEndring] = useState<EndringType>(defaultEndring);

        const form = useForm();

        const handleSubmit = () => {
            const nyeDagerMap = new Map<string, Utbetalingstabelldag>();

            let endringFom = dayjs(endring.fom, ISO_DATOFORMAT);
            while (endringFom.isBefore(dayjs(periodeFom, ISO_DATOFORMAT))) {
                nyeDagerMap.set(endringFom.format(ISO_DATOFORMAT), {
                    dato: endringFom.format(ISO_DATOFORMAT),
                    kilde: { type: Kildetype.Saksbehandler } as Kilde,
                    dag: endring.dag,
                    erAGP: false,
                    erVentetid: false,
                    erAvvist: false,
                    erForeldet: false,
                    erMaksdato: false,
                    grad: endring?.grad,
                    erNyDag: true,
                });
                endringFom = endringFom.add(1, 'day');
            }

            const endringFomMinusEnDag = dayjs(endring.fom, ISO_DATOFORMAT).subtract(1, 'day').toDate();
            fromSetSelected(endringFomMinusEnDag);
            toSetSelected(endringFomMinusEnDag);
            onSubmitPølsestrekk(nyeDagerMap);
        };

        const { onChange: onChangeGrad, ...gradvelgervalidation } = form.register('gradvelger', {
            required: kanVelgeGrad(endring.dag?.speilDagtype) && 'Velg grad',
            min: {
                value: 0,
                message: 'Grad må være over 0',
            },
            max: {
                value: 100,
                message: 'Grad må være 100 eller lavere',
            },
        });

        const oppdaterGrad = (event: React.ChangeEvent<HTMLInputElement>) => {
            const grad = Number.parseInt(event.target.value);
            setEndring({ ...endring, grad });
            void onChangeGrad(event);
        };

        const {
            datepickerProps: fromDatepickerProps,
            inputProps: fromInputProps,
            setSelected: fromSetSelected,
        } = useDatepicker({
            toDate: periodeFomMinusEnDag.toDate(),
            defaultMonth: periodeFomMinusEnDag.toDate(),
            defaultSelected: periodeFomMinusEnDag.toDate(),
            onDateChange: (date: Date | undefined) => {
                if (date) setEndring({ ...endring, fom: dayjs(date).format(ISO_DATOFORMAT) });
            },
        });

        const {
            datepickerProps: toDatepickerProps,
            inputProps: toInputProps,
            setSelected: toSetSelected,
        } = useDatepicker({
            defaultSelected: periodeFomMinusEnDag.toDate(),
        });

        return (
            <form onSubmit={form.handleSubmit(handleSubmit)} autoComplete="off">
                <div className={styles.StrekkePølse}>
                    <DatePicker {...fromDatepickerProps}>
                        <DatePicker.Input
                            {...fromInputProps}
                            label="Dato f.o.m"
                            size="small"
                            className={styles.dateinput}
                        />
                    </DatePicker>
                    <DatePicker {...toDatepickerProps}>
                        <DatePicker.Input
                            {...toInputProps}
                            label="Dato t.o.m"
                            size="small"
                            className={styles.dateinput}
                            disabled
                        />
                    </DatePicker>
                    <DagtypeSelect
                        clearErrors={() => form.clearErrors('dagtype')}
                        errorMessage={form.formState.errors?.dagtype?.message?.toString()}
                        setType={(type: OverstyrbarDagtype) =>
                            setEndring({
                                ...endring,
                                dag: getDagFromType(type),
                                grad: kanVelgeGrad(type) ? endring.grad : undefined,
                            })
                        }
                        erSelvstendig={erSelvstendig}
                    />
                    <TextField
                        className={styles.Gradvelger}
                        size="small"
                        type="number"
                        label="Grad"
                        onChange={oppdaterGrad}
                        disabled={!kanVelgeGrad(endring.dag?.speilDagtype)}
                        data-testid="gradvelger"
                        value={typeof endring?.grad === 'number' ? `${endring?.grad}` : ''}
                        error={
                            form.formState.errors.gradvelger ? <>{form.formState.errors.gradvelger.message}</> : null
                        }
                        {...gradvelgervalidation}
                    />
                    <Button
                        className={styles.Button}
                        size="small"
                        type="submit"
                        variant="secondary"
                        data-testid="legg-til"
                    >
                        Legg til
                    </Button>
                </div>
            </form>
        );
    },
);
