import React from 'react';
import Sjekkikon from './Ikon/Sjekkikon';
import Advarselikon from './Ikon/Advarselikon';
import styled from '@emotion/styled';
import { Normaltekst } from 'nav-frontend-typografi';
import classNames from 'classnames';

interface IkonradProps {
    tekst: string;
    ikontype: 'ok' | 'advarsel';
    className?: string;
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

const Ikonrad = ({ tekst, ikontype, className }: IkonradProps) => (
    <Rad className={classNames(className)}>
        {ikontype === 'ok' ? <Sjekkikon /> : <Advarselikon />}
        <Normaltekst>{tekst}</Normaltekst>
    </Rad>
);

export default Ikonrad;
