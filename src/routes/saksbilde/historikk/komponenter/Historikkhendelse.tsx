import classNames from 'classnames';
import React, { PropsWithChildren, ReactElement, useRef, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Spacer, VStack } from '@navikt/ds-react';

import { AnimatedExpandableDiv } from '@components/AnimatedExpandableDiv';
import { HendelseDate } from '@saksbilde/historikk/komponenter/HendelseDate';
import { DateString } from '@typer/shared';

import styles from './Historikkhendelse.module.scss';

type HistorikkhendelseProps = {
    icon?: ReactElement;
    title: string;
    kontekstknapp?: ReactElement;
    timestamp: DateString;
    saksbehandler?: string;
    aktiv?: boolean;
};

export const Historikkhendelse = ({
    icon,
    title,
    kontekstknapp,
    timestamp,
    saksbehandler,
    aktiv = true,
    children,
}: PropsWithChildren<HistorikkhendelseProps>): ReactElement => {
    const [expanded, setExpanded] = useState(false);
    const ref = useRef(null);

    function toggleExpanded() {
        setExpanded(!expanded);
    }

    return !aktiv && children ? (
        <li
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
                        event.preventDefault();
                        event.stopPropagation(); // Forhindre urelatert scrolling
                    }
                }
            }}
            className={classNames(styles.fokusområde, styles.klikkbar, styles.hendelse)}
            ref={ref}
        >
            <div className={styles.iconContainer}>{icon}</div>
            <div className={styles.content}>
                <HStack gap="1" wrap={false}>
                    <HStack gap="1" wrap={false}>
                        <BodyShort weight="semibold">{title}</BodyShort>
                        {expanded ? (
                            <ChevronUpIcon style={{ flexShrink: 0 }} title="Vis mindre" fontSize="1.5rem" />
                        ) : (
                            <ChevronDownIcon style={{ flexShrink: 0 }} title="Vis mer" fontSize="1.5rem" />
                        )}
                    </HStack>
                    {kontekstknapp && <Spacer />}
                    {kontekstknapp}
                </HStack>
                <HendelseDate timestamp={timestamp} ident={saksbehandler} />
                <AnimatedExpandableDiv expanded={expanded}>
                    <VStack gap="2">{children}</VStack>
                </AnimatedExpandableDiv>
            </div>
        </li>
    ) : (
        <li role="button" tabIndex={0} className={classNames(styles.fokusområde, styles.hendelse)}>
            <div className={styles.iconContainer}>{icon}</div>
            <div className={styles.content}>
                <HStack gap="1" wrap={false}>
                    <BodyShort weight="semibold">{title}</BodyShort>
                    {kontekstknapp && <Spacer />}
                    {kontekstknapp}
                </HStack>
                <HendelseDate timestamp={timestamp} ident={saksbehandler} />
                {children && <VStack gap="2">{children}</VStack>}
            </div>
        </li>
    );
};
