import React, { useMemo, useState } from 'react';
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
import { useUpdateVarsler } from '../../state/varslerState';

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
    posting: boolean;
}

const IkkeTildelt = ({ onTildel, posting }: IkkeTildeltProps) => (
    <Cell>
        <Knapp mini onClick={onTildel} spinner={posting}>
            Tildel meg
        </Knapp>
    </Cell>
);

interface SøkerProps {
    navn: string;
    link: string;
}

const Søker = ({ navn, link }: SøkerProps) => {
    const { fjernVarsler } = useUpdateVarsler();
    return (
        <Cell>
            <Link className="lenke" to={link} onClick={fjernVarsler}>
                {navn}
            </Link>
        </Cell>
    );
};

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

const TekstMedEllipsis = styled(Normaltekst)`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

interface BokommuneProps {
    navn: string;
}

const Bokommune = ({ navn }: BokommuneProps) => (
    <Cell>
        <TekstMedEllipsis>{navn}</TekstMedEllipsis>
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

export interface SpeilOppgave extends Oppgave {
    tildeling?: Tildeling;
}

interface OversiktslinjeProps {
    oppgave: SpeilOppgave;
    onUnassignCase: (id: string) => void;
    onAssignCase: (id: string, aktørId: string, email?: string) => Promise<void>;
    antallVarsler: number;
}

const Oversiktslinje = ({ oppgave, onUnassignCase, onAssignCase, antallVarsler }: OversiktslinjeProps) => {
    const { email } = useRecoilValue(authState);
    const { pathForLocation } = useNavigation();
    const [posting, setPosting] = useState(false);
    const { fornavn, mellomnavn, etternavn } = oppgave.personinfo;
    const formatertNavn = [fornavn, mellomnavn, etternavn].filter((n) => n).join(' ');
    const erTildelt = oppgave.tildeling?.userId;

    const tildel = () => {
        setPosting(true);
        onAssignCase(oppgave.oppgavereferanse, oppgave.aktørId, email!).finally(() => setPosting(false));
    };

    return useMemo(
        () => (
            <Row>
                <Søker navn={formatertNavn} link={pathForLocation(Location.Sykmeldingsperiode, oppgave.aktørId)} />
                <Type type={oppgave.type} />
                <Varsler antallVarsler={antallVarsler} />
                <Bokommune navn={oppgave.boenhet.navn} />
                <Opprettet dato={oppgave.opprettet} />
                {erTildelt ? (
                    <Tildelt
                        erTildeltInnloggetBruker={oppgave.tildeling?.userId === email}
                        innloggetBrukerNavn={capitalizeName(extractNameFromEmail(oppgave.tildeling?.userId))}
                        onFjernTildeling={() => onUnassignCase(oppgave.oppgavereferanse)}
                    />
                ) : (
                    <IkkeTildelt onTildel={tildel} posting={posting} />
                )}
            </Row>
        ),
        [oppgave.tildeling, posting]
    );
};

export default Oversiktslinje;
