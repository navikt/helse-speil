import classNames from 'classnames';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { BodyShort } from '@navikt/ds-react';

import { TimeoutModal } from '@components/TimeoutModal';
import { useMap } from '@hooks/useMap';

import { EndringForm } from './utbetalingstabell/EndringForm/EndringForm';
import { LeggTilDager } from './utbetalingstabell/LeggTilDager';
import { MarkerAlleDagerCheckbox } from './utbetalingstabell/MarkerAlleDagerCheckbox';
import { OverstyringForm } from './utbetalingstabell/OverstyringForm';
import { RadmarkeringCheckbox } from './utbetalingstabell/RadmarkeringCheckbox';
import { UtbetalingHeader } from './utbetalingstabell/UtbetalingHeader';
import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import { usePostOverstyring } from './utbetalingstabell/usePostOverstyring';

import styles from './OverstyrbarUtbetaling.module.css';

dayjs.extend(isBetween);

const getKey = (dag: Utbetalingstabelldag) => dag.dato;

const erReellEndring = (tilDag: Partial<Utbetalingstabelldag>, fraDag: Utbetalingstabelldag): boolean =>
    (typeof tilDag.grad === 'number' && tilDag.grad !== fraDag.grad) ||
    tilDag.dag?.speilDagtype !== fraDag.dag.speilDagtype;

interface OverstyrbarUtbetalingProps {
    fom: DateString;
    tom: DateString;
    dager: Map<string, Utbetalingstabelldag>;
    erForkastet: boolean;
    revurderingIsEnabled: boolean;
    overstyrRevurderingIsEnabled: boolean;
}

