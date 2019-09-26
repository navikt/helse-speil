import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DynamicTextarea from '../DynamicTextarea';
import { Checkbox } from 'nav-frontend-skjema';
import { useFocusRef } from '../../hooks/useFocusRef';
import './FeedbackInput.less';
import { useUenighet } from '../../hooks/useUenighet';

const errorMessage = 'Du bør skrive inn årsak';

const FeedbackInput = ({ label, itemsForFeedback }) => {
    const id = label + decodeURIComponent(window.location.pathname);

    const uenighet = useUenighet(id);
    const [checked, setChecked] = useState(uenighet.value ?? false);
    const [inputValue, setInputValue] = useState(uenighet.value ?? '');

    const showValidationError = checked && !inputValue;
    const ref = useFocusRef(showValidationError);
    const [error, setError] = useState(showValidationError ? errorMessage : undefined);

    useEffect(() => {
        setInputValue(uenighet.value || '');
        if (uenighet.value !== undefined) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    }, [uenighet.value]);

    const onCheckboxChange = e => {
        setChecked(e.target.checked);
        setError(undefined);
        if (e.target.checked) {
            uenighet.create(label, itemsForFeedback);
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
            <Checkbox label="Uenig" checked={checked} onChange={onCheckboxChange} />
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

FeedbackInput.propTypes = {
    label: PropTypes.string.isRequired,
    itemsForFeedback: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        })
    )
};

export default FeedbackInput;
