import React, { ReactNode } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import './Rows.less';

interface Props {
    label: string;
    children: string | number;
    labelProp?: ReactNode;
}

const Row = ({ label, children, labelProp }: Props) => {
    return (
        <span className="Row">
            <Normaltekst>
                {label}
                {labelProp}
            </Normaltekst>
            {children && <Normaltekst>{children}</Normaltekst>}
        </span>
    );
};

export default Row;
