import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import { Tildeling } from '../../context/types.internal';
import { Oppgave, OppgaveType } from '../../../types';
import { somDato } from '../../context/mapping/vedtaksperiodemapper';
import { NORSK_DATOFORMAT } from '../../utils/date';
import styled from '@emotion/styled';
import AlternativerKnapp from '../../components/AlternativerKnapp';
import { Cell, FlexCelleinnhold, Row } from './Oversikt.styles';
import { Location, useNavigation } from '../../hooks/useNavigation';
import { Link } from 'react-router-dom';
import { Oppgaveetikett } from './Oppgaveetikett';

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
    <Cell widthInPixels={200}>
        <FlexCelleinnhold>
            <Normaltekst>{innloggetBrukerNavn}</Normaltekst>
            {erTildeltInnloggetBruker && (
                <Tildelingsalternativ>
                    <MeldAvKnapp tabIndex={0} onClick={onFjernTildeling}>
                        Meld av
                    </MeldAvKnapp>
                </Tildelingsalternativ>
            )}
        </FlexCelleinnhold>
    </Cell>
);

interface IkkeTildeltProps {
    onTildel: () => void;
}

const IkkeTildelt = ({ onTildel }: IkkeTildeltProps) => (
    <Cell widthInPixels={200}>
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
    <Cell widthInPixels={265}>
        <Link className="lenke" to={link}>
            {navn}
        </Link>
    </Cell>
);

interface TypeProps {
    type: OppgaveType;
}

const Type = ({ type }: TypeProps) => (
    <Cell widthInPixels={200}>
        <Oppgaveetikett type={type} />
    </Cell>
);

interface OpprettetProps {
    dato: string;
}

const Opprettet = ({ dato }: OpprettetProps) => (
    <Cell widthInPixels={100}>
        <Normaltekst>{`${somDato(dato).format(NORSK_DATOFORMAT)}`}</Normaltekst>
    </Cell>
);

interface StatusProps {
    antallVarsler?: number;
}

const Varsler = ({ antallVarsler }: StatusProps) => {
    const varseltekst = (antallVarsler?: number | null) => {
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
    return (
        <Cell widthInPixels={200}>
            <Element>{varseltekst(antallVarsler)}</Element>
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
    const { email } = useContext(AuthContext);
    const { pathForLocation } = useNavigation();
    const { fornavn, mellomnavn, etternavn } = oppgave.navn;
    const formatertNavn = [fornavn, mellomnavn, etternavn].filter((n) => n).join(' ');
    const erTildeltInnloggetBruker = tildeling?.userId === email;

    return useMemo(
        () => (
            <Row>
                <Søker navn={formatertNavn} link={pathForLocation(Location.Sykmeldingsperiode, oppgave.aktørId)} />
                <Type type={oppgave.type} />
                <Varsler antallVarsler={antallVarsler} />
                <Opprettet dato={oppgave.opprettet} />
                {erTildeltInnloggetBruker ? (
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
