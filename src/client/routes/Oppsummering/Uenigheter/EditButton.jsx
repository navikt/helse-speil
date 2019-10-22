import React from 'react';
import PropTypes from 'prop-types';
import './EditButton.less';

const EditButton = ({ onClick }) => {
    return (
        <button className="EditButton" onClick={onClick}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="16px"
                height="16px"
                viewBox="0 0 24 24"
                enableBackground="new 0 0 24 24"
            >
                <g fill="#B7B1A9">
                    <path d="M0.188,23.212c-0.04,0.168,0.011,0.345,0.133,0.468c0.119,0.119,0.292,0.174,0.468,0.133l6.467-1.516 c0.043-0.01,0.083-0.027,0.122-0.047l-5.625-5.626c-0.021,0.039-0.037,0.08-0.047,0.123L0.188,23.212z" />
                    <rect
                        x="18.353"
                        y="1.149"
                        transform="matrix(-0.7074 0.7069 -0.7069 -0.7074 35.8269 -4.5354)"
                        width="1"
                        height="8"
                    />
                    <rect
                        x="2.677"
                        y="8.47"
                        transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 28.5021 13.1338)"
                        width="17.707"
                        height="8"
                    />
                    <path d="M22.741,6.916l0.354-0.354c0.975-0.974,0.975-2.56,0-3.535l-2.121-2.12c-0.472-0.474-1.1-0.733-1.768-0.733 c-0.668,0-1.296,0.26-1.768,0.733L17.084,1.26L22.741,6.916z" />
                </g>
            </svg>
        </button>
    );
};

EditButton.propTypes = {
    onClick: PropTypes.func
};

export default EditButton;
