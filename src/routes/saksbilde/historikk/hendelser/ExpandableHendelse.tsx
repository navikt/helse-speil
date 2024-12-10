import classNames from 'classnames';
import React, { ReactElement, ReactNode, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';

import { AnimatedExpandableDiv } from '@components/AnimatedExpandableDiv';
import { HendelseDate } from '@saksbilde/historikk/hendelser/HendelseDate';
import { DateString } from '@typer/shared';

import styles from './ExpandableHendelse.module.scss';

interface ExpandableHendelseProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'title'> {
    title: ReactNode;
    icon?: ReactNode;
    saksbehandler: string | null;
    timestamp: DateString;
}

export const ExpandableHendelse = ({
    icon,
    title,
    saksbehandler,
    timestamp,
    className,
    children,
    ...liProps
}: ExpandableHendelseProps): ReactElement => {
    const [expanded, setExpanded] = useState(false);

    return (
        <li
            role="button"
            tabIndex={0}
            onKeyDown={(event: React.KeyboardEvent) => {
                if (event.code === 'Enter' || event.code === 'Space') {
                    setExpanded(!expanded);
                }
            }}
            onClick={() => {
                // ikke minimer når man markerer tekst
                if (window.getSelection()?.type !== 'Range') setExpanded(!expanded);
            }}
            className={classNames(styles.fokusområde, styles.klikkbar, styles.hendelse, className)}
            {...liProps}
        >
            <div className={styles.iconContainer}>{icon}</div>
            <div className={styles.content}>
                <HStack gap="1">
                    <BodyShort weight="semibold">{title}</BodyShort>
                    {expanded ? (
                        <ChevronUpIcon title="Vis mindre" fontSize="1.5rem" />
                    ) : (
                        <ChevronDownIcon title="Vis mer" fontSize="1.5rem" />
                    )}
                </HStack>
                <AnimatedExpandableDiv expanded={expanded}>{children}</AnimatedExpandableDiv>
                <HendelseDate timestamp={timestamp} ident={saksbehandler} />
            </div>
        </li>
    );
};
