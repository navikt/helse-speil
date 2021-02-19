import React from 'react';
import styled from '@emotion/styled';
import { Utbetalinger, Vedtaksperiodetilstand } from 'internal-types';
import { Dropdown } from '../../../components/Dropdown';
import { annulleringerEnabled, oppdaterPersondataEnabled, påVent } from '../../../featureToggles';
import { Annullering } from './annullering/Annullering';
import { Button } from '../../../components/Button';
import { OppdaterPersondata } from './OppdaterPersondata';
import { Tildelingsknapp, useErTildeltInnloggetBruker } from './Tildelingsknapp';
import { usePerson } from '../../../state/person';
import { useAktivVedtaksperiode } from '../../../state/vedtaksperiode';
import { PåVentKnapp } from './PåVentKnapp';
import { AnonymiserData } from './AnonymiserData';

const Container = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
`;

const Dropdownknapp = styled(Dropdown)`
    padding: 1rem 1.25rem;

    &:hover,
    &:active {
        text-decoration: underline;
    }
`;

export const DropdownMenyknapp = styled(Button)`
    height: 30px;
    width: 180px;
    font-size: 1rem;
    white-space: nowrap;
    text-align: left;
    padding: 0.25rem 1rem;

    &:hover,
    &:focus {
        background: var(--speil-light-hover);
    }

    &:disabled {
        color: var(--navds-color-text-disabled);

        &:hover {
            background: inherit;
            cursor: not-allowed;
        }
    }
`;

const Strek = styled.hr`
    border: none;
    border-top: 1px solid var(--navds-color-border);
`;

export const Verktøylinje = () => {
    const personTilBehandling = usePerson();
    const aktivVedtaksperiode = useAktivVedtaksperiode();
    const tildeltTil = personTilBehandling?.tildeltTil;
    const tildeltTilMeg = useErTildeltInnloggetBruker();
    const utbetalinger: Utbetalinger | undefined = aktivVedtaksperiode?.utbetalinger;
    const vedtaksperiodeErAnnullert: boolean = aktivVedtaksperiode?.tilstand === Vedtaksperiodetilstand.Annullert;

    const visAnnulleringsmuligheter =
        !vedtaksperiodeErAnnullert && annulleringerEnabled && utbetalinger?.arbeidsgiverUtbetaling;

    return (
        <Container>
            <Dropdownknapp>
                {aktivVedtaksperiode && (
                    <>
                        {aktivVedtaksperiode.oppgavereferanse && (
                            <Tildelingsknapp
                                oppgavereferanse={aktivVedtaksperiode.oppgavereferanse}
                                tildeltTil={tildeltTil}
                            />
                        )}
                        <Strek />
                    </>
                )}
                {aktivVedtaksperiode && tildeltTilMeg && påVent && <PåVentKnapp />}
                {oppdaterPersondataEnabled && <OppdaterPersondata />}
                <AnonymiserData />
                {visAnnulleringsmuligheter && <Annullering />}
            </Dropdownknapp>
        </Container>
    );
};
