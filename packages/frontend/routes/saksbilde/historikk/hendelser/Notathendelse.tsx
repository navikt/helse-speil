import React, { useState } from 'react';
import classNames from 'classnames';
import { DialogDots, EllipsisH } from '@navikt/ds-icons';
import { Button, Loader } from '@navikt/ds-react';
import { Dropdown } from '@navikt/ds-react-internal';

import { putFeilregistrertNotat } from '@io/http';
import { ignorePromise } from '@utils/promise';
import { useRefetchPerson } from '@state/person';
import { useRefreshNotater } from '@state/notater';
import { useOperationErrorHandler } from '@state/varsler';
import { useInnloggetSaksbehandler } from '@state/authentication';

import { Hendelse } from './Hendelse';
import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';

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

interface NotathendelseProps extends Omit<NotathendelseObject, 'type'> {}

export const Notathendelse: React.FC<NotathendelseProps> = ({
    id,
    tekst,
    notattype,
    saksbehandler,
    saksbehandlerOid,
    timestamp,
    feilregistrert,
    vedtaksperiodeId,
}) => {
    const [isFetching, setIsFetching] = useState(false);
    const refreshNotater = useRefreshNotater();
    const refetchPerson = useRefetchPerson();
    const errorHandler = useOperationErrorHandler('Feilregistrering av Notat');

    const title = (
        <span className={classNames(feilregistrert && styles.Feilregistrert)}>
            {getNotattittel(notattype, feilregistrert)}
        </span>
    );

    const innloggetSaksbehandler = useInnloggetSaksbehandler();

    const feilregistrerNotat = () => {
        setIsFetching(true);
        ignorePromise(
            putFeilregistrertNotat(vedtaksperiodeId, id)
                .then(() => {
                    refreshNotater();
                    refetchPerson();
                })
                .finally(() => setIsFetching(false)),
            errorHandler,
        );
    };

    return (
        <Hendelse
            title={title}
            icon={<DialogDots width={20} height={20} />}
            timestamp={timestamp}
            ident={saksbehandler}
        >
            {!feilregistrert && innloggetSaksbehandler.oid === saksbehandlerOid && (
                <Dropdown>
                    <Button as={Dropdown.Toggle} variant="tertiary" className={styles.ToggleButton} size="xsmall">
                        <EllipsisH height={20} width={20} />
                    </Button>
                    <Dropdown.Menu>
                        <Dropdown.Menu.List>
                            <Dropdown.Menu.List.Item onClick={feilregistrerNotat} className={styles.ListItem}>
                                Feilregistrer {isFetching && <Loader size="xsmall" />}
                            </Dropdown.Menu.List.Item>
                        </Dropdown.Menu.List>
                    </Dropdown.Menu>
                </Dropdown>
            )}
            <ExpandableHistorikkContent>
                <pre className={styles.Notat}>{tekst}</pre>
            </ExpandableHistorikkContent>
        </Hendelse>
    );
};
