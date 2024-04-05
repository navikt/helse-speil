import dayjs, { Dayjs } from 'dayjs';
import React, { PropsWithChildren, useEffect } from 'react';

import * as amplitude from '@amplitude/analytics-browser';
import { AmplitudeContext } from '@io/amplitude/AmplitudeContext';
import { AmplitudeStorageHandler } from '@io/amplitude/AmplitudeStorageHandler';
import { Egenskap, Kategori, Oppgaveegenskap, Periode } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { getOppgavereferanse } from '@state/selectors/period';
import { erDev, erProd } from '@utils/featureToggles';
import { isBeregnetPeriode } from '@utils/typeguards';

import { defaultFilters } from '../../routes/oversikt/table/state/filter';

const apiKey = erProd() ? '4000b8a4a426b0dbefbe011778062779' : '27bc226964689268f3258512c10dc2a1';

const amplitudeClient = erProd() || erDev() ? amplitude : undefined;

amplitudeClient?.init(apiKey, '', {
    serverUrl: 'https://amplitude.nav.no/collect',
    serverZone: 'EU',
    defaultTracking: false,
});

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
            varighet: dayjs().diff(openedTimestamp, 'seconds'),
            warnings: period.varsler.map((it) => it.tittel),
            antallWarnings: period.varsler.length,
            begrunnelser: reasons,
            inntektstype: finnAlleIKategori(period.egenskaper, [Kategori.Inntektskilde])
                .map((it) => finnLabel(it.egenskap))
                .pop(),
            mottaker: finnAlleIKategori(period.egenskaper, [Kategori.Mottaker])
                .map((it) => finnLabel(it.egenskap))
                .pop(),
            oppgavetype: finnAlleIKategori(period.egenskaper, [Kategori.Oppgavetype])
                .map((it) => finnLabel(it.egenskap))
                .pop(),
            periodetype: finnAlleIKategori(period.egenskaper, [Kategori.Periodetype])
                .map((it) => finnLabel(it.egenskap))
                .pop(),
            egenskaper:
                finnAlleIKategori(period.egenskaper, [Kategori.Ukategorisert, Kategori.Status])?.map((it) =>
                    finnLabel(it.egenskap),
                ) ?? [],
        };
    } else {
        return {
            varighet: dayjs().diff(openedTimestamp),
            begrunnelser: reasons,
        };
    }
};
const finnAlleIKategori = (egenskaper: Oppgaveegenskap[], kategori: Kategori[]) =>
    egenskaper.filter((it) => kategori.includes(it.kategori));

const finnLabel = (egenskap: Egenskap) =>
    defaultFilters.find((it) => it.key === egenskap)?.label ?? egenskap.toString();

const useLogEvent = (): ((event: Amplitude.LogEvent, begrunnelser?: Array<string>) => void) => {
    const activePeriod = useActivePeriod();
    const oppgavereferanse = getOppgavereferanse(activePeriod);

    return async (event: Amplitude.LogEvent, begrunnelser?: string[]) => {
        if (oppgavereferanse) {
            const åpnetTidspunkt = AmplitudeStorageHandler.getÅpnetOppgaveTidspunkt(oppgavereferanse);

            if (åpnetTidspunkt) {
                await amplitudeClient?.track(event, getEventProperties(activePeriod, åpnetTidspunkt, begrunnelser))
                    .promise;
                AmplitudeStorageHandler.removeÅpnetOppgaveTidspunkt(oppgavereferanse);
            }
        }
    };
};

const _AmplitudeProvider: React.FC<PropsWithChildren<object>> = ({ children }) => {
    useStoreÅpnetTidspunkt();

    const logEvent = useLogEvent();

    const logOppgaveGodkjent = (erBeslutteroppgave: boolean) =>
        logEvent(erBeslutteroppgave ? 'totrinnsoppgave attestert' : 'oppgave godkjent');

    const logOppgaveForkastet = (begrunnelser: string[]) => logEvent('oppgave forkastet', begrunnelser);

    const logTotrinnsoppgaveReturnert = () => logEvent('totrinnsoppgave returnert');

    const logTotrinnsoppgaveTilGodkjenning = () => logEvent('totrinnsoppgave til godkjenning');

    const logAnnullert = (begrunnelser: string[]) => logEvent('annullert', begrunnelser);

    useEffect(() => {
        if (amplitudeClient === undefined) return;
        const identify = new amplitudeClient.Identify();
        identify.set('skjermbredde', window.screen.width);
        amplitude.identify(identify);
    }, []);

    return (
        <AmplitudeContext.Provider
            value={{
                logOppgaveGodkjent: logOppgaveGodkjent,
                logOppgaveForkastet: logOppgaveForkastet,
                logTotrinnsoppgaveReturnert: logTotrinnsoppgaveReturnert,
                logTotrinnsoppgaveTilGodkjenning: logTotrinnsoppgaveTilGodkjenning,
                logAnnullert: logAnnullert,
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
