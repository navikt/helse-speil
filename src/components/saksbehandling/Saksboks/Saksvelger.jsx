import React, { useRef, useState } from 'react';
import './Saksvelger.less';
import { Normaltekst } from 'nav-frontend-typografi';
import Icon, { IconType } from '../Icon/Icon';
import { useClickOutside } from '../../../hooks/useClickOutside';

const Saksvelger = () => {
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef();

    useClickOutside(popupRef, showPopup, () => {
        setShowPopup(false);
    });

    // Dummy-data som skal fjernes etterhvert
    const saksId = 123456789;
    const saker = ['123456789', '987654321', '134679258'];

    return (
        <div className="Saksvelger">
            <Normaltekst>SAKS ID {saksId}</Normaltekst>
            {showPopup && (
                <ul className="Saksvelger__popup" ref={popupRef}>
                    {saker.map((sak, i) => (
                        <li key={`popup-sak-${i}`}>
                            <Normaltekst>{sak}</Normaltekst>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={() => setShowPopup(!showPopup)}>
                <Icon type={IconType.MENY} />
            </button>
        </div>
    );
};

export default Saksvelger;
