import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

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
                    strokeWidth="3"
                    stroke="#38a161"
                />
            );
        case 'copy':
            return (
                <g {...defaultIconProps}>
                    <motion.path d="M20.5 20.5h-14v-20h8l6 6zM14.5.5v6h6M17.5 20.5v3h-14v-20h3" />
                </g>
            );
        default:
            throw new Error(`Cannot instantiate icon of type ${type}`);
    }
};

const ClipboardIcon = ({ size, type }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            {svgForType(type)}
        </svg>
    );
};

ClipboardIcon.propTypes = {
    type: PropTypes.oneOf(['copy', 'check']).isRequired,
    size: PropTypes.number
};

ClipboardIcon.defaultProps = {
    size: 16
};

export default ClipboardIcon;
