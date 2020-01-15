import React from 'react';
import './VisDetaljerKnapp.less';

interface Props {
    onClick: () => void;
    tekst?: string;
}

const VisDetaljerKnapp = ({ onClick, tekst = 'Vis detaljer' }: Props) => (
    <button className="VisDetaljerKnapp" onClick={onClick} tabIndex={0}>
        {tekst}
    </button>
);

export default VisDetaljerKnapp;
