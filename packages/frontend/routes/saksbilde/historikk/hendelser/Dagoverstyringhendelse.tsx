import React from 'react';
import { BodyShort } from '@navikt/ds-react';
import { CaseworkerFilled } from '@navikt/ds-icons';
import { getFormattedDateString } from '@utils/date';

import { Hendelse } from './Hendelse';
import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';

import styles from './Dagoverstyringhendelse.module.css';

interface DagoverstyringhendelseProps extends Omit<DagoverstyringhendelseObject, 'type' | 'id'> {}

export const Dagoverstyringhendelse: React.FC<DagoverstyringhendelseProps> = ({
    erRevurdering,
    saksbehandler,
    timestamp,
    begrunnelse,
    dager,
}) => {
    return (
        <Hendelse
            title={erRevurdering ? 'Revurdert utbetalingsdager' : 'Endret utbetalingsdager'}
            icon={<CaseworkerFilled height={20} width={20} />}
            ident={saksbehandler}
            timestamp={timestamp}
        >
            <ExpandableHistorikkContent>
                <BodyShort size="small">Begrunnelse: {begrunnelse}</BodyShort>
                <div className={styles.Content}>
                    {dager.map((dag, i) => (
                        <div key={i} className={styles.Grid}>
                            <BodyShort>Dato:</BodyShort>
                            <BodyShort>{getFormattedDateString(dag.dato)}</BodyShort>
                            <BodyShort>Grad:</BodyShort>
                            <BodyShort>{dag.grad} %</BodyShort>
                            <BodyShort>Type:</BodyShort>
                            <BodyShort>{dag.type}</BodyShort>
                        </div>
                    ))}
                </div>
            </ExpandableHistorikkContent>
        </Hendelse>
    );
};
