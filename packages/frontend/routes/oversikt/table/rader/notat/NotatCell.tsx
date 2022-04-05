import styled from '@emotion/styled';
import React, { useState } from 'react';

import { Notes } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';

import { useNotaterForVedtaksperiode } from '@state/notater';

import { Cell } from '../../Cell';
import { NotatListeModal } from './NotatListeModal';
import { convertToGraphQLPersoninfo } from '@utils/mapping';

const OpenNotesButton = styled(Button)`
    padding: 0.25rem;
    margin: 0;
    min-width: max-content;
    background: none;

    svg > path {
        fill: var(--navds-color-action-default);
    }

    &:hover svg > path,
    &:active svg > path {
        fill: var(--navds-color-text-inverse);
    }
`;

interface NotatCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    vedtaksperiodeId: string;
    personinfo: Personinfo;
    erPåVent?: boolean;
}

export const NotatCell: React.VFC<NotatCellProps> = ({ vedtaksperiodeId, personinfo, erPåVent, ...cellProps }) => {
    const [showModal, setShowModal] = useState(false);
    const notater = useNotaterForVedtaksperiode(vedtaksperiodeId);

    const toggleModal = (event: React.SyntheticEvent) => {
        event.stopPropagation();
        setShowModal((prevState) => !prevState);
    };

    return (
        <>
            <Cell {...cellProps} data-tip="Notater">
                {notater.length > 0 && (
                    <OpenNotesButton as="button" onClick={toggleModal} onKeyPress={toggleModal}>
                        <Notes height={20} width={20} />
                    </OpenNotesButton>
                )}
            </Cell>
            {showModal && (
                <NotatListeModal
                    notater={notater}
                    vedtaksperiodeId={vedtaksperiodeId}
                    personinfo={convertToGraphQLPersoninfo(personinfo)}
                    onClose={toggleModal}
                    erPåVent={erPåVent}
                />
            )}
        </>
    );
};
