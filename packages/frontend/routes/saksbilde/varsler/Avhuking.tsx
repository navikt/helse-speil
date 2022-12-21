import classNames from 'classnames';
import React, { Dispatch, SetStateAction } from 'react';

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
};

export const Avhuking: React.FC<AvhukingProps> = ({
    type,
    generasjonId,
    definisjonId,
    varselkode,
    varselstatus,
    setIsFetching,
}) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const refetchPerson = useRefetchPerson();
    const disableButton = varselstatus === Varselstatus.Godkjent || type === 'feil';

    const endreVarselstatus = (generasjonId: string, definisjonId: string, varselkode: string) => {
        const ident = innloggetSaksbehandler.ident;
        const status = varselstatus ?? Varselstatus.Aktiv;
        if (ident != undefined) {
            setIsFetching(true);
            if (status === Varselstatus.Aktiv) {
                settStatusVurdert({ generasjonId, definisjonId, varselkode, ident }).then(() => {
                    refetchPerson()
                        .finally(() => {
                            setIsFetching(false);
                        })
                        .catch(() => {
                            // TODO do something
                        });
                });
            } else if (status === Varselstatus.Vurdert) {
                settStatusAktiv({ generasjonId, varselkode, ident }).then(() => {
                    refetchPerson()
                        .finally(() => {
                            setIsFetching(false);
                        })
                        .catch(() => {
                            // TODO do something
                        });
                });
            }
        }
    };

    return (
        <button
            disabled={disableButton}
            onClick={() => endreVarselstatus(generasjonId, definisjonId, varselkode)}
            className={classNames(styles.avhuking, styles[type])}
        >
            {type === 'feil' ? <ErrorColored width="24px" height="24px" /> : <CheckIcon width="24px" height="24px" />}
        </button>
    );
};
