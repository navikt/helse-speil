import React from 'react';

interface Props {
    abbreviation: string;
    label: string;
    disabled?: boolean;
}

const InfotrygdMenuItem = ({ abbreviation, label, disabled }: Props) => {
    const style = disabled && { color: 'grey' } || {};
    return (
        <li style={style}>
            <span>{abbreviation}</span>
            <span style={style}>{label}</span>
        </li>
    );
};

export default InfotrygdMenuItem;
