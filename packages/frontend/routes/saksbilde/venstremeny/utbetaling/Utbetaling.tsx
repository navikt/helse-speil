import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSetRecoilState } from 'recoil';

import { BodyShort, Loader } from '@navikt/ds-react';

import { ErrorMessage } from '@components/ErrorMessage';
import { useErBeslutteroppgaveOgHarTilgang } from '@hooks/useErBeslutteroppgaveOgHarTilgang';
import { useHarVurderLovvalgOgMedlemskapVarsel } from '@hooks/useHarVurderLovvalgOgMedlemskapVarsel';
import { useHarUvurderteVarslerPåUtbetaling } from '@hooks/uvurderteVarsler';
import { NotatType, Periodetilstand } from '@io/graphql';
import { postAbonnerPåAktør } from '@io/http';
import { useHarDagOverstyringer } from '@state/arbeidsgiver';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { opptegnelsePollingTimeState } from '@state/opptegnelser';
import { getLatestUtbetalingTimestamp, getOverstyringer } from '@state/selectors/person';
import { isRevurdering } from '@state/selectors/utbetaling';
import { useTotrinnsvurderingErAktiv } from '@state/toggles';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode } from '@utils/typeguards';

import { AvvisningButton } from './AvvisningButton';
import { GodkjenningButton } from './GodkjenningButton';
import { ReturButton } from './ReturButton';
import { SendTilGodkjenningButton } from './SendTilGodkjenningButton';

import styles from './Utbetaling.module.css';

const InfoText = styled(BodyShort)`
    color: var(--navds-semantic-color-text);
    display: flex;
`;

const Spinner = styled(Loader)`
    margin-right: 0.5rem;
`;

const skalPolleEtterNestePeriode = (person: FetchedPerson) =>
    person.arbeidsgivere
        .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? [])
        .some((periode) =>
            [
                Periodetilstand.VenterPaEnAnnenPeriode,
                Periodetilstand.ForberederGodkjenning,
                Periodetilstand.UtbetaltVenterPaEnAnnenPeriode,
            ].includes(periode.periodetilstand)
        );

const hasOppgave = (period: FetchedBeregnetPeriode): boolean =>
    typeof period.oppgave?.id === 'string' && ['tilGodkjenning', 'revurderes'].includes(getPeriodState(period));

const useOnGodkjenn = (period: FetchedBeregnetPeriode, person: FetchedPerson): (() => void) => {
    const history = useHistory();
    const setOpptegnelsePollingTime = useSetRecoilState(opptegnelsePollingTimeState);

    return () => {
        if (skalPolleEtterNestePeriode(person) || (isBeregnetPeriode(period) && isRevurdering(period.utbetaling))) {
            postAbonnerPåAktør(person.aktorId).then(() => {
                setOpptegnelsePollingTime(1000);
            });
        } else {
            history.push('/');
        }
    };
};

const useOnAvvis = (): (() => void) => {
    const history = useHistory();
    return () => history.push('/');
};

const useHarOverstyringerEtterSisteGodkjenteUtbetaling = (person: FetchedPerson): boolean => {
    const timestamp = getLatestUtbetalingTimestamp(person);
    return getOverstyringer(person, timestamp).length > 0;
};

type SpeilError = {
    message: string;
    statusCode?: number;
    technical?: string;
};

interface UtbetalingProps {
    period: FetchedBeregnetPeriode;
    person: FetchedPerson;
}

