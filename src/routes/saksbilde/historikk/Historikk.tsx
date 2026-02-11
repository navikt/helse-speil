import { motion } from 'motion/react';
import React, { ReactElement } from 'react';

import { XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, LocalAlert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { OpenedDokument } from '@components/OpenedDokument';
import { JusterbarSidemeny } from '@components/justerbarSidemeny/JusterbarSidemeny';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { PersonFragment } from '@io/graphql';
import { useGetNotaterForVedtaksperiode } from '@io/rest/generated/notater/notater';
import { isAnnullertBeregnetPeriode } from '@saksbilde/SaksbildeVarsel';
import { HistorikkHendelse } from '@saksbilde/historikk/HistorikkHendelse';
import { Historikkmeny } from '@saksbilde/historikk/Historikkmeny';
import { getHistorikkTitle } from '@saksbilde/historikk/constants/historikkTitles';
import { Annulleringhendelse } from '@saksbilde/historikk/hendelser/Annulleringhendelse';
import { ArbeidstidVurderthendelse } from '@saksbilde/historikk/hendelser/ArbeidstidVurderthendelse';
import { InntektHentetFraAordningenhendelse } from '@saksbilde/historikk/hendelser/InntektHentetFraAordningenhendelse';
import { InntektsmeldingMottatthendelse } from '@saksbilde/historikk/hendelser/InntektsmeldingMottatthendelse';
import { MeldingOmVedtakhendelse } from '@saksbilde/historikk/hendelser/MeldingOmVedtakhendelse';
import { SykmeldingMottatthendelse } from '@saksbilde/historikk/hendelser/SykmeldingMottatthendelse';
import { SøknadMottatthendelse } from '@saksbilde/historikk/hendelser/SøknadMottatthendelse';
import { HistorikkSkeleton } from '@saksbilde/historikk/komponenter/HistorikkSkeleton';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { Filtertype, HendelseObject } from '@typer/historikk';
import { cn } from '@utils/tw';
import { isGhostPeriode } from '@utils/typeguards';

import { Notat } from '../notat/Notat';
import { AnnetArbeidsforholdoverstyringhendelse } from './hendelser/AnnetArbeidsforholdoverstyringhendelse';
import { Arbeidsforholdoverstyringhendelse } from './hendelser/Arbeidsforholdoverstyringhendelse';
import { Dagoverstyringhendelse } from './hendelser/Dagoverstyringhendelse';
import { Inntektoverstyringhendelse } from './hendelser/Inntektoverstyringhendelse';
import { Notathendelse } from './hendelser/Notathendelse';
import { SykepengegrunnlagSkjønnsfastsatthendelse } from './hendelser/SykepengegrunnlagSkjønnsfastsatthendelse';
import { Utbetalinghendelse } from './hendelser/Utbetalinghendelse';
import { VedtakBegrunnelsehendelse } from './hendelser/VedtakBegrunnelsehendelse';
import { useFilterState, useFilteredHistorikk, useShowHistorikkState, useShowHøyremenyState } from './state';

import styles from './Historikk.module.css';

function HistorikkWithContent(): ReactElement {
    const { loading, data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const aktivPeriode = useActivePeriod(person);
    const vedtaksperiodeId = (isGhostPeriode(aktivPeriode) ? undefined : aktivPeriode?.vedtaksperiodeId) ?? '';
    const {
        data: notatData,
        isPending: notaterLoading,
        isError: harNotatError,
    } = useGetNotaterForVedtaksperiode(vedtaksperiodeId);
    const historikk = useFilteredHistorikk(person, notatData ?? []);
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

    if (loading || notaterLoading) return <HistorikkSkeleton />;
    else if (aktivPeriode == null || person == null || isGhostPeriode(aktivPeriode)) return <></>;

    return (
        <HistorikkVisning
            person={person}
            historikk={historikk}
            filter={filter}
            vedtaksperiodeId={aktivPeriode.vedtaksperiodeId}
            erAnnullertBeregnetPeriode={isAnnullertBeregnetPeriode(aktivPeriode)}
            visHistorikk={showHistorikk}
            visHøyremeny={showHøyremeny}
            harNotatError={harNotatError}
            lukkHistorikk={() => setShowHistorikk(false)}
        />
    );
}

interface HistorikkVisningProps {
    person: PersonFragment;
    historikk: HendelseObject[];
    filter: Filtertype;
    vedtaksperiodeId: string;
    erAnnullertBeregnetPeriode: boolean;
    visHistorikk: boolean;
    visHøyremeny: boolean;
    harNotatError: boolean;
    lukkHistorikk: () => void;
}
function HistorikkVisning({
    person,
    historikk,
    filter,
    vedtaksperiodeId,
    erAnnullertBeregnetPeriode,
    visHistorikk,
    visHøyremeny,
    harNotatError,
    lukkHistorikk,
}: HistorikkVisningProps) {
    return (
        <div className={styles['historikk-container']}>
            <JusterbarSidemeny
                defaultBredde={320}
                visSidemeny={visHøyremeny && visHistorikk}
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
                    {harNotatError && <LocalAlert status="error">Kunne ikke hente notater</LocalAlert>}
                    <div className={styles.historikk}>
                        <HStack className={styles.header}>
                            <div>{getHistorikkTitle(filter)}</div>
                            <button className={styles.xbutton} onClick={lukkHistorikk}>
                                <XMarkIcon title="lukk historikk" />
                            </button>
                        </HStack>
                        <ul>
                            {filter !== 'Dokument' && filter !== 'Overstyring' && (
                                <Notat vedtaksperiodeId={vedtaksperiodeId} />
                            )}
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
                                            <SykepengegrunnlagSkjønnsfastsatthendelse
                                                key={`${it.id}-${index}`}
                                                {...it}
                                            />
                                        );
                                    }
                                    case 'MinimumSykdomsgradoverstyring': {
                                        return <ArbeidstidVurderthendelse key={`${it.id}-${index}`} {...it} />;
                                    }
                                    case 'Dokument': {
                                        switch (it.dokumenttype) {
                                            case 'Vedtak':
                                                return (
                                                    <MeldingOmVedtakhendelse
                                                        key={it.id}
                                                        dokumentId={it.dokumentId ?? undefined}
                                                        fødselsnummer={person.fodselsnummer}
                                                        timestamp={it.timestamp}
                                                    />
                                                );
                                            case 'Søknad':
                                                return (
                                                    <SøknadMottatthendelse
                                                        key={it.id}
                                                        dokumentId={it.dokumentId ?? ''}
                                                        timestamp={it.timestamp}
                                                    />
                                                );
                                            case 'Inntektsmelding':
                                                return (
                                                    <InntektsmeldingMottatthendelse
                                                        key={it.id}
                                                        dokumentId={it.dokumentId ?? ''}
                                                        person={person}
                                                        timestamp={it.timestamp}
                                                    />
                                                );
                                            case 'Sykmelding':
                                                return (
                                                    <SykmeldingMottatthendelse key={it.id} timestamp={it.timestamp} />
                                                );
                                            case 'InntektHentetFraAordningen':
                                                return (
                                                    <InntektHentetFraAordningenhendelse
                                                        key={it.id}
                                                        timestamp={it.timestamp}
                                                    />
                                                );
                                            default:
                                                return null;
                                        }
                                    }
                                    case 'Notat': {
                                        return <Notathendelse key={it.id + 'notat'} {...it} />;
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
                                        return (
                                            <Annulleringhendelse
                                                key={it.id}
                                                erAnnullertBeregnetPeriode={erAnnullertBeregnetPeriode}
                                                {...it}
                                            />
                                        );
                                    }
                                    default:
                                        return null;
                                }
                            })}
                        </ul>
                    </div>
                </motion.div>
            </JusterbarSidemeny>
            {visHøyremeny && <OpenedDokument person={person} />}
            <Historikkmeny />
        </div>
    );
}

function HistorikkError(): ReactElement {
    return (
        <div className={cn(styles.historikk, styles.error)}>
            <ul>
                <div>
                    <BodyShort>Noe gikk galt. Kan ikke vise historikk for perioden.</BodyShort>
                </div>
            </ul>
        </div>
    );
}

export function Historikk(): ReactElement {
    return (
        <ErrorBoundary fallback={<HistorikkError />}>
            <HistorikkWithContent />
        </ErrorBoundary>
    );
}
