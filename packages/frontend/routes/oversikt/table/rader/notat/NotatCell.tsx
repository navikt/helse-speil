import React, { useState } from 'react';

import { Notes } from '@navikt/ds-icons';
import { Button, Tooltip } from '@navikt/ds-react';

import { Personinfo } from '@io/graphql';
import { useNotaterForVedtaksperiode } from '@state/notater';

import { Cell } from '../../Cell';
import { NotatListeModal } from './NotatListeModal';

import styles from './NotatCell.module.css';

interface NotatCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    vedtaksperiodeId: string;
    personinfo: Personinfo;
    erPåVent?: boolean;
}

export const NotatCell: React.FC<NotatCellProps> = ({ vedtaksperiodeId, personinfo, erPåVent, ...cellProps }) => {
    const [showModal, setShowModal] = useState(false);
    const notater = useNotaterForVedtaksperiode(vedtaksperiodeId);

    const toggleModal = (event: React.SyntheticEvent) => {
        event.stopPropagation();
        setShowModal((prevState) => !prevState);
    };

    return (
        <>
            <Cell {...cellProps}>
                {notater.length > 0 && (
                    <Tooltip content="Notater">
                        <Button className={styles.NotatButton} onClick={toggleModal} onKeyPress={toggleModal}>
                            <Notes title="Toggle notatmodal" height={20} width={20} />
                        </Button>
                    </Tooltip>
                )}
            </Cell>
            {showModal && (
                <NotatListeModal
                    notater={notater}
                    vedtaksperiodeId={vedtaksperiodeId}
                    personinfo={personinfo}
                    onClose={toggleModal}
                    erPåVent={erPåVent}
                    notattype="PaaVent"
                />
            )}
        </>
    );
};
