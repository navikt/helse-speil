import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useSetRecoilState } from 'recoil';

import { ErrorMessage } from '@components/ErrorMessage';
import { postAbonnerPåAktør } from '@io/http';
import { Behandlingstype, BeregnetPeriode, Person } from '@io/graphql';
import { opptegnelsePollingTimeState } from '@state/opptegnelser';
import { getPeriodState } from '@utils/mapping';
import { isRevurdering } from '@utils/period';

import { AvvisningButton } from './AvvisningButton';
import { GodkjenningButton } from './GodkjenningButton';

import styles from './Utbetaling.module.css';
import { BodyShort, Loader } from '@navikt/ds-react';
import styled from '@emotion/styled';

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
        .some((periode) => periode.behandlingstype === Behandlingstype.Venter);

const hasOppgave = (period: BeregnetPeriode): boolean =>
    typeof period.oppgavereferanse === 'string' && ['oppgaver', 'revurderes'].includes(getPeriodState(period));

const useOnGodkjenn = (period: BeregnetPeriode, person: Person): (() => void) => {
    const history = useHistory();
    const setOpptegnelsePollingTime = useSetRecoilState(opptegnelsePollingTimeState);

    const onGodkjennUtbetaling = () => {
        if (skalPolleEtterNestePeriode(person) || isRevurdering(period)) {
            postAbonnerPåAktør(person.aktorId).then(() => {
                setOpptegnelsePollingTime(1000);
            });
        } else {
            history.push('/');
        }
    };

    return onGodkjennUtbetaling;
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
    const [periodenErUtbetaltEllerAvvist, setPeriodenErUtbetaltEllerAvvist] = useState(false);
    const [error, setError] = useState<SpeilError | null>();
    const ventEllerHopp = useOnGodkjenn(activePeriod, currentPerson);
    const onGodkjennUtbetaling = () => {
        setPeriodenErUtbetaltEllerAvvist(true);
        ventEllerHopp();
    };
    const onAvvisUtbetaling = useOnAvvis();

    if (!hasOppgave(activePeriod)) return null;

    const isRevurdering = activePeriod.utbetaling.type === 'REVURDERING';
    const harArbeidsgiverutbetaling = activePeriod.utbetaling.arbeidsgiverNettoBelop !== 0;
    const harBrukerutbetaling = activePeriod.utbetaling.personNettoBelop !== 0;

    return (
        <>
            <div className={styles.Buttons}>
                <GodkjenningButton
                    oppgavereferanse={activePeriod.oppgavereferanse!}
                    aktørId={currentPerson.aktorId}
                    disabled={periodenErUtbetaltEllerAvvist}
                    onSuccess={onGodkjennUtbetaling}
                    onError={setError}
                >
                    {isRevurdering
                        ? 'Revurder'
                        : harArbeidsgiverutbetaling || harBrukerutbetaling
                        ? 'Utbetal'
                        : 'Godkjenn'}
                </GodkjenningButton>
                {!isRevurdering && (
                    <AvvisningButton
                        disabled={periodenErUtbetaltEllerAvvist}
                        activePeriod={activePeriod}
                        aktørId={currentPerson.aktorId}
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
            {periodenErUtbetaltEllerAvvist && (
                <InfoText as="p">
                    <Spinner />
                    <span>{isRevurdering ? 'Revurdering ferdigstilles' : 'Neste periode klargjøres'}</span>
                </InfoText>
            )}
        </>
    );
};
