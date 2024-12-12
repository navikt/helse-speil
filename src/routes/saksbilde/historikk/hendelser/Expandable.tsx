import classNames from 'classnames';
import React, { PropsWithChildren, ReactElement } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

import styles from './Expandable.module.css';

interface ExpandableProps extends PropsWithChildren {
    expandable: boolean;
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
    expandText?: string;
    collapseText?: string;
    className?: string;
}

export const Expandable = ({
    expandable,
    expanded,
    setExpanded,
    expandText = 'Vis mer',
    collapseText = 'Vis mindre',
    className,
    children,
}: ExpandableProps): ReactElement => (
    <div
        role="button"
        tabIndex={0}
        onKeyDown={(event: React.KeyboardEvent) => {
            if (event.code === 'Enter' || event.code === 'Space') {
                setExpanded(expandable && !expanded);
            }
        }}
        onClick={() => {
            // ikke minimer når man markerer tekst
            if (window.getSelection()?.type !== 'Range') setExpanded(expandable && !expanded);
        }}
        className={classNames(styles.fokusområde, expandable && styles.klikkbar, className)}
    >
        {children}
        {expandable && (
            <span className={styles.expandCollapseButton}>
                {expanded ? collapseText : expandText}
                {expanded ? <ChevronUpIcon fontSize="1.5rem" /> : <ChevronDownIcon fontSize="1.5rem" />}
            </span>
        )}
    </div>
);
