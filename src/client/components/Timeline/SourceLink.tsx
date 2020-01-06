import React from 'react';
import './SourceLink.less';

interface Props {
    label: string;
}

const SourceLink = ({ label }: Props) => {
    return (
        <a className="SourceLink" href="#">
            {label.toUpperCase()}
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
        </a>
    );
};

export default SourceLink;
