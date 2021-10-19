import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useState } from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { EditButton } from '../../../../components/EditButton';
import { Flex, FlexColumn } from '../../../../components/Flex';
import { Kilde } from '../../../../components/Kilde';
import { useUtbetaling } from '../../../../modell/utbetalingshistorikkelement';
import { useAktivPeriode, useMaybeAktivPeriode } from '../../../../state/tidslinje';
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

const Tittel = styled(BodyShort)`
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    color: var(--navds-color-text-primary);
`;

const useUtbetalingstatus = (): UtbetalingshistorikkElement['status'] | undefined => {
    const periode = useMaybeAktivPeriode();
    const utbetaling = useUtbetaling(periode?.beregningId ?? '');
    return utbetaling?.status;
};

const useInntektskilde = (): Inntektskilde => useAktivPeriode().inntektskilde;

interface InntektProps {
    omregnetÅrsinntekt: ExternalOmregnetÅrsinntekt | null;
}

export const Inntekt = ({ omregnetÅrsinntekt }: InntektProps) => {
    const [editing, setEditing] = useState(false);
    const [endret, setEndret] = useState(false);

    const status = useUtbetalingstatus();
    const harKunEnArbeidsgiver = useInntektskilde() === 'EN_ARBEIDSGIVER';

    return (
        <Container editing={editing}>
            <Header isEditing={editing}>
                <Flex alignItems="center">
                    <Tittel as="h3">Inntekt</Tittel>
                    {endret ? (
                        <CaseworkerFilled height={20} width={20} />
                    ) : (
                        <Kilde type={getKildeType(omregnetÅrsinntekt?.kilde)}>{kilde(omregnetÅrsinntekt?.kilde)}</Kilde>
                    )}
                </Flex>
                {overstyrInntektEnabled && harKunEnArbeidsgiver && (
                    <EditButton
                        isOpen={editing}
                        openText="Lukk"
                        closedText={status === 'UTBETALT' ? 'Revurder' : 'Endre'}
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
