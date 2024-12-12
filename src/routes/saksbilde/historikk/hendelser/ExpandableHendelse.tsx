import classNames from 'classnames';
import React, { ReactElement, ReactNode, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Spacer } from '@navikt/ds-react';

import { AnimatedExpandableDiv } from '@components/AnimatedExpandableDiv';
import { HendelseDate } from '@saksbilde/historikk/hendelser/HendelseDate';
import { DateString } from '@typer/shared';

import styles from './ExpandableHendelse.module.scss';

interface ExpandableHendelseProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'title'> {
    tittel: ReactNode;
    ikon?: ReactNode;
    saksbehandler?: string;
    tidsstempel: DateString;
    kontekstknapp?: ReactNode;
}

export const ExpandableHendelse = ({
    ikon,
    tittel,
    saksbehandler,
    tidsstempel,
    kontekstknapp,
    className,
    children,
    ...liProps
}: ExpandableHendelseProps): ReactElement => {
    const [expanded, setExpanded] = useState(false);

    function toggleExpanded() {
        setExpanded(!expanded);
    }

    return (
        <li
            role="button"
            tabIndex={0}
            onKeyDown={(event: React.KeyboardEvent) => {
                if (event.code === 'Enter' || event.code === 'Space') {
                    toggleExpanded();
                }
            }}
            onClick={() => {
                // ikke minimer når man markerer tekst
                if (window.getSelection()?.type !== 'Range') {
                    toggleExpanded();
                }
            }}
            className={classNames(styles.fokusområde, styles.klikkbar, styles.hendelse, className)}
            {...liProps}
        >
            <div className={styles.iconContainer}>{ikon}</div>
            <div className={styles.content}>
                <HStack gap="1" wrap={false}>
                    <HStack>
                        <BodyShort weight="semibold">{tittel}</BodyShort>
                        {expanded ? (
                            <ChevronUpIcon title="Vis mindre" fontSize="1.5rem" />
                        ) : (
                            <ChevronDownIcon title="Vis mer" fontSize="1.5rem" />
                        )}
                    </HStack>
                    {kontekstknapp && <Spacer />}
                    {kontekstknapp}
                </HStack>
                <HendelseDate timestamp={tidsstempel} ident={saksbehandler} />
                <AnimatedExpandableDiv expanded={expanded}>{children}</AnimatedExpandableDiv>
            </div>
        </li>
    );
};
