import classNames from 'classnames';
import React, { useState } from 'react';

import { BodyShort, Loader } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { SettVarselStatusDocument, VarselDto, Varselstatus } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useRefetchPerson } from '@state/person';
import { getFormattedDatetimeString } from '@utils/date';

import { Avhuking } from './Avhuking';
import { VarselstatusType } from './Varsler';

import styles from './Varsel.module.css';

interface VarselProps extends HTMLAttributes<HTMLDivElement> {
    varsel: VarselDto;
    type: VarselstatusType;
}

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

export const Varsel: React.FC<VarselProps> = ({ className, varsel, type }) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const [venterPåRefetch, setVenterPåRefetch] = useState(false);
    const varselVurdering = varsel.vurdering;
    const varselStatus = varselVurdering?.status ?? Varselstatus.Aktiv;
    const refetchPerson = useRefetchPerson();

    const [settVarselstatus, { error, loading }] = useMutation(SettVarselStatusDocument, {
        onCompleted: async () => {
            setVenterPåRefetch(true);
            await refetchPerson();
            setVenterPåRefetch(false);
        },
    });

    const settVarselstatusVurdert = async () => {
        const ident = innloggetSaksbehandler.ident;
        if (ident === undefined || ident === null) {
            return;
        }
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
            {loading || venterPåRefetch ? (
                <Loader
                    style={{ height: 'var(--a-font-line-height-xlarge)', alignSelf: 'flex-start' }}
                    size="medium"
                    variant="interaction"
                />
            ) : (
                <Avhuking
                    type={type}
                    varselstatus={varselStatus}
                    settVarselstatusAktiv={settVarselstatusAktiv}
                    settVarselstatusVurdert={settVarselstatusVurdert}
                />
            )}
            <div className={styles.wrapper}>
                <BodyShort as="p">{varsel.tittel}</BodyShort>
                {(varselStatus === Varselstatus.Vurdert || varselStatus === Varselstatus.Godkjent) && (
                    <BodyShort className={styles.vurdering} as="p">
                        {getFormattedDatetimeString(varselVurdering?.tidsstempel)} av {varselVurdering?.ident}
                    </BodyShort>
                )}
                {error && (
                    <BodyShort className={styles.error} as="p">
                        {getErrorMessage(error.graphQLErrors[0].extensions.code as number)}
                    </BodyShort>
                )}
            </div>
        </div>
    );
};
