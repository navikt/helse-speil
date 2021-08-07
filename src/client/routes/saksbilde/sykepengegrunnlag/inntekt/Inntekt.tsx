import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { OmregnetÅrsinntekt } from 'internal-types';
import React, { useState } from 'react';

import { Undertittel } from 'nav-frontend-typografi';

import { EditButton } from '../../../../components/EditButton';
import { Flex, FlexColumn } from '../../../../components/Flex';
import { Kilde } from '../../../../components/Kilde';
import IconOverstyrt from '../../../../components/ikoner/iconOverstyrt.svg';
import { useUtbetaling, Utbetalingstatus } from '../../../../modell/utbetalingshistorikkelement';
import { useAktivPeriode } from '../../../../state/tidslinje';
import { getKildeType, kilde } from '../../../../utils/inntektskilde';

import { overstyrInntektEnabled } from '../../../../featureToggles';
import { EditableInntekt } from './EditableInntekt';
import { ReadOnlyInntekt } from './ReadOnlyInntekt';

const Container = styled(FlexColumn)<{ editing: boolean }>`
    box-sizing: border-box;
    margin-bottom: 2rem;

    ${(props) =>
        props.editing &&
        css`
            background-color: var(--speil-background-secondary);
            border-left: 4px solid var(--navds-color-action-default);
            padding: 0.5rem 1rem;
        `};
`;

const Header = styled.div<{ isEditing: boolean }>`
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    justify-content: flex-start;
    width: 100%;

    > div > * {
        margin-right: 1rem;
    }

    ${(props) =>
        props.isEditing &&
        css`
            justify-content: space-between;
        `}
`;

const Tittel = styled(Undertittel)`
    display: flex;
    align-items: center;
    font-size: 18px;
    color: var(--navds-color-text-primary);

    ${({ maxwidth }: { maxwidth?: string }) => maxwidth && `max-width: ${maxwidth};`}
`;

const useUtbetalingstatus = (): Utbetalingstatus | undefined => {
    const periode = useAktivPeriode();
    const utbetaling = useUtbetaling(periode?.beregningId ?? '');
    return utbetaling?.status;
};

interface InntektProps {
    omregnetÅrsinntekt?: OmregnetÅrsinntekt;
}

export const Inntekt = ({ omregnetÅrsinntekt }: InntektProps) => {
    const [editing, setEditing] = useState(false);
    const [endret, setEndret] = useState(false);

    const status = useUtbetalingstatus();

    return (
        <Container editing={editing}>
            <Header isEditing={editing}>
                <Flex alignItems="center">
                    <Tittel tag="h3">Inntekt</Tittel>
                    {endret ? (
                        <IconOverstyrt />
                    ) : (
                        <Kilde type={getKildeType(omregnetÅrsinntekt?.kilde)}>{kilde(omregnetÅrsinntekt?.kilde)}</Kilde>
                    )}
                </Flex>
                {overstyrInntektEnabled && (
                    <EditButton
                        isOpen={editing}
                        openText="Lukk"
                        closedText={status === Utbetalingstatus.UTBETALT ? 'Revurder' : 'Endre'}
                        onOpen={() => setEditing(true)}
                        onClose={() => setEditing(false)}
                        style={{ justifySelf: 'flex-end' }}
                    />
                )}
            </Header>
            {editing ? (
                <EditableInntekt
                    omregnetÅrsinntekt={omregnetÅrsinntekt!}
                    close={() => setEditing(false)}
                    onEndre={setEndret}
                />
            ) : (
                <ReadOnlyInntekt omregnetÅrsinntekt={omregnetÅrsinntekt} />
            )}
        </Container>
    );
};
