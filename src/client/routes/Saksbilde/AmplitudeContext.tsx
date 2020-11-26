import React, { PropsWithChildren, useContext } from 'react';
import dayjs from 'dayjs';
import amplitude from 'amplitude-js';
import { amplitudeEnabled } from '../../featureToggles';
import { PersonContext } from '../../context/PersonContext';

amplitudeEnabled &&
    amplitude?.getInstance().init('default', '', {
        apiEndpoint: 'amplitude.nav.no/collect-auto',
        saveEvents: false,
        platform: window.location.origin.toString(),
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
    const { aktivVedtaksperiode } = useContext(PersonContext);
    if (!aktivVedtaksperiode) throw Error('Mangler aktiv vedtaksperiode');

    const oppgaveÅpnet = dayjs();

    const eventProperties = () => ({
        varighet: dayjs().diff(oppgaveÅpnet),
        type: aktivVedtaksperiode.periodetype,
        warnings: aktivVedtaksperiode.aktivitetslog,
        antallWarnings: aktivVedtaksperiode.aktivitetslog.length,
    });

    const logOppgaveGodkjent = () => {
        amplitudeEnabled && amplitude?.getInstance().logEvent('oppgave godkjent', eventProperties());
    };

    const logOppgaveForkastet = () => {
        amplitudeEnabled && amplitude?.getInstance().logEvent('oppgave forkastet', eventProperties());
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
