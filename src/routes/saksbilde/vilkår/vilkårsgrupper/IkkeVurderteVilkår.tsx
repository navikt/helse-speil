import React from 'react';

import { Advarselikon } from '@components/ikoner/Advarselikon';
import { Vilkårdata } from '@mapping/vilkår';

import { Vilkårsgruppetittel } from '../Vilkårsgruppetittel';
import { Vilkårskategori } from '../Vilkårskategori';

import styles from '../vilkår.module.css';

interface IkkeVurderteVilkårProps {
    vilkår: Vilkårdata[];
}

export const IkkeVurderteVilkår = ({ vilkår }: IkkeVurderteVilkårProps) => (
    <ul className={styles.kolonne} data-testid="ikke-vurderte-vilkår" aria-labelledby="vilkår-til-vurdering">
        <Vilkårskategori id="vilkår-til-vurdering" ikon={<Advarselikon />}>
            Vilkår til vurdering
        </Vilkårskategori>
        {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
            <li className={styles.gruppe} key={i}>
                <Vilkårsgruppetittel type={type} paragraf={paragraf}>
                    {tittel}
                </Vilkårsgruppetittel>
                {komponent && <div className={styles.grid}>{komponent}</div>}
            </li>
        ))}
    </ul>
);
