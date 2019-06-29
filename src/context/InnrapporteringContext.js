import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const InnrapporteringContext = createContext({
    uenigheter: []
});

export const InnrapporteringProvider = ({ children }) => {
    const [uenigheter, setUenigheter] = useState([]);

    const removeUenighet = id => {
        setUenigheter(uenigheter => (
            uenigheter.filter(uenighet => uenighet.id !== id)
        ));
    };

    const addUenighet = id => {
        if (!uenigheter.find(uenighet => uenighet.id === id)) {
            setUenigheter(uenigheter => [...uenigheter, { id }]);
        }
    };

    const updateUenighet = (id, value) => {
        setUenigheter(uenigheter => (
            uenigheter.map(uenighet => (
                uenighet.id === id
                    ? { ...uenighet, value }
                    : uenighet
            ))
        ));
    };

    return (
        <InnrapporteringContext.Provider
            value={{
                uenigheter,
                setUenigheter,
                removeUenighet,
                addUenighet,
                updateUenighet
            }}
        >
            {children}
        </InnrapporteringContext.Provider>
    );
};

InnrapporteringProvider.propTypes = {
    children: PropTypes.node.isRequired
};
