import React from 'react';

interface IconStatistikkProps extends Omit<React.SVGAttributes<SVGElement>, 'children'> {}

export const IconStatistikk: React.VFC<IconStatistikkProps> = ({ ...svgProps }) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.0833 1.83333V20.1667H11.9167V1.83333H10.0833ZM8.25 0.916667V20.1667H6.41667V11.9167C6.41667 11.4104 6.00626 11 5.5 11H1.83333C1.32707 11 0.916667 11.4104 0.916667 11.9167V20.1667H0V22H0.916667H6.41667H8.25H13.75H15.5833H21.0833H22V20.1667H21.0833V6.41667C21.0833 5.91041 20.6729 5.5 20.1667 5.5H16.5C15.9937 5.5 15.5833 5.91041 15.5833 6.41667V20.1667H13.75V0.916667C13.75 0.410406 13.3396 0 12.8333 0H9.16667C8.66041 0 8.25 0.410406 8.25 0.916667ZM17.4167 20.1667H19.25V7.33333H17.4167V20.1667ZM2.75 20.1667V12.8333H4.58333V20.1667H2.75Z"
            fill="#262626"
        />
    </svg>
);
