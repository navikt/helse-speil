import classNames from 'classnames';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

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
    const variant = finnVariant(varsel.vurdering);
    return (
        <div className={classNames(styles.varsel, styles[`varsel-${variant}`])}>
            <Avhuking variant={variant} />
            <BodyShort as="p">{varsel.tittel}</BodyShort>
        </div>
    );
};
