import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { ReactElement, Reducer, useEffect, useReducer, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { BodyShort } from '@navikt/ds-react';

import { useBrukerIdent } from '@auth/brukerContext';
import { TimeoutModal } from '@components/TimeoutModal';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { ArbeidsgiverFragment, BeregnetPeriodeFragment, PersonFragment, UberegnetPeriodeFragment } from '@io/graphql';
import { getFørstePeriodeForSkjæringstidspunkt } from '@saksbilde/historikk/mapping';
import { DagtypeModal } from '@saksbilde/utbetaling/utbetalingstabell/DagtypeModal';
import { EndringForm } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/EndringForm';
import { MinimumSykdomsgradForm } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/MinimumSykdomsgradForm';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { kanOverstyreMinimumSykdomsgradToggle } from '@utils/featureToggles';
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
    vedtaksperiodeId: string;
    periode: BeregnetPeriodeFragment | UberegnetPeriodeFragment;
}

enum DagerActionType {
    FJERN_ALLE_DAGER,
    LEGG_TIL_NYE_DAGER,
    OVERSTYR_DAG,
    SET_MARKERTE_DAGER,
    SLETT_SISTE_NYE_DAG,
    FJERN_NYE_OG_OVERSTYRTE_DAGER,
    SHIFT_TOGGLE_MARKERTE_DAGER,
    TOGGLE_MARKERTE_DAGER,
}

type FjernDagerAction = {
    type:
        | DagerActionType.FJERN_ALLE_DAGER
        | DagerActionType.SLETT_SISTE_NYE_DAG
        | DagerActionType.FJERN_NYE_OG_OVERSTYRTE_DAGER;
};

type ModifyDagAction = {
    type: DagerActionType.OVERSTYR_DAG;
    payload: {
        dag: Partial<Utbetalingstabelldag>;
    };
};

type ModifyDagerAction = {
    type: DagerActionType.LEGG_TIL_NYE_DAGER | DagerActionType.SET_MARKERTE_DAGER;
    payload: {
        dager: Map<string, Utbetalingstabelldag>;
    };
};

type ToggleMarkerteDagerAction = {
    type: DagerActionType.SHIFT_TOGGLE_MARKERTE_DAGER | DagerActionType.TOGGLE_MARKERTE_DAGER;
    payload: {
        dag: Utbetalingstabelldag;
        alleDager: Map<string, Utbetalingstabelldag>;
        toggle: boolean;
    };
};

type DagerAction = FjernDagerAction | ModifyDagAction | ModifyDagerAction | ToggleMarkerteDagerAction;

interface DagerState {
    markerteDager: Map<string, Utbetalingstabelldag>;
    overstyrteDager: Map<string, Utbetalingstabelldag>;
    nyeDager: Map<string, Utbetalingstabelldag>;
}

const defaultDagerState: DagerState = {
    markerteDager: new Map(),
    overstyrteDager: new Map(),
    nyeDager: new Map(),
};

const reducer: Reducer<DagerState, DagerAction> = (prevState, action) => {
    const overstyrDag = (tilDag: Partial<Utbetalingstabelldag>) => {
        const nyeOverstyrteDager = Array.from(prevState.markerteDager.values()).reduce(
            (map: Map<string, Utbetalingstabelldag>, fraDag: Utbetalingstabelldag) => {
                if (erReellEndring(tilDag, fraDag)) {
                    map.set(getKey(fraDag), { ...fraDag, ...tilDag, fraType: fraDag.dag.speilDagtype });
                } else {
                    map.delete(getKey(fraDag));
                }
                return map;
            },
            new Map(prevState.overstyrteDager),
        );
        return {
            ...prevState,
            markerteDager: new Map(),
            overstyrteDager: nyeOverstyrteDager,
        };
    };

    const toggleMarkerteDager = (dag: Utbetalingstabelldag, toggle: boolean) => {
        const nyeMarkerteDager = new Map(prevState.markerteDager);
        toggle ? nyeMarkerteDager.set(getKey(dag), dag) : nyeMarkerteDager.delete(getKey(dag));
        return {
            ...prevState,
            markerteDager: nyeMarkerteDager,
        };
    };

    const shiftToggleMarkerteDager = (
        dag: Utbetalingstabelldag,
        alleDager: Map<string, Utbetalingstabelldag>,
        toggle: boolean,
    ) => {
        const forrigeValgteDag = Array.from(prevState.markerteDager.values())?.pop() ?? dag;
        const nyeMarkerteDager = new Map(prevState.markerteDager);
        Array.from(alleDager.values())
            .filter((it) => dayjs(it.dato).isBetween(forrigeValgteDag.dato, dag.dato, 'day', '[]'))
            .forEach((it) => {
                toggle ? nyeMarkerteDager.set(getKey(it), it) : nyeMarkerteDager.delete(getKey(it));
            });
        return {
            ...prevState,
            markerteDager: nyeMarkerteDager,
        };
    };

    switch (action.type) {
        case DagerActionType.OVERSTYR_DAG:
            return overstyrDag(action.payload.dag);
        case DagerActionType.TOGGLE_MARKERTE_DAGER:
            return toggleMarkerteDager(action.payload.dag, action.payload.toggle);
        case DagerActionType.SHIFT_TOGGLE_MARKERTE_DAGER:
            return shiftToggleMarkerteDager(action.payload.dag, action.payload.alleDager, action.payload.toggle);
        case DagerActionType.SET_MARKERTE_DAGER:
            return {
                ...prevState,
                markerteDager: action.payload.dager,
            };
        case DagerActionType.FJERN_NYE_OG_OVERSTYRTE_DAGER:
            return {
                ...prevState,
                overstyrteDager: new Map(),
                nyeDager: new Map(),
            };
        case DagerActionType.SLETT_SISTE_NYE_DAG:
            return {
                ...prevState,
                nyeDager: new Map(Array.from(prevState.nyeDager).slice(1)),
            };
        case DagerActionType.FJERN_ALLE_DAGER:
            return defaultDagerState;
        case DagerActionType.LEGG_TIL_NYE_DAGER:
            return {
                ...prevState,
                nyeDager: new Map([...action.payload.dager, ...prevState.nyeDager]),
            };
    }
};

