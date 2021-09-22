import React from 'react';

import { Link } from '@navikt/ds-react';

import { useInnloggetSaksbehandler } from '../../../../../state/authentication';
import { useNotaterForVedtaksperiode } from '../../../../../state/notater';

import { Endringslogg } from './Endringslogg';
import { NotatListeRad } from './NotatListeRad';

interface NotatListeModalProps {
    vedtaksperiodeId: string;
    åpneNyttNotatModal: () => void;
    tildeling?: Tildeling;
    onClose: () => void;
}

export const NotatListeModal = ({ onClose, vedtaksperiodeId, tildeling, åpneNyttNotatModal }: NotatListeModalProps) => {
    const notater = useNotaterForVedtaksperiode(vedtaksperiodeId);
    const påVent = tildeling?.påVent ?? false;
    const saksbehandler = useInnloggetSaksbehandler();

    const closeModal = (event: React.MouseEvent | React.KeyboardEvent) => {
        event.stopPropagation();
        onClose();
    };

    return (
        <Endringslogg
            title="Lagt på vent - notater"
            contentLabel="Lagt på vent - notater"
            isOpen
            onRequestClose={closeModal}
        >
            {notater.length > 0 && (
                <>
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
                    {påVent && (
                        <tfoot>
                            <tr>
                                <td />
                                <td />
                                <td>
                                    <Link
                                        href="#"
                                        onClick={() => {
                                            onClose();
                                            åpneNyttNotatModal();
                                        }}
                                    >
                                        Legg til ny kommentar
                                    </Link>
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </>
            )}
        </Endringslogg>
    );
};
