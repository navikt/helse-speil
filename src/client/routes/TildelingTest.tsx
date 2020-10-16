import React, { ChangeEvent, useState } from 'react';
import styled from '@emotion/styled';
import Fareknapp from 'nav-frontend-knapper/lib/fareknapp';
import {
    getDummyTildeling,
    getDummyTildelingSpesialist,
    postDummyTildeling,
    postDummyTildelingSpesialist,
} from '../io/http';
import { Normaltekst } from 'nav-frontend-typografi';
import Input from 'nav-frontend-skjema/lib/input';

const StyledDiv = styled.div`
    margin-top: 15rem;
`;

export const TildelingTest = () => {
    const [poster, setPoster] = useState(false);
    const [resultat, setResultat] = useState('');

    const dummyTildelPost = () => {
        setPoster(true);
        return postDummyTildeling('1224')
            .then((res) => {
                setResultat('POST: Det gikk fint');
            })
            .catch(async (error) => {
                setResultat(`POST: Det gikk IKKE fint, men det gikk. Feilmelding: ${error.message}`);
            })
            .finally(() => setPoster(false));
    };
    const dummyTildelGet = () => {
        setPoster(true);
        return getDummyTildeling('1334')
            .then((res) => {
                setResultat('GET: Det gikk fint');
            })
            .catch(async (error) => {
                setResultat(`GET: Det gikk IKKE fint, men det gikk. Feilmelding: ${error.message}`);
            })
            .finally(() => setPoster(false));
    };

    const dummyTildelSpesialistPost = () => {
        setPoster(true);
        return postDummyTildelingSpesialist('2224')
            .then((res) => {
                setResultat('POST: Det gikk fint');
            })
            .catch(async (error) => {
                setResultat(`POST: Det gikk IKKE fint, men det gikk. Feilmelding: ${error.message}`);
            })
            .finally(() => setPoster(false));
    };
    const dummyTildelSpesialistGet = () => {
        setPoster(true);
        return getDummyTildelingSpesialist('3334')
            .then((res) => {
                setResultat('GET: Det gikk fint');
            })
            .catch(async (error) => {
                setResultat(`GET: Det gikk IKKE fint, men det gikk. Feilmelding: ${error.message}`);
            })
            .finally(() => setPoster(false));
    };
    return (
        <StyledDiv>
            <Fareknapp spinner={poster} onClick={dummyTildelPost}>
                DO NOT CLICK!!! (POST)
            </Fareknapp>
            <Fareknapp spinner={poster} onClick={dummyTildelGet}>
                DO NOT CLICK!!! (GET)
            </Fareknapp>
            <Fareknapp spinner={poster} onClick={dummyTildelSpesialistPost}>
                Denne går til spesialist.nais.adeo.no (POST)
            </Fareknapp>
            <Fareknapp spinner={poster} onClick={dummyTildelSpesialistGet}>
                Denne går til spesialist.nais.adeo.no (GET)
            </Fareknapp>
            <Normaltekst>{resultat}</Normaltekst>
        </StyledDiv>
    );
};
