import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort, Loader } from '@navikt/ds-react';

import { useApolloClient } from '@apollo/client';
import { VarselDto, Varselstatus } from '@io/graphql';
import { getVarsel, useDeleteVarselvurdering, usePutVarselvurdering } from '@io/rest/generated/varsler/varsler';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { getFormattedDatetimeString } from '@utils/date';

import { Avhuking } from './Avhuking';
import { VarselstatusType } from './Varsler';

import styles from './Varsel.module.css';

interface VarselProps {
    className?: string;
    varsel: VarselDto;
    type: VarselstatusType;
}

const getErrorMessage = (errorCode: number): string => {
    switch (errorCode) {
        case 404:
            return 'Varselet finnes ikke lenger. Oppdater siden (F5).';
        case 409:
            return 'Varselet har allerede endret status. Oppdater siden (F5).';
        default:
            return `Det har skjedd en feil. Prøv igjen senere eller kontakt en utvikler. (Feilkode: ${errorCode})`;
    }
};

export const Varsel = ({ className, varsel, type }: VarselProps): ReactElement => {
    const [isLoading, setIsLoading] = React.useState(false);
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const varselVurdering = varsel.vurdering;
    const varselStatus = varselVurdering?.status ?? Varselstatus.Aktiv;
    const apolloClient = useApolloClient();

    const { mutate: putVurdering, error: putError } = usePutVarselvurdering();

    const { mutate: deleteVurdering, error: deleteError } = useDeleteVarselvurdering();

    const refetchVarsel = async () => {
        const { data: response } = await getVarsel(varsel.id);
        if (response !== undefined) {
            apolloClient.cache.modify({
                id: apolloClient.cache.identify(varsel),
                fields: {
                    vurdering() {
                        return response.vurdering
                            ? {
                                  ident: response.vurdering.ident,
                                  status: response.status,
                                  tidsstempel: response.vurdering.tidsstempel,
                              }
                            : null;
                    },
                },
            });
        }
        setIsLoading(false);
    };

    const settVarselstatusVurdert = async () => {
        const ident = innloggetSaksbehandler.ident;
        if (ident === undefined || ident === null) {
            return;
        }
        setIsLoading(true);

        putVurdering(
            {
                varselId: varsel.id,
                data: {
                    definisjonId: varsel.definisjonId,
                },
            },
            {
                onSuccess: async () => refetchVarsel(),
                onError: () => setIsLoading(false),
            },
        );
    };
    const settVarselstatusAktiv = async () => {
        const ident = innloggetSaksbehandler.ident;
        if (ident === undefined || ident === null) {
            return;
        }
        setIsLoading(true);

        deleteVurdering(
            {
                varselId: varsel.id,
            },
            {
                onSuccess: async () => refetchVarsel(),
                onError: () => setIsLoading(false),
            },
        );
    };

    return (
        <div className={classNames(className, styles.varsel, styles[type])}>
            {isLoading ? (
                <Loader className={styles.loader} size="medium" variant="interaction" />
            ) : (
                <Avhuking
                    type={type}
                    varselstatus={varselStatus}
                    settVarselstatusAktiv={settVarselstatusAktiv}
                    settVarselstatusVurdert={settVarselstatusVurdert}
                />
            )}
            <div className={styles.wrapper}>
                <BodyShort>{varsel.tittel}</BodyShort>
                {(varselStatus === Varselstatus.Vurdert || varselStatus === Varselstatus.Godkjent) && (
                    <BodyShort className={styles.vurdering}>
                        {getFormattedDatetimeString(varselVurdering?.tidsstempel)} av {varselVurdering?.ident}
                    </BodyShort>
                )}
                {(putError || deleteError) && (
                    <BodyShort className={styles.error}>
                        {putError?.status && getErrorMessage(putError.status)}
                        {deleteError?.status && getErrorMessage(deleteError.status)}
                    </BodyShort>
                )}
            </div>
        </div>
    );
};
