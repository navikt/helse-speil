import styled from '@emotion/styled';
import React, { useMemo } from 'react';

import { EditButton } from '@components/EditButton';
import { Flex } from '@components/Flex';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';

import { erHelg } from './helgUtils';

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
    dager: Map<string, Utbetalingstabelldag>;
    revurderingIsEnabled?: boolean;
    overstyrRevurderingIsEnabled?: boolean;
}

export const UtbetalingHeader: React.FC<UtbetalingHeaderProps> = ({
    periodeErForkastet,
    toggleOverstyring,
    overstyrer,
    dager,
    revurderingIsEnabled,
    overstyrRevurderingIsEnabled,
}) => {
    const dagerInneholderKunAvvisteDager = useMemo(
        () => Array.from(dager.values()).every((tabelldag) => tabelldag.erAvvist || erHelg(tabelldag.dag.speilDagtype)),
        [dager],
    );

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
            ) : dagerInneholderKunAvvisteDager ? (
                <InfobobleContainer>
                    <PopoverHjelpetekst ikon={<SortInfoikon />}>
                        <p>Det er foreløpig ikke mulig å gjøre endringer når hele perioden består av avslåtte dager</p>
                    </PopoverHjelpetekst>
                </InfobobleContainer>
            ) : (
                editButton
            )}
        </Container>
    );
};
