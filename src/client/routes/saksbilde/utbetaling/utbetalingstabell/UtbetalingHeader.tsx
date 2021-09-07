import styled from '@emotion/styled';
import React from 'react';

import { Locked } from '@navikt/ds-icons';

import { Flex } from '../../../../components/Flex';
import { PopoverHjelpetekst } from '../../../../components/PopoverHjelpetekst';
import { SortInfoikon } from '../../../../components/ikoner/SortInfoikon';
import { useRevurderingIsEnabled } from '../../../../hooks/useRevurderingIsEnabled';

import { defaultUtbetalingToggles } from '../../../../featureToggles';

const Container = styled(Flex)`
    min-height: 24px;
    margin-bottom: 1rem;
`;

const ToggleOverstyringKnapp = styled.button`
    position: absolute;
    top: 1rem;
    right: 2rem;
    border: none;
    background: none;
    display: flex;
    align-items: flex-end;
    outline: none;
    cursor: pointer;
    color: var(--navds-color-action-default);
    font-size: 1rem;
    font-family: inherit;

    > svg {
        margin-right: 0.25rem;
    }

    &:focus,
    &:hover {
        text-decoration: underline;
    }
`;

interface UtbetalingHeaderProps {
    periodeErForkastet: boolean;
    toggleOverstyring: () => void;
}

export const UtbetalingHeader: React.FC<UtbetalingHeaderProps> = ({ periodeErForkastet, toggleOverstyring }) => {
    const revurderingIsEnabled = useRevurderingIsEnabled(defaultUtbetalingToggles);
    return (
        <Container>
            {periodeErForkastet ? (
                <PopoverHjelpetekst ikon={<SortInfoikon />} offset={24}>
                    <p>Kan ikke revurdere perioden på grunn av manglende datagrunnlag</p>
                </PopoverHjelpetekst>
            ) : (
                <ToggleOverstyringKnapp onClick={toggleOverstyring}>
                    <Locked height={24} width={24} />
                    {revurderingIsEnabled ? 'Revurder' : 'Endre'}
                </ToggleOverstyringKnapp>
            )}
        </Container>
    );
};
