import styled from '@emotion/styled';
import React, { useState } from 'react';

import { DropdownButton } from '@components/dropdown';
import { Personinfo } from '@io/graphql';

import { NyttNotatModal } from '../../../oversikt/table/rader/notat/NyttNotatModal';

const Container = styled.span`
    display: flex;
    align-items: center;
`;

interface SkrivNotatDropdownMenuButtonProps {
    vedtaksperiodeId: string;
    personinfo: Personinfo;
}

export const SkrivGenereltNotatDropdownMenuButton = ({
    vedtaksperiodeId,
    personinfo,
}: SkrivNotatDropdownMenuButtonProps) => {
    const [visModal, setVisModal] = useState(false);

    return (
        <Container>
            <DropdownButton onClick={() => setVisModal(true)}>Skriv notat</DropdownButton>
            {visModal && (
                <NyttNotatModal
                    onClose={() => setVisModal(false)}
                    personinfo={personinfo}
                    vedtaksperiodeId={vedtaksperiodeId}
                    notattype="Generelt"
                />
            )}
        </Container>
    );
};

export default SkrivGenereltNotatDropdownMenuButton;
