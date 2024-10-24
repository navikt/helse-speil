import React from 'react';

import { BodyLong, BodyShort } from '@navikt/ds-react';

import { AvslagsdataInput } from '@io/graphql';

import styles from './BegrunnelseVedtakReadonly.module.scss';

interface BegrunnelseVedtakReadonlyProps {
    avslag: AvslagsdataInput;
}

export const ReadOnlyIndividuellBegrunnelse = ({ avslag }: BegrunnelseVedtakReadonlyProps) => {
    return (
        <>
            <BodyShort weight="semibold" className={styles.tittel}>
                Individuell begrunnelse for avslag
            </BodyShort>
            <BodyLong className={styles.begrunnelse} spacing>
                {avslag?.begrunnelse}
            </BodyLong>
        </>
    );
};
