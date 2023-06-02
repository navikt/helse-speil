import React, { useState } from 'react';

import { StopWatch } from '@navikt/ds-icons';
import { Button, Tooltip } from '@navikt/ds-react';

import { Personnavn } from '@io/graphql';
import { useNotaterForVedtaksperiode } from '@state/notater';

import { Cell } from '../../Cell';
import { CellContent } from '../CellContent';
import { NotatListeModal } from './NotatListeModal';

import styles from './NotatCell.module.css';

interface NotatCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    vedtaksperiodeId: string;
    navn: Personnavn;
    erPåVent?: boolean;
}

export const NotatCell: React.FC<NotatCellProps> = ({ vedtaksperiodeId, navn, erPåVent, ...cellProps }) => {
    const [showModal, setShowModal] = useState(false);
    const notater = useNotaterForVedtaksperiode(vedtaksperiodeId);

    const toggleModal = (event: React.SyntheticEvent) => {
        event.stopPropagation();
        if (event.type === 'keyup' && !['Space', 'Enter'].includes((event as React.KeyboardEvent).key)) return;
        setShowModal((prevState) => !prevState);
    };

    return (
        <>
            <Cell {...cellProps}>
                <CellContent>
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
                </CellContent>
            </Cell>
            {showModal && (
                <NotatListeModal
                    notater={notater}
                    vedtaksperiodeId={vedtaksperiodeId}
                    navn={navn}
                    onClose={toggleModal}
                    erPåVent={erPåVent}
                    notattype="PaaVent"
                />
            )}
        </>
    );
};
