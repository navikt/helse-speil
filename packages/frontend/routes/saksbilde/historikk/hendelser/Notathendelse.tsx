import React from 'react';
import { DialogDots } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Hendelse } from './Hendelse';
import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';
import classNames from 'classnames';

import styles from './Notathendelse.module.css';

const getNotattittel = (type: NotatType, feilregistrert: boolean) => {
    let title: string;
    switch (type) {
        case 'PaaVent':
            title = 'Lagt på vent';
            break;
        case 'Retur':
            title = 'Returnert';
            break;
        default:
            title = 'Notat';
            break;
    }

    return feilregistrert ? `${title} (feilregistrert)` : title;
};

interface NotathendelseProps extends Omit<NotathendelseObject, 'type' | 'id'> {}

export const Notathendelse: React.FC<NotathendelseProps> = ({
    tekst,
    notattype,
    saksbehandler,
    timestamp,
    feilregistrert,
}) => {
    const title = (
        <span className={classNames(feilregistrert && styles.Feilregistrert)}>
            {getNotattittel(notattype, feilregistrert)}
        </span>
    );

    return (
        <Hendelse
            title={title}
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
