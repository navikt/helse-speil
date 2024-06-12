import styles from './PopoverHjelpetekst.module.scss';
import React, { ReactElement, ReactNode, useRef, useState } from 'react';

import { Popover, PopoverProps } from '@navikt/ds-react';

interface PopoverHjelpetekstProps extends Pick<PopoverProps, 'offset'>, React.HTMLAttributes<HTMLDivElement> {
    ikon: ReactNode;
}

export const PopoverHjelpetekst = ({ children, ikon, offset, ...divProps }: PopoverHjelpetekstProps): ReactElement => {
    const ref = useRef<HTMLDivElement>(null);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

    const close = () => setAnchor(null);

    return (
        <div {...divProps}>
            <div
                ref={ref}
                onClick={() => {
                    anchor ? setAnchor(null) : setAnchor(ref.current);
                }}
                className={styles.ikon}
            >
                {ikon}
            </div>
            <Popover
                className={styles.popover}
                open={anchor !== null}
                anchorEl={anchor}
                offset={offset}
                onClose={close}
                placement="top"
            >
                {children}
            </Popover>
        </div>
    );
};
