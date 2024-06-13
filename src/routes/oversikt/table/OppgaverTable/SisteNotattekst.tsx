import React, { ReactElement } from 'react';

import { Popover, PopoverProps } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { usePopoverAnchor } from '@saksbilde/timeline/hooks/usePopoverAnchor';
import { useNotaterForVedtaksperiode } from '@state/notater';

import styles from './SisteNotattekst.module.css';

interface SisteNotattekstProps {
    vedtaksperiodeId: string;
}

interface NotattekstPopoverProps extends Omit<PopoverProps, 'children'> {
    tekst: string;
}

const NotattekstPopover = ({ tekst, ...popoverProps }: NotattekstPopoverProps): ReactElement => {
    return (
        <Popover placement="left" {...popoverProps}>
            <Popover.Content className={styles.NotattekstPopover}>
                <AnonymizableText>{tekst}</AnonymizableText>
            </Popover.Content>
        </Popover>
    );
};

export const SisteNotattekst = ({ vedtaksperiodeId }: SisteNotattekstProps): ReactElement | null => {
    const { onMouseOver, onMouseOut, ...popoverProps } = usePopoverAnchor();
    const sisteNotat = useNotaterForVedtaksperiode(vedtaksperiodeId).shift();

    if (sisteNotat === undefined) return null;

    return (
        <>
            <AnonymizableText onMouseOver={onMouseOver} onMouseOut={onMouseOut} className={styles.SisteNotat}>
                {sisteNotat.tekst}
            </AnonymizableText>
            <NotattekstPopover tekst={sisteNotat.tekst} {...popoverProps} />
        </>
    );
};
