import React, { useRef, useState } from 'react';
import Picker from '../widgets/Picker';
import PropTypes from 'prop-types';
import { useClickOutside } from '../../hooks/useClickOutside';
import './CasePicker.less';

const CasePicker = ({ ...props }) => {
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);

    useClickOutside(popupRef, showPopup, () => {
        setShowPopup(false);
    });

    return <Picker className="CasePicker" {...props} />;
};

CasePicker.propTypes = {
    items: PropTypes.arrayOf(PropTypes.any).isRequired,
    currentItem: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    itemLabel: PropTypes.func.isRequired
};

CasePicker.defaultProps = {
    currentItem: undefined
};

export default CasePicker;
