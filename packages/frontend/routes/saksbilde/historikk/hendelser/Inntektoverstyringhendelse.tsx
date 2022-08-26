import React from 'react';
import { BodyShort } from '@navikt/ds-react';
import { CaseworkerFilled } from '@navikt/ds-icons';

import { getFormattedDateString } from '@utils/date';
import { somPengerUtenDesimaler } from '@utils/locale';

import { Hendelse } from './Hendelse';
import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';

import styles from './Overstyringshendelse.module.css';

interface InntektoverstyringhendelseProps extends Omit<InntektoverstyringhendelseObject, 'type' | 'id'> {}

export const Inntektoverstyringhendelse: React.FC<InntektoverstyringhendelseProps> = ({
    erRevurdering,
    saksbehandler,
    timestamp,
    begrunnelse,
    inntekt,
}) => {
    return (
        <Hendelse
            title={erRevurdering ? 'Revurdert inntekt' : 'Endret inntekt'}
            icon={<CaseworkerFilled height={20} width={20} />}
            ident={saksbehandler}
            timestamp={timestamp}
        >
            <ExpandableHistorikkContent>
                <div className={styles.Grid}>
                    <BodyShort>Begrunnelse: </BodyShort>
                    <BodyShort>{begrunnelse}</BodyShort>
                    <BodyShort>Forklaring: </BodyShort>
                    <BodyShort>{inntekt.forklaring}</BodyShort>
                    <BodyShort>Mnd. inntekt: </BodyShort>
                    <BodyShort>{somPengerUtenDesimaler(inntekt.manedligInntekt)}</BodyShort>
                    <BodyShort>Skj. tidspunkt</BodyShort>
                    <BodyShort>{getFormattedDateString(inntekt.skjaeringstidspunkt)}</BodyShort>
                </div>
            </ExpandableHistorikkContent>
        </Hendelse>
    );
};
