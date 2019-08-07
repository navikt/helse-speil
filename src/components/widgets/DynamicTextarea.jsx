import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Undertekst } from 'nav-frontend-typografi';
import './DynamicTextarea.less';

const lineHeight = 22;

const DynamicTextarea = ({
    name,
    value,
    placeholder,
    maxCharacters,
    disabled,
    forwardedRef,
    error,
    ...rest
}) => {
    const [rows, setRows] = useState(1);

    useEffect(() => {
        if (forwardedRef && forwardedRef.current) {
            setRows(Math.floor(forwardedRef.current.scrollHeight / lineHeight));
        }
    }, [value, forwardedRef]);

    return (
        <div className="DynamicTextarea">
            <textarea
                name={name}
                value={value}
                placeholder={placeholder}
                maxLength={maxCharacters}
                disabled={disabled}
                rows={rows}
                ref={forwardedRef}
                style={{
                    marginLeft: '0.5rem',
                    resize: 'none'
                }}
                {...rest}
            />
            {error && (
                <Undertekst className="skjemaelement__feilmelding">
                    {error}
                </Undertekst>
            )}
        </div>
    );
};

DynamicTextarea.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    maxCharacters: PropTypes.number,
    disabled: PropTypes.bool,
    forwardedRef: PropTypes.any,
    error: PropTypes.string
};

DynamicTextarea.defaultProps = {
    value: '',
    placeholder: '',
    maxCharacters: 2000,
    disabled: false
};

export default React.forwardRef((props, ref) => (
    <DynamicTextarea {...props} forwardedRef={ref} />
));
