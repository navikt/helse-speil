import React, { useContext } from 'react';
import styled from '@emotion/styled';
import Sakslinje from '@navikt/helse-frontend-sakslinje';
import Dropdown from '../Dropdown';
import { Annullering } from '../Annullering';
import { PersonContext } from '../../context/PersonContext';
import { Utbetalinger, Vedtaksperiodetilstand } from 'internal-types';
import { annulleringerEnabled } from '../../featureToggles';

const Container = styled(Sakslinje)`
    border-left: none;
    border-right: none;
    max-width: 250px;
    display: flex;
    justify-content: space-between;
`;

const StyledDropdown = styled(Dropdown)`
    margin-right: 0.5rem;
    border-radius: 0.25rem;
    height: 1.5rem;
    width: 2rem;
`;

export const Verktøylinje = () => {
    const personContext = useContext(PersonContext);
    const utbetalinger: Utbetalinger | undefined = personContext.aktivVedtaksperiode?.utbetalinger;
    const vedtaksperiodeErAnnullert: boolean =
        personContext.aktivVedtaksperiode?.tilstand === Vedtaksperiodetilstand.Annullert;

    return (
        <Container
            høyre={
                !vedtaksperiodeErAnnullert &&
                ((annulleringerEnabled && utbetalinger?.arbeidsgiverUtbetaling) || utbetalinger?.personUtbetaling) && (
                    <StyledDropdown>
                        <Annullering />
                    </StyledDropdown>
                )
            }
        />
    );
};
