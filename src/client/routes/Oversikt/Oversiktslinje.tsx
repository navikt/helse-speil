import React, { useContext } from 'react';
import OversiktsLenke from './OversiktsLenke';
import { AuthContext } from '../../context/AuthContext';
import { Element, Normaltekst } from 'nav-frontend-typografi';
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
    onAssignCase: (id: string, email?: string) => Promise<void>;
    onSelectCase: (oppgave: Oppgave) => void;
    tildeling?: Tildeling;
    antallVarsler: number;
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
    background: #fff;
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

const Oversiktslinje = ({ oppgave, tildeling, onUnassignCase, onAssignCase, onSelectCase, antallVarsler }: Props) => {
    const { email } = useContext(AuthContext);
    const { fornavn, mellomnavn, etternavn } = oppgave.navn;
    const formatertNavn = [fornavn, mellomnavn, etternavn].filter(n => n).join(' ');

    const onTildeling = () => {
        onAssignCase(oppgave.spleisbehovId, email).then(() => onSelectCase(oppgave));
    };

    const tildelingsCelle = tildeling?.userId ? (
        <FlexContainer>
            <Normaltekst>{capitalizeName(extractNameFromEmail(tildeling.userId))}</Normaltekst>
            {tildeling.userId === email && (
                <Tildelingsalternativ>
                    <MeldAvKnapp tabIndex={0} onClick={() => onUnassignCase(oppgave.spleisbehovId)}>
                        Meld av
                    </MeldAvKnapp>
                </Tildelingsalternativ>
            )}
        </FlexContainer>
    ) : (
        <Knapp mini onClick={onTildeling}>
            Tildel meg
        </Knapp>
    );

    const Søkernavn = () => (
        <Cell>
            <OversiktsLenke onClick={() => onSelectCase(oppgave)}>{formatertNavn}</OversiktsLenke>
        </Cell>
    );

    const Dato = () => (
        <Cell>
            <Normaltekst>{`${somDato(oppgave.opprettet).format(NORSK_DATOFORMAT)}`}</Normaltekst>
        </Cell>
    );

    const Tildeling = () => (
        <Cell>{tildeling ? tildelingsCelle : <Normaltekst>Henter informasjon..</Normaltekst>}</Cell>
    );

    const varseltekst = (antallVarsler: number) => {
        switch (antallVarsler) {
            case 0:
            case null:
            case undefined:
                return '';
            case 1:
                return '1 varsel';
            default:
                return `${antallVarsler} varsler`;
        }
    };

    const Status = () => (
        <Cell>
            <Element>{varseltekst(antallVarsler)}</Element>
        </Cell>
    );

    return (
        <Row>
            <Søkernavn />
            <Dato />
            <Tildeling />
            <Status />
        </Row>
    );
};

export default Oversiktslinje;
