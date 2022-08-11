import { Bold } from '@components/Bold';
import { OverstyringTimeoutModal } from '@components/OverstyringTimeoutModal';
import { useMap } from '@hooks/useMap';
import { Utbetaling, Utbetalingstatus } from '@io/graphql';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Unlocked } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import styles from './OverstyrbarUtbetaling.module.css';
import { EndringForm } from './utbetalingstabell/EndringForm';
import { MarkerAlleDagerCheckbox } from './utbetalingstabell/MarkerAlleDagerCheckbox';
import { OverstyringForm } from './utbetalingstabell/OverstyringForm';
import { RadmarkeringCheckbox } from './utbetalingstabell/RadmarkeringCheckbox';
import { ToggleOverstyringKnapp, UtbetalingHeader } from './utbetalingstabell/UtbetalingHeader';
import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import { usePostOverstyring } from './utbetalingstabell/usePostOverstyring';

const getKey = (dag: UtbetalingstabellDag) => dag.dato;

const erReellEndring = (endring: Partial<UtbetalingstabellDag>, dag: UtbetalingstabellDag): boolean =>
    (typeof endring.grad === 'number' && endring.grad !== dag.grad) ||
    (typeof endring.type === 'string' && endring.type !== dag.type);

interface OverstyrbarUtbetalingProps {
    fom: DateString;
    tom: DateString;
    dager: Map<string, UtbetalingstabellDag>;
    skjæringstidspunkt: DateString;
    utbetaling: Utbetaling;
    revurderingIsEnabled: boolean;
    overstyrRevurderingIsEnabled: boolean;
}

export const OverstyrbarUtbetaling: React.FC<OverstyrbarUtbetalingProps> = ({
    fom,
    tom,
    dager,
    skjæringstidspunkt,
    utbetaling,
    revurderingIsEnabled,
    overstyrRevurderingIsEnabled,
}) => {
    const form = useForm({ mode: 'onBlur', shouldFocusError: false });

    const [overstyrer, setOverstyrer] = useState(false);
    const { postOverstyring, error, state } = usePostOverstyring();

    const [markerteDager, setMarkerteDager] = useMap<string, UtbetalingstabellDag>();
    const [overstyrteDager, setOverstyrteDager] = useMap<string, UtbetalingstabellDag>();

    const toggleOverstyring = () => {
        setMarkerteDager(new Map());
        setOverstyrteDager(new Map());
        setOverstyrer(!overstyrer);
    };

    const onSubmitOverstyring = () => {
        postOverstyring(Array.from(overstyrteDager.values()), form.getValues('begrunnelse'));
        setOverstyrer(!overstyrer);
    };

    const toggleChecked = (dag: UtbetalingstabellDag) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setMarkerteDager(markerteDager.set(getKey(dag), dag));
        } else {
            markerteDager.delete(getKey(dag));
            setMarkerteDager(markerteDager);
        }
    };

    const onSubmitEndring = (endring: Partial<UtbetalingstabellDag>) => {
        const newOverstyrteDager = Array.from(markerteDager.values()).reduce(
            (map: Map<string, UtbetalingstabellDag>, dag: UtbetalingstabellDag) => {
                if (erReellEndring(endring, dag)) {
                    map.set(getKey(dag), { ...dag, ...endring });
                } else {
                    map.delete(getKey(dag));
                }
                return map;
            },
            new Map(overstyrteDager),
        );
        setOverstyrteDager(newOverstyrteDager);
        setMarkerteDager(new Map());
    };

    useEffect(() => {
        if (state === 'done') {
            setOverstyrteDager(new Map());
        }
    }, [state]);

    return (
        <div
            className={classNames(styles.OverstyrbarUtbetaling, overstyrer && styles.overstyrer)}
            data-testid="utbetaling"
        >
            {overstyrer ? (
                <div className={styles.OverstyringHeader}>
                    <Bold>Huk av for dagene som skal endres til samme verdi</Bold>
                    <ToggleOverstyringKnapp type="button" onClick={toggleOverstyring} overstyrer={overstyrer}>
                        <Unlocked height={24} width={24} />
                        Avbryt
                    </ToggleOverstyringKnapp>
                </div>
            ) : (
                <UtbetalingHeader
                    periodeErForkastet={utbetaling.status === Utbetalingstatus.Forkastet}
                    toggleOverstyring={toggleOverstyring}
                    dager={dager}
                    revurderingIsEnabled={revurderingIsEnabled}
                    overstyrRevurderingIsEnabled={overstyrRevurderingIsEnabled}
                />
            )}
            <div className={classNames(styles.TableContainer, overstyrer && styles.overstyrer)}>
                <Utbetalingstabell
                    fom={fom}
                    tom={tom}
                    dager={dager}
                    lokaleOverstyringer={overstyrteDager}
                    markerteDager={markerteDager}
                    overstyrer={overstyrer}
                />
                {overstyrer && (
                    <>
                        <div className={styles.CheckboxContainer}>
                            <MarkerAlleDagerCheckbox
                                alleDager={dager}
                                markerteDager={markerteDager}
                                setMarkerteDager={setMarkerteDager}
                                skjæringstidspunkt={skjæringstidspunkt}
                            />
                            {Array.from(dager.values()).map((dag, i) => (
                                <RadmarkeringCheckbox
                                    key={i}
                                    index={i}
                                    dagtype={dag.type}
                                    dato={dag.dato}
                                    erAGP={dag.erAGP}
                                    skjæringstidspunkt={skjæringstidspunkt}
                                    onChange={toggleChecked(dag)}
                                    checked={markerteDager.get(dag.dato) !== undefined}
                                />
                            ))}
                        </div>
                        <div className={styles.Sticky}>
                            <EndringForm
                                markerteDager={markerteDager}
                                onSubmitEndring={onSubmitEndring}
                                revurderingIsEnabled={revurderingIsEnabled}
                            />
                        </div>
                        <div className={styles.BegrunnelseContainer}>
                            <FormProvider {...form}>
                                <form onSubmit={(event) => event.preventDefault()}>
                                    <OverstyringForm
                                        overstyrteDager={overstyrteDager}
                                        toggleOverstyring={toggleOverstyring}
                                        onSubmit={onSubmitOverstyring}
                                    />
                                </form>
                            </FormProvider>
                        </div>
                    </>
                )}
            </div>
            {state === 'timedOut' && <OverstyringTimeoutModal onRequestClose={() => null} />}
            {state === 'hasError' && error && (
                <BodyShort className={styles.ErrorMessage} role="alert">
                    {error}
                </BodyShort>
            )}
        </div>
    );
};
