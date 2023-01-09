import classNames from 'classnames';
import React, { Dispatch, MouseEvent, SetStateAction } from 'react';

import { ErrorColored } from '@navikt/ds-icons';

import { Varselstatus } from '@io/graphql';
import { settStatusAktiv, settStatusVurdert } from '@io/graphql/endreVarselstatus';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useRefetchPerson } from '@state/person';

import { CheckIcon } from '../timeline/icons';

import styles from './Avhuking.module.css';

type AvhukingProps = {
    type: 'feil' | 'aktiv' | 'vurdert' | 'ferdig-behandlet';
    generasjonId: string;
    definisjonId: string;
    varselkode: string;
    varselstatus: Varselstatus;
    setIsFetching: Dispatch<SetStateAction<boolean>>;
    setError: Dispatch<SetStateAction<{ error: boolean; message: string }>>;
};

const errorMessage = 'Kallet til baksystemet feilet. Kontakt en utvikler.';

export const Avhuking: React.FC<AvhukingProps> = ({
    type,
    generasjonId,
    definisjonId,
    varselkode,
    varselstatus,
    setIsFetching,
    setError,
}) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const refetchPerson = useRefetchPerson();
    const disabledButton = varselstatus === Varselstatus.Godkjent || type === 'feil';

    const clickEvent = (event: MouseEvent<HTMLSpanElement>) => {
        if (disabledButton) return;
        event.stopPropagation();
        event.preventDefault();
        endreVarselStatus();
    };

    const keyboardEvent = (event: React.KeyboardEvent<HTMLSpanElement>) => {
        if (disabledButton) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.stopPropagation();
            event.preventDefault();
            endreVarselStatus();
        }
    };

    const endreVarselStatus = () => {
        const ident = innloggetSaksbehandler.ident;
        if (ident === undefined || ident === null) {
            setError({ error: true, message: 'Du er ikke logget inn.' });
            return;
        }
        setIsFetching(true);

        if (varselstatus === Varselstatus.Aktiv) {
            settStatusVurdert({ generasjonId, definisjonId, varselkode, ident })
                .then((response) => {
                    håndterStatusVurdertRespons(response.settStatusVurdert);
                })
                .catch(() => setError({ error: true, message: errorMessage }));
        } else if (varselstatus === Varselstatus.Vurdert) {
            settStatusAktiv({ generasjonId, varselkode, ident })
                .then((response) => {
                    håndterStatusAktivRespons(response.settStatusAktiv);
                })
                .catch(() => setError({ error: true, message: errorMessage }));
        }
    };

    const håndterStatusVurdertRespons = (response: boolean) => {
        // Det er lagt til en constraint i backenden som ikke lar deg sette status til VURDERT hvis status allerede er VURDERT.
        // Backenden returnerer enn så lenge bare boolean, så vi kan ikke være helt sikre på her at varselets status er grunnen.
        // Dette er 'quick and dirty' frem til vi leverer noe mer fyldig respons fra backenden.
        håndterRespons(response, 'Varselet er allerede vurdert. Refresh siden.');
    };

    const håndterStatusAktivRespons = (response: boolean) => {
        håndterRespons(response, 'En feil oppsto. Kontakt en utvikler.');
    };

    const håndterRespons = (response: boolean, errorMessage: string) => {
        if (!response) {
            setError({ error: true, message: errorMessage });
            setIsFetching(false);
            return;
        }
        refetchPerson().finally(() => {
            setError({ error: false, message: '' });
            setIsFetching(false);
        });
    };

    return (
        <span
            role="button"
            tabIndex={disabledButton ? -1 : 0}
            aria-disabled={disabledButton}
            onClick={clickEvent}
            onKeyDown={keyboardEvent}
            className={classNames(styles.avhuking, styles[type])}
        >
            {type === 'feil' ? <ErrorColored width="24px" height="24px" /> : <CheckIcon width="24px" height="24px" />}
        </span>
    );
};
