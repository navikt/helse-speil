import styled from '@emotion/styled';
import { TildelingType } from 'internal-types';
import React from 'react';

import 'nav-frontend-tabell-style';

import { Link } from '@navikt/ds-react';

import { Modal } from '../../../../../components/Modal';
import { useInnloggetSaksbehandler } from '../../../../../state/authentication';
import { useNotaterForVedtaksperiode } from '../../../../../state/notater';

import { NotatListeRad } from './NotatListeRad';

const StyledLenke = styled(Link)`
    align-self: flex-end;
`;

const Content = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const StyledModal = styled(Modal)`
    width: 680px;

    h1 {
        font-size: 24px;
        font-weight: 600;
    }
`;

const Tittel = styled.h1`
    font-size: 16px;
    font-weight: 600;
    color: var(--navds-color-text-primary);
    margin-top: 18px;
    margin-left: 24px;
    margin-bottom: 26px;
`;

interface Props {
    lukk: () => void;
    vedtaksperiodeId: string;
    åpneNyttNotatModal: () => void;
    tildeling?: TildelingType;
}

export const NotatListeModal = ({ lukk, vedtaksperiodeId, tildeling, åpneNyttNotatModal }: Props) => {
    const notater = useNotaterForVedtaksperiode(vedtaksperiodeId);
    const påVent = tildeling?.påVent ?? false;
    const saksbehandler = useInnloggetSaksbehandler();

    const closeModal = (event: React.MouseEvent | React.KeyboardEvent) => {
        event.stopPropagation();
        lukk();
    };

    return (
        <StyledModal
            title={<Tittel>Lagt på vent - notater</Tittel>}
            contentLabel="Lagt på vent - notater"
            isOpen
            onRequestClose={closeModal}
        >
            <Content>
                {notater.length > 0 && (
                    <>
                        <table className="tabell tabell--stripet">
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
                                        saksbehandler={saksbehandler}
                                    />
                                ))}
                            </tbody>
                        </table>
                        <br />
                        {påVent && (
                            <StyledLenke
                                href="#"
                                onClick={() => {
                                    lukk();
                                    åpneNyttNotatModal();
                                }}
                            >
                                Legg til ny kommentar
                            </StyledLenke>
                        )}
                    </>
                )}
            </Content>
        </StyledModal>
    );
};
