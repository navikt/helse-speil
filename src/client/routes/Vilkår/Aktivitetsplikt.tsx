import React from 'react';
// @ts-ignore
import styled from '@emotion/styled';
import { FlexColumn } from '../../components/FlexColumn';
import { Normaltekst } from 'nav-frontend-typografi';
import { Container } from './Vilkårsgruppe/Vilkårsgruppe';
import { Deloverskrift } from './components';
import Grid from '../../components/Grid';

const Aktivitetstekst = styled(Normaltekst)`
    padding-left: 2.5rem;
`;

const Aktivitetsoverskrift = styled.div`
    padding-left: 2.5rem;
`;

export const Innhold = styled(Grid)`
    padding: 1rem 1.5rem;
`;

const Aktivitetspliktinfo = () => (
    <Container>
        <Aktivitetsoverskrift>
            <Deloverskrift tittel="Aktivitetsplikt" paragraf="8-4" />
        </Aktivitetsoverskrift>
        <Aktivitetstekst>Aktivitetsplikt vurderes fra og med 8 ukers sammenhengende sykefravær.</Aktivitetstekst>
    </Container>
);

const Aktivitetsplikt = ({ className }: { className?: string }) => {
    return (
        <Innhold kolonner={1} className={className}>
            <FlexColumn>
                <Aktivitetspliktinfo />
            </FlexColumn>
        </Innhold>
    );
};

export default Aktivitetsplikt;
