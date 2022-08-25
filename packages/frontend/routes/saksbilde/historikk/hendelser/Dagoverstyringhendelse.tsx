import { CaseworkerFilled } from '@navikt/ds-icons';
import React from 'react';
import { Hendelse } from './Hendelse';

interface DagoverstyringhendelseProps extends Omit<DagoverstyringhendelseObject, 'type' | 'id'> {}

export const Dagoverstyringhendelse: React.FC<DagoverstyringhendelseProps> = ({
    erRevurdering,
    saksbehandler,
    timestamp,
}) => {
    return (
        <Hendelse
            title={erRevurdering ? 'Revurdert utbetalingsdager' : 'Endret utbetalingsdager'}
            icon={<CaseworkerFilled height={20} width={20} />}
            ident={saksbehandler}
            timestamp={timestamp}
        />
    );
};
