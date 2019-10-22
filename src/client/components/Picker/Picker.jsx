import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { NedChevron } from 'nav-frontend-chevron';
import { hasParent, useClickOutside } from '../../hooks/useClickOutside';
import './Picker.less';
import { Keys } from '../../hooks/useKeyboard';

const Picker = ({ items, className, currentItem, onSelectItem, itemLabel, placeholderLabel }) => {
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);

    const onClick = item => {
        onSelectItem(item);
    };

    const onSimulatedClick = (e, item) => {
        if (e.keyCode === Keys.ENTER) {
            onSelectItem(item);
        }
    };

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
                {currentItem !== undefined ? itemLabel(currentItem) : placeholderLabel}
            </Normaltekst>
            {showPopup && (
                <ul
                    className="Picker__popup"
                    ref={popupRef}
                    onBlur={() => {
                        setTimeout(() => {
                            if (!hasParent(document.activeElement, popupRef.current)) {
                                setShowPopup(false);
                            }
                        }, 0);
                    }}
                >
                    {items.map((item, i) => (
                        <li
                            key={`popup-item-${i}`}
                            role="option"
                            onClick={onClick}
                            onKeyDown={e => onSimulatedClick(e, item)}
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
    onSelectItem: PropTypes.func.isRequired,
    itemLabel: PropTypes.func.isRequired,
    className: PropTypes.string,
    currentItem: PropTypes.any,
    placeholderLabel: PropTypes.string
};

Picker.defaultProps = {
    currentItem: undefined
};

export default Picker;
