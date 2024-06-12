import classNames from 'classnames';
import React from 'react';

import { VarselDto, Varselstatus, VarselvurderingDto } from '@io/graphql';
import { Maybe } from '@utils/ts';

import { EkspanderbartVarsel } from './EkspanderbartVarsel';
import { Varsel } from './Varsel';
import { useSkalViseAvviksvarselSomFeil } from './useSkalViseAvviksvarselSomFeil';

import styles from './Varsler.module.css';

const finnType = (varselvurdering: Maybe<VarselvurderingDto> | undefined) => {
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
const byKode = (a: VarselDto, b: VarselDto) => {
    if (a.kode > b.kode) return 1;
    if (a.kode < b.kode) return -1;
    return 0;
};

export type VarselstatusType = 'feil' | 'aktiv' | 'vurdert' | 'ferdig-behandlet';

interface VarslerProps {
    varsler: Array<VarselDto>;
}

export const Varsler: React.FC<VarslerProps> = React.memo(({ varsler }) => {
    const skalViseAvviksvarselSomFeil = useSkalViseAvviksvarselSomFeil();

    const varslerSomIkkeSkalVises = ['SB_EX_2'];
    const varslerSomSkalVisesSomFeil = ['RV_IV_2'];

    return (
        <>
            {varsler
                .filter((it) => !varslerSomIkkeSkalVises.includes(it.kode))
                .sort(byKode)
                .map((varsel, index) => {
                    const type = finnType(varsel.vurdering);
                    if (varsel.forklaring != null && varsel.handling != null) {
                        const visSomFeil =
                            varslerSomSkalVisesSomFeil.includes(varsel.kode) && skalViseAvviksvarselSomFeil;
                        return <EkspanderbartVarsel key={index} varsel={varsel} type={visSomFeil ? 'feil' : type} />;
                    } else {
                        return (
                            <Varsel
                                className={classNames(styles.varsel, styles['ikke-ekspanderbart'])}
                                key={index}
                                varsel={varsel}
                                type={type}
                            />
                        );
                    }
                })}
        </>
    );
});
