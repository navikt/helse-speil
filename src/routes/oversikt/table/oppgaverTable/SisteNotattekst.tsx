import React, { ReactElement } from 'react';

import { BodyShort, Popover, PopoverProps } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Maybe, PaVentInfo } from '@io/graphql';
import { usePopoverAnchor } from '@saksbilde/timeline/hooks/usePopoverAnchor';

import styles from './SisteNotattekst.module.css';

interface SisteNotattekstProps {
    påVentInfo: PaVentInfo;
}

export const SisteNotattekst = ({ påVentInfo }: SisteNotattekstProps): Maybe<ReactElement> => {
    const { onMouseOver, onMouseOut, ...popoverProps } = usePopoverAnchor();

    const preview = påVentInfo.arsaker.length > 0 ? påVentInfo.arsaker[0] : påVentInfo.tekst;

    return (
        <>
            <AnonymizableText onMouseOver={onMouseOver} onMouseOut={onMouseOut} className={styles.SisteNotat}>
                {preview}
            </AnonymizableText>
            <NotattekstPopover tekst={påVentInfo.tekst} årsaker={påVentInfo.arsaker} {...popoverProps} />
        </>
    );
};

interface NotattekstPopoverProps extends Omit<PopoverProps, 'children'> {
    tekst: Maybe<string>;
    årsaker: string[];
}

const NotattekstPopover = ({ tekst, årsaker, ...popoverProps }: NotattekstPopoverProps): ReactElement => {
    return (
        <Popover placement="left" {...popoverProps}>
            <Popover.Content className={styles.NotattekstPopover}>
                {årsaker.length > 0 && (
                    <>
                        <BodyShort weight="semibold">Årsaker</BodyShort>
                        {årsaker.map((årsak) => (
                            <AnonymizableText key={årsak}>{årsak}</AnonymizableText>
                        ))}
                    </>
                )}
                {!!tekst && (
                    <>
                        <BodyShort weight="semibold">Notat</BodyShort>
                        <AnonymizableText>{tekst}</AnonymizableText>
                    </>
                )}
            </Popover.Content>
        </Popover>
    );
};
