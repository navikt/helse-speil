import React from 'react';
import PropTypes from 'prop-types';
import './ImageLink.css';

const ImageLink = ({ href, ariaLabel, imgSrc }) => (
    <div className="imageLink">
        <a href={href} aria-label={ariaLabel}>
            <img className="logo" src={imgSrc} />
        </a>
    </div>
);

ImageLink.propTypes = {
    ariaLabel: PropTypes.string.isRequired,
    imgSrc: PropTypes.string.isRequired,
    href: PropTypes.string
};

export default ImageLink;
