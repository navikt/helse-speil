import dayjs, { Dayjs } from 'dayjs';
import React, { PropsWithChildren, ReactElement, useEffect } from 'react';

import { useBrukerGrupper } from '@/auth/brukerContext';
import { browserEnv, erDev, erProd } from '@/env';
import { getDefaultFilters } from '@/routes/oversikt/table/state/filter';
import { ActivePeriod } from '@/types/shared';
import * as amplitude from '@amplitude/analytics-browser';
import { AmplitudeContext } from '@io/amplitude/AmplitudeContext';
import { AmplitudeStorageHandler } from '@io/amplitude/AmplitudeStorageHandler';
import { Amplitude } from '@io/amplitude/types';
import { Egenskap, Kategori, Oppgaveegenskap } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { getOppgavereferanse } from '@state/selectors/period';
import { Maybe } from '@utils/ts';
import { isBeregnetPeriode } from '@utils/typeguards';

const amplitudeClient = erProd || erDev ? amplitude : undefined;

amplitudeClient?.init(browserEnv.NEXT_PUBLIC_AMPLITUDE_KEY ?? '', '', {
    serverUrl: 'https://amplitude.nav.no/collect',
    serverZone: 'EU',
    defaultTracking: false,
});

const getEventProperties = (
    period: Maybe<ActivePeriod>,
    openedTimestamp: Dayjs,
    grupper: string[],
    reasons?: Array<string>,
): Amplitude.EventProperties | Amplitude.EventPropertiesBeregnetPeriode => {
    if (isBeregnetPeriode(period)) {
        return {
            varighet: dayjs().diff(openedTimestamp, 'seconds'),
            warnings: period.varsler.map((it) => it.tittel),
            antallWarnings: period.varsler.length,
            begrunnelser: reasons,
            inntektstype: finnAlleIKategori(period.egenskaper, [Kategori.Inntektskilde])
                .map((it) => finnLabel(it.egenskap, grupper))
                .pop(),
            mottaker: finnAlleIKategori(period.egenskaper, [Kategori.Mottaker])
                .map((it) => finnLabel(it.egenskap, grupper))
                .pop(),
            oppgavetype: finnAlleIKategori(period.egenskaper, [Kategori.Oppgavetype])
                .map((it) => finnLabel(it.egenskap, grupper))
                .pop(),
            periodetype: finnAlleIKategori(period.egenskaper, [Kategori.Periodetype])
                .map((it) => finnLabel(it.egenskap, grupper))
                .pop(),
            egenskaper:
                finnAlleIKategori(period.egenskaper, [Kategori.Ukategorisert, Kategori.Status])?.map((it) =>
                    finnLabel(it.egenskap, grupper),
                ) ?? [],
        };
    } else {
        return {
            varighet: dayjs().diff(openedTimestamp),
            begrunnelser: reasons,
        };
    }
};

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
const finnAlleIKategori = (egenskaper: Oppgaveegenskap[], kategori: Kategori[]) =>
    egenskaper.filter((it) => kategori.includes(it.kategori));

const finnLabel = (egenskap: Egenskap, grupper: string[]) =>
    getDefaultFilters(grupper).find((it) => it.key === egenskap)?.label ?? egenskap.toString();

const useLogEvent = (): ((event: Amplitude.LogEvent, begrunnelser?: Array<string>) => void) => {
    const activePeriod = useActivePeriod();
    const oppgavereferanse = getOppgavereferanse(activePeriod);
    const grupper = useBrukerGrupper();

    return async (event: Amplitude.LogEvent, begrunnelser?: string[]) => {
        if (oppgavereferanse) {
            const åpnetTidspunkt = AmplitudeStorageHandler.getÅpnetOppgaveTidspunkt(oppgavereferanse);

            if (åpnetTidspunkt) {
                await amplitudeClient?.track(
                    event,
                    getEventProperties(activePeriod, åpnetTidspunkt, grupper, begrunnelser),
                ).promise;
                AmplitudeStorageHandler.removeÅpnetOppgaveTidspunkt(oppgavereferanse);
            }
        }
    };
};

const _AmplitudeProvider = ({ children }: PropsWithChildren): ReactElement => {
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

export const AmplitudeProvider = ({ children }: PropsWithChildren): ReactElement => {
    return (
        <React.Suspense fallback={<>{children}</>}>
            <_AmplitudeProvider>{children}</_AmplitudeProvider>
        </React.Suspense>
    );
};
