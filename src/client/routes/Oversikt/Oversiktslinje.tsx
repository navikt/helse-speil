import React, { useContext } from 'react';
import OversiktsLenke from './OversiktsLenke';
import { AuthContext } from '../../context/AuthContext';
import { Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import { Tildeling } from '../../context/types';
import { Oppgave } from '../../../types';
import { somDato } from '../../context/mapping/vedtaksperiodemapper';
import { NORSK_DATOFORMAT } from '../../utils/date';
import styled from '@emotion/styled';
import AlternativerKnapp from '../../components/AlternativerKnapp';
import { Cell, Row } from './Oversikt.styles';

interface Props {
    oppgave: Oppgave;
    onUnassignCase: (id: string) => void;
    onAssignCase: (id: string, email?: string) => void;
    onSelectCase: (oppgave: Oppgave) => void;
    tildeling?: Tildeling;
}

const FlexContainer = styled.span`
    display: flex;
    align-items: center;
`;

const Tildelingsalternativ = styled(AlternativerKnapp)`
    margin-left: 0.5rem;
`;

const MeldAvKnapp = styled.button`
    font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
    padding: 1rem;
    cursor: pointer;
    background: none;
    border: none;
    border-radius: 0.25rem;
    outline: none;
    font-size: 1rem;
    white-space: nowrap;

    &:hover,
    &:focus {
        background: #e7e9e9;
    }
`;

const Oversiktslinje = ({ oppgave, tildeling, onUnassignCase, onAssignCase, onSelectCase }: Props) => {
    const { authInfo } = useContext(AuthContext);

    const formatertNavn = `${oppgave.navn.fornavn} ${oppgave.navn.mellomnavn || ''} ${oppgave.navn.etternavn}`;

    const tildelingsCelle = tildeling?.userId ? (
        <FlexContainer>
            <Normaltekst>{capitalizeName(extractNameFromEmail(tildeling.userId))}</Normaltekst>
            {tildeling.userId === authInfo.email && (
                <Tildelingsalternativ>
                    <MeldAvKnapp tabIndex={0} onClick={() => onUnassignCase(oppgave.spleisbehovId)}>
                        Meld av
                    </MeldAvKnapp>
                </Tildelingsalternativ>
            )}
        </FlexContainer>
    ) : (
        <Knapp mini onClick={() => onAssignCase(oppgave.spleisbehovId, authInfo.email)}>
            Tildel til meg
        </Knapp>
    );

    return (
        <Row>
            <Cell>
                <OversiktsLenke onClick={() => onSelectCase(oppgave)}>{formatertNavn}</OversiktsLenke>
            </Cell>
            <Cell>
                <Normaltekst>{`${somDato(oppgave.opprettet).format(NORSK_DATOFORMAT)}`}</Normaltekst>
            </Cell>
            <Cell>{tildeling ? tildelingsCelle : <Normaltekst>Henter informasjon..</Normaltekst>}</Cell>
        </Row>
    );
};

export default Oversiktslinje;
