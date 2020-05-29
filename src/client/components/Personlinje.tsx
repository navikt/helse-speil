import React, { useContext } from 'react';
import Clipboard from './Clipboard';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../context/PersonContext';
import styled from '@emotion/styled';
import IkonMann from './Ikon/IkonMann';
import IkonKvinne from './Ikon/IkonKvinne';
import IkonKjønnsnøytral from './Ikon/IkonKjønnsnøytral';

const formatFnr = (fnr: string) => fnr.slice(0, 6) + ' ' + fnr.slice(6);

const Container = styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: 5rem;
    padding: 0 2rem;
    background: #fff;
    border-bottom: 1px solid #c6c2bf;
    color: #3e3832;

    > svg {
        margin: 0 0.5rem 0 0.5rem;
    }
`;

const Separator = styled(Normaltekst)`
    margin: 0 1rem 0 1rem;
`;

const Kjønnsikon = ({ kjønn }: { kjønn: string }) => {
    switch (kjønn.toLowerCase()) {
        case 'kvinne':
            return <IkonKvinne />;
        case 'mann':
            return <IkonMann />;
        default:
            return <IkonKjønnsnøytral />;
    }
};

const Personlinje = () => {
    const { personTilBehandling } = useContext(PersonContext);

    if (!personTilBehandling) return <Container />;

    const { aktørId, personinfo, navn } = personTilBehandling;

    return (
        <Container>
            <Kjønnsikon kjønn={personinfo.kjønn} />
            <Element>{`${navn.fornavn} ${navn.mellomnavn ? `${navn.mellomnavn} ` : ' '}${navn.etternavn}`}</Element>
            <Separator>/</Separator>
            {personinfo.fnr ? (
                <Clipboard>
                    <Normaltekst>{formatFnr(personinfo.fnr)}</Normaltekst>
                </Clipboard>
            ) : (
                <Normaltekst>Fødselsnummer ikke tilgjengelig</Normaltekst>
            )}
            <Separator>/</Separator>
            <Normaltekst>Aktør-ID:&nbsp;</Normaltekst>
            <Clipboard>{aktørId}</Clipboard>
            <Separator>/</Separator>
            <Normaltekst>
                Boenhet: {personTilBehandling.enhet.id} ({personTilBehandling.enhet.navn})
            </Normaltekst>
        </Container>
    );
};

export default Personlinje;
