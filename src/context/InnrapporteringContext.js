import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { withBehandlingContext } from './BehandlingerContext';

export const InnrapporteringContext = createContext({
    uenigheter: []
});

export const InnrapporteringProvider = withBehandlingContext(
    ({ behandling, children }) => {
        const behandlingsId = behandling && behandling.behandlingsId;
        const [uenigheter, setUenigheter] = useSessionStorage(
            `uenigheter-${behandlingsId}`,
            []
        );

        const removeUenighet = id => {
            setUenigheter(uenigheter =>
                uenigheter.filter(uenighet => uenighet.id !== id)
            );
        };

        const addUenighet = (id, label) => {
            if (!uenigheter.find(uenighet => uenighet.id === id)) {
                setUenigheter(uenigheter => [...uenigheter, { id, label }]);
            }
        };

        const updateUenighet = (id, value) => {
            setUenigheter(uenigheter =>
                uenigheter.map(uenighet =>
                    uenighet.id === id ? { ...uenighet, value } : uenighet
                )
            );
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
    }
);

InnrapporteringProvider.propTypes = {
    children: PropTypes.node.isRequired
};
