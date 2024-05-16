import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { BodyShort, Loader } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { useErBeslutteroppgaveOgHarTilgang } from '@hooks/useErBeslutteroppgaveOgHarTilgang';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { useHarUvurderteVarslerPåEllerFør } from '@hooks/uvurderteVarsler';
import { AvslagInput, OpprettAbonnementDocument, Periodetilstand } from '@io/graphql';
import { useFinnesNyereUtbetaltPeriodePåPerson } from '@state/arbeidsgiver';
import { useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { inntektOgRefusjonState } from '@state/overstyring';
import { isRevurdering } from '@state/selectors/utbetaling';
import { useTotrinnsvurderingErAktiv } from '@state/toggles';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode } from '@utils/typeguards';

import { BegrunnelseVedtak } from '../BegrunnelseVedtak';
import { AvvisningButton } from './AvvisningButton';
import { GodkjenningButton } from './GodkjenningButton';
import { ReturButton } from './ReturButton';
import { SendTilGodkjenningButton } from './SendTilGodkjenningButton';

import styles from './Utbetaling.module.css';

const skalPolleEtterNestePeriode = (person: FetchedPerson) =>
    person.arbeidsgivere
        .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? [])
        .some((periode) =>
            [
                Periodetilstand.VenterPaEnAnnenPeriode,
                Periodetilstand.ForberederGodkjenning,
                Periodetilstand.UtbetaltVenterPaEnAnnenPeriode,
            ].includes(periode.periodetilstand),
        );

const hasOppgave = (period: FetchedBeregnetPeriode): boolean =>
    typeof period.oppgave?.id === 'string' && ['tilGodkjenning', 'revurderes'].includes(getPeriodState(period));

const useOnGodkjenn = (period: FetchedBeregnetPeriode, person: FetchedPerson): (() => void) => {
    const navigate = useNavigate();
    const setOpptegnelsePollingTime = useSetOpptegnelserPollingRate();
    const [opprettAbonnement] = useMutation(OpprettAbonnementDocument);

    return () => {
        if (skalPolleEtterNestePeriode(person) || (isBeregnetPeriode(period) && isRevurdering(period.utbetaling))) {
            void opprettAbonnement({
                variables: { personidentifikator: person.aktorId },
                onCompleted: () => {
                    setOpptegnelsePollingTime(1000);
                },
            });
        } else {
            navigate('/');
        }
    };
};

const useOnAvvis = (): (() => void) => {
    const navigate = useNavigate();
    return () => navigate('/');
};

export type BackendFeil = {
    message: string;
    statusCode?: number;
};

interface UtbetalingProps {
    period: FetchedBeregnetPeriode;
    person: FetchedPerson;
    arbeidsgiver: string;
}

export const Utbetaling = ({ period, person, arbeidsgiver }: UtbetalingProps) => {
    const [godkjentPeriode, setGodkjentPeriode] = useState<string | undefined>();
    const [open, setOpen] = useState(false);
    const [avslag, setAvslag] = useState<Maybe<AvslagInput>>(null);
    const lokaleInntektoverstyringer = useRecoilValue(inntektOgRefusjonState);
    const ventEllerHopp = useOnGodkjenn(period, person);
    const navigate = useNavigate();
    const totrinnsvurderingAktiv = useTotrinnsvurderingErAktiv();
    const erBeslutteroppgaveOgHarTilgang = useErBeslutteroppgaveOgHarTilgang();
    const harUvurderteVarslerPåUtbetaling = useHarUvurderteVarslerPåEllerFør(period, person.arbeidsgivere);
    const finnesNyereUtbetaltPeriodePåPerson = useFinnesNyereUtbetaltPeriodePåPerson(period, person);

    const onGodkjennUtbetaling = () => {
        setGodkjentPeriode(period.vedtaksperiodeId);
        ventEllerHopp();
    };
    const onSendTilGodkjenning = () => {
        setGodkjentPeriode(period.vedtaksperiodeId);
        navigate('/');
    };
    const onAvvisUtbetaling = useOnAvvis();
    const erReadOnly = useIsReadOnlyOppgave();

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
        totrinnsvurderingAktiv && isBeregnetPeriode(period) && period.totrinnsvurdering?.erBeslutteroppgave === false;
    const trengerTotrinnsvurdering =
        period?.totrinnsvurdering !== null && !period.totrinnsvurdering?.erBeslutteroppgave;

    return (
        <div className={classNames(styles.container, (open || period.avslag.length > 0) && styles.aktiv)}>
            <BegrunnelseVedtak open={open} setOpen={setOpen} avslag={avslag} setAvslag={setAvslag} periode={period} />
            {!erReadOnly && (
                <div className={styles.buttons}>
                    {kanSendesTilTotrinnsvurdering && trengerTotrinnsvurdering ? (
                        <SendTilGodkjenningButton
                            utbetaling={period.utbetaling}
                            arbeidsgiver={arbeidsgiver}
                            personinfo={person.personinfo}
                            oppgavereferanse={period.oppgave?.id ?? ''}
                            disabled={
                                periodenErSendt ||
                                harUvurderteVarslerPåUtbetaling ||
                                lokaleInntektoverstyringer.aktørId !== null
                            }
                            onSuccess={onSendTilGodkjenning}
                            avslag={avslag}
                        >
                            Send til godkjenning
                        </SendTilGodkjenningButton>
                    ) : (
                        <GodkjenningButton
                            utbetaling={period.utbetaling}
                            arbeidsgiver={arbeidsgiver}
                            personinfo={person.personinfo}
                            oppgavereferanse={period.oppgave?.id ?? ''}
                            erBeslutteroppgave={erBeslutteroppgaveOgHarTilgang}
                            disabled={
                                periodenErSendt ||
                                harUvurderteVarslerPåUtbetaling ||
                                lokaleInntektoverstyringer.aktørId !== null
                            }
                            onSuccess={onGodkjennUtbetaling}
                            avslag={avslag}
                        >
                            {erBeslutteroppgaveOgHarTilgang
                                ? 'Godkjenn og fatt vedtak'
                                : harArbeidsgiverutbetaling || harBrukerutbetaling
                                  ? 'Fatt vedtak'
                                  : 'Godkjenn'}
                        </GodkjenningButton>
                    )}
                    {!isRevurdering &&
                        !period.totrinnsvurdering?.erBeslutteroppgave &&
                        !finnesNyereUtbetaltPeriodePåPerson && (
                            <AvvisningButton
                                disabled={periodenErSendt}
                                activePeriod={period}
                                onSuccess={onAvvisUtbetaling}
                            />
                        )}
                    {erBeslutteroppgaveOgHarTilgang && (
                        <ReturButton disabled={periodenErSendt} activePeriod={period} onSuccess={onAvvisUtbetaling} />
                    )}
                </div>
            )}
            {periodenErSendt && (
                <BodyShort as="p" className={styles.infotekst}>
                    <Loader className={styles.spinner} />
                    <span>
                        {kanSendesTilTotrinnsvurdering && trengerTotrinnsvurdering
                            ? 'Perioden sendes til godkjenning'
                            : 'Neste periode klargjøres'}
                    </span>
                </BodyShort>
            )}
        </div>
    );
};
