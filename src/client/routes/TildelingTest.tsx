import React, { useState } from 'react';
import styled from '@emotion/styled';
import Fareknapp from 'nav-frontend-knapper/lib/fareknapp';
import { postDummyTildeling } from '../io/http';
import { Normaltekst } from 'nav-frontend-typografi';

const StyledDiv = styled.div`
    margin-top: 15rem;
`;

export const TildelingTest = () => {
    const [poster, setPoster] = useState(false);
    const [resultat, setResultat] = useState('');

    const dummyTildel = () => {
        setPoster(true);
        return postDummyTildeling()
            .then((res) => {
                setResultat('Det fikk fint');
            })
            .catch(async (error) => {
                setResultat(`Det gikk IKKE fint, men det gikk. Feilmelding: ${error.message}`);
            })
            .finally(() => setPoster(false));
    };
    return (
        <StyledDiv>
            <Fareknapp spinner={poster} onClick={dummyTildel}>
                DO NOT CLICK!!!
            </Fareknapp>
            <Normaltekst>{resultat}</Normaltekst>
        </StyledDiv>
    );
};
