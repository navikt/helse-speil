import classNames from 'classnames';
import React, { PropsWithChildren, ReactElement, useRef, useState } from 'react';

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
    const ref = useRef(null);

    const toggleExpanded = () => {
        setExpanded((expanded) => !expanded);
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={(event: React.MouseEvent) => {
                // Ikke minimer når man markerer tekst
                if (window.getSelection()?.type !== 'Range') {
                    toggleExpanded();
                    event.stopPropagation();
                }
            }}
            onKeyDown={(event: React.KeyboardEvent) => {
                // Reager kun hvis akkurat dette elementet er markert med tab
                if (event.target === ref.current) {
                    if (event.key === 'Enter' || event.key === ' ') {
                        toggleExpanded();
                        event.stopPropagation();
                        event.preventDefault(); // Forhindre urelatert scrolling
                    }
                }
            }}
            className={classNames(styles.fokusområde, styles.klikkbar, className)}
            ref={ref}
        >
            <AnimatedExpandableDiv expanded={expanded}>{children}</AnimatedExpandableDiv>
            <span className={styles.expandCollapseButton}>
                {expanded ? collapseText : expandText}
                {expanded ? <ChevronUpIcon fontSize="1.5rem" /> : <ChevronDownIcon fontSize="1.5rem" />}
            </span>
        </div>
    );
};
