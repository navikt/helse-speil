import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactElement, ReactNode, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';

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
                <AnimatePresence mode="wait">
                    {expanded && (
                        <motion.div
                            key="div"
                            className={styles.animertUtvidetInnhold}
                            initial={{ height: 0 }}
                            exit={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            transition={{
                                type: 'tween',
                                duration: 0.2,
                                ease: 'easeInOut',
                            }}
                        >
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
                <HendelseDate timestamp={timestamp} ident={saksbehandler} />
            </div>
        </li>
    );
};
