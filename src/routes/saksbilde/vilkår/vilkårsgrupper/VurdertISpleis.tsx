import React from 'react';

import { AutomatiskVurdering } from '@components/AutomatiskVurdering';
import { Saksbehandlervurdering } from '@components/Saksbehandlervurdering';
import { Vilkårdata } from '@typer/vilkår';
import { getFormattedDateString } from '@utils/date';
import { cn } from '@utils/tw';

import { Vilkårsgruppetittel } from '../Vilkårsgruppetittel';

import styles from '../vilkår.module.css';

const Vilkår = ({ tittel, paragraf, komponent, type, oppfylt }: Vilkårdata) => (
    <li className={styles.gruppe}>
        <Vilkårsgruppetittel type={type} oppfylt={oppfylt} paragraf={paragraf}>
            {tittel}
        </Vilkårsgruppetittel>
        {komponent && <div className={styles.grid}>{komponent}</div>}
    </li>
);

interface VurdertISpleisProps {
    vilkår: Vilkårdata[];
    ident: string;
    skjæringstidspunkt: string;
    automatiskBehandlet: boolean;
    erForlengelse: boolean;
}

export const VurdertISpleis = ({
    vilkår,
    ident,
    skjæringstidspunkt,
    automatiskBehandlet,
    erForlengelse,
}: VurdertISpleisProps) => {
    const tittel = erForlengelse
        ? `Vilkår vurdert ved skjæringstidspunkt - ${getFormattedDateString(skjæringstidspunkt)}`
        : 'Vilkår vurdert denne perioden';

    return automatiskBehandlet ? (
        <AutomatiskVurdering title={tittel} ident={ident}>
            <ul
                className={cn(styles.kolonne, styles.behandlet)}
                data-testid="vurdert-automatisk"
                aria-label="Vilkår vurdert automatisk"
            >
                {vilkår.map((props, i) => (
                    <Vilkår key={i} {...props} />
                ))}
            </ul>
        </AutomatiskVurdering>
    ) : (
        <Saksbehandlervurdering title={tittel} ident={ident}>
            <ul
                className={cn(styles.kolonne, styles.behandlet)}
                data-testid="vurdert-av-saksbehandler"
                aria-label="Vilkår vurdert av saksbehandler"
            >
                {vilkår.map((props, i) => (
                    <Vilkår key={i} {...props} />
                ))}
            </ul>
        </Saksbehandlervurdering>
    );
};
