import React, { useRef, useState } from 'react';
import Picker from '../widgets/Picker';
import PropTypes from 'prop-types';
import { useClickOutside } from '../../hooks/useClickOutside';
import './CasePicker.less';

const CasePicker = ({ cases }) => {
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);

    useClickOutside(popupRef, showPopup, () => {
        setShowPopup(false);
    });

    return <Picker className="CasePicker" preLabel="Saks-ID" items={cases} />;
};

CasePicker.propTypes = {
    cases: PropTypes.arrayOf(PropTypes.string)
};

CasePicker.defaultProps = {
    cases: ['123456789', '987654321', '134679258']
};

export default CasePicker;
