import React, { ReactChild } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import './ListItem.less';

interface Props {
    label: string;
    children: ReactChild;
}

const ListItem = ({ label, children }: Props) => (
    <>
        <Normaltekst>{label}</Normaltekst>
        <Normaltekst>{children}</Normaltekst>
    </>
);

export default ListItem;
