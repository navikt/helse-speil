import React, { useState } from 'react';

import { StopWatch } from '@navikt/ds-icons';
import { Button, Table, Tooltip } from '@navikt/ds-react';

import { NotatType, Personnavn } from '@io/graphql';
import { useNotaterForVedtaksperiode } from '@state/notater';

import { NotatListeModal } from './NotatListeModal';

import styles from './NotatCell.module.css';

interface NotatCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    vedtaksperiodeId: string;
    navn: Personnavn;
    erPåVent?: boolean;
}

export const NotatCell = ({ vedtaksperiodeId, navn, erPåVent }: NotatCellProps) => {
    const [showModal, setShowModal] = useState(false);
    const notater = useNotaterForVedtaksperiode(vedtaksperiodeId);

    const toggleModal = (event: React.SyntheticEvent) => {
        event.stopPropagation();
        if (event.type === 'keyup' && !['Space', 'Enter'].includes((event as React.KeyboardEvent).key)) return;
        setShowModal((prevState) => !prevState);
    };

    return (
        <>
            <Table.DataCell onClick={(event) => event.stopPropagation()}>
                {notater.length > 0 && (
                    <Tooltip content="Lagt på vent">
                        <Button
                            variant="secondary"
                            className={styles.NotatButton}
                            onClick={toggleModal}
                            onKeyUp={toggleModal}
                        >
                            <StopWatch height={20} width={20} />
                        </Button>
                    </Tooltip>
                )}
            </Table.DataCell>
            {showModal && (
                <NotatListeModal
                    notater={notater}
                    vedtaksperiodeId={vedtaksperiodeId}
                    navn={navn}
                    onClose={toggleModal}
                    erPåVent={erPåVent}
                    notattype={NotatType.PaaVent}
                />
            )}
        </>
    );
};
