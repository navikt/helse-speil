import dayjs from 'dayjs';
import { atom, useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import React, { ReactElement, useState } from 'react';

import { BodyShort, Box, HStack, Loader } from '@navikt/ds-react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { useErBeslutteroppgaveOgHarTilgang } from '@hooks/useErBeslutteroppgaveOgHarTilgang';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { harUvurderteVarslerPåEllerFør } from '@hooks/uvurderteVarsler';
import { BeregnetPeriodeFragment, Periodetilstand, PersonFragment } from '@io/graphql';
import { useCalculatingValue } from '@state/calculating';
import { usePersonStore } from '@state/contexts/personStore';
import { InntektsforholdReferanse, finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
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
    inntektsforholdReferanse: InntektsforholdReferanse;
}

const vedtaksbegrunnelseAtom = atom<string>('initalValue');

export const Utbetaling = ({ period, person, inntektsforholdReferanse }: UtbetalingProps): ReactElement | null => {
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
    const harUvurderteVarslerPåUtbetaling = harUvurderteVarslerPåEllerFør(period, finnAlleInntektsforhold(person));
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

    const prevPeriodRef = React.useRef(period.vedtaksperiodeId);

    if (!hasOppgave(period)) return null;

    if (prevPeriodRef.current !== period.vedtaksperiodeId) {
        prevPeriodRef.current = period.vedtaksperiodeId;
        if (godkjentPeriode !== undefined) {
            setGodkjentPeriode(undefined);
        }
    }

    const periodeEndret =
        godkjentPeriode !== undefined &&
        (godkjentPeriode !== period.vedtaksperiodeId || period.periodetilstand !== Periodetilstand.TilGodkjenning);

    const periodenErSendt = godkjentPeriode === period.vedtaksperiodeId && !periodeEndret;

    const isRevurdering = period.utbetaling.type === 'REVURDERING';
    const harArbeidsgiverutbetaling = period.utbetaling.arbeidsgiverNettoBelop !== 0;
    const harBrukerutbetaling = period.utbetaling.personNettoBelop !== 0;
    const skalSendesTilTotrinnsvurdering =
        isBeregnetPeriode(period) && period.totrinnsvurdering && !period.totrinnsvurdering.erBeslutteroppgave;

    return (
        <Box
            background={rensetVedtakBegrunnelseTekst !== '' ? 'neutral-soft' : undefined}
            paddingBlock="space-0 space-16"
            paddingInline="space-16 space-16"
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
                <HStack gap="space-16">
                    <VisHvisSkrivetilgang>
                        {skalSendesTilTotrinnsvurdering && (
                            <SendTilGodkjenningButton
                                size="small"
                                utbetaling={period.utbetaling}
                                inntektsforholdReferanse={inntektsforholdReferanse}
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
                        )}
                    </VisHvisSkrivetilgang>
                    {!skalSendesTilTotrinnsvurdering && (
                        <>
                            {erBeslutteroppgaveOgHarTilgang && (
                                <GodkjenningButton
                                    size="small"
                                    behandlingId={period.behandlingId}
                                    utbetaling={period.utbetaling}
                                    inntektsforholdReferanse={inntektsforholdReferanse}
                                    personinfo={person.personinfo}
                                    disabled={
                                        calculating ||
                                        periodenErSendt ||
                                        harUvurderteVarslerPåUtbetaling ||
                                        lokaleInntektoverstyringer.aktørId !== null
                                    }
                                    onSuccess={onGodkjennUtbetaling}
                                    vedtakBegrunnelseTekst={rensetVedtakBegrunnelseTekst}
                                >
                                    Godkjenn og fatt vedtak
                                </GodkjenningButton>
                            )}
                            <VisHvisSkrivetilgang>
                                {!erBeslutteroppgaveOgHarTilgang && (
                                    <GodkjenningButton
                                        size="small"
                                        behandlingId={period.behandlingId}
                                        utbetaling={period.utbetaling}
                                        inntektsforholdReferanse={inntektsforholdReferanse}
                                        personinfo={person.personinfo}
                                        disabled={
                                            calculating ||
                                            periodenErSendt ||
                                            harUvurderteVarslerPåUtbetaling ||
                                            lokaleInntektoverstyringer.aktørId !== null
                                        }
                                        onSuccess={onGodkjennUtbetaling}
                                        vedtakBegrunnelseTekst={rensetVedtakBegrunnelseTekst}
                                    >
                                        {harArbeidsgiverutbetaling || harBrukerutbetaling ? 'Fatt vedtak' : 'Godkjenn'}
                                    </GodkjenningButton>
                                )}
                            </VisHvisSkrivetilgang>
                        </>
                    )}
                    <VisHvisSkrivetilgang>
                        {!isRevurdering &&
                            !period.totrinnsvurdering?.erBeslutteroppgave &&
                            !harNyereUtbetaltPeriodePåPerson(period, person) && (
                                <AvvisningButton size="small" disabled={periodenErSendt} activePeriod={period} />
                            )}
                    </VisHvisSkrivetilgang>
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
                        {skalSendesTilTotrinnsvurdering
                            ? 'Perioden sendes til godkjenning'
                            : 'Neste periode klargjøres'}
                    </span>
                </BodyShort>
            )}
        </Box>
    );
};

const skalVentePåNestePeriode = (person: PersonFragment) =>
    finnAlleInntektsforhold(person)
        .flatMap((inntektskilde) => inntektskilde.behandlinger[0]?.perioder ?? [])
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
        if (skalVentePåNestePeriode(person) || (isBeregnetPeriode(period) && isRevurdering(period.utbetaling))) {
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
    const nyesteUtbetaltPeriodePåPerson = finnAlleInntektsforhold(person)
        .flatMap((inntektsforhold) => inntektsforhold.behandlinger[0]?.perioder)
        .filter((periode) => isBeregnetPeriode(periode) && isGodkjent(periode.utbetaling))
        .pop();

    return dayjs(nyesteUtbetaltPeriodePåPerson?.fom, ISO_DATOFORMAT).isAfter(dayjs(period.tom, ISO_DATOFORMAT));
};
