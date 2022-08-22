import styled from '@emotion/styled';
import React, { useMemo } from 'react';

import { Locked } from '@navikt/ds-icons';

import { Flex } from '@components/Flex';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { useActivePeriodHasLatestFagsystemIdForSkjæringstidspunkt } from '@hooks/revurdering';

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
    align-items: flex-end;
    outline: none;
    cursor: pointer;
    color: var(--navds-semantic-color-interaction-primary);
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
    const dagerInneholderKunAGPEllerAvvisteDager = useMemo(
        () => Array.from(dager.values()).every((it) => it.erAGP || it.erAvvist || it.type === 'Helg'),
        [dager],
    );

    const hørerTilSisteFagsystemIdISkjæringstidspunkt = useActivePeriodHasLatestFagsystemIdForSkjæringstidspunkt();

    return (
        <Container>
            {periodeErForkastet ? (
                <InfobobleContainer>
                    <PopoverHjelpetekst ikon={<SortInfoikon />}>
                        <p>Kan ikke revurdere perioden på grunn av manglende datagrunnlag</p>
                    </PopoverHjelpetekst>
                </InfobobleContainer>
            ) : dagerInneholderKunAGPEllerAvvisteDager ? (
                <InfobobleContainer>
                    <PopoverHjelpetekst ikon={<SortInfoikon />}>
                        <p>
                            Det er foreløpig ikke mulig å gjøre endringer når hele perioden består av avslåtte dager
                            og/eller arbeidsgiverperiodedager
                        </p>
                    </PopoverHjelpetekst>
                </InfobobleContainer>
            ) : !hørerTilSisteFagsystemIdISkjæringstidspunkt ? (
                <InfobobleContainer>
                    <PopoverHjelpetekst ikon={<SortInfoikon />}>
                        <p>
                            Det er foreløpig ikke støtte for endringer i saker som har vært delvis behandlet i Infotrygd
                        </p>
                    </PopoverHjelpetekst>
                </InfobobleContainer>
            ) : (
                <ToggleOverstyringKnapp onClick={toggleOverstyring} data-testid="overstyringsknapp">
                    <Locked height={24} width={24} />
                    {revurderingIsEnabled || overstyrRevurderingIsEnabled ? 'Revurder' : 'Endre'}
                </ToggleOverstyringKnapp>
            )}
        </Container>
    );
};
