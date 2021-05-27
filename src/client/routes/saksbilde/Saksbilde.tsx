import styled from '@emotion/styled';
import { Person, UfullstendigVedtaksperiode, Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { LoggHeader as EksternLoggheader } from '@navikt/helse-frontend-logg';
import '@navikt/helse-frontend-logg/lib/main.css';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';

import { ErrorBoundary } from '../../components/ErrorBoundary';
import { LasterPersonlinje, Personlinje } from '../../components/Personlinje';
import { copyString } from '../../components/clipboard/util';
import { Key, useKeyboard } from '../../hooks/useKeyboard';
import { useNavigation } from '../../hooks/useNavigation';
import { useRefreshPersonVedOpptegnelse } from '../../hooks/useRefreshPersonVedOpptegnelse';
import { useRefreshPersonVedUrlEndring } from '../../hooks/useRefreshPersonVedUrlEndring';
import { usePollEtterOpptegnelser } from '../../io/polling';
import { erTidslinjeperiode, Tidslinjeperiode } from '../../modell/UtbetalingshistorikkElement';
import { usePerson } from '../../state/person';
import { useAktivPeriode } from '../../state/tidslinje';
import { ToastObject, useAddToast } from '../../state/toasts';
import { Scopes, useVarselFilter } from '../../state/varsler';

import { LoggProvider } from './logg/LoggProvider';
import { SaksbildeRevurdering } from './saksbilder/SaksbildeRevurdering';
import { TomtSaksbilde } from './saksbilder/SaksbildeTomt';
import { SaksbildeUfullstendigVedtaksperiode } from './saksbilder/SaksbildeUfullstendigVedtaksperiode';
import { SaksbildeVedtaksperiode } from './saksbilder/SaksbildeVedtaksperiode';
import { LasterTidslinje, Tidslinje } from './tidslinje';

export const getErrorMelding = (tilstand: Vedtaksperiodetilstand) => {
    const vedtaksperiodetilstandErrorMessage = getVedtaksperiodeTilstandError(tilstand);
    return (error: Error) => {
        return vedtaksperiodetilstandErrorMessage ? (
            vedtaksperiodetilstandErrorMessage
        ) : (
            <Varsel type={Varseltype.Feil}>{error.message}</Varsel>
        );
    };
};

export const getVedtaksperiodeTilstandError = (tilstand: Vedtaksperiodetilstand) => {
    switch (tilstand) {
        case Vedtaksperiodetilstand.Venter:
            return (
                <Varsel type={Varseltype.Info}>
                    Kunne ikke vise informasjon om vedtaksperioden. Dette skyldes at perioden ikke er klar til
                    behandling.
                </Varsel>
            );
        case Vedtaksperiodetilstand.KunFerie:
            return (
                <Varsel type={Varseltype.Info}>
                    Kunne ikke vise informasjon om vedtaksperioden. Perioden inneholder kun ferie.
                </Varsel>
            );
        case Vedtaksperiodetilstand.KunPermisjon:
            return (
                <Varsel type={Varseltype.Info}>
                    Kunne ikke vise informasjon om vedtaksperioden. Perioden inneholder kun permisjon.
                </Varsel>
            );
        case Vedtaksperiodetilstand.IngenUtbetaling:
            return (
                <Varsel type={Varseltype.Info}>
                    Kunne ikke vise informasjon om vedtaksperioden. Perioden har ingen utbetaling.
                </Varsel>
            );
        case Vedtaksperiodetilstand.VenterPåKiling:
            return <Varsel type={Varseltype.Info}>Ikke klar til behandling - avventer system.</Varsel>;
        case Vedtaksperiodetilstand.Ukjent:
            return <Varsel type={Varseltype.Feil}>Kunne ikke lese informasjon om sakens tilstand.</Varsel>;
        default:
            return undefined;
    }
};

const SaksbildeContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
`;

export const LoggHeader = styled(EksternLoggheader)`
    width: 336px;
    box-sizing: border-box;
    box-shadow: inset 0 -1px 0 0 var(--navds-color-border);
    height: 75px;

    & > button {
        min-height: 75px;
    }
`;

export const kopiertFødelsnummerToast = ({
    message = 'Fødselsnummer er kopiert',
    timeToLiveMs = 3000,
}: Partial<ToastObject>): ToastObject => ({
    key: 'kopierFødselsnummerToastKey',
    message,
    timeToLiveMs,
});

interface SaksbildeSwitchProps {
    personTilBehandling: Person;
}

const SaksbildeSwitch = ({ personTilBehandling }: SaksbildeSwitchProps) => {
    const aktivPeriode: Vedtaksperiode | UfullstendigVedtaksperiode | Tidslinjeperiode | undefined = useAktivPeriode();
    const { navigateToNext, navigateToPrevious } = useNavigation();
    const clickPrevious = () => navigateToPrevious?.();
    const clickNext = () => navigateToNext?.();
    const addToast = useAddToast();
    const copyFødselsnummer = () => {
        copyString(personTilBehandling?.fødselsnummer ?? '', false);
        addToast(kopiertFødelsnummerToast({}));
    };
    const { path } = useRouteMatch();

    useKeyboard({
        [Key.Left]: { action: clickPrevious, ignoreIfModifiers: true },
        [Key.Right]: { action: clickNext, ignoreIfModifiers: true },
        [Key.C]: { action: copyFødselsnummer, ignoreIfModifiers: false },
    });

    if (!aktivPeriode) return <TomtSaksbilde />;

    if (erTidslinjeperiode(aktivPeriode)) {
        return <SaksbildeRevurdering aktivPeriode={aktivPeriode as Tidslinjeperiode} />;
    }
    return aktivPeriode.fullstendig ? (
        <SaksbildeVedtaksperiode
            personTilBehandling={personTilBehandling}
            aktivVedtaksperiode={aktivPeriode as Vedtaksperiode}
            path={path}
        />
    ) : (
        <SaksbildeUfullstendigVedtaksperiode aktivVedtaksperiode={aktivPeriode as UfullstendigVedtaksperiode} />
    );
};

export const Saksbilde = () => (
    <ErrorBoundary fallback={(error: Error) => <Varsel type={Varseltype.Advarsel}>{error.message}</Varsel>}>
        <React.Suspense fallback={<LasterSaksbilde />}>
            <LoggProvider>
                <SaksbildeContent />
            </LoggProvider>
        </React.Suspense>
    </ErrorBoundary>
);

const SaksbildeContent = () => {
    const personTilBehandling = usePerson();
    useRefreshPersonVedUrlEndring();
    useRefreshPersonVedOpptegnelse();
    usePollEtterOpptegnelser();
    useVarselFilter(Scopes.SAKSBILDE);

    if (!personTilBehandling) return <LasterSaksbilde />;
    return (
        <SaksbildeContainer className="saksbilde">
            <Personlinje person={personTilBehandling} />
            <Tidslinje person={personTilBehandling} />
            <SaksbildeSwitch personTilBehandling={personTilBehandling} />
        </SaksbildeContainer>
    );
};

const LasterSaksbilde = () => (
    <SaksbildeContainer className="saksbilde" data-testid="laster-saksbilde">
        <LasterPersonlinje />
        <LasterTidslinje />
    </SaksbildeContainer>
);

export default Saksbilde;
