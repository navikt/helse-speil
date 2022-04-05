import styled from '@emotion/styled';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';

import { Loader } from '@navikt/ds-react';

import { DropdownButton, DropdownContext } from '@components/dropdown/Dropdown';
import { useOperationErrorHandler } from '@state/varsler';
import { ignorePromise } from '@utils/promise';
import { Personinfo } from '@io/graphql';

import { NyttNotatModal } from '../../../oversikt/table/rader/notat/NyttNotatModal';
import { useFjernPåVent, useLeggPåVent } from '@state/person';

const Container = styled.span`
    display: flex;
    align-items: center;
`;

interface PåVentDropdownMenuButtonProps {
    oppgavereferanse: string;
    vedtaksperiodeId: string;
    personinfo: Personinfo;
    erPåVent?: boolean;
}

export const PåVentDropdownMenuButton = ({
    erPåVent,
    oppgavereferanse,
    vedtaksperiodeId,
    personinfo,
}: PåVentDropdownMenuButtonProps) => {
    const [isFetching, setIsFetching] = useState(false);
    const [visModal, setVisModal] = useState(false);

    const history = useHistory();
    const leggPåVent = useLeggPåVent();
    const fjernPåVent = useFjernPåVent();
    const errorHandler = useOperationErrorHandler('Legg på vent');

    const { lukk } = useContext(DropdownContext);

    const settPåVent = () => {
        setIsFetching(true);
        ignorePromise(
            leggPåVent(oppgavereferanse).then(() => {
                history.push('/');
            }),
            errorHandler,
        );
    };

    const fjernFraPåVent = () => {
        setIsFetching(true);
        ignorePromise(
            fjernPåVent(oppgavereferanse).finally(() => {
                lukk();
                setIsFetching(false);
            }),
            errorHandler,
        );
    };

    return (
        <Container>
            {erPåVent ? (
                <DropdownButton onClick={fjernFraPåVent}>
                    Fjern fra på vent
                    {isFetching && <Loader size="xsmall" />}
                </DropdownButton>
            ) : (
                <DropdownButton onClick={() => setVisModal(true)}>Legg på vent</DropdownButton>
            )}
            {visModal && (
                <NyttNotatModal
                    onClose={() => setVisModal(false)}
                    personinfo={personinfo}
                    vedtaksperiodeId={vedtaksperiodeId}
                    onPostNotat={settPåVent}
                />
            )}
        </Container>
    );
};
