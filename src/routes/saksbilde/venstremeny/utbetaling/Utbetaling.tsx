import { useRouter } from 'next/navigation';
import React, { ReactElement, useEffect, useState } from 'react';

import { BodyShort, Box, HStack, Loader } from '@navikt/ds-react';

import { useErBeslutteroppgaveOgHarTilgang } from '@hooks/useErBeslutteroppgaveOgHarTilgang';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { useHarUvurderteVarslerPåEllerFør } from '@hooks/uvurderteVarsler';
import { ArbeidsgiverFragment, BeregnetPeriodeFragment, Maybe, Periodetilstand, PersonFragment } from '@io/graphql';
import { useFinnesNyereUtbetaltPeriodePåPerson } from '@state/arbeidsgiver';
import { useCalculatingValue } from '@state/calculating';
import { useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useInntektOgRefusjon } from '@state/overstyring';
import { isRevurdering } from '@state/selectors/utbetaling';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode } from '@utils/typeguards';

import { IndividuellBegrunnelse } from '../individuellBegrunnelse/IndividuellBegrunnelse';
import { AvvisningButton } from './AvvisningButton';
import { GodkjenningButton } from './GodkjenningButton';
import { ReturButton } from './ReturButton';
import { SendTilGodkjenningButton } from './SendTilGodkjenningButton';

import styles from './Utbetaling.module.css';

const skalPolleEtterNestePeriode = (person: PersonFragment) =>
    person.arbeidsgivere
        .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? [])
        .some((periode) =>
            [
                Periodetilstand.VenterPaEnAnnenPeriode,
                Periodetilstand.ForberederGodkjenning,
                Periodetilstand.UtbetaltVenterPaEnAnnenPeriode,
            ].includes(periode.periodetilstand),
        );

const hasOppgave = (period: BeregnetPeriodeFragment): boolean =>
    typeof period.oppgave?.id === 'string' && ['tilGodkjenning', 'revurderes'].includes(getPeriodState(period));

const useOnGodkjenn = (period: BeregnetPeriodeFragment, person: PersonFragment): (() => void) => {
    const router = useRouter();
    const setOpptegnelsePollingTime = useSetOpptegnelserPollingRate();

    return () => {
        if (skalPolleEtterNestePeriode(person) || (isBeregnetPeriode(period) && isRevurdering(period.utbetaling))) {
            setOpptegnelsePollingTime(1000);
        } else {
            router.push('/');
        }
    };
};

const useOnAvvis = (): (() => void) => {
    const router = useRouter();
    return () => router.push('/');
};

export type BackendFeil = {
    message: string;
};

interface UtbetalingProps {
    period: BeregnetPeriodeFragment;
    person: PersonFragment;
    arbeidsgiver: ArbeidsgiverFragment;
}

