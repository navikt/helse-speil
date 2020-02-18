import React, { ReactChild } from 'react';

interface Props {
    onClick: () => void;
    children: ReactChild;
}

const OversiktsLenke = ({ onClick, children }: Props) => {
    const simulateOnClick = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
        if (event.keyCode === 13) {
            onClick();
        }
    };

    return (
        <a className="lenke" onClick={onClick} onKeyPress={simulateOnClick} href="#">
            {children}
        </a>
    );
};

export default OversiktsLenke;
