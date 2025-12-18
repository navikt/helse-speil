import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { VarselDto, Varselstatus, VarselvurderingDto } from '@io/graphql';
import { useSkalViseUnder20SykdomsgradsvarselSomFeil } from '@saksbilde/varsler/useSkalViseUnder20Sykdomsgradsvarsel';

import { EkspanderbartVarsel } from './EkspanderbartVarsel';
import { Varsel } from './Varsel';
import { useSkalViseAvviksvarselSomFeil } from './useSkalViseAvviksvarselSomFeil';

import styles from './Varsler.module.css';

const finnType = (varselvurdering: VarselvurderingDto | null | undefined) => {
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
    varsler: VarselDto[];
}

export const Varsler = React.memo(({ varsler }: VarslerProps): ReactElement => {
    const skalViseAvviksvarselSomFeil = useSkalViseAvviksvarselSomFeil();
    const skalViseUnder20SykdomsgradsvarselSomFeil = useSkalViseUnder20SykdomsgradsvarselSomFeil();

    const varslerSomIkkeSkalVises = ['SB_EX_2'];
    const avviksvarsel = 'RV_IV_2';
    const under20Sykdomsgradsvarsel = 'RV_VV_4';

    return (
        <>
            {varsler
                .filter((it) => !varslerSomIkkeSkalVises.includes(it.kode))
                .sort(byKode)
                .map((varsel, index) => {
                    const type = finnType(varsel.vurdering);
                    if (varsel.forklaring != null && varsel.handling != null) {
                        const visSomFeil =
                            (varsel.kode === avviksvarsel && skalViseAvviksvarselSomFeil) ||
                            (varsel.kode === under20Sykdomsgradsvarsel &&
                                skalViseUnder20SykdomsgradsvarselSomFeil &&
                                type !== 'ferdig-behandlet');
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

Varsler.displayName = 'Varsler';
