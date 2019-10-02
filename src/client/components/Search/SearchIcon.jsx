import React from 'react';
import PropTypes from 'prop-types';

const SearchIcon = ({ color = '#78706a' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
        <g>
            <path
                fill={color}
                d="M9,18c2.131,0,4.09-0.75,5.633-1.992l7.658,7.697c0.389,0.393,1.021,0.395,1.414,0.004s0.393-1.023,0.004-1.414
                    l-7.668-7.707C17.264,13.053,18,11.111,18,9c0-4.963-4.037-9-9-9S0,4.037,0,9S4.037,18,9,18z M9,2c3.859,0,7,3.139,7,7
                    c0,3.859-3.141,7-7,7c-3.861,0-7-3.141-7-7C2,5.139,5.139,2,9,2z"
            />
        </g>
    </svg>
);

SearchIcon.propTypes = {
    color: PropTypes.string
};

export default SearchIcon;
