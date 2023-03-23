import styled from '@emotion/styled';
import React, { useMemo } from 'react';

import { Locked } from '@navikt/ds-icons';

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

export const ToggleOverstyringKnapp = styled.button`
    border: none;
    background: none;
    display: flex;
    align-items: center;
    outline: none;
    cursor: pointer;
    color: var(--a-surface-action);
    font-size: 1rem;
    font-family: inherit;
    height: 34px;

    > p {
        padding-top: 6px;
    }

    > svg {
        margin-right: 0.25rem;
    }

    &:hover {
        text-decoration: underline;
    }

    &:focus-visible {
        box-shadow: inset 0 0 0 3px var(--a-border-focus);
    }
`;

const InfobobleContainer = styled.div`
    margin-top: 1rem;
`;

interface UtbetalingHeaderProps {
    periodeErForkastet: boolean;
    toggleOverstyring: () => void;
    dager: Map<string, UtbetalingstabellDag>;
    revurderingIsEnabled?: boolean;
    overstyrRevurderingIsEnabled?: boolean;
}

export const UtbetalingHeader: React.FC<UtbetalingHeaderProps> = ({
    periodeErForkastet,
    toggleOverstyring,
    dager,
    revurderingIsEnabled,
    overstyrRevurderingIsEnabled,
}) => {
    const dagerInneholderKunAvvisteDager = useMemo(
        () => Array.from(dager.values()).every((it) => it.erAvvist || it.type === 'Helg'),
        [dager]
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
                <ToggleOverstyringKnapp onClick={toggleOverstyring} data-testid="overstyringsknapp">
                    <Locked height={24} width={24} title="locked" />
                    <p>{revurderingIsEnabled || overstyrRevurderingIsEnabled ? 'Revurder' : 'Endre'}</p>
                </ToggleOverstyringKnapp>
            )}
        </Container>
    );
};
