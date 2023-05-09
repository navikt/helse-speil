import classNames from 'classnames';
import React, { Dispatch, MouseEvent, SetStateAction } from 'react';

import { ErrorColored } from '@navikt/ds-icons';

import { Varselstatus } from '@io/graphql';
import { settVarselstatusAktiv, settVarselstatusVurdert } from '@io/graphql/endreVarselstatus';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useRefetchPerson } from '@state/person';

import { CheckIcon } from '../timeline/icons';
import { VarselstatusType } from './Varsler';

import styles from './Avhuking.module.css';

type GraphQLRequestError = {
    response: { errors: [{ message: string; extensions: { code: number } }] };
};

type AvhukingProps = {
    type: VarselstatusType;
    generasjonId: string;
    definisjonId: string;
    varselkode: string;
    varselstatus: Varselstatus;
    setIsFetching: Dispatch<SetStateAction<boolean>>;
    setError: Dispatch<SetStateAction<{ error: boolean; message: string }>>;
};

const getErrorMessage = (errorCode: number) => {
    switch (errorCode) {
        case 404:
            return 'Varselet finnes ikke lenger. Oppdater siden (F5).';
        case 409:
            return 'Varselet har allerede endret status. Oppdater siden (F5).';
        default:
            return `Det har skjedd en feil. Prøv igjen senere eller kontakt en utvikler. (Feilkode: ${errorCode})`;
    }
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
    const disabledButton = varselstatus === Varselstatus.Godkjent;

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
            settVarselstatusVurdert({
                generasjonIdString: generasjonId,
                definisjonIdString: definisjonId,
                varselkode,
                ident,
            })
                .then(() => håndterRespons())
                .catch((error) => håndterError(error));
        } else if (varselstatus === Varselstatus.Vurdert) {
            settVarselstatusAktiv({ generasjonIdString: generasjonId, varselkode, ident })
                .then(() => håndterRespons())
                .catch((error) => håndterError(error));
        }
    };

    const håndterRespons = () => {
        refetchPerson().finally(() => {
            setError({ error: false, message: '' });
            setIsFetching(false);
        });
    };

    const håndterError = (error: GraphQLRequestError) => {
        error.response.errors.forEach((error: { extensions: { code: number } }) => {
            setError({ error: true, message: getErrorMessage(error.extensions.code) });
            setIsFetching(false);
        });
    };

    return (
        <span
            role="button"
            tabIndex={disabledButton ? -1 : 0}
            aria-disabled={disabledButton}
            aria-label="Toggle varselvurdering"
            onClick={clickEvent}
            onKeyDown={keyboardEvent}
            className={classNames(styles.avhuking, styles[type])}
        >
            {type === 'feil' ? <ErrorColored width="24px" height="24px" /> : <CheckIcon width="24px" height="24px" />}
        </span>
    );
};
