import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DynamicTextarea from './DynamicTextarea';
import { Checkbox } from 'nav-frontend-skjema';
import { useFocusRef } from '../../hooks/useFocusRef';
import './Uenigboks.css';
import { useUenighet } from '../../hooks/useUenighet';

const errorMessage = 'Du bør skrive inn årsak';

const Uenigboks = ({ label }) => {
    const id = label + decodeURIComponent(window.location.pathname);

    const uenighet = useUenighet(id);
    const [checked, setChecked] = useState(uenighet.value ?? false);
    const [inputValue, setInputValue] = useState(uenighet.value ?? '');

    const showValidationError = checked && !inputValue;
    const ref = useFocusRef(showValidationError);
    const [error, setError] = useState(
        showValidationError ? errorMessage : undefined
    );

    useEffect(() => {
        setInputValue(uenighet.value || '');
        if (uenighet.value !== undefined) {
            setChecked(true);
        } else if (uenighet.value === '') {
            setError(undefined);
        }
    }, [uenighet.value]);

    const onCheckboxChange = e => {
        setChecked(e.target.checked);
        setInputValue('');
        if (e.target.checked) {
            uenighet.create(label);
        } else {
            uenighet.remove();
        }
    };

    const onInputChange = e => {
        setInputValue(e.target.value);
        uenighet.update(e.target.value);
    };

    const onInputBlur = e => {
        setError(e.target.value === '' ? errorMessage : undefined);
    };

    return (
        <div className="Uenigboks">
            <Checkbox
                label="Uenig"
                checked={checked}
                onChange={onCheckboxChange}
            />
            <DynamicTextarea
                name="Årsak"
                className="Uenigboks__input skjemaelement skjemaelement__input"
                placeholder="Skriv inn årsak til uenighet"
                disabled={!checked}
                onChange={onInputChange}
                onBlur={onInputBlur}
                error={error}
                value={inputValue}
                ref={ref}
            />
        </div>
    );
};

Uenigboks.propTypes = {
    label: PropTypes.string.isRequired
};

export default Uenigboks;
