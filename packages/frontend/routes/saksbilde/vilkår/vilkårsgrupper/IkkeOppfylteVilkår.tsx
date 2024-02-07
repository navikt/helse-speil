import React from 'react';

import { Feilikon } from '@components/ikoner/Feilikon';

import { Vilkårdata } from '../../../../mapping/vilkår';
import { Vilkårsgruppetittel } from '../Vilkårsgruppetittel';
import { Vilkårskategori } from '../Vilkårskategori';

import styles from '../vilkår.module.css';

interface IkkeOppfylteVilkårProps {
    vilkår: Vilkårdata[];
}

export const IkkeOppfylteVilkår = ({ vilkår }: IkkeOppfylteVilkårProps) => (
    <ul className={styles.kolonne} data-testid="ikke-oppfylte-vilkår" aria-labelledby="ikke-oppfylte-vilkår">
        <Vilkårskategori id="ikke-oppfylte-vilkår" ikon={<Feilikon />}>
            Ikke oppfylte vilkår
        </Vilkårskategori>
        {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
            <li className={styles.gruppe} key={i}>
                <Vilkårsgruppetittel type={type} oppfylt={false} paragraf={paragraf}>
                    {tittel}
                </Vilkårsgruppetittel>
                <div className={styles.grid}>{komponent}</div>
            </li>
        ))}
    </ul>
);
