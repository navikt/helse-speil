import classNames from 'classnames';
import React, { useState } from 'react';

import { BodyShort, Loader } from '@navikt/ds-react';

import { VarselDto, Varselstatus, VarselvurderingDto } from '@io/graphql';

import { Avhuking } from './Avhuking';

import styles from './Varsel.module.css';

type VarselProps = {
    varsel: VarselDto;
};

const finnVariant = (varselvurdering: Maybe<VarselvurderingDto> | undefined) => {
    if (!varselvurdering) return 'aktiv';
    switch (varselvurdering.status) {
        case Varselstatus.Vurdert:
            return 'vurdert';
        case Varselstatus.Godkjent:
            return 'ferdig-behandlet';
        case Varselstatus.Avvist:
        case Varselstatus.Aktiv:
            return 'aktiv';
    }
};

export const Varsel: React.FC<VarselProps> = ({ varsel }) => {
    const [isFetching, setIsFetching] = useState(false);
    const variant = finnVariant(varsel.vurdering);
    return (
        <div className={classNames(styles.varsel, styles[`varsel-${variant}`])}>
            {isFetching ? (
                <Loader
                    style={{ height: 'var(--navds-font-line-height-xlarge)' }}
                    size="medium"
                    variant="interaction"
                />
            ) : (
                <Avhuking
                    variant={variant}
                    generasjonId={varsel.generasjonId}
                    definisjonId={varsel.definisjonId}
                    varselkode={varsel.kode}
                    varselstatus={varsel.vurdering?.status}
                    setIsFetching={setIsFetching}
                />
            )}
            <BodyShort as="p">{varsel.tittel}</BodyShort>
        </div>
    );
};
