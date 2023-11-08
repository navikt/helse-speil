import { IkonContainer } from './Vilkår.styles';
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
    <div className={classNames('vilkårsgruppetittel', className, [styles.Header])}>
        <IkonContainer>
            {oppfylt === undefined || oppfylt === null ? (
                <Utropstegnikon alt="Til vurdering" />
            ) : oppfylt ? (
                <Sjekkikon alt="Oppfylt" />
            ) : (
                <Kryssikon alt="Ikke oppfylt" />
            )}
        </IkonContainer>
        <div className={styles.TekstContainer}>
            <BodyShort className={styles.Tittel} data-testid={type}>
                {children}
            </BodyShort>
            {paragraf && <BodyShort className={styles.Paragraf}>{paragraf}</BodyShort>}
        </div>
    </div>
);
