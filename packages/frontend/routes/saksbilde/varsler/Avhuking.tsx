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
    varselstatus?: Varselstatus;
    setIsFetching: Dispatch<SetStateAction<boolean>>;
    setError: Dispatch<SetStateAction<{ error: boolean; message: string }>>;
};

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
        const status = varselstatus ?? Varselstatus.Aktiv;
        if (ident === undefined || ident === null) {
            setError({ error: true, message: 'Du er ikke logget inn.' });
            return;
        }
        setIsFetching(true);
        let response;
        if (status === Varselstatus.Aktiv) {
            response = settStatusVurdert({ generasjonId, definisjonId, varselkode, ident });
        } else if (status === Varselstatus.Vurdert) {
            response = settStatusAktiv({ generasjonId, varselkode, ident });
        }
        response
            ?.then(() => {
                refetchPerson().finally(() => setIsFetching(false));
                setError({ error: false, message: '' });
            })
            .catch(() => setError({ error: true, message: 'Kallet til baksystemet feilet. Kontakt en utvikler.' }));
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
