import React, { ReactElement } from 'react';

import { BodyShort, HStack } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { PersonFragment } from '@io/graphql';
import { Endringsårsaker } from '@saksbilde/historikk/hendelser/dokument/Endringsårsaker';
import { useHentInntektsmeldingDokumentQuery } from '@state/dokument';
import { finnArbeidsgiverMedOrganisasjonsnummer } from '@state/inntektsforhold/arbeidsgiver';
import { ArbeidsgiverReferanse, lagArbeidsgiverReferanse } from '@state/inntektsforhold/inntektsforhold';
import { somNorskDato } from '@utils/date';
import { capitalizeName, tilTelefonNummer, toKronerOgØre } from '@utils/locale';

import { BestemmendeFraværsdag } from './BestemmendeFraværsdag';
import { DokumentFragment, DokumentFragmentAnonymisert } from './DokumentFragment';
import { DokumentLoader } from './DokumentLoader';

import styles from './Inntektsmeldingsinnhold.module.css';

type InntektsmeldinginnholdProps = {
    dokumentId: string;
    aktørId: string;
    person: PersonFragment;
};

export const Inntektsmeldingsinnhold = ({ dokumentId, aktørId, person }: InntektsmeldinginnholdProps): ReactElement => {
    const { data, isLoading, error } = useHentInntektsmeldingDokumentQuery(aktørId, dokumentId);
    const virksomhetsnummer = data?.virksomhetsnummer;
    const arbeidsgiverReferanse: ArbeidsgiverReferanse | null = virksomhetsnummer
        ? lagArbeidsgiverReferanse(
              virksomhetsnummer,
              finnArbeidsgiverMedOrganisasjonsnummer(person, virksomhetsnummer)?.navn,
          )
        : null;

    return (
        <>
            {data && (
                <div className={styles.dokument}>
                    {arbeidsgiverReferanse && (
                        <HStack gap="3" align="center" className={styles.arbeidsgiver}>
                            <Arbeidsgiverikon />
                            <Inntektsforholdnavn inntektsforholdReferanse={arbeidsgiverReferanse} maxWidth="72%" />
                        </HStack>
                    )}
                    {virksomhetsnummer && (
                        <DokumentFragmentAnonymisert overskrift="Virksomhetsnummer">
                            {virksomhetsnummer}
                        </DokumentFragmentAnonymisert>
                    )}
                    {data.arbeidsforholdId && (
                        <DokumentFragmentAnonymisert overskrift="ArbeidsforholdId">
                            {data.arbeidsforholdId}
                        </DokumentFragmentAnonymisert>
                    )}
                    <Endringsårsaker årsaker={data.inntektEndringAarsaker ?? []} />
                    <BestemmendeFraværsdag førsteFraværsdag={data?.foersteFravaersdag ?? null} />
                    {(data.arbeidsgiverperioder?.length ?? 0) > 0 && (
                        <div className={styles.liste}>
                            <BodyShort weight="semibold" size="small">
                                Arbeidsgiverperioder
                            </BodyShort>
                            {data.arbeidsgiverperioder?.map((it) => (
                                <BodyShort size="small" key={`agperioder${it.fom}-${it.tom}`}>
                                    {it.fom && somNorskDato(it.fom)} – {it.tom && somNorskDato(it.tom)}
                                </BodyShort>
                            ))}
                        </div>
                    )}
                    {data.bruttoUtbetalt != null && (
                        <DokumentFragment overskrift="Brutto utbetalt i AGP">
                            {toKronerOgØre(data.bruttoUtbetalt)}
                        </DokumentFragment>
                    )}
                    {data.begrunnelseForReduksjonEllerIkkeUtbetalt && (
                        <DokumentFragment overskrift="Begrunnelse for reduksjon eller ikke utbetalt">
                            {begrunnelseForReduksjonEllerIkkeUtbetaltMapper(
                                data.begrunnelseForReduksjonEllerIkkeUtbetalt,
                            )}
                        </DokumentFragment>
                    )}
                    {data.beregnetInntekt != null && (
                        <DokumentFragment overskrift="Beregnet inntekt">
                            Beløp pr mnd: {toKronerOgØre(data.beregnetInntekt)}
                        </DokumentFragment>
                    )}
                    {data.refusjon && (
                        <DokumentFragment overskrift="Refusjon">
                            <>
                                {data.refusjon.beloepPrMnd != null &&
                                    `Beløp pr mnd: ${toKronerOgØre(data.refusjon.beloepPrMnd)}`}
                                {data.refusjon.opphoersdato && (
                                    <>
                                        <br />
                                        Opphørsdato: {data.refusjon.opphoersdato}
                                    </>
                                )}
                            </>
                        </DokumentFragment>
                    )}
                    {(data.endringIRefusjoner?.length ?? 0) > 0 && (
                        <div className={styles.liste}>
                            <BodyShort weight="semibold" size="small">
                                Endring i refusjoner
                            </BodyShort>
                            {data.endringIRefusjoner?.map((it) => (
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
                    {(data.ferieperioder?.length ?? 0) > 0 && (
                        <div className={styles.liste}>
                            <BodyShort weight="semibold" size="small">
                                Ferieperioder
                            </BodyShort>
                            {data.ferieperioder?.map((it) => (
                                <BodyShort size="small" key={`ferieperioder${it.fom}`}>
                                    {it.fom && somNorskDato(it.fom)} – {it.tom && somNorskDato(it.tom)}
                                </BodyShort>
                            ))}
                        </div>
                    )}
                    {(data.opphoerAvNaturalytelser?.length ?? 0) > 0 && (
                        <div className={styles.liste}>
                            <BodyShort weight="semibold" size="small">
                                Opphør av naturalytelser
                            </BodyShort>
                            {data.opphoerAvNaturalytelser?.map((it) => (
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
                    {(data.gjenopptakelseNaturalytelser?.length ?? 0) > 0 && (
                        <div className={styles.liste}>
                            <BodyShort weight="semibold" size="small">
                                Gjenopptakelse naturalytelser
                            </BodyShort>
                            {data.gjenopptakelseNaturalytelser?.map((it) => (
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
                    {data.naerRelasjon && (
                        <DokumentFragment overskrift="Nær relasjon">
                            {data.naerRelasjon ? 'Ja' : 'Nei'}
                        </DokumentFragment>
                    )}
                    {data.innsenderFulltNavn && (
                        <DokumentFragmentAnonymisert overskrift="Innsender fullt navn">
                            {capitalizeName(data.innsenderFulltNavn)}
                        </DokumentFragmentAnonymisert>
                    )}
                    {data.innsenderTelefon && (
                        <DokumentFragmentAnonymisert overskrift="Innsender telefon">
                            {tilTelefonNummer(data.innsenderTelefon)}
                        </DokumentFragmentAnonymisert>
                    )}
                    {data.avsenderSystem && (
                        <DokumentFragment overskrift="Avsendersystem">
                            {tilAvsendersystem(data.avsenderSystem?.navn ?? '') ?? ''}
                        </DokumentFragment>
                    )}
                </div>
            )}
            {isLoading && <DokumentLoader />}
            {error && <div>Noe gikk galt, vennligst prøv igjen.</div>}
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
