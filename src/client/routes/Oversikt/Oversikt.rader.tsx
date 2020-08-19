import React, { ReactNode, useContext, useState } from 'react';
import AlternativerKnapp from '../../components/AlternativerKnapp';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { Oppgave, OppgaveType, SpesialistPersoninfo, TildeltOppgave } from '../../../types';
import { somDato } from '../../context/mapping/vedtaksperiodemapper';
import { NORSK_DATOFORMAT } from '../../utils/date';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Oppgaveetikett } from './Oppgaveetikett';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import { useEmail } from '../../state/authentication';
import { useUpdateVarsler } from '../../state/varslerState';
import { OppgaverContext } from '../../context/OppgaverContext';
import { useOppgavetildeling } from '../../hooks/useOppgavetildeling';

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

const Flex = styled.span`
    display: flex;
    align-items: center;
`;

const Tildelt = ({ oppgave }: { oppgave: TildeltOppgave }) => {
    const email = useEmail();
    const erTildeltInnloggetBruker = oppgave.tildeltTil === email;
    const tildeltBrukernavn = capitalizeName(extractNameFromEmail(oppgave.tildeltTil));
    const { fjernTildeling } = useOppgavetildeling();
    const { markerOppgaveSomTildelt } = useContext(OppgaverContext);

    const meldAv = () => {
        fjernTildeling(oppgave.oppgavereferanse).then(() => markerOppgaveSomTildelt(oppgave, null));
    };

    return (
        <Flex>
            <Normaltekst>{tildeltBrukernavn}</Normaltekst>
            {erTildeltInnloggetBruker && (
                <Tildelingsalternativ>
                    <MeldAvKnapp tabIndex={0} onClick={meldAv}>
                        Meld av
                    </MeldAvKnapp>
                </Tildelingsalternativ>
            )}
        </Flex>
    );
};

const IkkeTildelt = ({ oppgave }: { oppgave: Oppgave }) => {
    const email = useEmail();
    const [tildeler, setTildeler] = useState(false);
    const { tildelOppgave } = useOppgavetildeling();
    const { markerOppgaveSomTildelt } = useContext(OppgaverContext);

    const tildel = () => {
        if (!email) return;
        setTildeler(true);
        tildelOppgave(oppgave.oppgavereferanse, email)
            .then(() => markerOppgaveSomTildelt(oppgave, email))
            .catch((assignedUser) => markerOppgaveSomTildelt(oppgave, assignedUser))
            .finally(() => setTildeler(false));
    };

    return (
        <Knapp mini onClick={tildel} spinner={tildeler}>
            Tildel meg
        </Knapp>
    );
};

const SøkerContainer = styled.div`
    width: 200px;
    max-width: 200px;
`;

interface SøkerProps {
    navn: string;
    link: string;
}

const Søker = ({ navn, link }: SøkerProps) => {
    const { fjernVarsler } = useUpdateVarsler();
    return (
        <SøkerContainer>
            <TekstMedEllipsis>
                <Link className="lenke" to={link} onClick={fjernVarsler}>
                    {navn}
                </Link>
            </TekstMedEllipsis>
        </SøkerContainer>
    );
};

const SakstypeContainer = styled.div`
    box-sizing: border-box;
    width: 120px;
    max-width: 120px;
`;

const Sakstype = ({ type }: { type: OppgaveType }) => (
    <SakstypeContainer>
        <Oppgaveetikett type={type} />
    </SakstypeContainer>
);

const Opprettet = ({ dato }: { dato: string }) => (
    <Normaltekst>{`${somDato(dato).format(NORSK_DATOFORMAT)}`}</Normaltekst>
);

const TekstMedEllipsis = styled(Normaltekst)`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const BostedContainer = styled.div`
    width: 200px;
    max-width: 200px;
`;

const Bosted = ({ navn }: { navn: string }) => (
    <BostedContainer>
        <TekstMedEllipsis>{navn}</TekstMedEllipsis>
    </BostedContainer>
);

const Status = ({ antallVarsler }: { antallVarsler?: number }) => {
    const varseltekst = !antallVarsler ? '' : antallVarsler === 1 ? '1 varsel' : `${antallVarsler} varsler`;
    return <Element>{varseltekst}</Element>;
};

const formatertNavn = (personinfo: SpesialistPersoninfo): string => {
    const { fornavn, mellomnavn, etternavn } = personinfo;
    return [fornavn, mellomnavn, etternavn].filter((n) => n).join(' ');
};

const renderSøker = (oppgave: Oppgave) => (
    <Søker navn={formatertNavn(oppgave.personinfo)} link={`/sykmeldingsperiode/${oppgave.aktørId}`} />
);

const renderSakstype = (type: OppgaveType) => <Sakstype type={type} />;

const renderStatus = (antallVarsler: number) => <Status antallVarsler={antallVarsler} />;

const renderBosted = (bosted: string) => <Bosted navn={bosted} />;

const renderOpprettet = (opprettet: string) => <Opprettet dato={opprettet} />;

const renderTildeling = (oppgave: Oppgave) =>
    oppgave.tildeltTil ? <Tildelt oppgave={oppgave as TildeltOppgave} /> : <IkkeTildelt oppgave={oppgave} />;

export const tilOversiktsrad = (oppgave: Oppgave) => [
    oppgave.type,
    oppgave,
    oppgave.opprettet,
    oppgave.boenhet.navn,
    oppgave.antallVarsler,
    oppgave,
];

export const oversiktsradRenderer = (rad: (ReactNode | Oppgave)[]) => [
    renderSakstype(rad[0] as OppgaveType),
    renderSøker(rad[1] as Oppgave),
    renderOpprettet(rad[2] as string),
    renderBosted(rad[3] as string),
    renderStatus(rad[4] as number),
    renderTildeling(rad[5] as Oppgave),
];
