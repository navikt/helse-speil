import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { NedChevron } from 'nav-frontend-chevron';
import { useClickOutside } from '../../hooks/useClickOutside';
import './Picker.less';

const Picker = ({ items, className, currentItem, onSelectItem, itemLabel }) => {
    const [showPopup, setShowPopup] = useState(false);
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
                {currentItem !== undefined ? itemLabel(currentItem) : 'Ingen saker for bruker'}
            </Normaltekst>
            {showPopup && (
                <ul
                    className="Picker__popup"
                    ref={popupRef}
                    onBlur={() => {
                        console.log('blur');
                        setShowPopup(false);
                    }}
                >
                    {items.map((item, i) => (
                        <li
                            key={`popup-item-${i}`}
                            role="option"
                            onClick={() => onSelectItem(item)}
                            tabIndex={0}
                            aria-selected={currentItem.behandlingsId === item.behandlingsId}
                        >
                            <Normaltekst>{itemLabel(item)}</Normaltekst>
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
    items: PropTypes.arrayOf(PropTypes.any).isRequired,
    className: PropTypes.string,
    currentItem: PropTypes.any,
    onSelectItem: PropTypes.func.isRequired,
    itemLabel: PropTypes.func.isRequired
};

Picker.defaultProps = {
    currentItem: undefined
};

export default Picker;
