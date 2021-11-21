import amplitude from 'amplitude-js';
import dayjs, { Dayjs } from 'dayjs';
import React, { PropsWithChildren, useEffect } from 'react';

import { useMaybeAktivPeriode, useVedtaksperiode } from '../../state/tidslinje';

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

const getKey = (oppgaveId: string): string => `oppgave.${oppgaveId}.åpnet`;

const setÅpnetOppgavetidspunkt = (oppgaveId: string): void => {
    window.sessionStorage.setItem(getKey(oppgaveId), dayjs().toISOString());
};

const getÅpnetOppgaveTidspunkt = (oppgaveId: string): Dayjs | undefined => {
    const åpnet = window.sessionStorage.getItem(getKey(oppgaveId));
    return åpnet ? dayjs(åpnet) : undefined;
};

const removeÅpnetOppgaveTidspunkt = (oppgaveId: string): void => {
    const key = `oppgave.${oppgaveId}.åpnet`;
    window.sessionStorage.removeItem(key);
};

const logEventCallback = (oppgaveId: string) => () => removeÅpnetOppgaveTidspunkt(oppgaveId);

const useStoreÅpnetTidspunkt = (oppgavereferanse?: string) => {
    useEffect(() => {
        if (oppgavereferanse) {
            const åpnetTidspunkt = getÅpnetOppgaveTidspunkt(oppgavereferanse);
            if (!åpnetTidspunkt) {
                setÅpnetOppgavetidspunkt(oppgavereferanse);
            }
        }
    }, [oppgavereferanse]);
};

export const AmplitudeProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const aktivPeriode = useMaybeAktivPeriode();
    if (aktivPeriode === undefined) throw Error('Mangler aktiv vedtaksperiode');
    const vedtaksperiode = useVedtaksperiode(aktivPeriode?.id);

    useStoreÅpnetTidspunkt(vedtaksperiode?.oppgavereferanse);

    const eventProperties = (åpnetTidspunkt: Dayjs, begrunnelser: string[] | undefined = undefined) => ({
        varighet: dayjs().diff(åpnetTidspunkt),
        type: vedtaksperiode?.periodetype,
        inntektskilde: vedtaksperiode?.inntektskilde,
        warnings: vedtaksperiode?.aktivitetslog,
        antallWarnings: vedtaksperiode?.aktivitetslog.length,
        begrunnelser: begrunnelser,
    });

    const logEvent = (event: 'oppgave godkjent' | 'oppgave forkastet', begrunnelser?: string[]) => {
        if (amplitudeEnabled && vedtaksperiode?.oppgavereferanse) {
            const åpnetTidspunkt = getÅpnetOppgaveTidspunkt(vedtaksperiode.oppgavereferanse);

            åpnetTidspunkt &&
                amplitude
                    ?.getInstance()
                    .logEvent(
                        event,
                        eventProperties(åpnetTidspunkt, begrunnelser),
                        logEventCallback(vedtaksperiode.oppgavereferanse!)
                    );
        }
    };

    const logOppgaveGodkjent = () => logEvent('oppgave godkjent');

    const logOppgaveForkastet = (begrunnelser: string[]) => logEvent('oppgave forkastet', begrunnelser);

    // useEffect(() => {
    //     amplitudeEnabled &&
    //         amplitude?.getInstance().setUserProperties({
    //             skjermbredde: window.screen.width,
    //         });
    // }, []);

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
