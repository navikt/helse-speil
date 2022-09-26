import React, { useReducer } from 'react';
import classNames from 'classnames';
import { DialogDots } from '@navikt/ds-icons';

import { putFeilregistrertNotat } from '@io/http';
import { useRefetchPerson } from '@state/person';
import { useRefreshNotater } from '@state/notater';
import { useInnloggetSaksbehandler } from '@state/authentication';

import { Hendelse } from '../Hendelse';

import styles from './Notathendelse.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import { NotatHendelseContent } from './NotathendelseContent';
import { Action, State } from './types';
import { HendelseDropdownMenu } from './HendelseDropdownMenu';

const MAX_TEXT_LENGTH_BEFORE_TRUNCATION = 74;

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'ToggleNotat': {
            return {
                ...state,
                expanded: action.value,
            };
        }
        case 'ToggleDialogAction': {
            return {
                ...state,
                showAddDialog: action.value,
            };
        }
        case 'ErrorAction': {
            return {
                ...state,
                isFetching: false,
                hasErrors: true,
                errors: {
                    ...state.errors,
                    [action.id]: action.message ?? 'Det oppstod en feil. Prøv igje senere.',
                },
            };
        }
        case 'FetchSuccessAction': {
            return {
                ...state,
                isFetching: false,
                hasErrors: false,
                showAddDialog: false,
                errors: {},
            };
        }
        case 'FetchAction': {
            return {
                ...state,
                isFetching: true,
                hasErrors: false,
                errors: {},
            };
        }
        default: {
            return state;
        }
    }
};

interface NotathendelseProps extends Omit<NotathendelseObject, 'type'> {}

export const Notathendelse: React.FC<NotathendelseProps> = ({
    id,
    tekst,
    notattype,
    saksbehandler,
    saksbehandlerOid,
    timestamp,
    feilregistrert,
    vedtaksperiodeId,
    kommentarer,
}) => {
    const [state, dispatch] = useReducer(reducer, {
        errors: {},
        hasErrors: false,
        isFetching: false,
        showAddDialog: false,
        expanded: false,
    });

    const refreshNotater = useRefreshNotater();
    const refetchPerson = useRefetchPerson();

    const title = (
        <span className={classNames(feilregistrert && styles.Feilregistrert)}>
            {notattype === 'PaaVent' && 'Lagt på vent'}
            {notattype === 'Retur' && 'Returnert'}
            {notattype === 'Generelt' && 'Notat'}
            {feilregistrert && ' (feilregistrert)'}
        </span>
    );

    const innloggetSaksbehandler = useInnloggetSaksbehandler();

    const feilregistrerNotat = () => {
        dispatch({ type: 'FetchAction' });
        putFeilregistrertNotat(vedtaksperiodeId, id)
            .then(() => {
                refreshNotater();
                refetchPerson().finally(() => {
                    dispatch({ type: 'FetchSuccessAction' });
                });
            })
            .catch(() => {
                dispatch({ type: 'ErrorAction', id: 'feilregistrerNotat' });
            });
    };

    const isExpandable = () => {
        return tekst.length > MAX_TEXT_LENGTH_BEFORE_TRUNCATION;
    };

    const toggleNotat = (event: React.KeyboardEvent) => {
        if (event.code === 'Enter' || event.code === 'Space') {
            dispatch({ type: 'ToggleNotat', value: !state.expanded });
        }
    };

    return (
        <Hendelse
            title={title}
            icon={<DialogDots width={20} height={20} />}
            timestamp={timestamp}
            ident={saksbehandler}
            openText={`Kommentarer (${kommentarer.length})`}
            closeText="Lukk kommentarer"
            details={
                <NotatHendelseContent
                    kommentarer={kommentarer}
                    saksbehandlerOid={saksbehandlerOid}
                    id={id}
                    state={state}
                    dispatch={dispatch}
                />
            }
        >
            {!feilregistrert && innloggetSaksbehandler.oid === saksbehandlerOid && (
                <HendelseDropdownMenu feilregistrerAction={feilregistrerNotat} isFetching={state.isFetching} />
            )}
            <div
                role="button"
                tabIndex={0}
                onKeyDown={toggleNotat}
                onClick={() =>
                    dispatch({
                        type: 'ToggleNotat',
                        value: isExpandable() && !state.expanded,
                    })
                }
                className={styles.NotatTextWrapper}
            >
                <AnimatePresence exitBeforeEnter>
                    {state.expanded ? (
                        <motion.pre
                            key="pre"
                            className={styles.Notat}
                            initial={{ height: 40 }}
                            exit={{ height: 40 }}
                            animate={{ height: 'auto' }}
                            transition={{
                                type: 'tween',
                                duration: 0.2,
                                ease: 'easeInOut',
                            }}
                        >
                            {tekst}
                        </motion.pre>
                    ) : (
                        <motion.p key="p" className={styles.NotatTruncated}>
                            {tekst}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </Hendelse>
    );
};
