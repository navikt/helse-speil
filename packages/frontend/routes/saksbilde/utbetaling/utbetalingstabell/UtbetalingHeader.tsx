import styled from '@emotion/styled';
import React, { useMemo } from 'react';

import { Locked } from '@navikt/ds-icons';

import { Flex } from '@components/Flex';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { Arbeidsgiver, BeregnetPeriode } from '@io/graphql';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

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

const useActivePeriodHasLatestFagsystemIdForSkjæringstidspunkt = (): boolean => {
    const arbeidsgiver = useCurrentArbeidsgiver() as Arbeidsgiver;
    const periode = useActivePeriod() as BeregnetPeriode;

    const fagsystemiderSorted = arbeidsgiver.generasjoner[0]?.perioder
        .filter(isBeregnetPeriode)
        .filter((it) => it.skjaeringstidspunkt === periode.skjaeringstidspunkt)
        .sort((a, b) => new Date(b.fom).getTime() - new Date(a.fom).getTime());

    return periode.utbetaling.arbeidsgiverFagsystemId === fagsystemiderSorted[0]?.utbetaling.arbeidsgiverFagsystemId;
};

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
                    <Locked height={24} width={24} />
                    {revurderingIsEnabled || overstyrRevurderingIsEnabled ? 'Revurder' : 'Endre'}
                </ToggleOverstyringKnapp>
            )}
        </Container>
    );
};
