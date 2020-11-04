import React, { useContext } from 'react';
import styled from '@emotion/styled';
import Sakslinje from '@navikt/helse-frontend-sakslinje';
import { Utbetalinger } from 'internal-types';
import Dropdown from '../../components/Dropdown';
import { PersonContext } from '../../context/PersonContext';
import { annulleringerEnabled } from '../../featureToggles';
import { Annullering } from '../../components/Annullering';

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
