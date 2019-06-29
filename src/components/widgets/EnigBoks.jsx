import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Input } from 'nav-frontend-skjema';
import './EnigBoks.css';
import { InnrapporteringContext } from '../../context/InnrapporteringContext';

// Override proptypes til Input for å kunne gi en ref som parameter til inputRef
Input.propTypes = {
    ...Input.propTypes,
    inputRef: PropTypes.any
};

<<<<<<< HEAD
const EnigBoks = ({ label }) => {
    const id = label + window.location.pathname;
=======
const EnigBoks = ({ id }) => {
>>>>>>> da118e1... Add store for reports on frontend
    const ref = useRef();
    const innrapportering = useContext(InnrapporteringContext);

    const uenighet = useMemo(
        () => innrapportering.uenigheter.find(uenighet => uenighet.id === id),
        [innrapportering.uenigheter]
    );

    const [checked, setChecked] = useState(uenighet !== undefined);
<<<<<<< HEAD
    const [inputValue, setInputValue] = useState(
        (uenighet && uenighet.value) || ''
    );
=======
    const [inputValue, setInputValue] = useState(uenighet && uenighet.value || '');
>>>>>>> da118e1... Add store for reports on frontend

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
<<<<<<< HEAD
            innrapportering.addUenighet(id, label);
=======
            innrapportering.addUenighet(id);
>>>>>>> da118e1... Add store for reports on frontend
        } else {
            innrapportering.removeUenighet(id);
        }
    };

    const onInputChange = e => {
        setInputValue(e.target.value);
    };

    return (
        <div className="EnigBoks">
            <Checkbox
                label="Uenig"
                checked={checked}
                onChange={onCheckboxChange}
            />
            <Input
                className="EnigBoks__input"
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

EnigBoks.propTypes = {
<<<<<<< HEAD
    label: PropTypes.string.isRequired
=======
    id: PropTypes.string.isRequired
>>>>>>> da118e1... Add store for reports on frontend
};

export default EnigBoks;
