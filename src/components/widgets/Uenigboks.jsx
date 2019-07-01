import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Input } from 'nav-frontend-skjema';
import './Uenigboks.css';

// Override proptypes til Input for å kunne gi en ref som parameter til inputRef
Input.propTypes = {
    ...Input.propTypes,
    inputRef: PropTypes.any
};

const Uenigboks = () => {
    const ref = useRef();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (checked && ref.current) {
            ref.current.focus();
        }
    }, [checked]);

    return (
        <div className="Uenigboks">
            <Checkbox
                label="Uenig"
                checked={checked}
                onChange={e => setChecked(e.target.checked)}
            />
            <Input
                className="Uenigboks__input"
                label="Årsak"
                placeholder="Skriv inn årsak til uenighet"
                inputRef={ref}
                disabled={!checked}
            />
        </div>
    );
};

export default Uenigboks;
