import React, { useState } from 'react';
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
import { Oppgave, Personinfo, TildeltOppgave, Inntektskilde, Saksbehandler } from 'internal-types';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import { Tooltip } from '../../components/Tooltip';
import { useInnloggetSaksbehandler } from '../../state/authentication';
import { Knapp } from 'nav-frontend-knapper';

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

const KjøttbolleKnapp = styled.button`
    all: unset;
    height: 1rem;
    width: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--navds-color-deepblue-70);
    border-radius: 50%;
    cursor: pointer;
    margin: 6px;
    div {
        background-color: var(--navds-color-deepblue-70);
    }
    &:hover {
        border: 1px solid var(--navds-color-darkgray);
        div {
            background-color: var(--navds-color-darkgray);
        }
    }
    &[title]:hover::after {
        content: "Kevin er kulere"
        position: absolute;
        background-color: red;
        height: 200px;
        width: 200px;
        top: 100px;
    }
`;

const Circle = styled.div`
    margin: 1px;
    height: 2px;
    width: 2px;
    border-radius: 50%;
`;

const PopoverKnapp = styled(Knapp)`
    all: unset;
    height: 32px;
    cursor: pointer;
    padding-left: 16px;
    padding-right: 16px;
    width: 150px;
    &:hover {
        background-color: var(--speil-light-hover);
        color: var(--navds-primary-text);
    }
`;

const PopoverElementer = styled.div`
    margin-top: 16px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
`;

interface KjøttbolleProps {
    oppgave: Oppgave;
    fjernTildeling: (oppgave: Oppgave) => Promise<any>;
    tildelOppgave: (oppgave: Oppgave, saksbehandler: Saksbehandler) => Promise<any>;
    fjernPåVent: (oppgave: Oppgave) => Promise<any>;
    leggPåVent: (oppgave: Oppgave) => Promise<any>;
}
interface Fetching {
    fjernTildeling: boolean;
    tildelOppgave: boolean;
    leggPåVent: boolean;
    fjernPåVent: boolean;
}

const Kjøttbolle = ({ oppgave, fjernTildeling, tildelOppgave, fjernPåVent, leggPåVent }: KjøttbolleProps) => {
    const [anchor, setAnchor] = useState<HTMLElement | undefined>(undefined);
    const [fetching, setFetching] = useState<Fetching>({
        fjernTildeling: false,
        tildelOppgave: false,
        leggPåVent: false,
        fjernPåVent: false,
    });
    const saksbehandler = useInnloggetSaksbehandler();

    const handleFjernTildeling = () => {
        setFetching({ ...fetching, fjernTildeling: true });
        fjernTildeling(oppgave).finally(() => setFetching({ ...fetching, fjernTildeling: false }));
    };
    const handleTildelOppgave = () => {
        setFetching({ ...fetching, tildelOppgave: true });
        tildelOppgave(oppgave, saksbehandler).finally(() => setFetching({ ...fetching, tildelOppgave: false }));
    };
    const handleLeggPåVent = () => {
        setFetching({ ...fetching, leggPåVent: true });
        leggPåVent(oppgave).finally(() => setFetching({ ...fetching, leggPåVent: false }));
    };
    const handleFjernPåVent = () => {
        setFetching({ ...fetching, fjernPåVent: true });
        fjernPåVent(oppgave).finally(() => setFetching({ ...fetching, fjernPåVent: false }));
    };

    const erTildeltInnloggetBruker = oppgave.tildeling?.saksbehandler?.oid == saksbehandler.oid;
    return (
        <CellContainer width={120}>
            <KjøttbolleKnapp
                data-tip="Mer"
                onClick={(e) => (anchor ? setAnchor(undefined) : setAnchor(e.currentTarget))}
            >
                <Circle />
                <Circle />
                <Circle />
            </KjøttbolleKnapp>
            <Tooltip effect="solid" />
            <Popover
                ankerEl={anchor}
                onRequestClose={() => setAnchor(undefined)}
                orientering={PopoverOrientering.UnderHoyre}
                tabIndex={-1}
                utenPil
            >
                <PopoverElementer>
                    {erTildeltInnloggetBruker && !oppgave.tildeling?.påVent && (
                        <PopoverKnapp onClick={handleLeggPåVent} spinner={fetching.leggPåVent}>
                            Legg på vent
                        </PopoverKnapp>
                    )}
                    {erTildeltInnloggetBruker && oppgave.tildeling?.påVent && (
                        <PopoverKnapp onClick={handleFjernPåVent} spinner={fetching.fjernPåVent}>
                            Fjern fra på vent
                        </PopoverKnapp>
                    )}
                    {erTildeltInnloggetBruker && (
                        <PopoverKnapp onClick={handleFjernTildeling} spinner={fetching.fjernTildeling}>
                            Meld av
                        </PopoverKnapp>
                    )}
                    {!oppgave.tildeling && (
                        <PopoverKnapp onClick={handleTildelOppgave} spinner={fetching.tildelOppgave}>
                            Meld på
                        </PopoverKnapp>
                    )}
                </PopoverElementer>
            </Popover>
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

export const renderer = (
    rad: Tabellrad,
    fjernTildeling: (oppgave: Oppgave) => Promise<any>,
    tildelOppgave: (oppgave: Oppgave, saksbehandler: Saksbehandler) => Promise<any>,
    fjernPåVent: (oppgave: Oppgave) => Promise<any>,
    leggPåVent: (oppgave: Oppgave) => Promise<any>
): Tabellrad => {
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
            <Kjøttbolle
                oppgave={oppgave}
                fjernTildeling={fjernTildeling}
                tildelOppgave={tildelOppgave}
                fjernPåVent={fjernPåVent}
                leggPåVent={leggPåVent}
            />,
        ],
    };
};
