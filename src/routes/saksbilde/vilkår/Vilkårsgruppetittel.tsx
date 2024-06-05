import classNames from 'classnames';
import React, { ReactNode } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Kryssikon } from '@components/ikoner/Kryssikon';
import { Sjekkikon } from '@components/ikoner/Sjekkikon';
import { Utropstegnikon } from '@components/ikoner/Utropstegnikon';

import { Vilkårstype } from '../../../mapping/vilkår';

import styles from './Vilkarsgruppetittel.module.css';

interface VilkårsgruppetittelProps {
    children: ReactNode | ReactNode[];
    type?: Vilkårstype;
    oppfylt?: boolean | null;
    paragraf?: ReactNode;
    className?: string;
}

export const Vilkårsgruppetittel = ({ children, oppfylt, paragraf, type, className }: VilkårsgruppetittelProps) => (
    <div className={classNames('vilkårsgruppetittel', className, [styles.header])}>
        <div className={styles.ikon}>
            {oppfylt === undefined || oppfylt === null ? (
                <Utropstegnikon alt="Til vurdering" />
            ) : oppfylt ? (
                <Sjekkikon alt="Oppfylt" />
            ) : (
                <Kryssikon alt="Ikke oppfylt" />
            )}
        </div>
        <div className={styles.tekstContainer}>
            <BodyShort className={styles.tittel} data-testid={type}>
                {children}
            </BodyShort>
            {paragraf && <BodyShort className={styles.paragraf}>{paragraf}</BodyShort>}
        </div>
    </div>
);
