import React, { createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { withBehandlingContext } from './BehandlingerContext';
import { AuthContext } from './AuthContext';
import { getFeedback } from '../io/http';

export const InnrapporteringContext = createContext({
    uenigheter: []
});

export const InnrapporteringProvider = withBehandlingContext(
    ({ behandling, children }) => {
        const authContext = useContext(AuthContext);
        const behandlingsId = behandling && behandling.behandlingsId;
        const [hasSendt, setHasSendt] = useSessionStorage('harSendtUenigheter');
        const [kommentarer, setKommentarer] = useSessionStorage('kommentarer');
        const [uenigheter, setUenigheter] = useSessionStorage(
            `uenigheter-${behandlingsId}`,
            []
        );

        useEffect(() => {
            behandling &&
                getFeedback(behandlingsId)
                    .then(response => {
                        if (response.status === 200) {
                            setUenigheter(response.data.uenigheter);
                            setKommentarer(response.data.kommentarer);
                        }
                    })
                    .catch(err => {
                        console.log(err); // eslint-disable-line no-console
                    });
        }, [behandling]);

        const removeUenighet = id => {
            setHasSendt(false);
            setUenigheter(uenigheter =>
                uenigheter.filter(uenighet => uenighet.id !== id)
            );
        };

        const addUenighet = (id, label) => {
            setHasSendt(false);
            if (!uenigheter.find(uenighet => uenighet.id === id)) {
                setUenigheter(uenigheter => [
                    ...uenigheter,
                    {
                        id,
                        label,
                        value: '',
                        userId: {
                            ident: authContext.authInfo.ident,
                            email: authContext.authInfo.email
                        }
                    }
                ]);
            }
        };

        const updateUenighet = (id, value) => {
            setHasSendt(false);
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
                    updateUenighet,
                    hasSendt,
                    setHasSendt,
                    kommentarer,
                    setKommentarer
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
