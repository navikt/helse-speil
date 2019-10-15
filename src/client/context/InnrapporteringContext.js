import React, { createContext, useContext, useEffect, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { BehandlingerContext } from './BehandlingerContext';
import { getFeedback, getFeedbackList } from '../io/http';

export const InnrapporteringContext = createContext({
    uenigheter: [],
    kommentarer: '',
    godkjent: true,
    feedback: []
});

export const InnrapporteringProvider = ({ children }) => {
    const authContext = useContext(AuthContext);
    const { valgtBehandling, behandlingsoversikt } = useContext(BehandlingerContext);
    const [feedback, setFeedback] = useState([]);
    const [godkjent, setGodkjent] = useSessionStorage('godkjent');
    const [hasSendt, setHasSendt] = useSessionStorage('harSendtUenigheter');
    const [uenigheter, setUenigheter] = useSessionStorage(
        `uenigheter-${valgtBehandling?.behandlingsId}`,
        []
    );
    const [kommentarer, setKommentarer] = useSessionStorage('kommentarer');

    useEffect(() => {
        if (behandlingsoversikt.length > 0) {
            const behandlingIds = behandlingsoversikt.map(b => b.behandlingsId);
            fetchFeedbackList(behandlingIds);
        }
    }, [behandlingsoversikt]);

    useEffect(() => {
        if (valgtBehandling?.behandlingsId) {
            const feedbackInList = feedback.find(f => f.key === valgtBehandling.behandlingsId);
            if (feedbackInList === undefined) {
                fetchFeedback(valgtBehandling.behandlingsId);
            } else {
                setUenigheter(feedbackInList.value.uenigheter ?? []);
                setKommentarer(feedbackInList.value.kommentarer);
                setGodkjent(
                    feedbackInList.value.godkjent ?? !(feedbackInList.value.uenigheter?.length > 0)
                );
                setHasSendt(true);
            }
        }
    }, [valgtBehandling, feedback]);

    const fetchFeedback = behandlingsId => {
        return getFeedback(behandlingsId)
            .then(response => {
                if (response.status === 200) {
                    setUenigheter(response.data.uenigheter ?? []);
                    setKommentarer(response.data.kommentarer);
                    setGodkjent(response.data.godkjent ?? !(response.data.uenigheter?.length > 0));
                    setHasSendt(true);
                }
            })
            .catch(err => {
                console.log(err); // eslint-disable-line no-console
            });
    };

    const fetchFeedbackList = behandlingsIdList => {
        return getFeedbackList(behandlingsIdList)
            .then(response => {
                if (response.status === 200) {
                    setFeedback(response.data);
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
                removeUenighet,
                addUenighet,
                updateUenighet,
                hasSendt,
                setHasSendt,
                kommentarer,
                godkjent,
                setGodkjent,
                feedback,
                setKommentarer: val => {
                    setHasSendt(false);
                    setKommentarer(val);
                },
                resetUserFeedback: () => {
                    setUenigheter([]);
                    setHasSendt(false);
                    setKommentarer('');
                    setGodkjent(true);
                }
            }}
        >
            {children}
        </InnrapporteringContext.Provider>
    );
};

InnrapporteringProvider.propTypes = {
    children: PropTypes.node.isRequired
};
