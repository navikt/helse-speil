import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const lineHeight = 22;

const DynamicTextarea = ({
    name,
    value,
    placeholder,
    maxCharacters,
    disabled,
    forwardedRef,
    ...rest
}) => {
    const [rows, setRows] = useState(1);

    useEffect(() => {
        if (forwardedRef && forwardedRef.current) {
            setRows(Math.floor(forwardedRef.current.scrollHeight / lineHeight));
        }
    }, [value, forwardedRef]);

    return (
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
                resize: disabled ? 'none' : ''
            }}
            {...rest}
        />
    );
};

DynamicTextarea.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    maxCharacters: PropTypes.number,
    disabled: PropTypes.bool,
    forwardedRef: PropTypes.any
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
