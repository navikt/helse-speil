import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const EasterEggContext = createContext({
    isActive: false,
    activate: () => {},
    deactivate: () => {}
});

export const EasterEggProvider = ({ children }) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <EasterEggContext.Provider
            value={{
                isActive,
                activate: () => setIsActive(true),
                deactivate: () => setIsActive(false)
            }}
        >
            {children}
        </EasterEggContext.Provider>
    );
};

EasterEggProvider.propTypes = {
    children: PropTypes.node
};
