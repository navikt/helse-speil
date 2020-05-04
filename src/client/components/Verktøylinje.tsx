import React from 'react';
import styled from '@emotion/styled';
import Sakslinje from '@navikt/helse-frontend-sakslinje';
import AlternativerKnapp from './AlternativerKnapp';
import Annullering from './Annullering';

const Container = styled(Sakslinje)`
    border-top: none;
    border-left: none;
    border-right: none;
    max-width: 250px;
    display: flex;
    justify-content: space-between;
`;

const Alternativer = styled(AlternativerKnapp)`
    margin-right: 0.5rem;
    border-radius: 0.25rem;
    height: 1.5rem;
    width: 2rem;
`;

const Verktøylinje = () => <Container høyre={<Dropdown />} />;

const Dropdown = () => (
    <Alternativer>
        <Annullering />
    </Alternativer>
);

export default Verktøylinje;
