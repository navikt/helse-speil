import classNames from 'classnames';
import React, { ReactElement, ReactNode, useRef, useState } from 'react';

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
    const ref = useRef(null);

    function toggleExpanded() {
        setExpanded(!expanded);
    }

    return (
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
            className={classNames(styles.fokusområde, styles.klikkbar, styles.hendelse, className)}
            ref={ref}
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
