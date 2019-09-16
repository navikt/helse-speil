import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { NedChevron } from 'nav-frontend-chevron';
import { useClickOutside } from '../../../hooks/useClickOutside';
import './Picker.less';

const Picker = ({ items, preLabel, defaultLabel, className, maxVisibleCharacters }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [current, setCurrent] = useState(items[0]);
    const popupRef = useRef(null);

    useClickOutside(popupRef, showPopup, () => {
        setShowPopup(false);
    });

    return (
        <button
            role="select"
            className={`Picker ${className ? className : ''}`}
            onClick={() => setShowPopup(!showPopup)}
        >
            <Normaltekst>
                {preLabel && `${preLabel} `}
                {defaultLabel ? defaultLabel : `${current.slice(0, maxVisibleCharacters)}...`}
            </Normaltekst>
            {showPopup && (
                <ul className="Picker__popup" ref={popupRef} onBlur={() => setShowPopup(false)}>
                    {items.map((item, i) => (
                        <li
                            key={`popup-item-${i}`}
                            role="option"
                            onClick={() => setCurrent(item)}
                            tabIndex={0}
                            aria-selected={current === item}
                        >
                            <Normaltekst>{item}</Normaltekst>
                        </li>
                    ))}
                </ul>
            )}
            <div className="Picker__chevron">
                <NedChevron />
            </div>
        </button>
    );
};

Picker.propTypes = {
    items: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    preLabel: PropTypes.string,
    defaultLabel: PropTypes.string,
    maxVisibleCharacters: PropTypes.number,
    className: PropTypes.string
};

Picker.defaultProps = {
    maxVisibleCharacters: 8
};

export default Picker;
