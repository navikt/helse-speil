import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, UNSAFE_DatePicker as DatePicker, Select, TextField } from '@navikt/ds-react';

import { Kildetype } from '@io/graphql';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

import { kanVelgeGrad } from './EndringForm/EndringForm';
import { OverstyrbarDagtype, typeendringer } from './EndringForm/endringFormUtils';

import styles from './LeggTilDager.module.css';

interface LeggTilDagerProps {
    periodeFom: DateString;
    onSubmitPølsestrekk: (nyeDager: Map<string, UtbetalingstabellDag>) => void;
}

interface StrekkePølseProps {
    periodeFom: DateString;
    onSubmitPølsestrekk: (nyeDager: Map<string, UtbetalingstabellDag>) => void;
}

interface EndringType {
    type: OverstyrbarDagtype;
    fom: DateString;
    grad?: number;
}

export const LeggTilDager = React.memo(({ periodeFom, onSubmitPølsestrekk }: LeggTilDagerProps) => {
    const [visPølsestrekk, setVisPølsestrekk] = useState(false);

    const StrekkePølse = React.memo(({ periodeFom, onSubmitPølsestrekk }: StrekkePølseProps) => {
        const defaultEndring = {
            type: OverstyrbarDagtype.Syk,
            fom: dayjs(periodeFom, ISO_DATOFORMAT).subtract(1, 'days').format(ISO_DATOFORMAT),
            grad: undefined,
        };
        const [endring, setEndring] = useState<EndringType>(defaultEndring);
        const form = useForm();

        const handleSubmit = () => {
            const test = new Map();

            let endringFom = dayjs(endring.fom, ISO_DATOFORMAT);
            while (endringFom.isBefore(dayjs(periodeFom, ISO_DATOFORMAT))) {
                test.set(dayjs(endringFom, ISO_DATOFORMAT).format(ISO_DATOFORMAT), {
                    dato: dayjs(endringFom, ISO_DATOFORMAT).format(ISO_DATOFORMAT),
                    kilde: { type: Kildetype.Saksbehandler },
                    type: endring.type,
                    erAGP: false,
                    erAvvist: false,
                    erForeldet: false,
                    erMaksdato: false,
                    grad: endring?.grad,
                }) as Map<string, UtbetalingstabellDag>;
                endringFom = endringFom.add(1, 'days');
            }

            onSubmitPølsestrekk(test);
        };

        const { onChange: onChangeGrad, ...gradvelgervalidation } = form.register('gradvelger', {
            required: kanVelgeGrad(endring.type) && 'Velg grad',
            min: {
                value: 0,
                message: 'Grad må være over 0',
            },
            max: {
                value: 100,
                message: 'Grad må være 100 eller lavere',
            },
        });

        const oppdaterDagtype = (event: React.ChangeEvent<HTMLSelectElement>) => {
            if (typeendringer.includes(event.target.value as Utbetalingstabelldagtype)) {
                form.clearErrors('dagtype');
                const type = event.target.value as OverstyrbarDagtype;
                setEndring({ ...endring, type, grad: kanVelgeGrad(type) ? endring?.grad : undefined });
            }
        };

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
                        // @ts-ignore
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
                    <Select
                        className={styles.Dagtypevelger}
                        size="small"
                        label="Utbet. dager"
                        onChange={oppdaterDagtype}
                        error={form.formState.errors.dagtype ? <>{form.formState.errors.dagtype.message}</> : null}
                        data-testid="dagtypevelger"
                    >
                        {typeendringer.map((dagtype) => (
                            <option key={dagtype} value={dagtype}>
                                {dagtype}
                            </option>
                        ))}
                    </Select>
                    <TextField
                        className={styles.Gradvelger}
                        size="small"
                        type="number"
                        label="Grad"
                        onChange={oppdaterGrad}
                        disabled={!kanVelgeGrad(endring.type)}
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
                {visPølsestrekk ? '- ' : '+ '} Legg til dager
            </Button>
        </div>
    );
});
