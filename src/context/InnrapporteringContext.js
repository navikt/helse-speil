import React, { createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { withBehandlingContext } from './BehandlingerContext';
import { AuthContext } from './AuthContext';
import { getFeedback } from '../io/http';
import moment from 'moment';

export const InnrapporteringContext = createContext({
    uenigheter: [],
    kommentarer: ''
});

export const InnrapporteringProvider = withBehandlingContext(({ behandling, children }) => {
    const authContext = useContext(AuthContext);
    const behandlingsId = behandling?.behandlingsId;
    const [hasSendt, setHasSendt] = useSessionStorage('harSendtUenigheter');
    const [kommentarer, setKommentarer] = useSessionStorage('kommentarer');
    const [uenigheter, setUenigheter] = useSessionStorage(`uenigheter-${behandlingsId}`, []);

    useEffect(() => {
        if (behandlingsId !== undefined) {
            fetchFeedback(behandlingsId);
        }
    }, [behandlingsId]);

    const fetchFeedback = behandlingsId => {
        return getFeedback(behandlingsId)
            .then(response => {
                if (response.status === 200) {
                    setUenigheter(response.data.uenigheter ?? []);
                    setKommentarer(response.data.kommentarer);
                }
            })
            .catch(err => {
                console.log(err); // eslint-disable-line no-console
            });
    };

    const removeUenighet = id => {
        setHasSendt(false);
        setUenigheter(uenigheter => uenigheter.filter(uenighet => uenighet.id !== id));
    };

    const addUenighet = (id, label, items) => {
        setHasSendt(false);
        if (!uenigheter.find(uenighet => uenighet.id === id)) {
            setUenigheter(uenigheter => [
                ...uenigheter,
                {
                    id,
                    label,
                    items,
                    value: '',
                    userId: {
                        ident: authContext.authInfo.ident,
                        email: authContext.authInfo.email
                    },
                    date: moment().format()
                }
            ]);
        }
    };

    const updateUenighet = (id, value) => {
        setHasSendt(false);
        setUenigheter(uenigheter =>
            uenigheter.map(uenighet => (uenighet.id === id ? { ...uenighet, value } : uenighet))
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
                fetchFeedback,
                setKommentarer: val => {
                    setHasSendt(false);
                    setKommentarer(val);
                }
            }}
        >
            {children}
        </InnrapporteringContext.Provider>
    );
});

InnrapporteringProvider.propTypes = {
    children: PropTypes.node.isRequired
};
