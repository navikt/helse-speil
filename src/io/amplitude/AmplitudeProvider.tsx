import dayjs, { Dayjs } from 'dayjs';
import React, { PropsWithChildren, ReactElement, useEffect } from 'react';

import { browserEnv, erDev, erProd } from '@/env';
import * as amplitude from '@amplitude/analytics-browser';
import { useBrukerGrupper, useBrukerIdent } from '@auth/brukerContext';
import { AmplitudeContext } from '@io/amplitude/AmplitudeContext';
import { AmplitudeStorageHandler } from '@io/amplitude/AmplitudeStorageHandler';
import { Kategori, Maybe, Oppgaveegenskap, PersonFragment } from '@io/graphql';
import { getDefaultFilters } from '@oversikt/table/state/filter';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { getOppgavereferanse } from '@state/selectors/period';
import { Amplitude } from '@typer/amplitude';
import { ActivePeriod } from '@typer/shared';
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
    ident: string,
    reasons?: Array<string>,
): Amplitude.EventProperties | Amplitude.EventPropertiesBeregnetPeriode => {
    if (isBeregnetPeriode(period)) {
        return {
            varighet: dayjs().diff(openedTimestamp, 'seconds'),
            warnings: period.varsler.map((it) => it.tittel),
            antallWarnings: period.varsler.length,
            begrunnelser: reasons,
            inntektstype: finnAlleIKategori(period.egenskaper, [Kategori.Inntektskilde])
                .map((it) => finnLabel(it.egenskap, grupper, ident))
                .pop(),
            mottaker: finnAlleIKategori(period.egenskaper, [Kategori.Mottaker])
                .map((it) => finnLabel(it.egenskap, grupper, ident))
                .pop(),
            oppgavetype: finnAlleIKategori(period.egenskaper, [Kategori.Oppgavetype])
                .map((it) => finnLabel(it.egenskap, grupper, ident))
                .pop(),
            periodetype: finnAlleIKategori(period.egenskaper, [Kategori.Periodetype])
                .map((it) => finnLabel(it.egenskap, grupper, ident))
                .pop(),
            egenskaper:
                finnAlleIKategori(period.egenskaper, [Kategori.Ukategorisert, Kategori.Status])?.map((it) =>
                    finnLabel(it.egenskap, grupper, ident),
                ) ?? [],
        };
    } else {
        return {
            varighet: dayjs().diff(openedTimestamp),
            begrunnelser: reasons,
        };
    }
};

const useStoreÅpnetTidspunkt = (person: Maybe<PersonFragment>) => {
    const activePeriod = useActivePeriod(person);
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

const finnAlleIKategori = (egenskaper: Oppgaveegenskap[], kategori: Kategori[]): Oppgaveegenskap[] =>
    egenskaper.filter((it) => kategori.includes(it.kategori));

const finnLabel = (egenskap: string, grupper: string[], ident: string): string =>
    getDefaultFilters(grupper, ident).find((it) => it.key === egenskap)?.label ?? egenskap.toString();

const useLogEvent = (
    person: Maybe<PersonFragment>,
): ((event: Amplitude.LogEvent, begrunnelser?: Array<string>) => void) => {
    const activePeriod = useActivePeriod(person);
    const oppgavereferanse = getOppgavereferanse(activePeriod);
    const grupper = useBrukerGrupper();
    const ident = useBrukerIdent();

    return async (event: Amplitude.LogEvent, begrunnelser?: string[]) => {
        if (oppgavereferanse) {
            const åpnetTidspunkt = AmplitudeStorageHandler.getÅpnetOppgaveTidspunkt(oppgavereferanse);

            if (åpnetTidspunkt) {
                await amplitudeClient?.track(
                    event,
                    getEventProperties(activePeriod, åpnetTidspunkt, grupper, ident, begrunnelser),
                ).promise;
                AmplitudeStorageHandler.removeÅpnetOppgaveTidspunkt(oppgavereferanse);
            }
        }
    };
};

const AmplitudeProviderComponent = ({ children }: PropsWithChildren): ReactElement => {
    const { data } = useFetchPersonQuery();
    const person = data?.person ?? null;

    useStoreÅpnetTidspunkt(person);

    const logEvent = useLogEvent(person);

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
            <AmplitudeProviderComponent>{children}</AmplitudeProviderComponent>
        </React.Suspense>
    );
};
