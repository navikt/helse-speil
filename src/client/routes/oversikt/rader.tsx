import React from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { NORSK_DATOFORMAT } from '../../utils/date';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Oppgaveetikett } from './Oppgaveetikett';
import { IkkeTildelt, MeldAv, Tildelt } from './tildeling';
import { useRemoveAlleVarsler } from '../../state/varsler';
import { somDato } from '../../mapping/vedtaksperiode';
import { Tabellrad } from '@navikt/helse-frontend-tabell';
import { TekstMedEllipsis } from '../../components/TekstMedEllipsis';
import { useSkalAnonymiserePerson } from '../../state/person';
import { anonymisertPersoninfo } from '../../agurkdata';
import {Oppgave, Personinfo, TildeltOppgave, Inntektskilde} from "internal-types";

const formatertNavn = (personinfo: Personinfo): string => {
    const { fornavn, mellomnavn, etternavn } = personinfo;
    return [fornavn, mellomnavn, etternavn].filter((n) => n).join(' ');
};

const formatertVarsel = (antallVarsler?: number) =>
    !antallVarsler ? '' : antallVarsler === 1 ? '1 varsel' : `${antallVarsler} varsler`;

const inntektskildeLabel = (inntektskilde: Inntektskilde) => {
    switch (inntektskilde) {
        case Inntektskilde.FlereArbeidsgivere:
            return 'Flere arbeidsg.';
        case Inntektskilde.EnArbeidsgiver:
        default:
            return 'Én arbeidsgiver';
    }
};

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

const SkjultLenke = styled(Link)`
    position: absolute;
    width: 100%;
    height: 100%;
    margin-left: -1rem;
    outline: none;
`;

export const SkjultSakslenke: React.FunctionComponent<{ oppgave: Oppgave }> = ({ oppgave }) => {
    const removeAlleVarsler = useRemoveAlleVarsler();

    const onNavigate = () => {
        removeAlleVarsler();
    };

    return (
        <SkjultLenke
            className="lenke-skjult"
            to={`/person/${oppgave.aktørId}/utbetaling`}
            onClick={onNavigate}
            tabIndex={-1}
        />
    );
};

const Sakslenke: React.FunctionComponent<{ oppgave: Oppgave; skjult?: boolean }> = ({ oppgave, children }) => {
    const removeAlleVarsler = useRemoveAlleVarsler();
    return (
        <Link className="lenke" to={`/sykmeldingsperiode/${oppgave.aktørId}`} onClick={removeAlleVarsler}>
            {children}
        </Link>
    );
};

const Sakstype = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer width={120}>
        <Oppgaveetikett type={oppgave.periodetype} />
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

const Søker = ({ oppgave }: { oppgave: Oppgave }) => {
    const anonymiseringEnabled = useSkalAnonymiserePerson();

    return (
        <CellContainer width={200}>
            <TekstMedEllipsis>
                <Sakslenke oppgave={oppgave}>
                    {formatertNavn(anonymiseringEnabled ? anonymisertPersoninfo : oppgave.personinfo)}
                </Sakslenke>
            </TekstMedEllipsis>
            <SkjultSakslenke oppgave={oppgave} />
        </CellContainer>
    );
};

const Inntektskildetype = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer width={120}>
        <TekstMedEllipsis>{inntektskildeLabel(oppgave.inntektskilde)}</TekstMedEllipsis>
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

const Opprettet = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer>
        <Normaltekst>{`${somDato(oppgave.opprettet).format(NORSK_DATOFORMAT)}`}</Normaltekst>
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

const Bosted = ({ oppgave }: { oppgave: Oppgave }) => {
    const anonymiseringEnabled = useSkalAnonymiserePerson();

    return (
        <CellContainer width={200}>
            <TekstMedEllipsis>{anonymiseringEnabled ? 'Agurkheim' : oppgave.boenhet.navn}</TekstMedEllipsis>
            <SkjultSakslenke oppgave={oppgave} />
        </CellContainer>
    );
};

const Status = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer>
        <Element>{formatertVarsel(oppgave.antallVarsler)}</Element>
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

const TildeltMedSkjultSakslenke = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer width={160}>
        <Tildelt oppgave={oppgave as TildeltOppgave} />
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

export const tilOversiktsrad = (oppgave: Oppgave): Tabellrad => ({
    celler: [
        oppgave,
        oppgave,
        oppgave.periodetype,
        oppgave,
        oppgave.inntektskilde,
        oppgave.opprettet,
        oppgave.boenhet.navn,
        oppgave.antallVarsler,
    ],
    id: oppgave.oppgavereferanse,
});

export const renderer = (rad: Tabellrad): Tabellrad => {
    const oppgave = rad.celler[1] as Oppgave;

    return {
        ...rad,
        celler: [
            oppgave.tildeltTil ? (
                <TildeltMedSkjultSakslenke oppgave={oppgave} />
            ) : (
                <CellContainer width={160}>
                    <IkkeTildelt oppgave={oppgave} />
                </CellContainer>
            ),
            <CellContainer width={120}>
                <MeldAv oppgave={oppgave} />
            </CellContainer>,
            <Sakstype oppgave={oppgave} />,
            <Søker oppgave={oppgave} />,
            <Inntektskildetype oppgave={oppgave} />,
            <Opprettet oppgave={oppgave} />,
            <Bosted oppgave={oppgave} />,
            <Status oppgave={oppgave} />,
        ],
    };
};
