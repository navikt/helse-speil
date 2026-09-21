import React, { ReactElement } from 'react';

import { BodyShort, Popover, PopoverProps } from '@navikt/ds-react';

import { ApiOppgaveProjeksjonPåVentInfo } from '@io/rest/generated/spesialist.schemas';
import { usePopoverAnchor } from '@saksbilde/tidslinje/hooks/usePopoverAnchor';

import styles from './SisteNotattekst.module.css';

interface SisteNotattekstProps {
    påVentInfo: ApiOppgaveProjeksjonPåVentInfo;
}

export const SisteNotattekst = ({ påVentInfo }: SisteNotattekstProps): ReactElement | null => {
    const { onMouseOver, onMouseOut, ...popoverProps } = usePopoverAnchor();

    const preview = påVentInfo.arsaker.length > 0 ? påVentInfo.arsaker[0] : påVentInfo.tekst;

    return (
        <>
            <BodyShort data-sensitive onMouseOver={onMouseOver} onMouseOut={onMouseOut} className={styles.SisteNotat}>
                {preview}
            </BodyShort>
            <NotattekstPopover tekst={påVentInfo.tekst} årsaker={påVentInfo.arsaker} {...popoverProps} />
        </>
    );
};

interface NotattekstPopoverProps extends Omit<PopoverProps, 'children'> {
    tekst: string | undefined | null;
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
                            <BodyShort data-sensitive key={årsak}>
                                {årsak}
                            </BodyShort>
                        ))}
                    </>
                )}
                {!!tekst && (
                    <>
                        <BodyShort weight="semibold">Notat</BodyShort>
                        <BodyShort data-sensitive>{tekst}</BodyShort>
                    </>
                )}
            </Popover.Content>
        </Popover>
    );
};
