import React from 'react';
import Sjekkikon from '../Ikon/Sjekkikon';
import Advarselikon from '../Ikon/Advarselikon';
import styled from '@emotion/styled';
import { Normaltekst } from 'nav-frontend-typografi';

interface IkonradProps {
    tekst: string;
    ikontype: 'ok' | 'advarsel';
}

const Rad = styled.li`
    width: max-content;
    display: flex;
    align-items: center;
    padding: 0.25rem 0;

    > svg {
        margin-right: 1rem;
    }
`;

const Ikonrad = ({ tekst, ikontype }: IkonradProps) => {
    return (
        <Rad>
            {ikontype === 'ok' ? <Sjekkikon /> : <Advarselikon />}
            <Normaltekst>{tekst}</Normaltekst>
        </Rad>
    );
};

export default Ikonrad;
