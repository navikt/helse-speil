import React from 'react';

import { BodyLong, BodyShort } from '@navikt/ds-react';

import styles from './BegrunnelseVedtakReadonly.module.scss';

interface BegrunnelseVedtakReadonlyProps {
    vedtakBegrunnelseTekst: string;
}

export const ReadOnlyIndividuellBegrunnelse = ({ vedtakBegrunnelseTekst }: BegrunnelseVedtakReadonlyProps) => {
    return (
        <>
            <BodyShort weight="semibold" className={styles.tittel}>
                Individuell begrunnelse for vedtak
            </BodyShort>
            <BodyLong className={styles.begrunnelse} spacing>
                {vedtakBegrunnelseTekst}
            </BodyLong>
        </>
    );
};
