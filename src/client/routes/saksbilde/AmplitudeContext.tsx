import amplitude from 'amplitude-js';
import dayjs, { Dayjs } from 'dayjs';
import React, { PropsWithChildren, useEffect } from 'react';

import { useAktivVedtaksperiode } from '../../state/tidslinje';

import { amplitudeEnabled } from '../../featureToggles';

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

const getÅpnetOppgaveTidspunkt = (oppgaveId: string): Dayjs => {
    const key = `oppgave.${oppgaveId}.åpnet`;
    const åpnet = window.sessionStorage.getItem(key);
    if (åpnet) {
        return dayjs(åpnet);
    }
    const currentTime = dayjs();
    window.sessionStorage.setItem(key, currentTime.toISOString());
    return currentTime;
};

const removeÅpnetOppgaveTidspunkt = (oppgaveId: string): void => {
    const key = `oppgave.${oppgaveId}.åpnet`;
    window.sessionStorage.removeItem(key);
};

const logEventCallback = (oppgaveId: string) => () => removeÅpnetOppgaveTidspunkt(oppgaveId);

export const AmplitudeProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const aktivVedtaksperiode = useAktivVedtaksperiode();
    if (aktivVedtaksperiode === undefined) throw Error('Mangler aktiv vedtaksperiode');

    const åpnet = getÅpnetOppgaveTidspunkt(aktivVedtaksperiode.oppgavereferanse!);

    const eventProperties = (begrunnelser: string[] | undefined = undefined) => ({
        varighet: dayjs().diff(åpnet!),
        type: aktivVedtaksperiode.periodetype,
        inntektskilde: aktivVedtaksperiode.inntektskilde,
        warnings: aktivVedtaksperiode.aktivitetslog,
        antallWarnings: aktivVedtaksperiode.aktivitetslog.length,
        begrunnelser: begrunnelser,
    });

    const logOppgaveGodkjent = () => {
        amplitudeEnabled &&
            åpnet &&
            amplitude
                ?.getInstance()
                .logEvent(
                    'oppgave godkjent',
                    eventProperties(),
                    logEventCallback(aktivVedtaksperiode.oppgavereferanse!)
                );
    };

    const logOppgaveForkastet = (begrunnelser: string[]) => {
        amplitudeEnabled &&
            åpnet &&
            amplitude
                ?.getInstance()
                .logEvent(
                    'oppgave forkastet',
                    eventProperties(begrunnelser),
                    logEventCallback(aktivVedtaksperiode.oppgavereferanse!)
                );
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
