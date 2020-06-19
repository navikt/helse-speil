import React, { useMemo } from 'react';
import AlternativerKnapp from '../../components/AlternativerKnapp';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { Tildeling } from '../../context/types.internal';
import { Oppgave, OppgaveType } from '../../../types';
import { somDato } from '../../context/mapping/vedtaksperiodemapper';
import { NORSK_DATOFORMAT } from '../../utils/date';
import styled from '@emotion/styled';
import { Cell, Flex, Row } from './Oversikt.styles';
import { Link } from 'react-router-dom';
import { Oppgaveetikett } from './Oppgaveetikett';
import { Location, useNavigation } from '../../hooks/useNavigation';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import { useRecoilValue } from 'recoil';
import { authState } from '../../state/authentication';

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

interface TildeltProps {
    innloggetBrukerNavn: string;
    erTildeltInnloggetBruker: boolean;
    onFjernTildeling: () => void;
}

const Tildelt = ({ innloggetBrukerNavn, erTildeltInnloggetBruker, onFjernTildeling }: TildeltProps) => (
    <Cell>
        <Flex>
            <Normaltekst>{innloggetBrukerNavn}</Normaltekst>
            {erTildeltInnloggetBruker && (
                <Tildelingsalternativ>
                    <MeldAvKnapp tabIndex={0} onClick={onFjernTildeling}>
                        Meld av
                    </MeldAvKnapp>
                </Tildelingsalternativ>
            )}
        </Flex>
    </Cell>
);

interface IkkeTildeltProps {
    onTildel: () => void;
}

const IkkeTildelt = ({ onTildel }: IkkeTildeltProps) => (
    <Cell>
        <Knapp mini onClick={onTildel}>
            Tildel meg
        </Knapp>
    </Cell>
);

interface SøkerProps {
    navn: string;
    link: string;
}

const Søker = ({ navn, link }: SøkerProps) => (
    <Cell>
        <Link className="lenke" to={link}>
            {navn}
        </Link>
    </Cell>
);

interface TypeProps {
    type: OppgaveType;
}

const Type = ({ type }: TypeProps) => (
    <Cell>
        <Oppgaveetikett type={type} />
    </Cell>
);

interface OpprettetProps {
    dato: string;
}

const Opprettet = ({ dato }: OpprettetProps) => (
    <Cell>
        <Normaltekst>{`${somDato(dato).format(NORSK_DATOFORMAT)}`}</Normaltekst>
    </Cell>
);

interface StatusProps {
    antallVarsler?: number;
}

const Varsler = ({ antallVarsler }: StatusProps) => {
    const varseltekst = !antallVarsler ? '' : antallVarsler === 1 ? '1 varsel' : `${antallVarsler} varsler`;
    return (
        <Cell>
            <Element>{varseltekst}</Element>
        </Cell>
    );
};

interface OversiktslinjeProps {
    oppgave: Oppgave;
    onUnassignCase: (id: string) => void;
    onAssignCase: (id: string, aktørId: string, email?: string) => void;
    tildeling?: Tildeling;
    antallVarsler: number;
}

const Oversiktslinje = ({ oppgave, tildeling, onUnassignCase, onAssignCase, antallVarsler }: OversiktslinjeProps) => {
    const { email } = useRecoilValue(authState);
    const { pathForLocation } = useNavigation();
    const { fornavn, mellomnavn, etternavn } = oppgave.navn;
    const formatertNavn = [fornavn, mellomnavn, etternavn].filter((n) => n).join(' ');
    const erTildelt = tildeling?.userId;

    return useMemo(
        () => (
            <Row>
                <Søker navn={formatertNavn} link={pathForLocation(Location.Sykmeldingsperiode, oppgave.aktørId)} />
                <Type type={oppgave.type} />
                <Varsler antallVarsler={antallVarsler} />
                <Opprettet dato={oppgave.opprettet} />
                {erTildelt ? (
                    <Tildelt
                        erTildeltInnloggetBruker={tildeling?.userId === email}
                        innloggetBrukerNavn={capitalizeName(extractNameFromEmail(tildeling?.userId))}
                        onFjernTildeling={() => onUnassignCase(oppgave.spleisbehovId)}
                    />
                ) : (
                    <IkkeTildelt onTildel={() => onAssignCase(oppgave.spleisbehovId, oppgave.aktørId, email!)} />
                )}
            </Row>
        ),
        [tildeling]
    );
};

export default Oversiktslinje;
