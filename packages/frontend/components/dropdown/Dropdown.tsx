import React, { HTMLAttributes, useState } from 'react';
import classNames from 'classnames';
import { Collapse, Expand } from '@navikt/ds-icons';
import { Popover } from '@navikt/ds-react';

import { Button } from '@components/Button';

import styles from './Dropdown.module.css';

interface DropdownContextValue {
    lukk: () => void;
}

export const DropdownContext = React.createContext<DropdownContextValue>({
    lukk: () => {},
});

interface DropdownProps extends HTMLAttributes<HTMLButtonElement> {
    onClick?: (event: React.MouseEvent) => void;
    orientering?: 'bottom-start';
}

export const Dropdown: React.FC<DropdownProps> = ({ className, onClick, children, orientering = 'bottom-start' }) => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    const onClickWrapper = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        onClick?.(event);
        anchor ? setAnchor(null) : setAnchor(event.currentTarget);
    };

    const lukk = () => {
        setAnchor(null);
    };

    return (
        <div className={styles.Dropdown}>
            <Button className={classNames(styles.Button, className)} onClick={onClickWrapper}>
                Meny
                {anchor !== null ? <Collapse /> : <Expand />}
            </Button>
            <Popover
                open={anchor !== null}
                tabIndex={-1}
                placement={orientering}
                arrow={false}
                anchorEl={anchor}
                onClose={lukk}
                offset={0}
            >
                <ul className={styles.List}>{children}</ul>
            </Popover>
        </div>
    );
};
