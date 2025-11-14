import classNames from 'classnames';
import React, { ReactElement, useEffect, useState } from 'react';

import { BodyShort, Loader } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { SettVarselStatusDocument, VarselDto, Varselstatus } from '@io/graphql';
import { getVarsel } from '@io/rest/generated/varsler/varsler';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { getFormattedDatetimeString } from '@utils/date';
import { apolloErrorCode } from '@utils/error';

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
    const [loading, setLoading] = useState(false);
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const varselVurdering = varsel.vurdering;
    const varselStatus = varselVurdering?.status ?? Varselstatus.Aktiv;

    useEffect(() => {
        setLoading(false);
    }, [varsel?.vurdering?.status]);

    const [settVarselstatus, { error }] = useMutation(SettVarselStatusDocument, {
        fetchPolicy: 'no-cache',
        update: async (cache) => {
            const { data: response } = await getVarsel(varsel.id);
            if (response !== undefined) {
                cache.modify({
                    id: cache.identify(varsel),
                    fields: {
                        vurdering() {
                            return {
                                ident: response?.vurdering?.ident,
                                status: response?.status,
                                tidsstempel: response?.vurdering?.tidsstempel,
                            };
                        },
                    },
                });
            }
        },
        onError: () => {
            setLoading(false);
        },
    });

    const settVarselstatusVurdert = async () => {
        const ident = innloggetSaksbehandler.ident;
        if (ident === undefined || ident === null) {
            return;
        }
        setLoading(true);

        //onCompleted
        await settVarselstatus({
            variables: {
                generasjonIdString: varsel.generasjonId,
                ident: ident,
                varselkode: varsel.kode,
                definisjonIdString: varsel.definisjonId,
            },
        });
    };
    const settVarselstatusAktiv = async () => {
        const ident = innloggetSaksbehandler.ident;
        if (ident === undefined || ident === null) {
            return;
        }
        setLoading(true);
        await settVarselstatus({
            variables: {
                generasjonIdString: varsel.generasjonId,
                ident: ident,
                varselkode: varsel.kode,
            },
        });
    };

    return (
        <div className={classNames(className, styles.varsel, styles[type])}>
            {loading ? (
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
                {error && <BodyShort className={styles.error}>{getErrorMessage(apolloErrorCode(error))}</BodyShort>}
            </div>
        </div>
    );
};
