import React from 'react';
import PropTypes from 'prop-types';
import './DeleteButton.less';

const DeleteButton = ({ onDelete }) => {
    return (
        <button className="DeleteButton" onClick={onDelete}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 24 24">
                <g
                    stroke="#B7B1A9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeWidth="4"
                >
                    <path d="M23.5.5l-23 23M23.5 23.5l-23-23" />
                </g>
            </svg>
        </button>
    );
};

DeleteButton.propTypes = {
    onDelete: PropTypes.func
};

export default DeleteButton;