export const Utbetaling = ({ period, person, arbeidsgiver }: UtbetalingProps): Maybe<ReactElement> => {
    const [godkjentPeriode, setGodkjentPeriode] = useState<string | undefined>();
    const lagretVedtakBegrunnelseTekst =
        period.vedtakBegrunnelser[0] != undefined ? (period.vedtakBegrunnelser[0].begrunnelse as string) : '';
    const [vedtakBegrunnelseTekst, setVedtakBegrunnelseTekst] = useState(lagretVedtakBegrunnelseTekst);
    const rensetVedtakBegrunnelseTekst = vedtakBegrunnelseTekst.trim();
    const lokaleInntektoverstyringer = useInntektOgRefusjon();
    const ventEllerHopp = useOnGodkjenn(period, person);
    const router = useRouter();
    const erBeslutteroppgaveOgHarTilgang = useErBeslutteroppgaveOgHarTilgang(person);
    const harUvurderteVarslerPåUtbetaling = useHarUvurderteVarslerPåEllerFør(period, person.arbeidsgivere);
    const finnesNyereUtbetaltPeriodePåPerson = useFinnesNyereUtbetaltPeriodePåPerson(period, person);
    const calculating = useCalculatingValue();

    const onGodkjennUtbetaling = () => {
        setGodkjentPeriode(period.vedtaksperiodeId);
        ventEllerHopp();
    };
    const onSendTilGodkjenning = () => {
        setGodkjentPeriode(period.vedtaksperiodeId);
        router.push('/');
    };
    const onAvvisUtbetaling = useOnAvvis();
    const erReadOnly = useIsReadOnlyOppgave(person);

    useEffect(() => {
        if (godkjentPeriode !== period.vedtaksperiodeId && period.periodetilstand === Periodetilstand.TilGodkjenning) {
            setGodkjentPeriode(undefined);
        }
    }, [period.vedtaksperiodeId, period.periodetilstand, godkjentPeriode]);

    if (!hasOppgave(period)) return null;

    const periodenErSendt = !!godkjentPeriode;
    const isRevurdering = period.utbetaling.type === 'REVURDERING';
    const harArbeidsgiverutbetaling = period.utbetaling.arbeidsgiverNettoBelop !== 0;
    const harBrukerutbetaling = period.utbetaling.personNettoBelop !== 0;
    const trengerTotrinnsvurdering =
        isBeregnetPeriode(period) && period.totrinnsvurdering && !period.totrinnsvurdering.erBeslutteroppgave;

    return (
        <Box
            background={vedtakBegrunnelseTekst !== '' ? 'bg-subtle' : 'surface-transparent'}
            paddingBlock="0 4"
            paddingInline="4 4"
            style={{ margin: '0 -1rem' }}
        >
            <IndividuellBegrunnelse
                defaultÅpen={lagretVedtakBegrunnelseTekst !== ''}
                vedtakBegrunnelseTekst={vedtakBegrunnelseTekst}
                setVedtakBegrunnelseTekst={setVedtakBegrunnelseTekst}
                periode={period}
                person={person}
            />
            {!erReadOnly && (
                <HStack gap="4">
                    {trengerTotrinnsvurdering ? (
                        <SendTilGodkjenningButton
                            size="small"
                            utbetaling={period.utbetaling}
                            arbeidsgiverNavn={arbeidsgiver.navn}
                            personinfo={person.personinfo}
                            oppgavereferanse={period.oppgave?.id ?? ''}
                            disabled={
                                calculating ||
                                periodenErSendt ||
                                harUvurderteVarslerPåUtbetaling ||
                                lokaleInntektoverstyringer.aktørId !== null
                            }
                            onSuccess={onSendTilGodkjenning}
                            vedtakBegrunnelseTekst={rensetVedtakBegrunnelseTekst}
                        >
                            Send til godkjenning
                        </SendTilGodkjenningButton>
                    ) : (
                        <GodkjenningButton
                            size="small"
                            utbetaling={period.utbetaling}
                            arbeidsgiverNavn={arbeidsgiver.navn}
                            personinfo={person.personinfo}
                            oppgavereferanse={period.oppgave?.id ?? ''}
                            erBeslutteroppgave={erBeslutteroppgaveOgHarTilgang}
                            disabled={
                                calculating ||
                                periodenErSendt ||
                                harUvurderteVarslerPåUtbetaling ||
                                lokaleInntektoverstyringer.aktørId !== null
                            }
                            onSuccess={onGodkjennUtbetaling}
                            vedtakBegrunnelseTekst={rensetVedtakBegrunnelseTekst}
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
                            <AvvisningButton size="small" disabled={periodenErSendt} activePeriod={period} />
                        )}
                    {erBeslutteroppgaveOgHarTilgang && (
                        <ReturButton
                            size="small"
                            disabled={periodenErSendt}
                            activePeriod={period}
                            onSuccess={onAvvisUtbetaling}
                            person={person}
                        />
                    )}
                </HStack>
            )}
            {periodenErSendt && (
                <BodyShort className={styles.infotekst}>
                    <Loader className={styles.spinner} />
                    <span>
                        {trengerTotrinnsvurdering ? 'Perioden sendes til godkjenning' : 'Neste periode klargjøres'}
                    </span>
                </BodyShort>
            )}
        </Box>
    );
};
