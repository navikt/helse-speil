import React from 'react';
import { DialogDots } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Hendelse } from './Hendelse';
import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';

const getNotattittel = (type: NotatType) => {
    switch (type) {
        case 'PaaVent':
            return 'Lagt på vent';
        case 'Retur':
            return 'Returnert';
        default:
            return 'Notat';
    }
};

interface NotathendelseProps extends Omit<NotathendelseObject, 'type' | 'id'> {}

export const Notathendelse: React.FC<NotathendelseProps> = ({ tekst, notattype, saksbehandler, timestamp }) => {
    return (
        <Hendelse
            title={getNotattittel(notattype)}
            icon={<DialogDots width={20} height={20} />}
            timestamp={timestamp}
            ident={saksbehandler}
        >
            <ExpandableHistorikkContent>
                <BodyShort>{tekst}</BodyShort>
            </ExpandableHistorikkContent>
        </Hendelse>
    );
};
