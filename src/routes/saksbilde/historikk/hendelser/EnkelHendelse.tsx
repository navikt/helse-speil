import classNames from 'classnames';
import React, { ReactElement, ReactNode } from 'react';

import { BodyShort, HStack } from '@navikt/ds-react';

import { HendelseDate } from '@saksbilde/historikk/hendelser/HendelseDate';
import { DateString } from '@typer/shared';

import styles from './EnkelHendelse.module.scss';

interface EnkelHendelseProps {
    icon: ReactNode;
    title: ReactNode;
    timestamp: DateString;
    saksbehandler?: string;
}

export const EnkelHendelse = ({ icon, title, timestamp, saksbehandler }: EnkelHendelseProps): ReactElement => (
    <li tabIndex={0} className={classNames(styles.fokusområde, styles.hendelse)}>
        <div className={styles.iconContainer}>{icon}</div>
        <div className={styles.content}>
            <HStack gap="1">
                <BodyShort weight="semibold">{title}</BodyShort>
            </HStack>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
        </div>
    </li>
);
