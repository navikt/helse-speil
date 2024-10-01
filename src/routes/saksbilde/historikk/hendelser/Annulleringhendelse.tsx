import React, { ReactElement } from 'react';

import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { AnnulleringhendelseObject } from '@typer/historikk';

import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';
import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';

import styles from './Overstyringshendelse.module.css';

type AnnulleringhendelseProps = Omit<AnnulleringhendelseObject, 'type' | 'id'>;

export const Annulleringhendelse = ({
    årsaker,
    begrunnelse,
    saksbehandler,
    timestamp,
}: AnnulleringhendelseProps): ReactElement => {
    return (
        <Hendelse
            title="Saken er annullert "
            icon={<XMarkOctagonIcon title="Stopp ikon" className={styles.annullertikon} />}
        >
            <ExpandableHistorikkContent>
                <div className={styles.Grid}>
                    <BodyShort weight="semibold">Årsaker: </BodyShort>
                    {årsaker.map((årsak, index) => (
                        <BodyShort key={index + årsak}>{årsak}</BodyShort>
                    ))}
                    <BodyShort weight="semibold">Begrunnelse: </BodyShort>
                    <BodyShort>{begrunnelse}</BodyShort>
                </div>
            </ExpandableHistorikkContent>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
        </Hendelse>
    );
};
