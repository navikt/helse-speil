import React, { ReactElement } from 'react';

import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Link } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { hoppTilModia } from '@components/SystemMenu';
import { DateString } from '@typer/shared';

import { Hendelse } from '../Hendelse';
import { HendelseDate } from '../HendelseDate';

import styles from './VedtakDokumentHendelse.module.scss';

type VedtakDokumentHendelseProps = {
    dokumentId?: string;
    fødselsnummer: string;
    timestamp: DateString;
};

export const VedtakDokumentHendelse = ({
    dokumentId,
    fødselsnummer,
    timestamp,
}: VedtakDokumentHendelseProps): ReactElement => (
    <Hendelse
        title={
            <span className={styles.header}>
                <span>Melding om vedtak</span>
            </span>
        }
        icon={<Kilde type="VEDTAK">MV</Kilde>}
    >
        <Link
            onClick={() =>
                hoppTilModia(
                    `https://spinnsyn-frontend-interne.intern.nav.no/syk/sykepenger?id=${dokumentId}`,
                    fødselsnummer,
                )
            }
            className={styles['åpne-vedtak']}
        >
            Åpne vedtak i ny fane
            <ExternalLinkIcon className={styles.eksternlenke} />
        </Link>
        <HendelseDate timestamp={timestamp} />
    </Hendelse>
);
