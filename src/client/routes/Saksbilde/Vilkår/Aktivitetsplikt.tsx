import React from 'react';
import styled from '@emotion/styled';
import { Normaltekst } from 'nav-frontend-typografi';
import Vilkårstittel from './Vilkårstittel';
import { FlexColumn } from '../../../components/Flex';

const Aktivitetstekst = styled(Normaltekst)`
    padding-left: 2.5rem;
`;

const Aktivitetsoverskrift = styled(Vilkårstittel)`
    padding-left: 2.5rem;
`;

export const Container = styled.div`
    padding: 1rem 1.5rem;
`;

const Aktivitetsplikt = () => {
    return (
        <Container>
            <FlexColumn>
                <Aktivitetsoverskrift størrelse="m" paragraf="§ 8-4">
                    Aktivitetsplikt
                </Aktivitetsoverskrift>
                <Aktivitetstekst>
                    Aktivitetsplikt vurderes fra og med 8 ukers sammenhengende sykefravær.
                </Aktivitetstekst>
            </FlexColumn>
        </Container>
    );
};

export default Aktivitetsplikt;