export const Utbetaling = ({ period, person }: UtbetalingProps) => {
    const [godkjentPeriode, setGodkjentPeriode] = useState<string | undefined>();
    const [error, setError] = useState<SpeilError | null>();
    const ventEllerHopp = useOnGodkjenn(period, person);
    const history = useHistory();
    const erBeslutteroppgaveOgHarTilgang = useErBeslutteroppgaveOgHarTilgang();
    const totrinnsvurderingAktiv = useTotrinnsvurderingErAktiv();
    const harVurderLovvalgOgMedlemskapVarsel = useHarVurderLovvalgOgMedlemskapVarsel();
    const harOverstyringerEtterSisteGodkjenteUtbetaling = useHarOverstyringerEtterSisteGodkjenteUtbetaling(person);
    const harDagOverstyringer = useHarDagOverstyringer(period);
    const currentSaksbehandler = useInnloggetSaksbehandler();
    const harUvurderteVarslerPåUtbetaling = useHarUvurderteVarslerPåUtbetaling(period.utbetaling.id);

    const onGodkjennUtbetaling = () => {
        setGodkjentPeriode(period.vedtaksperiodeId);
        ventEllerHopp();
    };
    const onSendTilGodkjenning = () => {
        setGodkjentPeriode(period.vedtaksperiodeId);
        history.push('/');
    };
    const onAvvisUtbetaling = useOnAvvis();

    useEffect(() => {
        if (godkjentPeriode !== period.vedtaksperiodeId && period.periodetilstand === Periodetilstand.TilGodkjenning) {
            setGodkjentPeriode(undefined);
        }
    }, [period.vedtaksperiodeId, period.periodetilstand]);

    if (!hasOppgave(period)) return null;

    const periodenErSendt = !!godkjentPeriode;
    const isRevurdering = period.utbetaling.type === 'REVURDERING';
    const harArbeidsgiverutbetaling = period.utbetaling.arbeidsgiverNettoBelop !== 0;
    const harBrukerutbetaling = period.utbetaling.personNettoBelop !== 0;
    const kanSendesTilTotrinnsvurdering =
        totrinnsvurderingAktiv && isBeregnetPeriode(period) && !period.oppgave?.erBeslutter;
    const trengerTotrinnsvurdering = period.oppgave?.trengerTotrinnsvurdering ?? false;
    const manglerNotatVedVurderLovvalgOgMedlemskapVarsel = harVurderLovvalgOgMedlemskapVarsel
        ? period.notater.filter((it) => it.type === NotatType.Generelt && !it.feilregistrert).length === 0
        : undefined;
    const erTildeltInnloggetSaksbehandler = currentSaksbehandler.oid === person.tildeling?.oid;

    return (
        <>
            <div className={styles.Buttons}>
                {kanSendesTilTotrinnsvurdering &&
                (harVurderLovvalgOgMedlemskapVarsel ||
                    trengerTotrinnsvurdering ||
                    harOverstyringerEtterSisteGodkjenteUtbetaling ||
                    harDagOverstyringer) ? (
                    <SendTilGodkjenningButton
                        oppgavereferanse={period.oppgave?.id!}
                        manglerNotatVedVurderLovvalgOgMedlemskapVarsel={manglerNotatVedVurderLovvalgOgMedlemskapVarsel}
                        disabled={periodenErSendt || harUvurderteVarslerPåUtbetaling}
                        onSuccess={onSendTilGodkjenning}
                        onError={setError}
                    >
                        Send til godkjenning
                    </SendTilGodkjenningButton>
                ) : (
                    <GodkjenningButton
                        oppgavereferanse={period.oppgave?.id!}
                        aktørId={person.aktorId}
                        erBeslutteroppgave={erBeslutteroppgaveOgHarTilgang}
                        disabled={periodenErSendt || harUvurderteVarslerPåUtbetaling}
                        onSuccess={onGodkjennUtbetaling}
                        onError={setError}
                    >
                        {erBeslutteroppgaveOgHarTilgang
                            ? 'Godkjenn og utbetal'
                            : harArbeidsgiverutbetaling || harBrukerutbetaling
                            ? 'Utbetal'
                            : 'Godkjenn'}
                    </GodkjenningButton>
                )}
                {!isRevurdering && !period.oppgave?.erBeslutter && (
                    <AvvisningButton
                        disabled={periodenErSendt}
                        activePeriod={period}
                        aktørId={person.aktorId}
                        onSuccess={onAvvisUtbetaling}
                        onError={setError}
                    />
                )}
                {erBeslutteroppgaveOgHarTilgang && (
                    <ReturButton
                        disabled={periodenErSendt}
                        activePeriod={period}
                        onSuccess={onAvvisUtbetaling}
                        onError={setError}
                    />
                )}
            </div>
            {error && (
                <ErrorMessage>
                    {error.message || 'En feil har oppstått.'}
                    {error.statusCode === 401 && <a href="/"> Logg inn</a>}
                </ErrorMessage>
            )}
            {periodenErSendt && (
                <InfoText as="p">
                    <Spinner />
                    <span>
                        {kanSendesTilTotrinnsvurdering &&
                        (harVurderLovvalgOgMedlemskapVarsel ||
                            trengerTotrinnsvurdering ||
                            harOverstyringerEtterSisteGodkjenteUtbetaling ||
                            harDagOverstyringer)
                            ? 'Perioden sendes til godkjenning'
                            : 'Neste periode klargjøres'}
                    </span>
                </InfoText>
            )}
        </>
    );
};
