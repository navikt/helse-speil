import React, { PropsWithChildren } from 'react';
import dayjs from 'dayjs';
import amplitude from 'amplitude-js';
import { amplitudeEnabled } from '../../featureToggles';

amplitudeEnabled &&
    amplitude?.getInstance().init('default', '', {
        apiEndpoint: 'amplitude.nav.no/collect-auto',
        saveEvents: false,
        platform: window.location.toString(),
    });

interface AmplitudeContextValue {
    logOppgaveGodkjent: () => void;
    logOppgaveForkastet: () => void;
}

export const AmplitudeContext = React.createContext<AmplitudeContextValue>({
    logOppgaveGodkjent(): void {},
    logOppgaveForkastet(): void {},
});

export const AmplitudeProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const oppgaveÅpnet = dayjs();

    const logOppgaveGodkjent = () => {
        amplitudeEnabled &&
            amplitude?.getInstance().logEvent('oppgave godkjent', {
                åpnet: oppgaveÅpnet.toDate(),
                godkjent: dayjs().toDate(),
            });
    };

    const logOppgaveForkastet = () => {
        amplitudeEnabled &&
            amplitude?.getInstance().logEvent('oppgave forkastet', {
                åpnet: oppgaveÅpnet.toDate(),
                forkastet: dayjs().toDate(),
            });
    };

    return (
        <AmplitudeContext.Provider
            value={{
                logOppgaveGodkjent: logOppgaveGodkjent,
                logOppgaveForkastet: logOppgaveForkastet,
            }}
        >
            {children}
        </AmplitudeContext.Provider>
    );
};
