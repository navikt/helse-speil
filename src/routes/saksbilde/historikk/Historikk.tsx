import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { ReactElement } from 'react';

import { XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { OpenedDokument } from '@components/OpenedDokument';
import { JusterbarSidemeny } from '@components/justerbarSidemeny/JusterbarSidemeny';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { PeriodehistorikkType, PersonFragment } from '@io/graphql';
import { Historikkmeny } from '@saksbilde/historikk/Historikkmeny';
import { Annulleringhendelse } from '@saksbilde/historikk/hendelser/Annulleringhendelse';
import { Dokumenthendelse } from '@saksbilde/historikk/hendelser/Dokumenthendelse';
import { FjernetFraPåVentHendelse } from '@saksbilde/historikk/hendelser/FjernetFraPåVentHendelse';
import { HistorikkSkeleton } from '@saksbilde/historikk/hendelser/HistorikkSkeleton';
import { InntektsmeldingDokumentHendelse } from '@saksbilde/historikk/hendelser/InntektsmeldingDokumentHendelse';
import { LagtPåVentHendelse } from '@saksbilde/historikk/hendelser/LagtPåVentHendelse';
import { MinimumSykdomsgradhendelse } from '@saksbilde/historikk/hendelser/MinimumSykdomsgradhendelse';
import { StansAutomatiskBehandlingHendelse } from '@saksbilde/historikk/hendelser/StansAutomatiskBehandlingHendelse';
import { SøknadDokumentHendelse } from '@saksbilde/historikk/hendelser/SøknadDokumentHendelse';
import { TotrinnsvurderingAttestertHendelse } from '@saksbilde/historikk/hendelser/TotrinnsvurderingAttestertHendelse';
import { TotrinnsvurderingReturHendelse } from '@saksbilde/historikk/hendelser/TotrinnsvurderingReturHendelse';
import { TotrinnsvurderingTilGodkjenningHendelse } from '@saksbilde/historikk/hendelser/TotrinnsvurderingTilGodkjenningHendelse';
import { VedtakDokumentHendelse } from '@saksbilde/historikk/hendelser/VedtakDokumenthendelse';
import { VedtaksperiodeReberegnetHendelse } from '@saksbilde/historikk/hendelser/VedtaksperiodeReberegnetHendelse';
import { useFetchPersonQuery } from '@state/person';
import { Filtertype, HendelseObject, HistorikkhendelseObject } from '@typer/historikk';

import { Notat } from '../notat/Notat';
import { AnnetArbeidsforholdoverstyringhendelse } from './hendelser/AnnetArbeidsforholdoverstyringhendelse';
import { Arbeidsforholdoverstyringhendelse } from './hendelser/Arbeidsforholdoverstyringhendelse';
import { Dagoverstyringhendelse } from './hendelser/Dagoverstyringhendelse';
import { Inntektoverstyringhendelse } from './hendelser/Inntektoverstyringhendelse';
import { Notathendelse } from './hendelser/Notathendelse';
import { Sykepengegrunnlagskjønnsfastsettinghendelse } from './hendelser/Sykepengegrunnlagskjønnsfastsettinghendelse';
import { Utbetalinghendelse } from './hendelser/Utbetalinghendelse';
import { VedtakBegrunnelsehendelse } from './hendelser/VedtakBegrunnelsehendelse';
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
                                            return <HistorikkHendelse key={it.id} hendelse={it} person={person} />;
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

const HistorikkHendelse = ({ hendelse, person }: HistorikkHendelseProps): ReactElement => {
    const HendelseComponent = historikkhendelseComponents[hendelse.historikktype];
    return <HendelseComponent person={person} hendelse={hendelse} {...hendelse} />;
};

const historikkhendelseComponents = {
    [PeriodehistorikkType.LeggPaVent]: LagtPåVentHendelse,
    [PeriodehistorikkType.EndrePaVent]: LagtPåVentHendelse,
    [PeriodehistorikkType.FjernFraPaVent]: FjernetFraPåVentHendelse,
    [PeriodehistorikkType.TotrinnsvurderingAttestert]: TotrinnsvurderingAttestertHendelse,
    [PeriodehistorikkType.TotrinnsvurderingTilGodkjenning]: TotrinnsvurderingTilGodkjenningHendelse,
    [PeriodehistorikkType.VedtaksperiodeReberegnet]: VedtaksperiodeReberegnetHendelse,
    [PeriodehistorikkType.StansAutomatiskBehandling]: StansAutomatiskBehandlingHendelse,
    [PeriodehistorikkType.TotrinnsvurderingRetur]: TotrinnsvurderingReturHendelse,
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
