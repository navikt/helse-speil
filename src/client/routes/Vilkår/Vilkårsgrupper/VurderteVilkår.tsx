import React from 'react';
import styled from '@emotion/styled';
import Vilkårstittel from '../Vilkårstittel';
import GrøntSjekkikon from '../../../components/Ikon/GrøntSjekkikon';

const VurderteVilkårstittel = styled(Vilkårstittel)`
    margin-top: 2rem;
    margin-left: 2rem;
`;

const VurderteVilkår = () => {
    return (
        <VurderteVilkårstittel størrelse="m" ikon={<GrøntSjekkikon />}>
            Vurderte vilkår
        </VurderteVilkårstittel>
    );
};

export default VurderteVilkår;
