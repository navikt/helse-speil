import React, { ReactChild } from 'react';
import classNames from 'classnames';
import './Kildelenke.less';

type WrapperProps = { children: ReactChild | ReactChild[] };

interface Props {
    label: Kildetype;
    link?: string;
}

export enum Kildetype {
    inntektsmelding = 'IM',
    aareg = 'Aa',
    aordningen = 'AO'
}

const Kildelenke = ({ label, link }: Props) => {
    const content = (
        <>
            {label}
            {link && (
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
        </>
    );
    return link ? (
        <a className={classNames('Kildelenke')} href={link}>
            {content}
        </a>
    ) : (
        <div className={classNames('Kildelenke', 'disabled')}>{content}</div>
    );
};

export default Kildelenke;
