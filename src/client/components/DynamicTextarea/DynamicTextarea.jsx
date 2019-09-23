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
    className,
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
                className={`${className} ${error ? ' error' : ''}`}
                name={name}
                value={value}
                placeholder={placeholder}
                maxLength={maxCharacters}
                disabled={disabled}
                rows={rows}
                ref={forwardedRef}
                style={{
                    resize: 'none'
                }}
                {...rest}
            />
            <div role="alert" aria-live="assertive">
                {error && <Undertekst className="skjemaelement__feilmelding">{error}</Undertekst>}
            </div>
        </div>
    );
};

DynamicTextarea.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    error: PropTypes.string,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    maxCharacters: PropTypes.number,
    forwardedRef: PropTypes.any,
    disabled: PropTypes.bool
};

DynamicTextarea.defaultProps = {
    value: '',
    className: '',
    placeholder: '',
    maxCharacters: 2000,
    disabled: false
};

export default React.forwardRef((props, ref) => <DynamicTextarea {...props} forwardedRef={ref} />);
