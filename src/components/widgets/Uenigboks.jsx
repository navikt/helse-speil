import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Input } from 'nav-frontend-skjema';
import { InnrapporteringContext } from '../../context/InnrapporteringContext';
import './Uenigboks.css';

// Override proptypes til Input for å kunne gi en ref som parameter til inputRef
Input.propTypes = {
    ...Input.propTypes,
    inputRef: PropTypes.any
};

const Uenigboks = ({ label }) => {
    const id = label + window.location.pathname;
    const ref = useRef();
    const innrapportering = useContext(InnrapporteringContext);

    const uenighet = useMemo(
        () => innrapportering.uenigheter.find(uenighet => uenighet.id === id),
        [innrapportering.uenigheter]
    );

    const [checked, setChecked] = useState(uenighet !== undefined);
    const [inputValue, setInputValue] = useState(
        (uenighet && uenighet.value) || ''
    );

    useEffect(() => {
        if (checked && inputValue === '') {
            ref.current && ref.current.focus();
        }
    }, [checked]);

    useEffect(() => {
        innrapportering.updateUenighet(id, inputValue);
    }, [inputValue]);

    const onCheckboxChange = e => {
        setChecked(e.target.checked);
        if (e.target.checked) {
            innrapportering.addUenighet(id, label);
        } else {
            innrapportering.removeUenighet(id);
        }
    };

    const onInputChange = e => {
        setInputValue(e.target.value);
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
