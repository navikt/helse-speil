import { CaseworkerFilled } from '@navikt/ds-icons';
import React from 'react';

import { Hendelse } from './Hendelse';

interface ArbeidsforholdoverstyringhendelseProps extends Omit<ArbeidsforholdoverstyringhendelseObject, 'type' | 'id'> {}

export const Arbeidsforholdoverstyringhendelse: React.FC<ArbeidsforholdoverstyringhendelseProps> = ({
    erDeaktivert,
    saksbehandler,
    timestamp,
}) => {
    return (
        <Hendelse
            title={erDeaktivert ? 'Brukes ikke i beregningen' : 'Brukes i beregningen'}
            icon={<CaseworkerFilled height={20} width={20} />}
            ident={saksbehandler}
            timestamp={timestamp}
        />
    );
};
