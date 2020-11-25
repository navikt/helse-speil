import React, { useContext } from 'react';
import styled from '@emotion/styled';
import Sakslinje from '@navikt/helse-frontend-sakslinje';
import { Utbetalinger, Vedtaksperiodetilstand } from 'internal-types';
import Dropdown from '../../../components/Dropdown';
import { PersonContext } from '../../../context/PersonContext';
import { annulleringerEnabled, oppdaterPersondataEnabled } from '../../../featureToggles';
import { Annullering } from '../annullering/Annullering';
import { useEmail } from '../../../state/authentication';
import { useOppgavetildeling } from '../../../hooks/useOppgavetildeling';
import { useUpdateVarsler } from '../../../state/varslerState';
import { Button } from '../../../components/Button';
import { Varseltype } from '@navikt/helse-frontend-varsel';
import { OppdaterPersondata } from '../../../components/OppdaterPersondata';

const Container = styled(Sakslinje)`
    border-left: none;
    border-right: none;
    max-width: 250px;
    border: 0;
    background: inherit;
    width: 50px;
    span {
        border: 0;
    }
    margin-left: 24px;

    ul button:nth-of-type(2) {
        border-top: 1px solid #c6c2bf;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
`;

const StyledDropdown = styled(Dropdown)`
    margin-right: 0.5rem;
    border-radius: 50%;
    height: 3rem;
    width: 3rem;
    &:hover,
    &:active {
        background-color: #e7e9e9;
        box-shadow: none;
    }
    &:focus {
        border: 3px solid #254b6d;
        background: inherit;
        box-shadow: none;
    }
`;

const TildelingKnapp = styled(Button)`
    margin: 0.5rem 0;
    border-radius: 0.25rem;
    height: 30px;
    width: 180px;
    font-size: 1rem;
    white-space: nowrap;

    &:hover,
    &:focus {
        background: #e7e9e9;
    }
    &:active {
        background: #e1e4e4;
    }
    &:disabled {
        color: #78706a;
        &:hover {
            background: inherit;
            cursor: not-allowed;
        }
    }
`;

const Tildeling = ({ oppgavereferanse, tildeltTil }: { oppgavereferanse: string; tildeltTil: string | undefined }) => {
    const email = useEmail();
    const { fjernTildeling, tildelOppgave } = useOppgavetildeling();
    const { leggTilVarsel } = useUpdateVarsler();
    const { markerPersonSomTildelt } = useContext(PersonContext);
    const tildelingsvarsel = (message: string) => ({ message, type: Varseltype.Advarsel });
    const erTildeltInnloggetBruker = tildeltTil === email;

    const meldAvTildeling = () => {
        fjernTildeling(oppgavereferanse)
            .then(() => markerPersonSomTildelt(email))
            .catch(() => {
                leggTilVarsel(tildelingsvarsel('Kunne ikke fjerne tildeling av sak.'));
            });
    };

    const tildel = () => {
        tildelOppgave(oppgavereferanse, email!)
            .then(() => markerPersonSomTildelt(email))
            .catch((assignedUser) => markerPersonSomTildelt(assignedUser));
    };

    return erTildeltInnloggetBruker ? (
        <TildelingKnapp onClick={meldAvTildeling}>Meld av {erTildeltInnloggetBruker} </TildelingKnapp>
    ) : (
        <TildelingKnapp onClick={tildel} disabled={tildeltTil !== undefined}>
            Tildel meg
        </TildelingKnapp>
    );
};

export const Verktøylinje = () => {
    const { personTilBehandling, aktivVedtaksperiode } = useContext(PersonContext);
    const tildeltTil = personTilBehandling?.tildeltTil;
    const utbetalinger: Utbetalinger | undefined = aktivVedtaksperiode?.utbetalinger;
    const vedtaksperiodeErAnnullert: boolean = aktivVedtaksperiode?.tilstand === Vedtaksperiodetilstand.Annullert;

    const visAnnulleringsmuligheter =
        !vedtaksperiodeErAnnullert &&
        ((annulleringerEnabled && utbetalinger?.arbeidsgiverUtbetaling) || utbetalinger?.personUtbetaling);

    if (!aktivVedtaksperiode) return null;

    return (
        <Container
            høyre={
                <StyledDropdown>
                    <Tildeling oppgavereferanse={aktivVedtaksperiode.oppgavereferanse} tildeltTil={tildeltTil} />
                    {oppdaterPersondataEnabled && <OppdaterPersondata />}
                    {visAnnulleringsmuligheter && <Annullering />}
                </StyledDropdown>
            }
        />
    );
};
