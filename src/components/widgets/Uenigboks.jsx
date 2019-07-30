import React, { useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import DynamicTextarea from './DynamicTextarea';
import { Checkbox } from 'nav-frontend-skjema';
import { InnrapporteringContext } from '../../context/InnrapporteringContext';
import { useFocusRef } from '../../hooks/useFocusRef';
import './Uenigboks.css';

const Uenigboks = ({ label }) => {
    const id = label + decodeURIComponent(window.location.pathname);
    const innrapportering = useContext(InnrapporteringContext);

    const uenighet = useMemo(
        () => innrapportering.uenigheter.find(uenighet => uenighet.id === id),
        [innrapportering.uenigheter]
    );

    const [checked, setChecked] = useState(!!uenighet);
    const [inputValue, setInputValue] = useState(
        uenighet ? uenighet.value : ''
    );
    const ref = useFocusRef(checked && inputValue === '');

    useEffect(() => {
        if (uenighet) {
            setChecked(true);
            setInputValue(uenighet.value || '');
        }
    }, [uenighet]);

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
            <DynamicTextarea
                name="Årsak"
                className="Uenigboks__input skjemaelement skjemaelement__input"
                placeholder="Skriv inn årsak til uenighet"
                disabled={!checked}
                onChange={onInputChange}
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
