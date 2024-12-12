import { useRouter } from 'next/navigation';
import React, { ReactElement, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { BodyShort, Box, HStack, Loader } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { useBrukerGrupper, useBrukerIdent } from '@auth/brukerContext';
import { useErBeslutteroppgaveOgHarTilgang } from '@hooks/useErBeslutteroppgaveOgHarTilgang';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { useHarUvurderteVarslerPåEllerFør } from '@hooks/uvurderteVarsler';
import {
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    Dag,
    Maybe,
    OpprettAbonnementDocument,
    Periodetilstand,
    PersonFragment,
    Utbetalingsdagtype,
    VedtakUtfall,
} from '@io/graphql';
import { useFinnesNyereUtbetaltPeriodePåPerson } from '@state/arbeidsgiver';
import { calculatingState } from '@state/calculating';
import { useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useInntektOgRefusjon } from '@state/overstyring';
import { isRevurdering } from '@state/selectors/utbetaling';
import { useTotrinnsvurderingErAktiv } from '@state/toggles';
import { kanSeTilkommenInntekt } from '@utils/featureToggles';
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
    statusCode?: number;
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
    const totrinnsvurderingAktiv = useTotrinnsvurderingErAktiv();
    const erBeslutteroppgaveOgHarTilgang = useErBeslutteroppgaveOgHarTilgang(person);
    const harUvurderteVarslerPåUtbetaling = useHarUvurderteVarslerPåEllerFør(period, person.arbeidsgivere);
    const finnesNyereUtbetaltPeriodePåPerson = useFinnesNyereUtbetaltPeriodePåPerson(period, person);
    const saksbehandlerident = useBrukerIdent();
    const grupper = useBrukerGrupper();
    const calculating = useRecoilValue(calculatingState);

    const tidslinjeUtenAGPogHelg = getTidslinjeUtenAGPogHelg(period);
    const avvisteDager = getAvvisteDager(tidslinjeUtenAGPogHelg);

    const utfall =
        avvisteDager.length === 0
            ? VedtakUtfall.Innvilgelse
            : tidslinjeUtenAGPogHelg.length === avvisteDager.length
              ? VedtakUtfall.Avslag
              : VedtakUtfall.DelvisInnvilgelse;

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
    const kanSendesTilTotrinnsvurdering =
        totrinnsvurderingAktiv && isBeregnetPeriode(period) && period.totrinnsvurdering?.erBeslutteroppgave === false;
    const trengerTotrinnsvurdering =
        period?.totrinnsvurdering !== null && !period.totrinnsvurdering?.erBeslutteroppgave;
    const erTilkommenOgHarIkkeTilgang =
        period.egenskaper.some((it) => it.egenskap === 'TILKOMMEN') &&
        !kanSeTilkommenInntekt(saksbehandlerident, grupper);

    return (
        <Box
            background={vedtakBegrunnelseTekst !== '' ? 'bg-subtle' : 'surface-transparent'}
            paddingBlock="0 4"
            paddingInline="4 4"
            style={{ margin: '0 -1rem' }}
        >
            <IndividuellBegrunnelse
                defaultÅpen={lagretVedtakBegrunnelseTekst !== ''}
                erInnvilgelse={utfall === VedtakUtfall.Innvilgelse}
                vedtakBegrunnelseTekst={vedtakBegrunnelseTekst}
                setVedtakBegrunnelseTekst={setVedtakBegrunnelseTekst}
                periode={period}
                person={person}
            />
            {!erReadOnly && (
                <HStack gap="4">
                    {kanSendesTilTotrinnsvurdering && trengerTotrinnsvurdering ? (
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
                                lokaleInntektoverstyringer.aktørId !== null ||
                                erTilkommenOgHarIkkeTilgang
                            }
                            onSuccess={onSendTilGodkjenning}
                            utfall={utfall}
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
                                lokaleInntektoverstyringer.aktørId !== null ||
                                erTilkommenOgHarIkkeTilgang
                            }
                            onSuccess={onGodkjennUtbetaling}
                            utfall={utfall}
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
                        {kanSendesTilTotrinnsvurdering && trengerTotrinnsvurdering
                            ? 'Perioden sendes til godkjenning'
                            : 'Neste periode klargjøres'}
                    </span>
                </BodyShort>
            )}
        </Box>
    );
};

const getTidslinjeUtenAGPogHelg = (periode: BeregnetPeriodeFragment) =>
    periode.tidslinje.filter(
        (dag) =>
            ![Utbetalingsdagtype.Navhelgdag, Utbetalingsdagtype.Arbeidsgiverperiodedag].includes(
                dag.utbetalingsdagtype,
            ),
    );

const getAvvisteDager = (tidslinjeUtenAGPogHelg: Dag[]) =>
    tidslinjeUtenAGPogHelg.filter((dag) =>
        [Utbetalingsdagtype.AvvistDag, Utbetalingsdagtype.ForeldetDag, Utbetalingsdagtype.Feriedag].includes(
            dag.utbetalingsdagtype,
        ),
    );
