import classNames from 'classnames';
import React, { ReactElement, useRef, useState } from 'react';

import { BodyShort, Popover } from '@navikt/ds-react';

import styles from './Infotrekant.module.css';

interface InfotrekantProps extends React.HTMLAttributes<HTMLSpanElement> {
    text: string;
}

export const Infotrekant = ({ className, text, ...spanProps }: InfotrekantProps): ReactElement => {
    const [showPopover, setShowPopover] = useState(false);
    const containerRef = useRef<HTMLSpanElement>(null);

    return (
        <span
            data-testid="infotrekant"
            ref={containerRef}
            onMouseOver={() => setShowPopover(true)}
            onFocus={() => setShowPopover(true)}
            onMouseLeave={() => setShowPopover(false)}
            aria-label={text}
            className={classNames(styles.Infotrekant, className)}
            {...spanProps}
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 16V0H16L0 16Z" fill="#FF9100" />
            </svg>
            <Popover
                anchorEl={containerRef.current}
                open={showPopover}
                onClose={() => setShowPopover(false)}
                placement="top"
            >
                <BodyShort className={styles.Text}>{text}</BodyShort>
            </Popover>
        </span>
    );
};
