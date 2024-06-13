import React from 'react';

import { GrøntSjekkikon } from '@components/ikoner/GrøntSjekkikon';
import { Vilkårdata } from '@mapping/vilkår';

import { Vilkårsgruppetittel } from '../Vilkårsgruppetittel';
import { Vilkårskategori } from '../Vilkårskategori';

import styles from '../vilkår.module.css';

interface OppfylteVilkårProps {
    vilkår: Vilkårdata[];
}

export const OppfylteVilkår = ({ vilkår }: OppfylteVilkårProps) => (
    <ul className={styles.kolonne} data-testid="oppfylte-vilkår" aria-labelledby="oppfylte-vilkår">
        <Vilkårskategori id="oppfylte-vilkår" ikon={<GrøntSjekkikon />}>
            Oppfylte vilkår
        </Vilkårskategori>
        {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
            <li className={styles.gruppe} key={i}>
                <Vilkårsgruppetittel type={type} oppfylt={true} paragraf={paragraf}>
                    {tittel}
                </Vilkårsgruppetittel>
                <div className={styles.grid}>{komponent}</div>
            </li>
        ))}
    </ul>
);
