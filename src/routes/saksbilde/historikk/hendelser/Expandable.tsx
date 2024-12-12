import classNames from 'classnames';
import React, { PropsWithChildren, ReactElement, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

import { AnimatedExpandableDiv } from '@components/AnimatedExpandableDiv';

import styles from './Expandable.module.css';

interface ExpandableProps extends PropsWithChildren {
    expandText?: string;
    collapseText?: string;
    className?: string;
}

export const Expandable = ({
    expandText = 'Vis mer',
    collapseText = 'Vis mindre',
    className,
    children,
}: ExpandableProps): ReactElement => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded((expanded) => !expanded);
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onKeyDown={(event: React.KeyboardEvent) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    toggleExpanded();
                    event.stopPropagation();
                }
            }}
            onClick={(event: React.MouseEvent) => {
                // Ikke minimer når man markerer tekst
                if (window.getSelection()?.type !== 'Range') {
                    toggleExpanded();
                    event.stopPropagation();
                }
            }}
            className={classNames(styles.fokusområde, styles.klikkbar, className)}
        >
            <AnimatedExpandableDiv expanded={expanded}>{children}</AnimatedExpandableDiv>
            <span className={styles.expandCollapseButton}>
                {expanded ? collapseText : expandText}
                {expanded ? <ChevronUpIcon fontSize="1.5rem" /> : <ChevronDownIcon fontSize="1.5rem" />}
            </span>
        </div>
    );
};
