import React from 'react';
import {Element, Normaltekst} from 'nav-frontend-typografi';
import {NORSK_DATOFORMAT} from '../../utils/date';
import styled from '@emotion/styled';
import {Link} from 'react-router-dom';
import {Oppgaveetikett} from './Oppgaveetikett';
import {IkkeTildelt, Tildelt} from './tildeling';
import {useRemoveAlleVarsler} from '../../state/varsler';
import {somDato} from '../../mapping/vedtaksperiode';
import {Tabellrad} from '@navikt/helse-frontend-tabell';
import {TekstMedEllipsis} from '../../components/TekstMedEllipsis';
import {useSkalAnonymiserePerson} from '../../state/person';
import {anonymisertPersoninfo} from '../../agurkdata';
import {Inntektskilde, Oppgave, Personinfo, TildeltOppgave} from 'internal-types';
import {Tooltip} from '../../components/Tooltip';
import {useInnloggetSaksbehandler} from '../../state/authentication';
import {Meatball} from "@navikt/helse-frontend-meatball";
import "@navikt/helse-frontend-meatball/lib/main.css"
import {Dropdown} from "../../components/dropdown/Dropdown";
import {Tildelingsknapp} from "../saksbilde/sakslinje/Tildelingsknapp";
import {PåVentKnapp} from "../saksbilde/sakslinje/PåVentKnapp";

const formatertNavn = (personinfo: Personinfo): string => {
    const { fornavn, mellomnavn, etternavn } = personinfo;
    return `${etternavn}, ${fornavn} ${mellomnavn ? `${mellomnavn} ` : ''}`;
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
    height: 2rem;
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

interface KjøttbolleProps {
    oppgave: Oppgave;
}

const Kjøttbolle = ({oppgave}: KjøttbolleProps) => {
    const saksbehandler = useInnloggetSaksbehandler();

    const StyledMeatball = styled(Meatball)`
        margin: 0.5rem 0;
    `

    const erTildeltInnloggetBruker = oppgave.tildeling?.saksbehandler?.oid === saksbehandler.oid;

    const StyledDropdown = styled(Dropdown)`
        & > ul {
            white-space: normal;
        }
    `;

    return (
        <CellContainer>
            <StyledDropdown labelRenderer={(_, onClick) => <StyledMeatball data-tip="Mer" onClick={onClick}/>}>
                <Tildelingsknapp
                    oppgavereferanse={oppgave.oppgavereferanse}
                    tildeling={oppgave.tildeling}
                    erTildeltInnloggetBruker={erTildeltInnloggetBruker}
                />
                {erTildeltInnloggetBruker && <PåVentKnapp erPåVent={oppgave.tildeling?.påVent} oppgavereferanse={oppgave.oppgavereferanse}/>}
            </StyledDropdown>
            <Tooltip effect="solid" />
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
                <CellContainer width={160}>
                    <IkkeTildelt oppgave={oppgave} />
                </CellContainer>
            ),
            <Sakstype oppgave={oppgave} />,
            <Bosted oppgave={oppgave} />,
            <Inntektskildetype oppgave={oppgave} />,
            <Status oppgave={oppgave} />,
            <Søker oppgave={oppgave} />,
            <Opprettet oppgave={oppgave} />,
            <Kjøttbolle oppgave={oppgave}/>,
        ],
    };
};
