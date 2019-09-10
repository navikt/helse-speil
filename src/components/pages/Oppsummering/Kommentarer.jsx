import React, { useContext } from 'react';
import DynamicTextarea from '../../widgets/DynamicTextarea';
import { Normaltekst } from 'nav-frontend-typografi';
import { InnrapporteringContext } from '../../../context/InnrapporteringContext';

const Kommentarer = () => {
    const innrapportering = useContext(InnrapporteringContext);

    const onChange = e => {
        innrapportering.setKommentarer(e.target.value);
    };

    return (
        <>
            <Normaltekst className="Innrapportering__feedback">Andre kommentarer</Normaltekst>
            <DynamicTextarea
                className="skjemaelement__input skjemaelement"
                name="tilbakemelding"
                value={innrapportering.kommentarer}
                onChange={onChange}
            />
        </>
    );
};

export default Kommentarer;
