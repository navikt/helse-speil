import { CaseworkerFilled } from '@navikt/ds-icons';
import React from 'react';
import { Hendelse } from './Hendelse';

interface InntektoverstyringhendelseProps extends Omit<InntektoverstyringhendelseObject, 'type' | 'id'> {}

export const Inntektoverstyringhendelse: React.FC<InntektoverstyringhendelseProps> = ({
    erRevurdering,
    saksbehandler,
    timestamp,
}) => {
    return (
        <Hendelse
            title={erRevurdering ? 'Revurdert inntekt' : 'Endret inntekt'}
            icon={<CaseworkerFilled height={22} width={22} />}
            ident={saksbehandler}
            timestamp={timestamp}
        />
    );
};
