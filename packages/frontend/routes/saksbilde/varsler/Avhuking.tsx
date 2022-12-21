import classNames from 'classnames';
import React, { Dispatch, SetStateAction } from 'react';

import { Varselstatus } from '@io/graphql';
import { settStatusAktiv, settStatusVurdert } from '@io/graphql/endreVarselstatus';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useRefetchPerson } from '@state/person';

import { CheckIcon } from '../timeline/icons';

import styles from './Avhuking.module.css';

type AvhukingProps = {
    variant: string;
    generasjonId: string;
    definisjonId: string;
    varselkode: string;
    varselstatus?: Varselstatus;
    setIsFetching: Dispatch<SetStateAction<boolean>>;
};

export const Avhuking: React.FC<AvhukingProps> = ({
    variant,
    generasjonId,
    definisjonId,
    varselkode,
    varselstatus,
    setIsFetching,
}) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const refetchPerson = useRefetchPerson();
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
            onClick={() => endreVarselstatus(generasjonId, definisjonId, varselkode)}
            className={classNames(styles.avhuking, styles[`avhuking-${variant}`])}
        >
            <CheckIcon width="24px" height="24px" />
        </button>
    );
};
