import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { NORSK_DATOFORMAT } from '@utils/date';
import { toKronerOgØre } from '@utils/locale';

import { DokumentFragment } from './DokumentFragment';
import { DokumentLoader } from './DokumentLoader';
import { useQueryInntektsmelding } from './queries';

import styles from './Inntektsmeldingsinnhold.module.css';

type SøknadsinnholdProps = {
    dokumentId: DokumenthendelseObject['dokumentId'];
    fødselsnummer: string;
};

export const Inntektsmeldingsinnhold: React.FC<SøknadsinnholdProps> = ({ dokumentId, fødselsnummer }) => {
    const inntektsmeldingssrespons = useQueryInntektsmelding(fødselsnummer, dokumentId);
    const inntektsmelding = inntektsmeldingssrespons.data;

    return (
        <div>
            {inntektsmelding && (
                <div className={styles.dokument}>
                    {inntektsmelding.begrunnelseForReduksjonEllerIkkeUtbetalt && (
                        <DokumentFragment overskrift="Begrunnelse for reduksjon eller ikke utbetalt">
                            {inntektsmelding.begrunnelseForReduksjonEllerIkkeUtbetalt}
                        </DokumentFragment>
                    )}
                    {inntektsmelding.bruttoUtbetalt && (
                        <DokumentFragment overskrift="Brutto utbetalt">
                            {toKronerOgØre(inntektsmelding.bruttoUtbetalt)}
                        </DokumentFragment>
                    )}
                    {inntektsmelding.beregnetInntekt && (
                        <DokumentFragment overskrift="Beregnet inntekt">
                            {toKronerOgØre(inntektsmelding.beregnetInntekt)}
                        </DokumentFragment>
                    )}
                    {inntektsmelding.inntektsdato && (
                        <DokumentFragment overskrift="Inntektsdato">
                            {dayjs(inntektsmelding.inntektsdato).format(NORSK_DATOFORMAT)}
                        </DokumentFragment>
                    )}
                    {inntektsmelding.refusjon && (
                        <DokumentFragment overskrift="Refusjon">
                            <>
                                {inntektsmelding.refusjon.beloepPrMnd !== null &&
                                    `Beløp pr mnd: ${inntektsmelding.refusjon.beloepPrMnd}`}
                                {inntektsmelding.refusjon.opphoersdato &&
                                    `${(<br />)}Opphørsdato: ${inntektsmelding.refusjon.opphoersdato}`}
                            </>
                        </DokumentFragment>
                    )}
                    {(inntektsmelding.endringIRefusjoner?.length ?? 0) > 0 && (
                        <div className={styles.liste}>
                            <Bold size="small">Endring i refusjoner</Bold>
                            {inntektsmelding.endringIRefusjoner?.map((it) => (
                                <>
                                    {it.endringsdato && (
                                        <DokumentFragment overskrift="Endringsdato">{it.endringsdato}</DokumentFragment>
                                    )}
                                    {it.beloep && (
                                        <DokumentFragment overskrift="Beløp">
                                            {toKronerOgØre(it.beloep)}
                                        </DokumentFragment>
                                    )}
                                </>
                            ))}
                        </div>
                    )}
                    {(inntektsmelding.opphoerAvNaturalytelser?.length ?? 0) > 0 && (
                        <div className={styles.liste}>
                            <Bold size="small">Opphør av naturalytelser</Bold>
                            {inntektsmelding.opphoerAvNaturalytelser?.map((it) => (
                                <>
                                    {it.naturalytelse && (
                                        <DokumentFragment overskrift="Naturalytelse">
                                            {it.naturalytelse}
                                        </DokumentFragment>
                                    )}
                                    {it.fom && (
                                        <DokumentFragment overskrift="Fom">
                                            {dayjs(it.fom).format(NORSK_DATOFORMAT)}
                                        </DokumentFragment>
                                    )}
                                    {it.beloepPrMnd && (
                                        <DokumentFragment overskrift="Beløp per måned">
                                            {toKronerOgØre(it.beloepPrMnd)}
                                        </DokumentFragment>
                                    )}
                                </>
                            ))}
                        </div>
                    )}
                    {(inntektsmelding.gjenopptakelseNaturalytelser?.length ?? 0) > 0 && (
                        <div className={styles.liste}>
                            <Bold size="small">Gjenopptakelse naturalytelser</Bold>
                            {inntektsmelding.gjenopptakelseNaturalytelser?.map((it) => (
                                <>
                                    {it.naturalytelse && (
                                        <DokumentFragment overskrift="Naturalytelse">
                                            {it.naturalytelse}
                                        </DokumentFragment>
                                    )}
                                    {it.fom && (
                                        <DokumentFragment overskrift="Fom">
                                            {dayjs(it.fom).format(NORSK_DATOFORMAT)}
                                        </DokumentFragment>
                                    )}
                                    {it.beloepPrMnd && (
                                        <DokumentFragment overskrift="Beløp per måned">
                                            {toKronerOgØre(it.beloepPrMnd)}
                                        </DokumentFragment>
                                    )}
                                </>
                            ))}
                        </div>
                    )}
                    {(inntektsmelding.arbeidsgiverperioder?.length ?? 0) > 0 && (
                        <div className={styles.liste}>
                            <Bold size="small">Arbeidsgiverperioder</Bold>
                            {inntektsmelding.arbeidsgiverperioder?.map((it) => (
                                <BodyShort size="small">
                                    {it.fom && dayjs(it.fom).format(NORSK_DATOFORMAT)} –{' '}
                                    {it.tom && dayjs(it.tom).format(NORSK_DATOFORMAT)}
                                </BodyShort>
                            ))}
                        </div>
                    )}
                    {(inntektsmelding.ferieperioder?.length ?? 0) > 0 && (
                        <div className={styles.liste}>
                            <Bold size="small">Ferieperioder</Bold>
                            {inntektsmelding.ferieperioder?.map((it) => (
                                <BodyShort size="small">
                                    {it.fom && dayjs(it.fom).format(NORSK_DATOFORMAT)} –{' '}
                                    {it.tom && dayjs(it.tom).format(NORSK_DATOFORMAT)}
                                </BodyShort>
                            ))}
                        </div>
                    )}
                    {inntektsmelding.foersteFravaersdag && (
                        <DokumentFragment overskrift="Første fraværsdag">
                            {dayjs(inntektsmelding.foersteFravaersdag).format(NORSK_DATOFORMAT)}
                        </DokumentFragment>
                    )}
                    {inntektsmelding.naerRelasjon && (
                        <DokumentFragment overskrift="Nær relasjon">
                            {inntektsmelding.naerRelasjon ? 'Ja' : 'Nei'}
                        </DokumentFragment>
                    )}
                    {inntektsmelding.innsenderFulltNavn && (
                        <DokumentFragment overskrift="Innsender fullt navn">
                            {inntektsmelding.innsenderFulltNavn}
                        </DokumentFragment>
                    )}
                    {inntektsmelding.innsenderTelefon && (
                        <DokumentFragment overskrift="Innsender telefon">
                            {inntektsmelding.innsenderTelefon}
                        </DokumentFragment>
                    )}
                </div>
            )}
            {inntektsmeldingssrespons.loading && <DokumentLoader />}
            {inntektsmeldingssrespons.error && <div>Noe gikk feil, vennligst prøv igjen.</div>}
        </div>
    );
};