export const OverstyrbarUtbetaling = ({
    person,
    arbeidsgiver,
    fom,
    tom,
    dager,
    erForkastet,
    vedtaksperiodeId,
    periode,
}: OverstyrbarUtbetalingProps): ReactElement => {
    const form = useForm({ mode: 'onBlur', shouldFocusError: false });

    const [visDagtypeModal, setVisDagtypeModal] = useState(false);
    const [overstyrer, setOverstyrer] = useState(false);
    const [overstyrerMinimumSykdomsgrad, setOverstyrerMinimumSykdomsgrad] = useState(false);
    const { postOverstyring, error, timedOut, done } = useOverstyrDager(person, arbeidsgiver);
    const saksbehandlerident = useBrukerIdent();

    const [state, dispatch] = useReducer(reducer, defaultDagerState);

    const { markerteDager, overstyrteDager, nyeDager } = state;

    const alleDager = new Map<string, Utbetalingstabelldag>([...nyeDager, ...dager]);
    const alleOverstyrteDager = new Map<string, Utbetalingstabelldag>([...nyeDager, ...overstyrteDager]);

    const onSubmitOverstyring = () => {
        void postOverstyring(
            Array.from(alleDager.values()),
            Array.from(alleOverstyrteDager.values()),
            form.getValues('begrunnelse'),
            vedtaksperiodeId,
            () => setOverstyrer(!overstyrer),
        );
    };

    const toggleOverstyring = () => {
        dispatch({ type: DagerActionType.FJERN_ALLE_DAGER });
        setOverstyrer(!overstyrer);
    };

    const toggleChecked = (dag: Utbetalingstabelldag) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if ((event.nativeEvent as KeyboardEvent)?.shiftKey) {
            dispatch({
                type: DagerActionType.SHIFT_TOGGLE_MARKERTE_DAGER,
                payload: { alleDager: alleDager, dag: dag, toggle: event.target.checked },
            });
        } else {
            dispatch({
                type: DagerActionType.TOGGLE_MARKERTE_DAGER,
                payload: { dag: dag, toggle: event.target.checked, alleDager: alleDager },
            });
        }
    };

    const onSubmitEndring = (tilDag: Partial<Utbetalingstabelldag>) => {
        dispatch({ type: DagerActionType.OVERSTYR_DAG, payload: { dag: tilDag } });
    };

    const onSubmitPølsestrekk = (dagerLagtTil: Map<string, Utbetalingstabelldag>) => {
        dispatch({ type: DagerActionType.LEGG_TIL_NYE_DAGER, payload: { dager: dagerLagtTil } });
    };

    const slettSisteNyeDag = () => {
        dispatch({ type: DagerActionType.SLETT_SISTE_NYE_DAG });
    };

    const setMarkerteDager = (dager: Map<string, Utbetalingstabelldag>) => {
        dispatch({ type: DagerActionType.SET_MARKERTE_DAGER, payload: { dager: dager } });
    };

    useEffect(() => {
        if (done) {
            dispatch({ type: DagerActionType.FJERN_NYE_OG_OVERSTYRTE_DAGER });
        }
    }, [done, dispatch]);

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
                kanOverstyreMinimumSykdomsgrad={kanOverstyreMinimumSykdomsgradToggle(saksbehandlerident)}
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
            {timedOut && <TimeoutModal showModal={timedOut} onClose={() => null} />}
            {error && (
                <BodyShort className={styles.ErrorMessage} role="alert">
                    {error}
                </BodyShort>
            )}
            {visDagtypeModal && <DagtypeModal onClose={() => setVisDagtypeModal(false)} showModal={visDagtypeModal} />}
        </div>
    );
};
