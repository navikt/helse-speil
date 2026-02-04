import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { TimerPauseIcon } from '@navikt/aksel-icons';
import { Button, HStack, Table, Tooltip } from '@navikt/ds-react';

import { ApiOppgaveProjeksjonPaaVentInfo, ApiPersonnavn } from '@io/rest/generated/spesialist.schemas';
import { SisteNotattekst } from '@oversikt/table/oppgaverTable/SisteNotattekst';

import { PåVentListeModal } from './PåVentListeModal';

import styles from './PåVentCell.module.css';

interface PåVentCellProps {
    navn: ApiPersonnavn;
    utgåttFrist: boolean;
    påVentInfo: ApiOppgaveProjeksjonPaaVentInfo | undefined | null;
}

export const PåVentCell = ({ navn, utgåttFrist, påVentInfo }: PåVentCellProps): ReactElement => {
    return (
        <Table.DataCell onClick={(event) => event.stopPropagation()} className={styles.PåVentCell}>
            {!!påVentInfo && (
                <HStack gap="space-8" wrap={false}>
                    <PåVentKnapp navn={navn} utgåttFrist={utgåttFrist} påVentInfo={påVentInfo} />
                    <SisteNotattekst påVentInfo={påVentInfo} />
                </HStack>
            )}
        </Table.DataCell>
    );
};

interface PåVentKnappProps {
    navn: ApiPersonnavn;
    utgåttFrist: boolean;
    påVentInfo: ApiOppgaveProjeksjonPaaVentInfo;
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
                    variant="tertiary-neutral"
                    size="xsmall"
                    className={classNames(styles.NotatButton, utgåttFrist && styles.utgåttFrist)}
                    onClick={toggleModal}
                    onKeyUp={toggleModal}
                    icon={<TimerPauseIcon fontSize="1.5rem" aria-hidden />}
                />
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
