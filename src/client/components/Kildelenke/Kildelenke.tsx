import React from 'react';
import classNames from 'classnames';
import './Kildelenke.less';

interface Props {
    label: string;
    disabled?: boolean;
}

const Kildelenke = ({ label, disabled = false }: Props) => {
    return (
        <a className={classNames('Kildelenke', disabled && 'disabled')} href="#">
            {label.toUpperCase()}
            {!disabled && (
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24">
                    <g
                        stroke="#0067c5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        strokeWidth="4"
                        fill="none"
                    >
                        <path d="M16.513.5h7v7M23.513.5l-16 16" />
                    </g>
                </svg>
            )}
        </a>
    );
};

export default Kildelenke;
