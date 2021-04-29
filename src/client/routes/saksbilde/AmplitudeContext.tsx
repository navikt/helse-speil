import React, { PropsWithChildren, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import amplitude from 'amplitude-js';
import { amplitudeEnabled } from '../../featureToggles';
import { useAktivVedtaksperiode } from '../../state/tidslinje';

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

const åpneOppgave = (oppgaveId: string): Dayjs => {
    const key = `oppgave.${oppgaveId}.åpnet`;
    const åpnet = window.sessionStorage.getItem(key);
    if (åpnet) {
        return dayjs(åpnet);
    }
    const currentTime = dayjs();
    window.sessionStorage.setItem(key, currentTime.toISOString());
    return currentTime;
};

export const AmplitudeProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const aktivVedtaksperiode = useAktivVedtaksperiode();
    if (!aktivVedtaksperiode) throw Error('Mangler aktiv vedtaksperiode');

    const åpnet = åpneOppgave(aktivVedtaksperiode.oppgavereferanse!);

    const eventProperties = (begrunnelser: string[] | undefined = undefined) => ({
        varighet: dayjs().diff(åpnet!),
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
