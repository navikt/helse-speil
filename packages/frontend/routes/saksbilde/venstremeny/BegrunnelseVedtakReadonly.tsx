import styles from './BegrunnelseVedtakReadonly.module.scss';
import React from 'react';

import { BodyLong } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { AvslagInput } from '@io/graphql';

interface BegrunnelseVedtakReadonlyProps {
    avslag: AvslagInput;
}

export const BegrunnelseVedtakReadonly = ({ avslag }: BegrunnelseVedtakReadonlyProps) => {
    return (
        <>
            <Bold className={styles.tittel}>Individuell begrunnelse for avslag</Bold>
            <BodyLong className={styles.begrunnelse} spacing>
                {avslag?.begrunnelse}
            </BodyLong>
        </>
    );
};
