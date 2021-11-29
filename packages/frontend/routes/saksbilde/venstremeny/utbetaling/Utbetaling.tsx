import React, { useState } from 'react';

import { useUtbetaling } from '../../../../modell/utbetalingshistorikkelement';
import { harOppgave, useOppgavereferanse } from '../../../../state/tidslinje';
import { GodkjenningButton } from './GodkjenningButton';
import { usePerson } from '../../../../state/person';
import { postAbonnerPåAktør } from '../../../../io/http';
import { useSetRecoilState } from 'recoil';
import { opptegnelsePollingTimeState } from '../../../../state/opptegnelser';
import { useHistory } from 'react-router';
import { ErrorMessage } from '../../../../components/ErrorMessage';
import { AvvisningButton } from './AvvisningButton';
import styled from '@emotion/styled';
import { BrukerutbetalingInfoMessage } from './BrukerutbetalingInfoMessage';

const Buttons = styled.div`
    display: flex;
    gap: 1rem;
`;

const skalPolleEtterNestePeriode = (person: Person) =>
    person.arbeidsgivere
        .flatMap((arbeidsgiver: Arbeidsgiver) =>
            arbeidsgiver.vedtaksperioder.flatMap(
                (vedtaksperiode: Vedtaksperiode | UfullstendigVedtaksperiode) => vedtaksperiode.tilstand
            )
        )
        .some((tilstand) => tilstand === 'venterPåKiling');

interface UtbetalingProps {
    aktivPeriode: Tidslinjeperiode;
}

export const Utbetaling = ({ aktivPeriode }: UtbetalingProps) => {
    const person = usePerson();
    const history = useHistory();
    const utbetaling = useUtbetaling(aktivPeriode.beregningId);
    const oppgavereferanse = useOppgavereferanse(aktivPeriode.beregningId);
    const setOpptegnelsePollingTime = useSetRecoilState(opptegnelsePollingTimeState);
    const [error, setError] = useState<SpeilError | null>();

    if (!person || !(harOppgave(aktivPeriode) && oppgavereferanse)) return null;

    const erRevurdering = aktivPeriode.type === 'REVURDERING';
    const harArbeidsgiverutbetaling = utbetaling?.arbeidsgiverNettobeløp
        ? utbetaling.arbeidsgiverNettobeløp !== 0
        : false;
    const harBrukerutbetaling = utbetaling?.personNettobeløp ? utbetaling.personNettobeløp !== 0 : false;

    const navigerTilOversikten = () => history.push('/');

    const onGodkjennUtbetaling = () => {
        if (skalPolleEtterNestePeriode(person) || erRevurdering) {
            postAbonnerPåAktør(person.aktørId).then(() => {
                setOpptegnelsePollingTime(1000);
            });
        } else {
            navigerTilOversikten();
        }
    };

    const captureError = (error: Error) => setError(error);

    return (
        <>
            {harBrukerutbetaling && <BrukerutbetalingInfoMessage />}
            <Buttons>
                {!harBrukerutbetaling && (
                    <GodkjenningButton
                        oppgavereferanse={oppgavereferanse}
                        aktørId={person.aktørId}
                        onSuccess={onGodkjennUtbetaling}
                        onError={captureError}
                    >
                        {erRevurdering ? 'Revurder' : harArbeidsgiverutbetaling ? 'Utbetal' : 'Godkjenn'}
                    </GodkjenningButton>
                )}
                {!erRevurdering && (
                    <AvvisningButton
                        aktivPeriode={aktivPeriode}
                        oppgavereferanse={oppgavereferanse}
                        aktørId={person.aktørId}
                        onSuccess={navigerTilOversikten}
                        onError={captureError}
                    />
                )}
            </Buttons>
            {error && (
                <ErrorMessage>
                    {error.message || 'En feil har oppstått.'}
                    {error.statusCode === 401 && <a href="/"> Logg inn</a>}
                </ErrorMessage>
            )}
        </>
    );
};
