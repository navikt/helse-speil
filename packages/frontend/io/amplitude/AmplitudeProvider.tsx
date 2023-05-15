import amplitude from 'amplitude-js';
import dayjs, { Dayjs } from 'dayjs';
import React, { PropsWithChildren, useEffect } from 'react';

import { AmplitudeContext } from '@io/amplitude/AmplitudeContext';
import { AmplitudeStorageHandler } from '@io/amplitude/AmplitudeStorageHandler';
import { Periode } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { getOppgavereferanse } from '@state/selectors/period';
import { isBeregnetPeriode } from '@utils/typeguards';

amplitude?.getInstance().init('default', '', {
    apiEndpoint: 'amplitude.nav.no/collect-auto',
    saveEvents: false,
    platform: window.location.origin.toString(),
});

const logEventCallback = (oppgaveId: string) => () => AmplitudeStorageHandler.removeÅpnetOppgaveTidspunkt(oppgaveId);

const useStoreÅpnetTidspunkt = () => {
    const activePeriod = useActivePeriod();
    const oppgavereferanse = getOppgavereferanse(activePeriod);

    useEffect(() => {
        if (oppgavereferanse) {
            const åpnetTidspunkt = AmplitudeStorageHandler.getÅpnetOppgaveTidspunkt(oppgavereferanse);
            if (!åpnetTidspunkt) {
                AmplitudeStorageHandler.setÅpnetOppgavetidspunkt(oppgavereferanse);
            }
        }
    }, [oppgavereferanse]);
};

const getEventProperties = (
    period: Maybe<Periode | GhostPeriode>,
    openedTimestamp: Dayjs,
    reasons?: Array<string>,
): Amplitude.EventProperties | Amplitude.EventPropertiesBeregnetPeriode => {
    if (isBeregnetPeriode(period)) {
        return {
            varighet: dayjs().diff(openedTimestamp),
            type: period.periodetype,
            inntektskilde: period.inntektstype,
            warnings: period.aktivitetslogg.map((it) => it.melding),
            antallWarnings: period.aktivitetslogg.length,
            begrunnelser: reasons,
        };
    } else {
        return {
            varighet: dayjs().diff(openedTimestamp),
            begrunnelser: reasons,
        };
    }
};

const useLogEvent = (): ((event: Amplitude.LogEvent, begrunnelser?: Array<string>) => void) => {
    const activePeriod = useActivePeriod();
    const oppgavereferanse = getOppgavereferanse(activePeriod);

    return (event: Amplitude.LogEvent, begrunnelser?: string[]) => {
        if (oppgavereferanse) {
            const åpnetTidspunkt = AmplitudeStorageHandler.getÅpnetOppgaveTidspunkt(oppgavereferanse);

            åpnetTidspunkt &&
                amplitude
                    ?.getInstance()
                    .logEvent(
                        event,
                        getEventProperties(activePeriod, åpnetTidspunkt, begrunnelser),
                        logEventCallback(oppgavereferanse),
                    );
        }
    };
};

const _AmplitudeProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    useStoreÅpnetTidspunkt();

    const logEvent = useLogEvent();

    const logOppgaveGodkjent = (erBeslutteroppgave: boolean) =>
        logEvent(erBeslutteroppgave ? 'totrinnsoppgave attestert' : 'oppgave godkjent');

    const logOppgaveForkastet = (begrunnelser: string[]) => logEvent('oppgave forkastet', begrunnelser);

    const logTotrinnsoppgaveReturnert = () => logEvent('totrinnsoppgave returnert');

    const logTotrinnsoppgaveTilGodkjenning = () => logEvent('totrinnsoppgave til godkjenning');

    useEffect(() => {
        amplitude?.getInstance().setUserProperties({
            skjermbredde: window.screen.width,
        });
    }, []);

    return (
        <AmplitudeContext.Provider
            value={{
                logOppgaveGodkjent: logOppgaveGodkjent,
                logOppgaveForkastet: logOppgaveForkastet,
                logTotrinnsoppgaveReturnert: logTotrinnsoppgaveReturnert,
                logTotrinnsoppgaveTilGodkjenning: logTotrinnsoppgaveTilGodkjenning,
            }}
        >
            {children}
        </AmplitudeContext.Provider>
    );
};

export const AmplitudeProvider: React.FC<ChildrenProps> = ({ children }) => {
    return (
        <React.Suspense fallback={<>{children}</>}>
            <_AmplitudeProvider>{children}</_AmplitudeProvider>
        </React.Suspense>
    );
};
