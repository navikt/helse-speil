import React, { useContext } from 'react';
import styled from '@emotion/styled';
import Sakslinje from '@navikt/helse-frontend-sakslinje';
import Dropdown from './Dropdown';
import { Annullering } from './Annullering';
import { PersonContext } from '../context/PersonContext';
import { Utbetalinger } from 'internal-types';
import { annulleringerEnabled } from '../featureToggles';

const Container = styled(Sakslinje)`
    border-top: none;
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

const Verktøylinje = () => {
    const personContext = useContext(PersonContext);
    const utbetalinger: Utbetalinger | undefined = personContext.aktivVedtaksperiode?.utbetalinger;

    return (
        <Container
            høyre={
                ((annulleringerEnabled && utbetalinger?.arbeidsgiverUtbetaling) || utbetalinger?.personUtbetaling) && (
                    <StyledDropdown>
                        <Annullering />
                    </StyledDropdown>
                )
            }
        />
    );
};

export default Verktøylinje;
