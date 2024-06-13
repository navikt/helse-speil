import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, DatePicker, TextField } from '@navikt/ds-react';

import { Kildetype } from '@io/graphql';
import {
    OverstyrbarDagtype,
    getDagFromType,
} from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endringFormUtils';
import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

import { DagtypeSelect } from './DagtypeSelect';
import { Speildag, Sykedag } from './utbetalingstabelldager';

import styles from './LeggTilDager.module.css';

interface LeggTilDagerProps {
    periodeFom: DateString;
    onSubmitPølsestrekk: (nyeDager: Map<string, Utbetalingstabelldag>) => void;
}

interface StrekkePølseProps {
    periodeFom: DateString;
    onSubmitPølsestrekk: (nyeDager: Map<string, Utbetalingstabelldag>) => void;
}

interface EndringType {
    dag?: Speildag;
    fom: DateString;
    grad?: number;
}

export const LeggTilDager = React.memo(({ periodeFom, onSubmitPølsestrekk }: LeggTilDagerProps) => {
    const [visPølsestrekk, setVisPølsestrekk] = useState(false);

    const StrekkePølse = React.memo(({ periodeFom, onSubmitPølsestrekk }: StrekkePølseProps) => {
        const defaultEndring = {
            dag: Sykedag,
            fom: dayjs(periodeFom, ISO_DATOFORMAT).subtract(1, 'days').format(ISO_DATOFORMAT),
            grad: undefined,
        };
        const [endring, setEndring] = useState<EndringType>(defaultEndring);
        const form = useForm();

        const handleSubmit = () => {
            const nyeDagerMap = new Map();

            let endringFom = dayjs(endring.fom, ISO_DATOFORMAT);
            while (endringFom.isBefore(dayjs(periodeFom, ISO_DATOFORMAT))) {
                nyeDagerMap.set(endringFom.format(ISO_DATOFORMAT), {
                    dato: endringFom.format(ISO_DATOFORMAT),
                    kilde: { type: Kildetype.Saksbehandler },
                    dag: endring.dag,
                    erAGP: false,
                    erAvvist: false,
                    erForeldet: false,
                    erMaksdato: false,
                    erHelg: endringFom.isoWeekday() > 5,
                    grad: endring?.grad,
                    erNyDag: true,
                }) as Map<string, Utbetalingstabelldag>;
                endringFom = endringFom.add(1, 'days');
            }

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
            onChangeGrad(event);
        };

        const oppdaterFom = (date?: DateString) => {
            const fom = dayjs(date, NORSK_DATOFORMAT).isValid()
                ? dayjs(date, NORSK_DATOFORMAT).format(ISO_DATOFORMAT)
                : date === ''
                  ? periodeFom
                  : '';
            setEndring({ ...endring, fom });
        };

        return (
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className={styles.StrekkePølse}>
                    <DatePicker
                        // @ts-expect-error Det er noe muffins med date picker, hold ds oppdatert i håp om at feilen løses
                        defaultMonth={dayjs(periodeFom, ISO_DATOFORMAT).subtract(1, 'day').toDate()}
                        onSelect={(date: Date | undefined) => {
                            oppdaterFom(dayjs(date).format(NORSK_DATOFORMAT));
                        }}
                    >
                        <DatePicker.Input
                            label="Dato f.o.m."
                            className={styles.DateInput}
                            size="small"
                            placeholder="dd.mm.åååå"
                            onBlur={(e) => {
                                oppdaterFom(e.target.value);
                            }}
                            key={endring.fom}
                            defaultValue={dayjs(endring.fom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)}
                        />
                    </DatePicker>
                    <DatePicker.Input
                        label="Dato t.o.m."
                        className={styles.DateInput}
                        size="small"
                        placeholder={dayjs(periodeFom, ISO_DATOFORMAT).subtract(1, 'day').format(NORSK_DATOFORMAT)}
                        disabled
                    />
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
    });

    return (
        <div className={classNames(styles.LeggTilDager, visPølsestrekk && styles.Viserpølsestrekk)}>
            {visPølsestrekk && (
                <StrekkePølse periodeFom={periodeFom} onSubmitPølsestrekk={onSubmitPølsestrekk}></StrekkePølse>
            )}
            <Button size="small" variant="tertiary" onClick={() => setVisPølsestrekk(!visPølsestrekk)}>
                {visPølsestrekk ? 'Lukk legg til dager' : '+ Legg til dager'}
            </Button>
        </div>
    );
});
