import styled from '@emotion/styled';
import React from 'react';

import { EditButton } from '@components/EditButton';
import { Flex } from '@components/Flex';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';

const Container = styled(Flex)`
    height: 24px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 0 0 0 2rem;
    width: 100%;
`;

const InfobobleContainer = styled.div`
    margin-top: 1rem;
`;

interface UtbetalingHeaderProps {
    periodeErForkastet: boolean;
    toggleOverstyring: () => void;
    overstyrer: boolean;
    revurderingIsEnabled?: boolean;
    overstyrRevurderingIsEnabled?: boolean;
}

export const UtbetalingHeader: React.FC<UtbetalingHeaderProps> = ({
    periodeErForkastet,
    toggleOverstyring,
    overstyrer,
    revurderingIsEnabled,
    overstyrRevurderingIsEnabled,
}) => {
    const editButton = (
        <EditButton
            isOpen={overstyrer}
            onOpen={toggleOverstyring}
            onClose={toggleOverstyring}
            openText="Avbryt"
            closedText={revurderingIsEnabled || overstyrRevurderingIsEnabled ? 'Revurder' : 'Endre'}
        />
    );
    return (
        <Container>
            {periodeErForkastet ? (
                <InfobobleContainer>
                    <PopoverHjelpetekst ikon={<SortInfoikon />}>
                        <p>Kan ikke revurdere perioden på grunn av manglende datagrunnlag</p>
                    </PopoverHjelpetekst>
                </InfobobleContainer>
            ) : (
                editButton
            )}
        </Container>
    );
};
