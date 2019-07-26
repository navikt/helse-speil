import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Input } from 'nav-frontend-skjema';
import { InnrapporteringContext } from '../../context/InnrapporteringContext';
import './Uenigboks.css';
import { useFocusRef } from '../../hooks/useFocusRef';

// Override proptypes til Input for å kunne gi en ref som parameter til inputRef
Input.propTypes = {
    ...Input.propTypes,
    inputRef: PropTypes.any
};

const Uenigboks = ({ label }) => {
    const id = label + decodeURIComponent(window.location.pathname);
    const innrapportering = useContext(InnrapporteringContext);
    const [checked, setChecked] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const ref = useFocusRef(checked && inputValue === '');

    useEffect(() => {
        const uenighet = innrapportering.uenigheter.find(
            uenighet => uenighet.id === id
        );
        if (uenighet) {
            setChecked(true);
            setInputValue(uenighet.value || '');
        }
    }, [innrapportering.uenigheter]);

    const onCheckboxChange = e => {
        setChecked(e.target.checked);
        setInputValue('');
        if (e.target.checked) {
            innrapportering.addUenighet(id, label);
        } else {
            innrapportering.removeUenighet(id);
        }
    };

    const onInputChange = e => {
        setInputValue(e.target.value);
        innrapportering.updateUenighet(id, e.target.value);
    };

    return (
        <div className="Uenigboks">
            <Checkbox
                label="Uenig"
                checked={checked}
                onChange={onCheckboxChange}
            />
            <Input
                className="Uenigboks__input"
                label="Årsak"
                placeholder="Skriv inn årsak til uenighet"
                inputRef={ref}
                disabled={!checked}
                onChange={onInputChange}
                value={inputValue}
            />
        </div>
    );
};

Uenigboks.propTypes = {
    label: PropTypes.string.isRequired
};

export default Uenigboks;
