import styled from '@emotion/styled';
import React, { useState } from 'react';

import { LinkButton } from '../../../../../components/LinkButton';
import { TableModal } from '../../../../../components/TableModal';
import { useInnloggetSaksbehandler } from '../../../../../state/authentication';
import { getFormatertNavn } from '../../../../../state/person';

import { NotatListeRad } from './NotatListeRad';
import { NyttNotatModal } from './NyttNotatModal';

const Title = styled.div`
    > p:first-of-type {
        font-size: 18px;
        margin-bottom: 0.5rem;
    }

    > p:not(:first-of-type) {
        font-size: 14px;
        font-weight: normal;
    }
`;

interface NotatListeModalProps {
    notater: Notat[];
    vedtaksperiodeId: string;
    personinfo: Personinfo;
    onClose: (event: React.SyntheticEvent) => void;
    erPåVent?: boolean;
}

export const NotatListeModal = ({ notater, vedtaksperiodeId, personinfo, onClose, erPåVent }: NotatListeModalProps) => {
    const [showNyttNotatModal, setShowNyttNotatModal] = useState(false);
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const søkernavn = getFormatertNavn(personinfo);

    const closeModal = (event: React.SyntheticEvent) => {
        onClose(event);
    };

    const toggleShowNyttNotatModal = (event: React.SyntheticEvent) => {
        setShowNyttNotatModal((prevState) => !prevState);
    };

    return showNyttNotatModal ? (
        <NyttNotatModal
            onClose={toggleShowNyttNotatModal}
            personinfo={personinfo}
            vedtaksperiodeId={vedtaksperiodeId}
        />
    ) : (
        <TableModal
            title={
                <Title>
                    <p>Lagt på vent - notater</p>
                    <p>Søker: {søkernavn}</p>
                </Title>
            }
            contentLabel="Lagt på vent - notater"
            isOpen
            onRequestClose={closeModal}
        >
            <thead>
                <tr>
                    <th>Dato</th>
                    <th>Saksbehandler</th>
                    <th>Kommentar</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {notater.map((notat) => (
                    <NotatListeRad
                        key={notat.id}
                        notat={notat}
                        vedtaksperiodeId={vedtaksperiodeId}
                        innloggetSaksbehandler={innloggetSaksbehandler}
                    />
                ))}
            </tbody>
            {erPåVent && (
                <tfoot>
                    <tr>
                        <td colSpan={4} style={{ textAlign: 'right', paddingTop: '1.5rem' }}>
                            <LinkButton onClick={toggleShowNyttNotatModal}>Legg til ny kommentar</LinkButton>
                        </td>
                    </tr>
                </tfoot>
            )}
        </TableModal>
    );
};
