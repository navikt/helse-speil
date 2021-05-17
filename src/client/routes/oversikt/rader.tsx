import React, { useRef, useState } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { NORSK_DATOFORMAT } from '../../utils/date';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Oppgaveetikett } from './Oppgaveetikett';
import { IkkeTildelt, Tildelt } from './tildeling';
import { useRemoveAlleVarsler } from '../../state/varsler';
import { somDato } from '../../mapping/vedtaksperiode';
import { Tabellrad } from '@navikt/helse-frontend-tabell';
import { TekstMedEllipsis } from '../../components/TekstMedEllipsis';
import { useSkalAnonymiserePerson } from '../../state/person';
import { anonymisertPersoninfo } from '../../agurkdata';
import { Inntektskilde, Oppgave, Personinfo, TildeltOppgave } from 'internal-types';
import { Tooltip } from '../../components/Tooltip';
import { useInnloggetSaksbehandler } from '../../state/authentication';
import { Meatball } from '@navikt/helse-frontend-meatball';
import '@navikt/helse-frontend-meatball/lib/main.css';
import { Dropdown } from '../../components/dropdown/Dropdown';
import { Tildelingsknapp } from '../saksbilde/sakslinje/Tildelingsknapp';
import { PåVentKnapp } from '../saksbilde/sakslinje/PåVentKnapp';
import { capitalizeName } from '../../utils/locale';

const formaterNavn = (personinfo: Personinfo): string => {
    const { fornavn, mellomnavn, etternavn } = personinfo;
    return capitalizeName(`${etternavn}, ${fornavn} ${mellomnavn ? `${mellomnavn} ` : ''}`);
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

const tooltipId = (kolonne: string, oppgave: Oppgave): string =>
    `tabellrad-${kolonne}-tooltip-${oppgave.oppgavereferanse}`;

const CellContainer = styled.div<{ width?: number }>`
    position: relative;
    height: 2rem;
    display: flex;
    align-items: center;

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
    padding: 0 1.5rem 0 1rem;
    outline: none;
`;

const SkjultSakslenke: React.FunctionComponent<{ oppgave: Oppgave }> = ({ oppgave }) => {
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

const Sakstype = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer width={128}>
        <Oppgaveetikett type={oppgave.periodetype} medLabel={true} />
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

const Søker = ({ oppgave }: { oppgave: Oppgave }) => {
    const anonymiseringEnabled = useSkalAnonymiserePerson();
    const formatertNavn = formaterNavn(anonymiseringEnabled ? anonymisertPersoninfo : oppgave.personinfo);
    return (
        <CellContainer width={128} data-for={tooltipId('søker', oppgave)} data-tip={formatertNavn}>
            <TekstMedEllipsis>{formatertNavn}</TekstMedEllipsis>
            <SkjultSakslenke oppgave={oppgave} />
            {formatertNavn.length > 19 && <Tooltip id={tooltipId('søker', oppgave)} />}
        </CellContainer>
    );
};

const Inntektskildetype = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer width={128}>
        <TekstMedEllipsis>{inntektskildeLabel(oppgave.inntektskilde)}</TekstMedEllipsis>
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

const Opprettet = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer width={100}>
        <Normaltekst>{`${somDato(oppgave.opprettet).format(NORSK_DATOFORMAT)}`}</Normaltekst>
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

const Bosted = ({ oppgave }: { oppgave: Oppgave }) => {
    const anonymiseringEnabled = useSkalAnonymiserePerson();
    const bosted = anonymiseringEnabled ? 'Agurkheim' : oppgave.boenhet.navn;
    return (
        <CellContainer width={128} data-for={tooltipId('bosted', oppgave)} data-tip={bosted}>
            <TekstMedEllipsis>{bosted}</TekstMedEllipsis>
            <SkjultSakslenke oppgave={oppgave} />
            {bosted.length > 18 && <Tooltip id={tooltipId('bosted', oppgave)} />}
        </CellContainer>
    );
};

const Status = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer width={100}>
        <Element>{formatertVarsel(oppgave.antallVarsler)}</Element>
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

const TildeltMedSkjultSakslenke = ({ oppgave }: { oppgave: Oppgave }) => {
    const tildeltTilNavn = (oppgave as TildeltOppgave).tildeling.saksbehandler.navn;

    return (
        <CellContainer width={128} data-tip={tildeltTilNavn} data-for={tooltipId('tildelt-til', oppgave)}>
            <Tildelt tildeltBrukernavn={tildeltTilNavn} />
            <SkjultSakslenke oppgave={oppgave} />
            {tildeltTilNavn.length > 15 && <Tooltip id={tooltipId('tildelt-til', oppgave)} />}
        </CellContainer>
    );
};

interface KjøttbolleProps {
    oppgave: Oppgave;
}

const Kjøttbolle = ({ oppgave }: KjøttbolleProps) => {
    const saksbehandler = useInnloggetSaksbehandler();

    const erTildeltInnloggetBruker = oppgave.tildeling?.saksbehandler?.oid === saksbehandler.oid;

    return (
        <CellContainer>
            <span data-tip="Mer" data-for={tooltipId('kjottbolle', oppgave)}>
                <Dropdown labelRenderer={(_, onClick) => <Meatball onClick={onClick} />}>
                    <Tildelingsknapp
                        oppgavereferanse={oppgave.oppgavereferanse}
                        tildeling={oppgave.tildeling}
                        erTildeltInnloggetBruker={erTildeltInnloggetBruker}
                    />
                    {erTildeltInnloggetBruker && (
                        <PåVentKnapp erPåVent={oppgave.tildeling?.påVent} oppgavereferanse={oppgave.oppgavereferanse} />
                    )}
                </Dropdown>
            </span>
            <Tooltip id={tooltipId('kjottbolle', oppgave)} effect={'solid'} offset={{ top: -10 }} />
        </CellContainer>
    );
};

export type TabellradMedOppgave = Tabellrad & {
    oppgave: Oppgave;
};

export const tilOversiktsrad = (oppgave: Oppgave): TabellradMedOppgave => ({
    celler: [
        oppgave,
        oppgave.periodetype,
        oppgave.boenhet.navn,
        oppgave.inntektskilde,
        oppgave.antallVarsler,
        oppgave,
        oppgave.opprettet,
    ],
    oppgave,
    id: oppgave.oppgavereferanse,
});

export const renderer = (rad: Tabellrad): Tabellrad => {
    let oppgave = (rad as TabellradMedOppgave).oppgave;
    return {
        ...rad,
        celler: [
            oppgave.tildeling ? (
                <TildeltMedSkjultSakslenke oppgave={oppgave} />
            ) : (
                <CellContainer width={128}>
                    <IkkeTildelt oppgave={oppgave} />
                </CellContainer>
            ),
            <Sakstype oppgave={oppgave} />,
            <Bosted oppgave={oppgave} />,
            <Inntektskildetype oppgave={oppgave} />,
            <Status oppgave={oppgave} />,
            <Søker oppgave={oppgave} />,
            <Opprettet oppgave={oppgave} />,
            <Kjøttbolle oppgave={oppgave} />,
        ],
    };
};
