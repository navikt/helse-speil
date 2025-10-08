import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { TimerPauseIcon } from '@navikt/aksel-icons';
import { Button, Table, Tooltip } from '@navikt/ds-react';

import { Maybe, OppgaveProjeksjonPaaVent, Personnavn } from '@io/graphql';
import { SisteNotattekst } from '@oversikt/table/oppgaverTable/SisteNotattekst';

import { PåVentListeModal } from './PåVentListeModal';

import styles from './PåVentCell.module.css';

interface PåVentCellProps {
    navn: Personnavn;
    utgåttFrist: boolean;
    påVentInfo: Maybe<OppgaveProjeksjonPaaVent>;
}

export const PåVentCell = ({ navn, utgåttFrist, påVentInfo }: PåVentCellProps): ReactElement => {
    return (
        <Table.DataCell onClick={(event) => event.stopPropagation()} className={classNames(styles.PåVentCell)}>
            {!!påVentInfo && (
                <div className={styles.KnappOgTekst}>
                    <PåVentKnapp navn={navn} utgåttFrist={utgåttFrist} påVentInfo={påVentInfo} />
                    <SisteNotattekst påVentInfo={påVentInfo} />
                </div>
            )}
        </Table.DataCell>
    );
};

interface PåVentKnappProps {
    navn: Personnavn;
    utgåttFrist: boolean;
    påVentInfo: OppgaveProjeksjonPaaVent;
}

const PåVentKnapp = ({ navn, utgåttFrist, påVentInfo }: PåVentKnappProps): ReactElement | null => {
    const [showModal, setShowModal] = useState(false);

    const toggleModal = (event: React.SyntheticEvent) => {
        event.stopPropagation();
        if (event.type === 'keyup' && !['Space', 'Enter'].includes((event as React.KeyboardEvent).key)) return;
        setShowModal((prevState) => !prevState);
    };

    return (
        <>
            <Tooltip content="Lagt på vent">
                <Button
                    variant="secondary"
                    className={classNames(styles.NotatButton, utgåttFrist && styles.utgåttFrist)}
                    onClick={toggleModal}
                    onKeyUp={toggleModal}
                >
                    <TimerPauseIcon fontSize="1.5rem" title="Vis lagt på vent-notater" />
                </Button>
            </Tooltip>
            {showModal && (
                <PåVentListeModal
                    closeModal={() => setShowModal(false)}
                    showModal={showModal}
                    påVentInfo={påVentInfo}
                    navn={navn}
                />
            )}
        </>
    );
};
