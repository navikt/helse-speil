import dayjs from 'dayjs';
import { atom, useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import React, { ReactElement, useEffect, useState } from 'react';

import { BodyShort, Box, HStack, Loader } from '@navikt/ds-react';

import { useErBeslutteroppgaveOgHarTilgang } from '@hooks/useErBeslutteroppgaveOgHarTilgang';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { useHarUvurderteVarslerPåEllerFør } from '@hooks/uvurderteVarsler';
import { ArbeidsgiverFragment, BeregnetPeriodeFragment, Periodetilstand, PersonFragment } from '@io/graphql';
import { useCalculatingValue } from '@state/calculating';
import { usePersonStore } from '@state/contexts/personStore';
import { useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useInntektOgRefusjon } from '@state/overstyring';
import { isGodkjent, isRevurdering } from '@state/selectors/utbetaling';
import { ISO_DATOFORMAT } from '@utils/date';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode } from '@utils/typeguards';

import { IndividuellBegrunnelse } from '../individuellBegrunnelse/IndividuellBegrunnelse';
import { AvvisningButton } from './AvvisningButton';
import { GodkjenningButton } from './GodkjenningButton';
import { ReturButton } from './ReturButton';
import { SendTilGodkjenningButton } from './SendTilGodkjenningButton';

import styles from './Utbetaling.module.css';

interface UtbetalingProps {
    period: BeregnetPeriodeFragment;
    person: PersonFragment;
    arbeidsgiver: ArbeidsgiverFragment;
}

const vedtaksbegrunnelseAtom = atom<string>('initalValue');

export const Utbetaling = ({ period, person, arbeidsgiver }: UtbetalingProps): ReactElement | null => {
    const [godkjentPeriode, setGodkjentPeriode] = useState<string | undefined>();
    const lagretVedtakBegrunnelseTekst =
        period.vedtakBegrunnelser[0] != undefined ? (period.vedtakBegrunnelser[0].begrunnelse as string) : '';
    const [vedtakBegrunnelseTekst, setVedtakBegrunnelseTekst] = useAtom(vedtaksbegrunnelseAtom, {
        store: usePersonStore(),
    });

    const rensetVedtakBegrunnelseTekst =
        vedtakBegrunnelseTekst !== 'initalValue' ? vedtakBegrunnelseTekst : lagretVedtakBegrunnelseTekst;
    const lokaleInntektoverstyringer = useInntektOgRefusjon();
    const ventEllerHopp = useOnGodkjenn(period, person);
    const router = useRouter();
    const erBeslutteroppgaveOgHarTilgang = useErBeslutteroppgaveOgHarTilgang(person);
    const harUvurderteVarslerPåUtbetaling = useHarUvurderteVarslerPåEllerFør(period, person.arbeidsgivere);
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
            background={rensetVedtakBegrunnelseTekst !== '' ? 'bg-subtle' : 'surface-transparent'}
            paddingBlock="0 4"
            paddingInline="4 4"
            style={{ margin: '0 -1rem' }}
        >
            <IndividuellBegrunnelse
                defaultÅpen={rensetVedtakBegrunnelseTekst !== ''}
                vedtakBegrunnelseTekst={rensetVedtakBegrunnelseTekst}
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
                            arbeidsgiverIdentifikator={arbeidsgiver.organisasjonsnummer}
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
                            arbeidsgiverIdentifikator={arbeidsgiver.organisasjonsnummer}
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
                        !harNyereUtbetaltPeriodePåPerson(period, person) && (
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

const harNyereUtbetaltPeriodePåPerson = (period: BeregnetPeriodeFragment, person: PersonFragment): boolean => {
    const nyesteUtbetaltPeriodePåPerson = person.arbeidsgivere
        .flatMap((it) => it.generasjoner[0]?.perioder)
        .filter((periode) => isBeregnetPeriode(periode) && isGodkjent(periode.utbetaling))
        .pop();

    return dayjs(nyesteUtbetaltPeriodePåPerson?.fom, ISO_DATOFORMAT).isAfter(dayjs(period.tom, ISO_DATOFORMAT));
};
