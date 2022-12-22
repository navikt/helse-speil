import classNames from 'classnames';
import React, { useState } from 'react';

import { BodyShort, Loader } from '@navikt/ds-react';

import { VarselDto, Varselstatus } from '@io/graphql';
import { getFormattedDatetimeString } from '@utils/date';

import { Avhuking } from './Avhuking';

import styles from './Varsel.module.css';

interface VarselProps extends HTMLAttributes<HTMLDivElement> {
    varsel: VarselDto;
    type: 'feil' | 'aktiv' | 'vurdert' | 'ferdig-behandlet';
}

export const Varsel: React.FC<VarselProps> = ({ className, varsel, type }) => {
    const [isFetching, setIsFetching] = useState(false);
    const varselVurdering = varsel.vurdering;
    const varselStatus = varselVurdering?.status;
    return (
        <div className={classNames(className, styles.varsel, styles[type])}>
            {isFetching ? (
                <Loader
                    style={{ height: 'var(--navds-font-line-height-xlarge)', alignSelf: 'flex-start' }}
                    size="medium"
                    variant="interaction"
                />
            ) : (
                <Avhuking
                    type={type}
                    generasjonId={varsel.generasjonId}
                    definisjonId={varsel.definisjonId}
                    varselkode={varsel.kode}
                    varselstatus={varselStatus}
                    setIsFetching={setIsFetching}
                />
            )}
            <div className={styles.wrapper}>
                <BodyShort as="p">{varsel.tittel}</BodyShort>
                {(varselStatus === Varselstatus.Vurdert || varselStatus === Varselstatus.Godkjent) && (
                    <BodyShort className={styles.vurdering} as="p">
                        {getFormattedDatetimeString(varselVurdering?.tidsstempel)} av {varselVurdering?.ident}
                    </BodyShort>
                )}
            </div>
        </div>
    );
};