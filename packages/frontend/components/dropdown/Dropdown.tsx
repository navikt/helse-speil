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
    title: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ title, className, onClick, children, ...buttonProps }) => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    const onClickWrapper = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onClick?.(event);
        anchor ? setAnchor(null) : setAnchor(event.currentTarget);
    };

    const lukk = () => {
        setAnchor(null);
    };

    return (
        <div className={styles.Dropdown}>
            <Button className={classNames(styles.Button, className)} onClick={onClickWrapper} {...buttonProps}>
                {title}
                {anchor !== null ? <Collapse /> : <Expand />}
            </Button>
            <Popover
                open={anchor !== null}
                tabIndex={-1}
                placement="bottom-start"
                arrow={false}
                anchorEl={anchor}
                onClose={lukk}
                offset={0}
            >
                {anchor !== null && <ul className={styles.List}>{children}</ul>}
            </Popover>
        </div>
    );
};
