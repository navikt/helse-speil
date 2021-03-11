import React, { PropsWithChildren, useEffect } from 'react';
import dayjs from 'dayjs';
import amplitude from 'amplitude-js';
import { amplitudeEnabled } from '../../featureToggles';
import { useAktivVedtaksperiode } from '../../state/vedtaksperiode';

amplitudeEnabled &&
    amplitude?.getInstance().init('default', '', {
        apiEndpoint: 'amplitude.nav.no/collect-auto',
        saveEvents: false,
        platform: window.location.origin.toString(),
    });

interface AmplitudeContextValue {
    logOppgaveGodkjent: () => void;
    logOppgaveForkastet: (begrunnelser: string[]) => void;
}

export const AmplitudeContext = React.createContext<AmplitudeContextValue>({
    logOppgaveGodkjent(): void {},
    logOppgaveForkastet(): void {},
});

export const AmplitudeProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const aktivVedtaksperiode = useAktivVedtaksperiode();
    if (!aktivVedtaksperiode) throw Error('Mangler aktiv vedtaksperiode');

    const oppgaveÅpnet = dayjs();

    const eventProperties = (begrunnelser: string[] | undefined = undefined) => ({
        varighet: dayjs().diff(oppgaveÅpnet),
        type: aktivVedtaksperiode.periodetype,
        inntektskilde: aktivVedtaksperiode.inntektskilde,
        warnings: aktivVedtaksperiode.aktivitetslog,
        antallWarnings: aktivVedtaksperiode.aktivitetslog.length,
        begrunnelser: begrunnelser,
    });

    const logOppgaveGodkjent = () => {
        amplitudeEnabled && amplitude?.getInstance().logEvent('oppgave godkjent', eventProperties());
    };

    const logOppgaveForkastet = (begrunnelser: string[]) => {
        amplitudeEnabled && amplitude?.getInstance().logEvent('oppgave forkastet', eventProperties(begrunnelser));
    };

    useEffect(() => {
        amplitudeEnabled &&
            amplitude?.getInstance().setUserProperties({
                skjermbredde: window.screen.width,
            });
    }, []);

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
