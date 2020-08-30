import React, { ReactNode } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Oppgave, OppgaveType, SpesialistPersoninfo, TildeltOppgave } from '../../../types';
import { somDato } from '../../context/mapping/vedtaksperiode';
import { NORSK_DATOFORMAT } from '../../utils/date';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Oppgaveetikett } from './Oppgaveetikett';
import { IkkeTildelt, Tildelt } from './tildeling';
import { useUpdateVarsler } from '../../state/varslerState';

type Oversiktsrad = [OppgaveType, Oppgave, string, string, number, Oppgave];

type RendretOversiktsrad = [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode];

const formatertNavn = (personinfo: SpesialistPersoninfo): string => {
    const { fornavn, mellomnavn, etternavn } = personinfo;
    return [fornavn, mellomnavn, etternavn].filter((n) => n).join(' ');
};

const formatertVarsel = (antallVarsler?: number) =>
    !antallVarsler ? '' : antallVarsler === 1 ? '1 varsel' : `${antallVarsler} varsler`;

const CellContainer = styled.div<{ width?: number }>`
    position: relative;
    height: 48px;
    display: flex;
    align-items: center;
    margin: 0 -1rem 0 -1rem;
    padding: 0 1rem;

    ${({ width }) =>
        width &&
        `
        width: ${width}px;
        max-width: ${width}px;
    `}
`;

const TekstMedEllipsis = styled(Normaltekst)`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    > a:focus {
        box-shadow: 0 0 0 3px #254b6d;
    }
`;

const SkjultLenke = styled(Link)`
    position: absolute;
    width: 100%;
    height: 100%;
    margin-left: -1rem;
    outline: none;
`;

const SkjultSakslenke: React.FunctionComponent<{ oppgave: Oppgave }> = ({ oppgave }) => {
    const { fjernVarsler } = useUpdateVarsler();
    return (
        <SkjultLenke
            className="lenke-skjult"
            to={`/sykmeldingsperiode/${oppgave.aktørId}`}
            onClick={fjernVarsler}
            tabIndex={-1}
        />
    );
};

const Sakslenke: React.FunctionComponent<{ oppgave: Oppgave; skjult?: boolean }> = ({ oppgave, skjult, children }) => {
    const { fjernVarsler } = useUpdateVarsler();
    return (
        <Link className="lenke" to={`/sykmeldingsperiode/${oppgave.aktørId}`} onClick={fjernVarsler}>
            {children}
        </Link>
    );
};

const Sakstype = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer width={120}>
        <Oppgaveetikett type={oppgave.type} />
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

const Søker = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer width={200}>
        <TekstMedEllipsis>
            <Sakslenke oppgave={oppgave}>{formatertNavn(oppgave.personinfo)}</Sakslenke>
        </TekstMedEllipsis>
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

const Opprettet = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer>
        <Normaltekst>{`${somDato(oppgave.opprettet).format(NORSK_DATOFORMAT)}`}</Normaltekst>
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

const Bosted = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer width={200}>
        <TekstMedEllipsis>{oppgave.boenhet.navn}</TekstMedEllipsis>
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

const Status = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer>
        <Element>{formatertVarsel(oppgave.antallVarsler)}</Element>
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

export const tilOversiktsrad = (oppgave: Oppgave): Oversiktsrad => [
    oppgave.type,
    oppgave,
    oppgave.opprettet,
    oppgave.boenhet.navn,
    oppgave.antallVarsler,
    oppgave,
];

export const oversiktsradRenderer = (rad: (ReactNode | Oppgave)[]): RendretOversiktsrad => {
    const oppgave = rad[1] as Oppgave;
    return [
        <Sakstype oppgave={oppgave} />,
        <Søker oppgave={oppgave} />,
        <Opprettet oppgave={oppgave} />,
        <Bosted oppgave={oppgave} />,
        <Status oppgave={oppgave} />,
        oppgave.tildeltTil ? <Tildelt oppgave={oppgave as TildeltOppgave} /> : <IkkeTildelt oppgave={oppgave} />,
    ];
};
