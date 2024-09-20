import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { BodyShort, HStack } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { AnonymizableText, AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import { PersonFragment } from '@io/graphql';
import { useArbeidsgiver } from '@state/arbeidsgiver';
import { DokumenthendelseObject } from '@typer/historikk';
import { NORSK_DATOFORMAT } from '@utils/date';
import { tilTelefonNummer, toKronerOgØre } from '@utils/locale';

import { BestemmendeFraværsdag } from './BestemmendeFraværsdag';
import { DokumentFragment } from './DokumentFragment';
import { DokumentLoader } from './DokumentLoader';
import { useQueryInntektsmelding } from './queries';

import styles from './Inntektsmeldingsinnhold.module.css';

type InntektsmeldinginnholdProps = {
    dokumentId: DokumenthendelseObject['dokumentId'];
    fødselsnummer: string;
    person: PersonFragment;
};

export const Inntektsmeldingsinnhold = ({
    dokumentId,
    fødselsnummer,
    person,
}: InntektsmeldinginnholdProps): ReactElement => {
    const inntektsmeldingssrespons = useQueryInntektsmelding(fødselsnummer, dokumentId ?? '');
    const inntektsmelding = inntektsmeldingssrespons.data;
    const arbeidsgiverNavn = useArbeidsgiver(person, inntektsmelding?.virksomhetsnummer ?? '')?.navn;

    return (
        <div>
            {inntektsmelding && (
                <div className={styles.dokument}>
                    {arbeidsgiverNavn && (
                        <HStack gap="3" className={styles.arbeidsgiver}>
                            <ArbeidsgiverikonMedTooltip />
                            <AnonymizableTextWithEllipsis className={styles.arbeidsgivernavn}>
                                {arbeidsgiverNavn}
                            </AnonymizableTextWithEllipsis>
                        </HStack>
                    )}
                    {inntektsmelding.virksomhetsnummer && (
                        <DokumentFragment overskrift="Virksomhetsnummer">
                            <AnonymizableText>{inntektsmelding.virksomhetsnummer}</AnonymizableText>
                        </DokumentFragment>
                    )}
                    {inntektsmelding.arbeidsforholdId && (
                        <DokumentFragment overskrift="ArbeidsforholdId">
                            <AnonymizableText>{inntektsmelding.arbeidsforholdId}</AnonymizableText>
                        </DokumentFragment>
                    )}
                    {inntektsmelding.inntektEndringAarsak && (
                        <div className={styles.inntektEndringAarsak}>
                            <Bold size="small" className={styles.fullBredde}>
                                Endringsårsak
                            </Bold>
                            <BodyShort size="small">Årsak:</BodyShort>
                            <BodyShort size="small">{inntektsmelding.inntektEndringAarsak.aarsak}</BodyShort>
                            {inntektsmelding.inntektEndringAarsak.perioder && (
                                <>
                                    <BodyShort size="small">Perioder: </BodyShort>
                                    <BodyShort size="small">
                                        {inntektsmelding.inntektEndringAarsak?.perioder
                                            ?.map(
                                                (it) =>
                                                    it.fom &&
                                                    `${dayjs(it.fom).format(NORSK_DATOFORMAT)} – 
                                                ${it.tom && dayjs(it.tom).format(NORSK_DATOFORMAT)}`,
                                            )
                                            .join(', ')
                                            .replace(/,(?=[^,]*$)/, ' og')}
                                    </BodyShort>
                                </>
                            )}
                            {inntektsmelding.inntektEndringAarsak.gjelderFra && (
                                <>
                                    <BodyShort size="small">Gjelder fra:</BodyShort>
                                    <BodyShort size="small">
                                        {dayjs(inntektsmelding.inntektEndringAarsak.gjelderFra).format(
                                            NORSK_DATOFORMAT,
                                        )}
                                    </BodyShort>
                                </>
                            )}
                            {inntektsmelding.inntektEndringAarsak.bleKjent && (
                                <>
                                    <BodyShort size="small">Ble kjent:</BodyShort>
                                    <BodyShort size="small">
                                        {dayjs(inntektsmelding.inntektEndringAarsak.bleKjent).format(NORSK_DATOFORMAT)}
                                    </BodyShort>
                                </>
                            )}
                        </div>
                    )}
                    <BestemmendeFraværsdag førsteFraværsdag={inntektsmelding?.foersteFravaersdag ?? null} />
                    {(inntektsmelding.arbeidsgiverperioder?.length ?? 0) > 0 && (
                        <div className={styles.liste}>
                            <Bold size="small">Arbeidsgiverperioder</Bold>
                            {inntektsmelding.arbeidsgiverperioder?.map((it) => (
                                <BodyShort size="small" key={`agperioder${it.fom}-${it.tom}`}>
                                    {it.fom && dayjs(it.fom).format(NORSK_DATOFORMAT)} –{' '}
                                    {it.tom && dayjs(it.tom).format(NORSK_DATOFORMAT)}
                                </BodyShort>
                            ))}
                        </div>
                    )}
                    {inntektsmelding.bruttoUtbetalt != null && (
                        <DokumentFragment overskrift="Brutto utbetalt i AGP">
                            {toKronerOgØre(inntektsmelding.bruttoUtbetalt)}
                        </DokumentFragment>
                    )}
                    {inntektsmelding.begrunnelseForReduksjonEllerIkkeUtbetalt && (
                        <DokumentFragment overskrift="Begrunnelse for reduksjon eller ikke utbetalt">
                            {inntektsmelding.begrunnelseForReduksjonEllerIkkeUtbetalt}
                        </DokumentFragment>
                    )}
                    {inntektsmelding.beregnetInntekt != null && (
                        <DokumentFragment overskrift="Beregnet inntekt">
                            Beløp pr mnd: {toKronerOgØre(inntektsmelding.beregnetInntekt)}
                        </DokumentFragment>
                    )}
                    {inntektsmelding.refusjon && (
                        <DokumentFragment overskrift="Refusjon">
                            <>
                                {inntektsmelding.refusjon.beloepPrMnd != null &&
                                    `Beløp pr mnd: ${toKronerOgØre(inntektsmelding.refusjon.beloepPrMnd)}`}
                                {inntektsmelding.refusjon.opphoersdato && (
                                    <>
                                        <br />
                                        Opphørsdato: {inntektsmelding.refusjon.opphoersdato}
                                    </>
                                )}
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
                                    {it.beloep != null && (
                                        <DokumentFragment overskrift="Beløp">
                                            {toKronerOgØre(it.beloep)}
                                        </DokumentFragment>
                                    )}
                                </>
                            ))}
                        </div>
                    )}
                    {(inntektsmelding.ferieperioder?.length ?? 0) > 0 && (
                        <div className={styles.liste}>
                            <Bold size="small">Ferieperioder</Bold>
                            {inntektsmelding.ferieperioder?.map((it) => (
                                <BodyShort size="small" key={`ferieperioder${it.fom}`}>
                                    {it.fom && dayjs(it.fom).format(NORSK_DATOFORMAT)} –{' '}
                                    {it.tom && dayjs(it.tom).format(NORSK_DATOFORMAT)}
                                </BodyShort>
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
                                    {it.beloepPrMnd != null && (
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
                                    {it.beloepPrMnd != null && (
                                        <DokumentFragment overskrift="Beløp per måned">
                                            {toKronerOgØre(it.beloepPrMnd)}
                                        </DokumentFragment>
                                    )}
                                </>
                            ))}
                        </div>
                    )}
                    {inntektsmelding.naerRelasjon && (
                        <DokumentFragment overskrift="Nær relasjon">
                            {inntektsmelding.naerRelasjon ? 'Ja' : 'Nei'}
                        </DokumentFragment>
                    )}
                    {inntektsmelding.innsenderFulltNavn && (
                        <DokumentFragment overskrift="Innsender fullt navn">
                            <AnonymizableContainer as="span">
                                {inntektsmelding.innsenderFulltNavn}
                            </AnonymizableContainer>
                        </DokumentFragment>
                    )}
                    {inntektsmelding.innsenderTelefon && (
                        <DokumentFragment overskrift="Innsender telefon">
                            <AnonymizableContainer as="span">
                                {tilTelefonNummer(inntektsmelding.innsenderTelefon)}
                            </AnonymizableContainer>
                        </DokumentFragment>
                    )}
                    {inntektsmelding.avsenderSystem && (
                        <DokumentFragment overskrift="Avsendersystem">
                            {tilAvsendersystem(inntektsmelding.avsenderSystem?.navn ?? '') ?? ''}
                        </DokumentFragment>
                    )}
                </div>
            )}
            {inntektsmeldingssrespons.loading && <DokumentLoader />}
            {inntektsmeldingssrespons.error && <div>{inntektsmeldingssrespons.error.message}</div>}
        </div>
    );
};

const tilAvsendersystem = (avsenderSystem: string): string => {
    switch (avsenderSystem) {
        case 'NAV_NO':
            return 'NAV';
        case String(avsenderSystem.match(/SAP.*/)):
            return 'SAP';
        default:
            return avsenderSystem;
    }
};
