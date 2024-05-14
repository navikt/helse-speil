import React from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Kilde } from '@components/Kilde';
import { Avslagstype, Inntektskilde } from '@io/graphql';

import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';
import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';

import styles from './Overstyringshendelse.module.css';

type AvslaghendelseProps = Omit<AvslaghendelseObject, 'type' | 'id'>;

export const Avslaghendelse: React.FC<AvslaghendelseProps> = ({
    avslagstype,
    begrunnelse,
    saksbehandler,
    timestamp,
}) => {
    return (
        <Hendelse
            title="Individuell begrunnelse om avslag"
            icon={
                <Kilde type={Inntektskilde.Saksbehandler}>
                    <CaseworkerFilled title="Caseworker-ikon" height={20} width={20} />
                </Kilde>
            }
        >
            <ExpandableHistorikkContent>
                <div className={styles.Grid}>
                    <Bold>Type: </Bold>
                    <BodyShort>{avslagstype === Avslagstype.DelvisAvslag ? 'Delvis innvilgelse' : 'Avslag'}</BodyShort>
                    <Bold>Begrunnelse: </Bold>
                    <BodyShort>{begrunnelse}</BodyShort>
                </div>
            </ExpandableHistorikkContent>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
        </Hendelse>
    );
};
