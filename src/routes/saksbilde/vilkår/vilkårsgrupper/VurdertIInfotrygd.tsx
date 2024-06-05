import classNames from 'classnames';
import React from 'react';

import { Infotrygdvurdering } from '@components/Infotrygdvurdering';

import { Vilkårdata } from '../../../../mapping/vilkår';
import { Vilkårsgruppetittel } from '../Vilkårsgruppetittel';

import styles from '../vilkår.module.css';

interface VurdertIInfotrygdProps {
    vilkår: Vilkårdata[];
}

export const VurdertIInfotrygd = ({ vilkår }: VurdertIInfotrygdProps) => (
    <Infotrygdvurdering title="Inngangsvilkår vurdert i Infotrygd">
        <ul
            className={classNames(styles.kolonne, styles.behandlet)}
            data-testid="vurdert-i-infotrygd"
            aria-label="Vilkår vurdert i Infotrygd"
        >
            {vilkår.map(({ tittel, paragraf, type }, i) => (
                <li className={styles.gruppe} key={i}>
                    <Vilkårsgruppetittel type={type} oppfylt={true} paragraf={paragraf}>
                        {tittel}
                    </Vilkårsgruppetittel>
                    <div className={styles.grid} />
                </li>
            ))}
        </ul>
    </Infotrygdvurdering>
);
