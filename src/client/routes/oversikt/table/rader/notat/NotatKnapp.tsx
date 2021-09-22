import styled from '@emotion/styled';
import React, { useState } from 'react';

import { Notes } from '@navikt/ds-icons';

import { useNotaterForVedtaksperiode } from '../../../../../state/notater';

import { InteractiveCellContent } from '../../../../saksbilde/table/CellContent';
import { NotatListeModal } from './NotatListeModal';
import { NyttNotatModal } from './NyttNotatModal';

const NotesContainer = styled.span`
    display: flex;
    align-items: center;
`;

interface NotatKnappProps {
    tildeling?: Tildeling;
    vedtaksperiodeId: string;
    personinfo: Personinfo;
}

export const NotatKnapp = ({ tildeling, vedtaksperiodeId, personinfo }: NotatKnappProps) => {
    const [showNotatListeModal, setShowNotatListeModal] = useState(false);
    const [showNyttNotatModal, setShowNyttNotatModal] = useState(false);

    const notater = useNotaterForVedtaksperiode(vedtaksperiodeId);

    return notater.length > 0 ? (
        <InteractiveCellContent>
            <NotesContainer>
                <Notes
                    height="20px"
                    width="20px"
                    color="var(--nav-blaa-darken-20)"
                    onClick={() => setShowNotatListeModal(true)}
                />
                {showNotatListeModal && (
                    <NotatListeModal
                        onClose={() => setShowNotatListeModal(false)}
                        vedtaksperiodeId={vedtaksperiodeId}
                        tildeling={tildeling}
                        åpneNyttNotatModal={() => setShowNyttNotatModal(true)}
                    />
                )}
                {showNyttNotatModal && (
                    <NyttNotatModal
                        lukkModal={() => setShowNyttNotatModal(false)}
                        personinfo={personinfo}
                        vedtaksperiodeId={vedtaksperiodeId}
                        navigerTilbake={() => {
                            setShowNotatListeModal(true);
                            setShowNyttNotatModal(false);
                        }}
                    />
                )}
            </NotesContainer>
        </InteractiveCellContent>
    ) : null;
};
