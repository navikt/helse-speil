import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { withBehandlingContext } from './BehandlingerContext';
import { AuthContext } from './AuthContext';
import { getFeedback } from '../io/http';
import moment from 'moment';

export const InnrapporteringContext = createContext({
    uenigheter: [],
    kommentarer: '',
    godkjent: true
});

export const InnrapporteringProvider = withBehandlingContext(({ behandling, children }) => {
    const authContext = useContext(AuthContext);
    const behandlingsId = behandling?.behandlingsId;
    const [hasSendt, setHasSendt] = useSessionStorage('harSendtUenigheter');
    const [kommentarer, setKommentarer] = useSessionStorage('kommentarer');
    const [uenigheter, setUenigheter] = useSessionStorage(`uenigheter-${behandlingsId}`, []);
    const [godkjent, setGodkjent] = useSessionStorage('godkjent');

    const fetchFeedback = behandlingsId => {
        return getFeedback(behandlingsId)
            .then(response => {
                if (response.status === 200) {
                    setUenigheter(response.data.uenigheter ?? []);
                    setKommentarer(response.data.kommentarer);
                    setGodkjent(response.data.godkjent ?? !(response.data.uenigheter?.length > 0));
                }
            })
            .catch(err => {
                console.log(err); // eslint-disable-line no-console
            });
    };

    const removeUenighet = id => {
        setHasSendt(false);
        const filteredUenigheter = uenigheter.filter(uenighet => uenighet.id !== id);
        setUenigheter(filteredUenigheter);

        if (filteredUenigheter.length === 0) {
            setGodkjent(true);
        }
    };

    const addUenighet = (id, label, items) => {
        setHasSendt(false);
        setGodkjent(false);
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
                godkjent,
                setGodkjent,
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
