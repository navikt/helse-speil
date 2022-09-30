import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSetRecoilState } from 'recoil';

import { BodyShort, Loader } from '@navikt/ds-react';

import { ErrorMessage } from '@components/ErrorMessage';
import { useErBeslutteroppgaveOgHarTilgang } from '@hooks/useErBeslutteroppgaveOgHarTilgang';
import { useHarVurderLovvalgOgMedlemskapVarsel } from '@hooks/useHarVurderLovvalgOgMedlemskapVarsel';
import { BeregnetPeriode, Periodetilstand, Person } from '@io/graphql';
import { postAbonnerPåAktør } from '@io/http';
import { useHarDagOverstyringer } from '@state/arbeidsgiver';
import { opptegnelsePollingTimeState } from '@state/opptegnelser';
import { useHarEndringerEtterNyesteUtbetaltetidsstempel } from '@state/person';
import { useTotrinnsvurderingErAktiv } from '@state/toggles';
import { getPeriodState } from '@utils/mapping';
import { isRevurdering } from '@utils/period';
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

const skalPolleEtterNestePeriode = (person: Person) =>
    person.arbeidsgivere
        .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? [])
        .some((periode) =>
            [
                Periodetilstand.VenterPaEnAnnenPeriode,
                Periodetilstand.ForberederGodkjenning,
                Periodetilstand.UtbetaltVenterPaEnAnnenPeriode,
            ].includes(periode.periodetilstand)
        );

const hasOppgave = (period: BeregnetPeriode): boolean =>
    typeof period.oppgavereferanse === 'string' && ['tilGodkjenning', 'revurderes'].includes(getPeriodState(period));

const useOnGodkjenn = (period: BeregnetPeriode, person: Person): (() => void) => {
    const history = useHistory();
    const setOpptegnelsePollingTime = useSetRecoilState(opptegnelsePollingTimeState);

    return () => {
        if (skalPolleEtterNestePeriode(person) || isRevurdering(period)) {
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

type SpeilError = {
    message: string;
    statusCode?: number;
    technical?: string;
};

interface UtbetalingProps {
    activePeriod: BeregnetPeriode;
    currentPerson: Person;
}

export const Utbetaling = ({ activePeriod, currentPerson }: UtbetalingProps) => {
    const [godkjentPeriode, setGodkjentPeriode] = useState<string | undefined>();
    const [error, setError] = useState<SpeilError | null>();
    const ventEllerHopp = useOnGodkjenn(activePeriod, currentPerson);
    const history = useHistory();
    const erBeslutteroppgaveOgHarTilgang = useErBeslutteroppgaveOgHarTilgang();
    const totrinnsvurderingAktiv = useTotrinnsvurderingErAktiv();
    const harVurderLovvalgOgMedlemskapVarsel = useHarVurderLovvalgOgMedlemskapVarsel();
    const harEndringerEtterNyesteUtbetaltetidsstempel = useHarEndringerEtterNyesteUtbetaltetidsstempel();
    const harDagOverstyringer = useHarDagOverstyringer(activePeriod);

    const onGodkjennUtbetaling = () => {
        setGodkjentPeriode(activePeriod.vedtaksperiodeId);
        ventEllerHopp();
    };
    const onSendTilGodkjenning = () => {
        setGodkjentPeriode(activePeriod.vedtaksperiodeId);
        history.push('/');
    };
    const onAvvisUtbetaling = useOnAvvis();

    useEffect(() => {
        if (
            godkjentPeriode !== activePeriod.vedtaksperiodeId &&
            activePeriod.periodetilstand === Periodetilstand.TilGodkjenning
        ) {
            setGodkjentPeriode(undefined);
        }
    }, [activePeriod.vedtaksperiodeId, activePeriod.periodetilstand]);

    if (!hasOppgave(activePeriod)) return null;

    const periodenErSendt = !!godkjentPeriode;
    const isRevurdering = activePeriod.utbetaling.type === 'REVURDERING';
    const harArbeidsgiverutbetaling = activePeriod.utbetaling.arbeidsgiverNettoBelop !== 0;
    const harBrukerutbetaling = activePeriod.utbetaling.personNettoBelop !== 0;
    const kanSendesTilTotrinnsvurdering =
        totrinnsvurderingAktiv && isBeregnetPeriode(activePeriod) && !activePeriod.erBeslutterOppgave;
    const trengerTotrinnsvurdering = activePeriod.trengerTotrinnsvurdering;

    return (
        <>
            <div className={styles.Buttons}>
                {kanSendesTilTotrinnsvurdering &&
                (harVurderLovvalgOgMedlemskapVarsel ||
                    trengerTotrinnsvurdering ||
                    harEndringerEtterNyesteUtbetaltetidsstempel ||
                    harDagOverstyringer) ? (
                    <SendTilGodkjenningButton
                        oppgavereferanse={activePeriod.oppgavereferanse!}
                        disabled={periodenErSendt}
                        onSuccess={onSendTilGodkjenning}
                        onError={setError}
                    >
                        Send til godkjenning
                    </SendTilGodkjenningButton>
                ) : (
                    <GodkjenningButton
                        oppgavereferanse={activePeriod.oppgavereferanse!}
                        aktørId={currentPerson.aktorId}
                        erBeslutteroppgave={erBeslutteroppgaveOgHarTilgang}
                        disabled={periodenErSendt}
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
                {!isRevurdering && !activePeriod.erBeslutterOppgave && (
                    <AvvisningButton
                        disabled={periodenErSendt}
                        activePeriod={activePeriod}
                        aktørId={currentPerson.aktorId}
                        onSuccess={onAvvisUtbetaling}
                        onError={setError}
                    />
                )}
                {erBeslutteroppgaveOgHarTilgang && (
                    <ReturButton
                        disabled={periodenErSendt}
                        activePeriod={activePeriod}
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
                            harEndringerEtterNyesteUtbetaltetidsstempel ||
                            harDagOverstyringer)
                            ? 'Perioden sendes til godkjenning'
                            : 'Neste periode klargjøres'}
                    </span>
                </InfoText>
            )}
        </>
    );
};