export const OverstyrbarUtbetaling: React.FC<OverstyrbarUtbetalingProps> = ({
    fom,
    tom,
    dager,
    erForkastet,
    revurderingIsEnabled,
    overstyrRevurderingIsEnabled,
}) => {
    const form = useForm({ mode: 'onBlur', shouldFocusError: false });

    const [overstyrer, setOverstyrer] = useState(false);
    const { postOverstyring, error, state } = usePostOverstyring();

    const [markerteDager, setMarkerteDager] = useMap<string, Utbetalingstabelldag>();
    const [overstyrteDager, setOverstyrteDager] = useMap<string, Utbetalingstabelldag>();
    const [nyeDager, setNyeDager] = useMap<string, Utbetalingstabelldag>();

    const alleDager = new Map<string, Utbetalingstabelldag>([...nyeDager, ...dager]);
    const alleOverstyrteDager = new Map<string, Utbetalingstabelldag>([...nyeDager, ...overstyrteDager]);

    const toggleOverstyring = () => {
        setMarkerteDager(new Map());
        setOverstyrteDager(new Map());
        setNyeDager(new Map());
        setOverstyrer(!overstyrer);
    };

    const onSubmitOverstyring = () => {
        postOverstyring(
            Array.from(alleDager.values()),
            Array.from(alleOverstyrteDager.values()),
            form.getValues('begrunnelse'),
            () => setOverstyrer(!overstyrer),
        );
    };

    const toggleChecked = (dag: Utbetalingstabelldag) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if ((event.nativeEvent as KeyboardEvent)?.shiftKey) {
            toggleCheckedShift(dag)(event);
            return;
        }

        if (event.target.checked) {
            setMarkerteDager(markerteDager.set(getKey(dag), dag));
        } else {
            markerteDager.delete(getKey(dag));
            setMarkerteDager(markerteDager);
        }
    };

    const toggleCheckedShift = (dag: Utbetalingstabelldag) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const forrigeValgteDag = Array.from(markerteDager.values())?.pop() ?? dag;
        Array.from(alleDager.values())
            .filter((it) => dayjs(it.dato).isBetween(forrigeValgteDag.dato, dag.dato, 'day', '[]'))
            .forEach((it) => {
                if (event.target.checked) {
                    setMarkerteDager(markerteDager.set(getKey(it), it));
                } else {
                    markerteDager.delete(getKey(it));
                    setMarkerteDager(markerteDager);
                }
            });
    };

    const onSubmitEndring = (tilDag: Partial<Utbetalingstabelldag>) => {
        const newOverstyrteDager = Array.from(markerteDager.values()).reduce(
            (map: Map<string, Utbetalingstabelldag>, fraDag: Utbetalingstabelldag) => {
                if (erReellEndring(tilDag, fraDag)) {
                    map.set(getKey(fraDag), { ...fraDag, ...tilDag, fraType: fraDag.dag.speilDagtype });
                } else {
                    map.delete(getKey(fraDag));
                }
                return map;
            },
            new Map(overstyrteDager),
        );
        setOverstyrteDager(newOverstyrteDager);
        setMarkerteDager(new Map());
    };

    const onSubmitPølsestrekk = (dagerLagtTil: Map<string, Utbetalingstabelldag>) => {
        const alleNyeDager = new Map<string, Utbetalingstabelldag>([...dagerLagtTil, ...nyeDager]);
        setNyeDager(alleNyeDager);
    };

    const slettSisteNyeDag = () => {
        const tempNyeDager = Array.from(nyeDager).slice(1);
        setNyeDager(new Map(tempNyeDager));
    };

    useEffect(() => {
        if (state === 'done') {
            setOverstyrteDager(new Map());
            setNyeDager(new Map());
        }
    }, [state]);

    return (
        <div
            className={classNames(styles.OverstyrbarUtbetaling, overstyrer && styles.overstyrer)}
            data-testid="utbetaling"
        >
            <UtbetalingHeader
                periodeErForkastet={erForkastet}
                toggleOverstyring={toggleOverstyring}
                overstyrer={overstyrer}
                dager={dager}
                revurderingIsEnabled={revurderingIsEnabled}
                overstyrRevurderingIsEnabled={overstyrRevurderingIsEnabled}
            />
            {overstyrer && (
                <LeggTilDager
                    periodeFom={Array.from(alleDager.values())[0].dato}
                    onSubmitPølsestrekk={onSubmitPølsestrekk}
                />
            )}
            <div className={classNames(styles.TableContainer)}>
                <Utbetalingstabell
                    fom={fom}
                    tom={tom}
                    dager={alleDager}
                    lokaleOverstyringer={alleOverstyrteDager}
                    markerteDager={markerteDager}
                    overstyrer={overstyrer}
                    slettSisteNyeDag={slettSisteNyeDag}
                />
                {overstyrer && (
                    <>
                        <div className={styles.CheckboxContainer}>
                            <MarkerAlleDagerCheckbox
                                alleDager={alleDager}
                                markerteDager={markerteDager}
                                setMarkerteDager={setMarkerteDager}
                            />
                            {Array.from(alleDager.values()).map((dag, i) => (
                                <RadmarkeringCheckbox
                                    key={i}
                                    index={i}
                                    onChange={toggleChecked(dag)}
                                    checked={markerteDager.get(dag.dato) !== undefined}
                                />
                            ))}
                        </div>
                        <EndringForm markerteDager={markerteDager} onSubmitEndring={onSubmitEndring} />
                        <FormProvider {...form}>
                            <form onSubmit={(event) => event.preventDefault()}>
                                <OverstyringForm
                                    overstyrteDager={alleOverstyrteDager}
                                    hale={Array.from(alleDager.values())?.pop()?.dato ?? ''}
                                    snute={Array.from(alleDager.values())?.shift()?.dato ?? ''}
                                    toggleOverstyring={toggleOverstyring}
                                    onSubmit={onSubmitOverstyring}
                                />
                            </form>
                        </FormProvider>
                    </>
                )}
            </div>
            {state === 'timedOut' && <TimeoutModal onRequestClose={() => null} />}
            {state === 'hasError' && error && (
                <BodyShort className={styles.ErrorMessage} role="alert">
                    {error}
                </BodyShort>
            )}
        </div>
    );
};
