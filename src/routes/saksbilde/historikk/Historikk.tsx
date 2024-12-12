import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { ReactElement } from 'react';

import { XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { OpenedDokument } from '@components/OpenedDokument';
import { JusterbarSidemeny } from '@components/justerbarSidemeny/JusterbarSidemeny';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { PeriodehistorikkType, PersonFragment } from '@io/graphql';
import { Historikkmeny } from '@saksbilde/historikk/Historikkmeny';
import { Annulleringhendelse } from '@saksbilde/historikk/hendelser/Annulleringhendelse';
import { MinimumSykdomsgradhendelse } from '@saksbilde/historikk/hendelser/MinimumSykdomsgradhendelse';
import { StansAutomatiskBehandlingHendelse } from '@saksbilde/historikk/hendelser/StansAutomatiskBehandlingHendelse';
import { TotrinnsvurderingReturHendelse } from '@saksbilde/historikk/hendelser/TotrinnsvurderingReturHendelse';
import { VedtaksperiodeReberegnetHendelse } from '@saksbilde/historikk/hendelser/VedtaksperiodeReberegnetHendelse';
import { Dokumenthendelse } from '@saksbilde/historikk/hendelser/dokument/Dokumenthendelse';
import { InntektsmeldingDokumentHendelse } from '@saksbilde/historikk/hendelser/dokument/InntektsmeldingDokumentHendelse';
import { SøknadDokumentHendelse } from '@saksbilde/historikk/hendelser/dokument/SøknadDokumentHendelse';
import { VedtakDokumentHendelse } from '@saksbilde/historikk/hendelser/dokument/VedtakDokumenthendelse';
import { FjernFraPåVentHendelse } from '@saksbilde/historikk/hendelser/påvent/FjernFraPåVentHendelse';
import { NyestePåVentHendelse } from '@saksbilde/historikk/hendelser/påvent/NyestePåVentHendelse';
import { TidligerePåVentHendelse } from '@saksbilde/historikk/hendelser/påvent/TidligerePåVentHendelse';
import { TotrinnsvurderingAttestertHendelse } from '@saksbilde/historikk/hendelser/totrinnsvurdering/TotrinnsvurderingAttestertHendelse';
import { TotrinnsvurderingTilGodkjenningHendelse } from '@saksbilde/historikk/hendelser/totrinnsvurdering/TotrinnsvurderingTilGodkjenningHendelse';
import { useFetchPersonQuery } from '@state/person';
import { Filtertype, HendelseObject, HistorikkhendelseObject } from '@typer/historikk';

import { Notat } from '../notat/Notat';
import { AnnetArbeidsforholdoverstyringhendelse } from './hendelser/AnnetArbeidsforholdoverstyringhendelse';
import { Arbeidsforholdoverstyringhendelse } from './hendelser/Arbeidsforholdoverstyringhendelse';
import { Dagoverstyringhendelse } from './hendelser/Dagoverstyringhendelse';
import { HendelseSkeleton } from './hendelser/Hendelse';
import { Inntektoverstyringhendelse } from './hendelser/Inntektoverstyringhendelse';
import { Sykepengegrunnlagskjønnsfastsettinghendelse } from './hendelser/Sykepengegrunnlagskjønnsfastsettinghendelse';
import { Utbetalinghendelse } from './hendelser/Utbetalinghendelse';
import { VedtakBegrunnelsehendelse } from './hendelser/VedtakBegrunnelsehendelse';
import { Notathendelse } from './hendelser/notat/Notathendelse';
import { useFilterState, useFilteredHistorikk, useShowHistorikkState, useShowHøyremenyState } from './state';

import styles from './Historikk.module.css';

const getHistorikkTitle = (type: Filtertype): string => {
    switch (type) {
        case 'Dokument': {
            return 'DOKUMENTER';
        }
        case 'Historikk': {
            return 'HISTORIKK';
        }
        case 'Notat': {
            return 'NOTATER';
        }
        case 'Overstyring': {
            return 'OVERSTYRINGER';
        }
    }
};

const HistorikkWithContent = (): ReactElement => {
    const { loading, data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const historikk = useFilteredHistorikk(person);
    const [filter] = useFilterState();
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();
    const [showHøyremeny, _] = useShowHøyremenyState();

    useKeyboard([
        {
            key: Key.H,
            action: () => setShowHistorikk(!showHistorikk),
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
    ]);

    if (loading) return <HistorikkSkeleton />;

    return (
        <div className={styles['historikk-container']}>
            <JusterbarSidemeny
                defaultBredde={320}
                visSidemeny={showHøyremeny && showHistorikk}
                localStorageNavn="historikkBredde"
            >
                <motion.div
                    key="historikk"
                    transition={{
                        type: 'tween',
                        duration: 0.2,
                        ease: 'easeInOut',
                    }}
                    style={{ overflow: 'hidden' }}
                >
                    {person && (
                        <div className={styles.historikk}>
                            <HStack className={styles.header}>
                                <div>{getHistorikkTitle(filter)}</div>
                                <button className={styles.xbutton} onClick={() => setShowHistorikk(false)}>
                                    <XMarkIcon title="lukk åpnet dokument" />
                                </button>
                            </HStack>
                            <ul>
                                {filter !== 'Dokument' && filter !== 'Overstyring' && <Notat person={person} />}
                                {historikk.map((it: HendelseObject, index) => {
                                    switch (it.type) {
                                        case 'Arbeidsforholdoverstyring': {
                                            return <Arbeidsforholdoverstyringhendelse key={it.id} {...it} />;
                                        }
                                        case 'AnnetArbeidsforholdoverstyring': {
                                            return <AnnetArbeidsforholdoverstyringhendelse key={it.id} {...it} />;
                                        }
                                        case 'Dagoverstyring': {
                                            return <Dagoverstyringhendelse key={it.id} {...it} />;
                                        }
                                        case 'Inntektoverstyring': {
                                            return <Inntektoverstyringhendelse key={`${it.id}-${index}`} {...it} />;
                                        }
                                        case 'Sykepengegrunnlagskjonnsfastsetting': {
                                            return (
                                                <Sykepengegrunnlagskjønnsfastsettinghendelse
                                                    key={`${it.id}-${index}`}
                                                    {...it}
                                                />
                                            );
                                        }
                                        case 'MinimumSykdomsgradoverstyring': {
                                            return <MinimumSykdomsgradhendelse key={`${it.id}-${index}`} {...it} />;
                                        }
                                        case 'Dokument': {
                                            switch (it.dokumenttype) {
                                                case 'Vedtak':
                                                    return (
                                                        <VedtakDokumentHendelse
                                                            key={it.id}
                                                            dokumentId={it.dokumentId ?? undefined}
                                                            fødselsnummer={person.fodselsnummer}
                                                            timestamp={it.timestamp}
                                                        />
                                                    );
                                                case 'Søknad':
                                                    return (
                                                        <SøknadDokumentHendelse
                                                            key={it.id}
                                                            dokumentId={it.dokumentId ?? ''}
                                                            fødselsnummer={person.fodselsnummer}
                                                            timestamp={it.timestamp}
                                                        />
                                                    );
                                                case 'Inntektsmelding':
                                                    return (
                                                        <InntektsmeldingDokumentHendelse
                                                            key={it.id}
                                                            dokumentId={it.dokumentId ?? ''}
                                                            person={person}
                                                            timestamp={it.timestamp}
                                                        />
                                                    );
                                                case 'InntektHentetFraAordningen':
                                                case 'Sykmelding':
                                                    return (
                                                        <Dokumenthendelse
                                                            key={it.id}
                                                            dokumenttype={it.dokumenttype}
                                                            timestamp={it.timestamp}
                                                        />
                                                    );
                                            }
                                        }
                                        case 'Notat': {
                                            return <Notathendelse key={it.id} {...it} />;
                                        }
                                        case 'Utbetaling': {
                                            return <Utbetalinghendelse key={it.id} {...it} />;
                                        }
                                        case 'Historikk': {
                                            return <HistorikkHendelse hendelse={it} person={person} />;
                                        }
                                        case 'VedtakBegrunnelse': {
                                            return <VedtakBegrunnelsehendelse key={it.id} {...it} />;
                                        }
                                        case 'Annullering': {
                                            return <Annulleringhendelse key={it.id} {...it} />;
                                        }
                                        default:
                                            return null;
                                    }
                                })}
                            </ul>
                        </div>
                    )}
                </motion.div>
            </JusterbarSidemeny>
            {person && showHøyremeny && <OpenedDokument person={person} />}
            <Historikkmeny />
        </div>
    );
};

interface HistorikkHendelseProps {
    hendelse: HistorikkhendelseObject;
    person: PersonFragment;
}

const HistorikkHendelse = ({ hendelse, person }: HistorikkHendelseProps) => {
    switch (hendelse.historikktype) {
        case PeriodehistorikkType.LeggPaVent:
        case PeriodehistorikkType.EndrePaVent: {
            return <PåVentHendelse key={hendelse.id} hendelse={hendelse} person={person} />;
        }
        case PeriodehistorikkType.FjernFraPaVent: {
            return <FjernFraPåVentHendelse key={hendelse.id} {...hendelse} />;
        }
        case PeriodehistorikkType.TotrinnsvurderingAttestert: {
            return <TotrinnsvurderingAttestertHendelse key={hendelse.id} {...hendelse} />;
        }
        case PeriodehistorikkType.TotrinnsvurderingTilGodkjenning: {
            return <TotrinnsvurderingTilGodkjenningHendelse key={hendelse.id} {...hendelse} />;
        }
        case PeriodehistorikkType.VedtaksperiodeReberegnet: {
            return <VedtaksperiodeReberegnetHendelse key={hendelse.id} {...hendelse} />;
        }
        case PeriodehistorikkType.StansAutomatiskBehandling: {
            return <StansAutomatiskBehandlingHendelse key={hendelse.id} {...hendelse} />;
        }
        case PeriodehistorikkType.TotrinnsvurderingRetur: {
            return <TotrinnsvurderingReturHendelse key={hendelse.id} {...hendelse} />;
        }
    }
};

interface PåVentHendelseProps {
    hendelse: HistorikkhendelseObject;
    person: PersonFragment;
}

const PåVentHendelse = ({ hendelse, person }: PåVentHendelseProps) => {
    if (hendelse.erNyestePåVentInnslag) {
        return <NyestePåVentHendelse key={hendelse.id} {...hendelse} person={person} />;
    } else {
        return (
            <TidligerePåVentHendelse
                key={hendelse.id}
                {...hendelse}
                erEndring={hendelse.historikktype === PeriodehistorikkType.EndrePaVent}
            />
        );
    }
};

export const HistorikkSkeleton = (): ReactElement => {
    return (
        <HStack className={styles.historikkskeletonwrapper}>
            <div className={styles.historikkskeleton}>
                <ul>
                    <div>HISTORIKK</div>
                    <HendelseSkeleton enLinje />
                    <HendelseSkeleton />
                    <HendelseSkeleton />
                </ul>
            </div>
            <VStack gap="6" className={styles.historikkskeletonmeny}>
                <LoadingShimmer style={{ borderRadius: '100%', height: 32 }} />
                <LoadingShimmer style={{ borderRadius: '100%', height: 32 }} />
                <LoadingShimmer style={{ borderRadius: '100%', height: 32 }} />
                <LoadingShimmer style={{ borderRadius: '100%', height: 32 }} />
            </VStack>
        </HStack>
    );
};

const HistorikkError = (): ReactElement => {
    return (
        <div className={classNames(styles.historikk, styles.error)}>
            <ul>
                <div>
                    <BodyShort>Noe gikk galt. Kan ikke vise historikk for perioden.</BodyShort>
                </div>
            </ul>
        </div>
    );
};

export const Historikk = (): ReactElement => {
    return (
        <ErrorBoundary fallback={<HistorikkError />}>
            <HistorikkWithContent />
        </ErrorBoundary>
    );
};
