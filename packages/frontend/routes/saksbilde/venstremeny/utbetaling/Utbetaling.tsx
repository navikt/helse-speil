import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { ErrorMessage } from '@components/ErrorMessage';
import { postAbonnerPåAktør } from '@io/http';
import { BeregnetPeriode, Periodetilstand, Person } from '@io/graphql';
import { opptegnelsePollingTimeState } from '@state/opptegnelser';
import { getPeriodState } from '@utils/mapping';
import { isRevurdering } from '@utils/period';

import { AvvisningButton } from './AvvisningButton';
import { GodkjenningButton } from './GodkjenningButton';
import { SendTilGodkjenningButton } from './SendTilGodkjenningButton';

import styles from './Utbetaling.module.css';
import { BodyShort, Loader } from '@navikt/ds-react';
import styled from '@emotion/styled';
import { isBeregnetPeriode } from '@utils/typeguards';
import { ReturButton } from './ReturButton';
import { useErBeslutteroppgaveOgHarTilgang } from '@hooks/useErBeslutteroppgaveOgHarTilgang';
import { toggleTotrinnsvurderingAktiv } from '@state/toggles';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { useHarVurderLovvalgOgMedlemskapVarsel } from '@hooks/useHarVurderLovvalgOgMedlemskapVarsel';

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
            [Periodetilstand.VenterPaEnAnnenPeriode, Periodetilstand.ForberederGodkjenning].includes(
                periode.periodetilstand,
            ),
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

interface UtbetalingProps {
    activePeriod: BeregnetPeriode;
    currentPerson: Person;
}

export const Utbetaling = ({ activePeriod, currentPerson }: UtbetalingProps) => {
    const [godkjentPeriode, setGodkjentPeriode] = useState<string | undefined>();
    const [error, setError] = useState<SpeilError | null>();
    const ventEllerHopp = useOnGodkjenn(activePeriod, currentPerson);
    const history = useHistory();
    const readOnly = useIsReadOnlyOppgave();
    const erBeslutteroppgaveOgHarTilgang = useErBeslutteroppgaveOgHarTilgang();
    const harVurderLovvalgOgMedlemskapVarsel = useHarVurderLovvalgOgMedlemskapVarsel();
    const totrinnsvurderingAktiv = useRecoilValue(toggleTotrinnsvurderingAktiv);

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
    const trengerTotrinnsvurdering =
        totrinnsvurderingAktiv && isBeregnetPeriode(activePeriod) && activePeriod.trengerTotrinnsvurdering;

    return (
        <>
            <div className={styles.Buttons}>
                {(trengerTotrinnsvurdering && !readOnly && !activePeriod.erBeslutterOppgave) ||
                (totrinnsvurderingAktiv &&
                    !readOnly &&
                    !activePeriod.erBeslutterOppgave &&
                    harVurderLovvalgOgMedlemskapVarsel) ? (
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
                            : isRevurdering
                            ? 'Revurder'
                            : harArbeidsgiverutbetaling || harBrukerutbetaling
                            ? 'Utbetal'
                            : 'Godkjenn'}
                    </GodkjenningButton>
                )}
                {!isRevurdering && !readOnly && !activePeriod.erBeslutterOppgave && (
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
                        {isRevurdering
                            ? 'Revurdering ferdigstilles'
                            : trengerTotrinnsvurdering
                            ? 'Perioden sendes til godkjenning'
                            : 'Neste periode klargjøres'}
                    </span>
                </InfoText>
            )}
        </>
    );
};
