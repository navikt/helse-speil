import React from 'react';
import styled from '@emotion/styled';
import Sakslinje from '@navikt/helse-frontend-sakslinje';
import { Utbetalinger, Vedtaksperiodetilstand } from 'internal-types';
import { Dropdown } from '../../../components/Dropdown';
import { annulleringerEnabled, oppdaterPersondataEnabled } from '../../../featureToggles';
import { Annullering } from '../annullering/Annullering';
import { Button } from '../../../components/Button';
import { OppdaterPersondata } from './OppdaterPersondata';
import { Tildelingsknapp } from './Tildelingsknapp';
import { usePerson } from '../../../state/person';
import { useAktivVedtaksperiode } from '../../../state/vedtaksperiode';

const Container = styled(Sakslinje)`
    border-left: none;
    border-right: none;
    max-width: 250px;
    border: 0;
    background: inherit;
    width: 50px;
    margin-left: 10px;

    span {
        border: 0;
    }
`;

const StyledDropdown = styled(Dropdown)`
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

export const DropdownMenyknapp = styled(Button)`
    height: 30px;
    width: 180px;
    font-size: 1rem;
    white-space: nowrap;
    text-align: left;
    padding: 0.25rem 1rem;

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

const Strek = styled.hr`
    border: none;
    border-top: 1px solid #c6c2bf;
`;

export const Verktøylinje = () => {
    const personTilBehandling = usePerson();
    const aktivVedtaksperiode = useAktivVedtaksperiode();
    const tildeltTil = personTilBehandling?.tildeltTil;
    const utbetalinger: Utbetalinger | undefined = aktivVedtaksperiode?.utbetalinger;
    const vedtaksperiodeErAnnullert: boolean = aktivVedtaksperiode?.tilstand === Vedtaksperiodetilstand.Annullert;

    const visAnnulleringsmuligheter =
        !vedtaksperiodeErAnnullert && annulleringerEnabled && utbetalinger?.arbeidsgiverUtbetaling;

    return (
        <Container
            høyre={
                <StyledDropdown>
                    {aktivVedtaksperiode && (
                        <>
                            <Tildelingsknapp
                                oppgavereferanse={aktivVedtaksperiode.oppgavereferanse}
                                tildeltTil={tildeltTil}
                            />
                            <Strek />
                        </>
                    )}
                    {oppdaterPersondataEnabled && <OppdaterPersondata />}
                    {visAnnulleringsmuligheter && <Annullering />}
                </StyledDropdown>
            }
        />
    );
};
