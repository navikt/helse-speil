import classNames from 'classnames';
import React, { PropsWithChildren, ReactNode } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Kryssikon } from '@components/ikoner/Kryssikon';
import { Sjekkikon } from '@components/ikoner/Sjekkikon';
import { Utropstegnikon } from '@components/ikoner/Utropstegnikon';
import { Maybe } from '@io/graphql';
import { Vilkårstype } from '@typer/vilkår';

import styles from './Vilkarsgruppetittel.module.css';

interface VilkårsgruppetittelProps {
    type?: Vilkårstype;
    oppfylt?: Maybe<boolean>;
    paragraf?: ReactNode;
    className?: string;
}

export const Vilkårsgruppetittel = ({
    children,
    oppfylt,
    paragraf,
    type,
    className,
}: PropsWithChildren<VilkårsgruppetittelProps>) => (
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
