import React, { useReducer } from 'react';
import classNames from 'classnames';
import { DialogDots, EllipsisH } from '@navikt/ds-icons';
import { Button, Loader } from '@navikt/ds-react';
import { Dropdown } from '@navikt/ds-react-internal';

import { putFeilregistrertNotat } from '@io/http';
import { leggTilKommentar } from '@io/graphql/leggTilKommentar';
import { LinkButton } from '@components/LinkButton';
import { useRefetchPerson } from '@state/person';
import { useRefreshNotater } from '@state/notater';
import { useInnloggetSaksbehandler } from '@state/authentication';

import { Hendelse } from '../Hendelse';
import { ExpandableHistorikkContent } from '../ExpandableHistorikkContent';
import { NotatForm } from './NotatForm';
import { Kommentarer } from './Kommentarer';

import styles from './Notathendelse.module.css';

type State = {
    errors: { [key: string]: string };
    hasErrors: boolean;
    isFetching: boolean;
    showAddDialog: boolean;
};

type ErrorAction = {
    type: 'ErrorAction';
    id: string;
    message?: string;
};

type FetchSuccessAction = {
    type: 'FetchSuccessAction';
};

type FetchAction = {
    type: 'FetchAction';
};

type ToggleDialogAction = {
    type: 'ToggleDialogAction';
    value: boolean;
};

type Action = FetchAction | FetchSuccessAction | ErrorAction | ToggleDialogAction;

const reducer = (state: State, action: Action) => {
    switch (action.type) {
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

    const onLeggTilKommentar = (notatId: number, saksbehandlerident: string) => (tekst: string) => {
        dispatch({ type: 'FetchAction' });
        leggTilKommentar({ tekst, notatId, saksbehandlerident })
            .then(() => {
                refreshNotater();
                refetchPerson().finally(() => {
                    dispatch({ type: 'FetchSuccessAction' });
                });
            })
            .catch(() => {
                dispatch({ type: 'ErrorAction', id: 'leggTilKommentar' });
            });
    };

    return (
        <Hendelse
            title={title}
            icon={<DialogDots width={20} height={20} />}
            timestamp={timestamp}
            ident={saksbehandler}
        >
            {!feilregistrert && innloggetSaksbehandler.oid === saksbehandlerOid && (
                <Dropdown>
                    <Button as={Dropdown.Toggle} variant="tertiary" className={styles.ToggleButton} size="xsmall">
                        <EllipsisH height={32} width={32} />
                    </Button>
                    <Dropdown.Menu>
                        <Dropdown.Menu.List>
                            <Dropdown.Menu.List.Item onClick={feilregistrerNotat} className={styles.ListItem}>
                                Feilregistrer {state.isFetching && <Loader size="xsmall" />}
                            </Dropdown.Menu.List.Item>
                        </Dropdown.Menu.List>
                    </Dropdown.Menu>
                </Dropdown>
            )}
            <ExpandableHistorikkContent>
                <div className={styles.NotatContent}>
                    <pre className={styles.Notat}>{tekst}</pre>
                    <Kommentarer kommentarer={kommentarer} />
                    {innloggetSaksbehandler.oid === saksbehandlerOid &&
                        innloggetSaksbehandler.ident &&
                        (state.showAddDialog ? (
                            <NotatForm
                                label="Kommentar"
                                onSubmitForm={onLeggTilKommentar(Number.parseInt(id), innloggetSaksbehandler.ident)}
                                closeForm={() => dispatch({ type: 'ToggleDialogAction', value: false })}
                                isFetching={state.isFetching}
                                hasError={typeof state.errors.leggTilKommentar === 'string'}
                            />
                        ) : (
                            <LinkButton
                                className={styles.LeggTilKommentarButton}
                                onClick={() => dispatch({ type: 'ToggleDialogAction', value: true })}
                            >
                                Legg til ny kommentar
                            </LinkButton>
                        ))}
                </div>
            </ExpandableHistorikkContent>
        </Hendelse>
    );
};
