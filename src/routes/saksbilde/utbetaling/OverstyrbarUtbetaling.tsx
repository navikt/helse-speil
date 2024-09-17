import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { ReactElement, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { BodyShort } from '@navikt/ds-react';

import { TimeoutModal } from '@components/TimeoutModal';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { useMap } from '@hooks/useMap';
import { ArbeidsgiverFragment, BeregnetPeriodeFragment, PersonFragment, UberegnetPeriodeFragment } from '@io/graphql';
import { getFørstePeriodeForSkjæringstidspunkt } from '@saksbilde/historikk/mapping';
import { DagtypeModal } from '@saksbilde/utbetaling/utbetalingstabell/DagtypeModal';
import { EndringForm } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/EndringForm';
import { MinimumSykdomsgradForm } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/MinimumSykdomsgradForm';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { isBeregnetPeriode } from '@utils/typeguards';

import { LeggTilDager } from './utbetalingstabell/LeggTilDager';
import { MarkerAlleDagerCheckbox } from './utbetalingstabell/MarkerAlleDagerCheckbox';
import { OverstyringForm } from './utbetalingstabell/OverstyringForm';
import { RadmarkeringCheckbox } from './utbetalingstabell/RadmarkeringCheckbox';
import { UtbetalingHeader } from './utbetalingstabell/UtbetalingHeader';
import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import { useOverstyrDager } from './utbetalingstabell/useOverstyrDager';

import styles from './OverstyrbarUtbetaling.module.css';

const getKey = (dag: Utbetalingstabelldag) => dag.dato;

const erReellEndring = (tilDag: Partial<Utbetalingstabelldag>, fraDag: Utbetalingstabelldag): boolean =>
    (typeof tilDag.grad === 'number' && tilDag.grad !== fraDag.grad) ||
    tilDag.dag?.speilDagtype !== fraDag.dag.speilDagtype;

interface OverstyrbarUtbetalingProps {
    person: PersonFragment;
    arbeidsgiver: ArbeidsgiverFragment;
    fom: DateString;
    tom: DateString;
    dager: Map<string, Utbetalingstabelldag>;
    erForkastet: boolean;
    revurderingIsEnabled: boolean;
    overstyrRevurderingIsEnabled: boolean;
    vedtaksperiodeId: string;
    periode: BeregnetPeriodeFragment | UberegnetPeriodeFragment;
}

export const OverstyrbarUtbetaling = ({
    person,
    arbeidsgiver,
    fom,
    tom,
    dager,
    erForkastet,
    revurderingIsEnabled,
    overstyrRevurderingIsEnabled,
    vedtaksperiodeId,
    periode,
}: OverstyrbarUtbetalingProps): ReactElement => {
    const form = useForm({ mode: 'onBlur', shouldFocusError: false });

    const [visDagtypeModal, setVisDagtypeModal] = useState(false);
    const [overstyrer, setOverstyrer] = useState(false);
    const [overstyrerMinimumSykdomsgrad, setOverstyrerMinimumSykdomsgrad] = useState(false);
    const { postOverstyring, error, state } = useOverstyrDager(person, arbeidsgiver);

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
        void postOverstyring(
            Array.from(alleDager.values()),
            Array.from(alleOverstyrteDager.values()),
            form.getValues('begrunnelse'),
            vedtaksperiodeId,
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
    }, [setNyeDager, setOverstyrteDager, state]);

    useKeyboard([
        {
            key: Key.D,
            action: () => overstyrer && setVisDagtypeModal(!visDagtypeModal),
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
    ]);

    const erFørstePeriodePåSkjæringstidspunkt =
        getFørstePeriodeForSkjæringstidspunkt(periode.skjaeringstidspunkt, arbeidsgiver)?.id === periode.id;

    return (
        <div
            className={classNames(styles.OverstyrbarUtbetaling, overstyrer && styles.overstyrer)}
            data-testid="utbetaling"
        >
            <UtbetalingHeader
                periodeErForkastet={erForkastet}
                toggleOverstyring={toggleOverstyring}
                overstyrer={overstyrer}
                revurderingIsEnabled={revurderingIsEnabled}
                overstyrRevurderingIsEnabled={overstyrRevurderingIsEnabled}
                overstyrerMinimumSykdomsgrad={overstyrerMinimumSykdomsgrad}
                setOverstyrerMinimumSykdomsgrad={setOverstyrerMinimumSykdomsgrad}
            />
            {overstyrerMinimumSykdomsgrad && isBeregnetPeriode(periode) && (
                <MinimumSykdomsgradForm
                    person={person}
                    fom={fom}
                    tom={tom}
                    periode={periode}
                    setOverstyrerMinimumSykdomsgrad={setOverstyrerMinimumSykdomsgrad}
                />
            )}
            {overstyrer && erFørstePeriodePåSkjæringstidspunkt && (
                <LeggTilDager
                    openDagtypeModal={() => setVisDagtypeModal(true)}
                    periodeFom={Array.from(alleDager.values())[0].dato}
                    onSubmitPølsestrekk={onSubmitPølsestrekk}
                />
            )}
            <div className={classNames(styles.TableContainer)}>
                <Utbetalingstabell
                    fom={fom}
                    tom={tom}
                    dager={alleDager}
                    personFødselsdato={person.personinfo.fodselsdato}
                    lokaleOverstyringer={alleOverstyrteDager}
                    markerteDager={markerteDager}
                    overstyrer={overstyrer}
                    slettSisteNyeDag={slettSisteNyeDag}
                    person={person}
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
                        <EndringForm
                            markerteDager={markerteDager}
                            onSubmitEndring={onSubmitEndring}
                            openDagtypeModal={() => setVisDagtypeModal(true)}
                        />
                        <FormProvider {...form}>
                            <form onSubmit={(event) => event.preventDefault()}>
                                <OverstyringForm
                                    overstyrteDager={alleOverstyrteDager}
                                    alleDager={alleDager}
                                    toggleOverstyring={toggleOverstyring}
                                    onSubmit={onSubmitOverstyring}
                                />
                            </form>
                        </FormProvider>
                    </>
                )}
            </div>
            {state === 'timedOut' && <TimeoutModal showModal={state === 'timedOut'} onClose={() => null} />}
            {state === 'hasError' && error && (
                <BodyShort className={styles.ErrorMessage} role="alert">
                    {error}
                </BodyShort>
            )}
            {visDagtypeModal && <DagtypeModal onClose={() => setVisDagtypeModal(false)} showModal={visDagtypeModal} />}
        </div>
    );
};
