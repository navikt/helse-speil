import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { Avslagstype, Inntektskilde } from '@io/graphql';
import { AvslaghendelseObject } from '@typer/historikk';

import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';
import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';

import styles from './Overstyringshendelse.module.css';

type AvslaghendelseProps = Omit<AvslaghendelseObject, 'type' | 'id'>;

export const Avslaghendelse = ({
    avslagstype,
    begrunnelse,
    saksbehandler,
    timestamp,
}: AvslaghendelseProps): ReactElement => {
    return (
        <Hendelse
            title="Individuell begrunnelse for avslag"
            icon={
                <Kilde type={Inntektskilde.Saksbehandler}>
                    <PersonPencilFillIcon title="Saksbehandler ikon" />
                </Kilde>
            }
        >
            <ExpandableHistorikkContent>
                <div className={styles.Grid}>
                    <BodyShort weight="semibold">Type: </BodyShort>
                    <BodyShort>{avslagstype === Avslagstype.DelvisAvslag ? 'Delvis innvilgelse' : 'Avslag'}</BodyShort>
                    <BodyShort weight="semibold">Begrunnelse: </BodyShort>
                    <BodyShort>{begrunnelse}</BodyShort>
                </div>
            </ExpandableHistorikkContent>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
        </Hendelse>
    );
};
