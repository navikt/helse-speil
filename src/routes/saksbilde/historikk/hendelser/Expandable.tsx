import classNames from 'classnames';
import React, { PropsWithChildren, ReactElement } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

import styles from './Expandable.module.css';

interface ExpandableProps extends PropsWithChildren {
    expandable: boolean;
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
}

export const Expandable = ({ expandable, expanded, setExpanded, children }: ExpandableProps): ReactElement => (
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
        className={classNames(styles.fokusområde, expandable && styles.klikkbar)}
    >
        {children}
        {expandable && <VisMerTekst expanded={expanded} />}
    </div>
);

interface VisMerTekstProps {
    expanded: boolean;
}

const VisMerTekst = ({ expanded }: VisMerTekstProps): ReactElement => (
    <span className={styles.visMer}>
        {expanded ? (
            <>
                Vis mindre <ChevronUpIcon title="Vis mindre av teksten" fontSize="1.5rem" />
            </>
        ) : (
            <>
                Vis mer <ChevronDownIcon title="Vis mer av teksten" fontSize="1.5rem" />
            </>
        )}
    </span>
);
