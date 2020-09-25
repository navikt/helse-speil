import React from 'react';
import styled from '@emotion/styled';
import { Person } from 'internal-types';
import { Clipboard } from './clipboard';
import { Manneikon } from './ikoner/Manneikon';
import { Kvinneikon } from './ikoner/Kvinneikon';
import { KjønnsnøytraltIkon } from './ikoner/KjønnsnøytraltIkon';
import { Element, Normaltekst } from 'nav-frontend-typografi';

const formatFnr = (fnr: string) => fnr.slice(0, 6) + ' ' + fnr.slice(6);

const Container = styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: 48px;
    padding: 0 2rem;
    background: #f8f8f8;
    border-bottom: 1px solid #c6c2bf;
    color: #3e3832;

    > svg {
        margin-right: 0.5rem;
    }
`;

const Separator = styled(Normaltekst)`
    margin: 0 1rem 0 1rem;
`;

const Kjønnsikon = ({ kjønn }: { kjønn: string }) => {
    switch (kjønn.toLowerCase()) {
        case 'kvinne':
            return <Kvinneikon />;
        case 'mann':
            return <Manneikon />;
        default:
            return <KjønnsnøytraltIkon />;
    }
};

interface PersonlinjeProps {
    person?: Person;
}

export const Personlinje = ({ person }: PersonlinjeProps) => {
    if (!person) return <Container />;

    const { aktørId, personinfo } = person;
    const { fornavn, mellomnavn, etternavn, kjønn, fnr } = personinfo;

    return (
        <Container>
            <Kjønnsikon kjønn={kjønn} />
            <Element>{`${fornavn} ${mellomnavn ? `${mellomnavn} ` : ' '}${etternavn}`}</Element>
            <Separator>/</Separator>
            {fnr ? (
                <Clipboard preserveWhitespace={false}>
                    <Normaltekst>{formatFnr(fnr)}</Normaltekst>
                </Clipboard>
            ) : (
                <Normaltekst>Fødselsnummer ikke tilgjengelig</Normaltekst>
            )}
            <Separator>/</Separator>
            <Normaltekst>Aktør-ID:&nbsp;</Normaltekst>
            <Clipboard preserveWhitespace={false}>
                <Normaltekst>{aktørId}</Normaltekst>
            </Clipboard>
            <Separator>/</Separator>
            <Normaltekst>
                Boenhet: {person.enhet.id} ({person.enhet.navn})
            </Normaltekst>
        </Container>
    );
};
