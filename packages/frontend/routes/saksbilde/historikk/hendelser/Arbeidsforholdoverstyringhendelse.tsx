import React from 'react';
import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { getFormattedDateString } from '@utils/date';

import { Hendelse } from './Hendelse';
import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';

import styles from './Overstyringshendelse.module.css';
import { HendelseDate } from './HendelseDate';

interface ArbeidsforholdoverstyringhendelseProps extends Omit<ArbeidsforholdoverstyringhendelseObject, 'type' | 'id'> {}

export const Arbeidsforholdoverstyringhendelse: React.FC<ArbeidsforholdoverstyringhendelseProps> = ({
    erDeaktivert,
    saksbehandler,
    timestamp,
    begrunnelse,
    forklaring,
    skjæringstidspunkt,
}) => {
    return (
        <Hendelse
            title={erDeaktivert ? 'Brukes ikke i beregningen' : 'Brukes i beregningen'}
            icon={<CaseworkerFilled height={20} width={20} />}
        >
            <ExpandableHistorikkContent>
                <div className={styles.Grid}>
                    <BodyShort>Begrunnelse: </BodyShort>
                    <BodyShort>{begrunnelse}</BodyShort>
                    <BodyShort>Forklaring: </BodyShort>
                    <BodyShort>{forklaring}</BodyShort>
                    <BodyShort>Skj. tidspunkt:</BodyShort>
                    <BodyShort>{getFormattedDateString(skjæringstidspunkt)}</BodyShort>
                </div>
            </ExpandableHistorikkContent>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
        </Hendelse>
    );
};
