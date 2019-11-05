import React from 'react';
import PropTypes from 'prop-types';

const defaultIconProps = {
    stroke: '#000',
    strokeLinecap: 'round',
    strokeLinejoin: 'rount',
    strokeMiterlimit: '10',
    fill: 'none'
};

const svgForType = type => {
    switch (type) {
        case 'check':
            return (
                <path
                    {...defaultIconProps}
                    d="M23.5.5l-16.5 23-6.5-6.5"
                    strokeWidth="2"
                    stroke="#38a161"
                />
            );
        case 'copy':
            return (
                <g {...defaultIconProps}>
                    <g strokeWidth="1">
                        <g transform="translate(4, 4)">
                            <polygon points="4.4408921e-14 19.1729323 4.4408921e-14 4.5112782 10.1503759 4.5112782 10.1503759 19.1729323" />
                            <polyline points="5.63909774 2.19924812 5.63909774 -2.69118061e-13 15.7894737 -2.69118061e-13 15.7894737 14.6616541 13.2518797 14.6616541" />
                        </g>
                    </g>
                </g>
            );
        default:
            throw new Error(`Cannot instantiate icon of type ${type}`);
    }
};

const ClipboardIcon = ({ size, type }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="-2 0 26 26">
            {svgForType(type)}
        </svg>
    );
};

ClipboardIcon.propTypes = {
    type: PropTypes.oneOf(['copy', 'check']).isRequired,
    size: PropTypes.number
};

ClipboardIcon.defaultProps = {
    size: 20
};

export default ClipboardIcon;
