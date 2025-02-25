import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';

import styles from './BegrunnelseVedtakReadonly.module.scss';

interface BegrunnelseVedtakReadonlyProps {
    vedtakBegrunnelseTekst: string;
}

export const ReadOnlyIndividuellBegrunnelse = ({ vedtakBegrunnelseTekst }: BegrunnelseVedtakReadonlyProps) => {
    return (
        <>
            <BodyShort weight="semibold" className={styles.tittel}>
                Individuell begrunnelse
            </BodyShort>
            <BodyShortWithPreWrap spacing>{vedtakBegrunnelseTekst}</BodyShortWithPreWrap>
        </>
    );
};
