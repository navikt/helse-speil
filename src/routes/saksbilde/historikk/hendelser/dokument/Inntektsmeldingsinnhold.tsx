import React, { ReactElement } from 'react';

import { BodyShort, HStack } from '@navikt/ds-react';

import { Arbeidsgivernavn } from '@components/Inntektsforholdnavn';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { PersonFragment } from '@io/graphql';
import { Endringsårsaker } from '@saksbilde/historikk/hendelser/dokument/Endringsårsaker';
import { finnArbeidsgiver } from '@state/inntektsforhold/arbeidsgiver';
import { DokumenthendelseObject } from '@typer/historikk';
import { somNorskDato } from '@utils/date';
import { capitalizeName, tilTelefonNummer, toKronerOgØre } from '@utils/locale';

import { BestemmendeFraværsdag } from './BestemmendeFraværsdag';
import { DokumentFragment, DokumentFragmentAnonymisert } from './DokumentFragment';
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
    const virksomhetsnummer = inntektsmelding?.virksomhetsnummer;
    const arbeidsgivernavn = finnArbeidsgiver(person, virksomhetsnummer ?? '')?.navn;

    return (
        <>
            {inntektsmelding && (
                <div className={styles.dokument}>
                    {virksomhetsnummer && (
                        <HStack gap="3" align="center" className={styles.arbeidsgiver}>
                            <Arbeidsgiverikon />
                            <Arbeidsgivernavn
                                identifikator={virksomhetsnummer}
                                navn={arbeidsgivernavn}
                                maxWidth="72%"
                            />
                        </HStack>
                    )}
                    {virksomhetsnummer && (
                        <DokumentFragmentAnonymisert overskrift="Virksomhetsnummer">
                            {virksomhetsnummer}
                        </DokumentFragmentAnonymisert>
                    )}
                    {inntektsmelding.arbeidsforholdId && (
                        <DokumentFragmentAnonymisert overskrift="ArbeidsforholdId">
                            {inntektsmelding.arbeidsforholdId}
                        </DokumentFragmentAnonymisert>
                    )}
                    <Endringsårsaker årsaker={inntektsmelding.inntektEndringAarsaker} />
                    <BestemmendeFraværsdag førsteFraværsdag={inntektsmelding?.foersteFravaersdag ?? null} />
                    {(inntektsmelding.arbeidsgiverperioder?.length ?? 0) > 0 && (
                        <div className={styles.liste}>
                            <BodyShort weight="semibold" size="small">
                                Arbeidsgiverperioder
                            </BodyShort>
                            {inntektsmelding.arbeidsgiverperioder?.map((it) => (
                                <BodyShort size="small" key={`agperioder${it.fom}-${it.tom}`}>
                                    {it.fom && somNorskDato(it.fom)} – {it.tom && somNorskDato(it.tom)}
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
                            {begrunnelseForReduksjonEllerIkkeUtbetaltMapper(
                                inntektsmelding.begrunnelseForReduksjonEllerIkkeUtbetalt,
                            )}
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
                            <BodyShort weight="semibold" size="small">
                                Endring i refusjoner
                            </BodyShort>
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
                            <BodyShort weight="semibold" size="small">
                                Ferieperioder
                            </BodyShort>
                            {inntektsmelding.ferieperioder?.map((it) => (
                                <BodyShort size="small" key={`ferieperioder${it.fom}`}>
                                    {it.fom && somNorskDato(it.fom)} – {it.tom && somNorskDato(it.tom)}
                                </BodyShort>
                            ))}
                        </div>
                    )}
                    {(inntektsmelding.opphoerAvNaturalytelser?.length ?? 0) > 0 && (
                        <div className={styles.liste}>
                            <BodyShort weight="semibold" size="small">
                                Opphør av naturalytelser
                            </BodyShort>
                            {inntektsmelding.opphoerAvNaturalytelser?.map((it) => (
                                <>
                                    {it.naturalytelse && (
                                        <DokumentFragment overskrift="Naturalytelse">
                                            {it.naturalytelse}
                                        </DokumentFragment>
                                    )}
                                    {it.fom && (
                                        <DokumentFragment overskrift="Fom">{somNorskDato(it.fom)}</DokumentFragment>
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
                            <BodyShort weight="semibold" size="small">
                                Gjenopptakelse naturalytelser
                            </BodyShort>
                            {inntektsmelding.gjenopptakelseNaturalytelser?.map((it) => (
                                <>
                                    {it.naturalytelse && (
                                        <DokumentFragment overskrift="Naturalytelse">
                                            {it.naturalytelse}
                                        </DokumentFragment>
                                    )}
                                    {it.fom && (
                                        <DokumentFragment overskrift="Fom">{somNorskDato(it.fom)}</DokumentFragment>
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
                        <DokumentFragmentAnonymisert overskrift="Innsender fullt navn">
                            {capitalizeName(inntektsmelding.innsenderFulltNavn)}
                        </DokumentFragmentAnonymisert>
                    )}
                    {inntektsmelding.innsenderTelefon && (
                        <DokumentFragmentAnonymisert overskrift="Innsender telefon">
                            {tilTelefonNummer(inntektsmelding.innsenderTelefon)}
                        </DokumentFragmentAnonymisert>
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
        </>
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

function begrunnelseForReduksjonEllerIkkeUtbetaltMapper(begrunnelse: string) {
    switch (begrunnelse) {
        case 'ArbeidOpphoert':
            return 'Arbeid opphørt';
        case 'BeskjedGittForSent':
            return 'Beskjed gitt for sent';
        case 'BetvilerArbeidsufoerhet':
            return 'Betviler arbeidsuførhet';
        case 'FerieEllerAvspasering':
            return 'Ferie eller avspasering';
        case 'FiskerMedHyre':
            return 'Fisker med hyre';
        case 'FravaerUtenGyldigGrunn':
            return 'Fravær uten gyldig grunn';
        case 'IkkeFravaer':
            return 'Ikke fravær';
        case 'IkkeFullStillingsandel':
            return 'Ikke full stillingsandel';
        case 'IkkeLoenn':
            return 'Ikke lønn';
        case 'LovligFravaer':
            return 'Lovlig fravær';
        case 'ManglerOpptjening':
            return 'Mangler opptjening';
        case 'Saerregler':
            return 'Særregler';
        case 'StreikEllerLockout':
            return 'Streik eller lockout';
        case 'TidligereVirksomhet':
            return 'Tidligere virksomhet';
    }
    return begrunnelse;
}
