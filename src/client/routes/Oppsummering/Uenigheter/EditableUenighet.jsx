import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import EditButton from './EditButton';
import { Keys } from '../../../hooks/useKeyboard';
import { Normaltekst } from 'nav-frontend-typografi';
import { oppsummeringstekster } from '../../../tekster';
import { InnrapporteringContext } from '../../../context/InnrapporteringContext';
import './EditableUenighet.less';
import DeleteButton from './DeleteButton';

const EditableUenighet = ({ uenighet }) => {
    const { updateUenighet, removeUenighet } = useContext(InnrapporteringContext);
    const [value, setValue] = useState(uenighet.value);
    const [isEditing, setIsEditing] = useState(false);

    const onChange = e => {
        setValue(e.target.value);
    };

    const onBlur = () => {
        if (value !== uenighet.value) {
            updateUenighet(uenighet.id, value);
        }
        setIsEditing(false);
    };

    const onKeyDown = e => {
        if (e.keyCode === Keys.ENTER) {
            onBlur();
        }
    };

    return (
        <>
            <Normaltekst className="EditableUenighet__label">{uenighet.label}:</Normaltekst>
            <span className="EditableUenighet__value">
                {isEditing ? (
                    <textarea
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        autoFocus={true}
                    />
                ) : (
                    <Normaltekst>{uenighet.value}</Normaltekst>
                )}
            </span>
            {!uenighet.value && (
                <span className="skjemaelement__feilmelding">
                    {oppsummeringstekster('oppgi_årsak')}
                </span>
            )}
            <span className="EditableUenighet__edit">
                <EditButton onClick={() => setIsEditing(!isEditing)} />
                <DeleteButton onDelete={() => removeUenighet(uenighet.id)} />
            </span>
        </>
    );
};

EditableUenighet.propTypes = {
    uenighet: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
        id: PropTypes.string
    })
};

export default EditableUenighet;
