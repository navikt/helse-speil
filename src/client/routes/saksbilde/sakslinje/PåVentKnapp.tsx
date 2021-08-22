import styled from '@emotion/styled';
import { Personinfo } from 'internal-types';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { useSetRecoilState } from 'recoil';

import { DropdownContext, DropdownMenyknapp } from '../../../components/dropdown/Dropdown';
import { useFjernPåVent, useLeggPåVent } from '../../../state/person';
import { useOperationErrorHandler } from '../../../state/varsler';
import { ignorePromise } from '../../../utils/promise';

import { NyttNotatModal } from '../../oversikt/table/rader/notat/NyttNotatModal';
import { tabState, TabType } from '../../oversikt/tabs';

export interface PåVentKnappProps {
    erPåVent?: boolean;
    oppgavereferanse?: string;
    vedtaksperiodeId: string;
    personinfo: Personinfo;
}

const Container = styled.span`
    display: flex;
    align-items: center;
`;

export const PåVentKnapp = ({ erPåVent, oppgavereferanse, vedtaksperiodeId, personinfo }: PåVentKnappProps) => {
    const setAktivTab = useSetRecoilState(tabState);
    const [isFetching, setIsFetching] = useState(false);
    const history = useHistory();
    const errorHandler = useOperationErrorHandler('Legg på vent');
    const { lukk } = useContext(DropdownContext);

    const leggPåVent = useLeggPåVent();
    const fjernPåVent = useFjernPåVent();

    const [visModal, setVisModal] = useState(false);

    if (!oppgavereferanse) {
        return null;
    }
    const settPåVent = () => {
        setIsFetching(true);
        ignorePromise(
            leggPåVent({ oppgavereferanse }).then(() => {
                setAktivTab(TabType.Ventende);
                history.push('/');
            }),
            errorHandler
        );
    };

    const fjernFraPåVent = () => {
        setIsFetching(true);
        ignorePromise(
            fjernPåVent({ oppgavereferanse }).finally(() => {
                lukk();
                setIsFetching(false);
            }),
            errorHandler
        );
    };

    return (
        <Container>
            {erPåVent ? (
                <DropdownMenyknapp spinner={isFetching} onClick={fjernFraPåVent}>
                    Fjern fra på vent
                </DropdownMenyknapp>
            ) : (
                <DropdownMenyknapp onClick={() => setVisModal(true)}>Legg på vent</DropdownMenyknapp>
            )}
            {visModal && (
                <NyttNotatModal
                    lukkModal={() => setVisModal(false)}
                    personinfo={personinfo}
                    vedtaksperiodeId={vedtaksperiodeId}
                    leggSakPåVent={settPåVent}
                />
            )}
        </Container>
    );
};
