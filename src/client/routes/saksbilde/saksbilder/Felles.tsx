import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import { Arbeidsforhold, Dagtype, Periodetype, Simulering } from 'internal-types';
import React, { useState } from 'react';

import Lenke from 'nav-frontend-lenker';
import { Feilmelding, Normaltekst, Undertekst, UndertekstBold, Undertittel } from 'nav-frontend-typografi';

import { Flex } from '../../../components/Flex';
import { LovdataLenke } from '../../../components/LovdataLenke';
import { Clipboard } from '../../../components/clipboard';
import { Advarselikon } from '../../../components/ikoner/Advarselikon';
import { Maksdatoikon } from '../../../components/ikoner/Maksdatoikon';
import { Skjæringstidspunktikon } from '../../../components/ikoner/Skjæringstidspunktikon';
import { Sykmeldingsperiodeikon } from '../../../components/ikoner/Sykmeldingsperiodeikon';
import { Tidslinjetilstand } from '../../../mapping/arbeidsgiver';
import {
    Periodetype as Historikkperiodetype,
    Tidslinjeperiode,
    useGjenståendeDager,
    useNettobeløp,
} from '../../../modell/UtbetalingshistorikkElement';
import { useSykepengegrunnlag } from '../../../state/person';
import { harOppgave, useVedtaksperiode } from '../../../state/tidslinje';
import { NORSK_DATOFORMAT, NORSK_DATOFORMAT_KORT } from '../../../utils/date';
import { somPenger } from '../../../utils/locale';

import { getAnonymArbeidsgiverForOrgnr } from '../../../agurkdata';
import { SimuleringsinfoModal } from '../utbetaling/Oppsummering/SimuleringsinfoModal';
import { Utbetaling } from '../utbetaling/Oppsummering/utbetaling/Utbetaling';
import { Vilkårsliste } from '../utbetaling/Vilkårsoversikt';
import { Oppgavetype } from './Oppgavetype';

const Kort = styled.section`
    padding-bottom: 0;
    &:not(:last-of-type) {
        margin-bottom: 2rem;
    }
`;

const Korttittel = styled(Undertittel)`
    display: flex;
    align-items: center;
    font-size: 16px;
    margin-bottom: 0.25rem;

    a {
        color: inherit;

        &:hover {
            text-decoration: none;
        }

        &:active,
        &:focus {
            outline: none;
            color: var(--navds-color-text-inverse);
            text-decoration: none;
            background-color: var(--navds-text-focus);
            box-shadow: 0 0 0 2px var(--navds-text-focus);
        }
    }
`;

export const StyledUndertekstBold = styled(UndertekstBold)`
    letter-spacing: 0.4px;
    color: #59514b;
`;

const PeriodetypeEtikett = (periode: Tidslinjeperiode) => {
    const vedtaksperiode = useVedtaksperiode(periode.id);
    if (periode.type === Historikkperiodetype.REVURDERING) return <Oppgavetype periodetype={Periodetype.Revurdering} />;
    return <Oppgavetype periodetype={vedtaksperiode?.periodetype} />;
};

interface PeriodeKortProps {
    aktivPeriode: Tidslinjeperiode;
    maksdato: string;
    over67år: boolean;
    gjenståendeDager?: number;
    skjæringstidspunkt: string;
}

export const PeriodeKort = ({
    aktivPeriode,
    maksdato,
    over67år,
    skjæringstidspunkt,
    gjenståendeDager,
}: PeriodeKortProps) => {
    const periode = `${aktivPeriode.fom.format(NORSK_DATOFORMAT_KORT)} - ${aktivPeriode.tom.format(
        NORSK_DATOFORMAT_KORT
    )}`;

    return (
        <Kort>
            <Korttittel>{PeriodetypeEtikett(aktivPeriode)}</Korttittel>
            <IkonOgTekst tekst={periode} Ikon={<Sykmeldingsperiodeikon />} />
            <IkonOgTekst tekst={skjæringstidspunkt} Ikon={<Skjæringstidspunktikon />} />

            <Flex style={{ justifyContent: 'space-between' }}>
                <IkonOgTekst
                    tekst={`${maksdato} (${gjenståendeDager ?? 'Ukjent antall'} dager igjen)`}
                    Ikon={<Maksdatoikon />}
                />
                {over67år && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Advarselikon height={16} width={16} />
                        <Undertekst style={{ marginLeft: '4px' }}>
                            <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                        </Undertekst>
                    </div>
                )}
            </Flex>
        </Kort>
    );
};

interface ArbeidsgiverKortProps {
    arbeidsgivernavn: string;
    organisasjonsnummer: string;
    arbeidsforhold: Arbeidsforhold[];
    anonymiseringEnabled?: boolean;
    månedsbeløp?: number;
}

export const ArbeidsgiverKort = ({
    arbeidsgivernavn,
    organisasjonsnummer,
    arbeidsforhold,
    månedsbeløp,
    anonymiseringEnabled = false,
}: ArbeidsgiverKortProps) => {
    return (
        <Kort>
            <Korttittel>
                <StyledUndertekstBold>
                    {anonymiseringEnabled
                        ? getAnonymArbeidsgiverForOrgnr(organisasjonsnummer).navn.toUpperCase()
                        : arbeidsgivernavn.toUpperCase()}
                </StyledUndertekstBold>
            </Korttittel>
            <Clipboard preserveWhitespace={false} copyMessage="Organisasjonsnummer er kopiert">
                <Normaltekst>
                    {anonymiseringEnabled
                        ? getAnonymArbeidsgiverForOrgnr(organisasjonsnummer).orgnr
                        : organisasjonsnummer}
                </Normaltekst>
            </Clipboard>
            {arbeidsforhold.map((e, i) => (
                <React.Fragment key={i}>
                    <Normaltekst>{`${
                        anonymiseringEnabled ? 'Agurkifisert stillingstittel' : titleCase(e.stillingstittel)
                    }, ${e.stillingsprosent} %`}</Normaltekst>
                    <Normaltekst>
                        {e.startdato.format(NORSK_DATOFORMAT)}
                        {e.sluttdato && ' - ' && e.sluttdato.format(NORSK_DATOFORMAT)}
                    </Normaltekst>
                </React.Fragment>
            ))}
            <Flex flexDirection={'row'} justifyContent={'space-between'}>
                <Normaltekst>Månedsbeløp:</Normaltekst>
                {somPenger(månedsbeløp)}
            </Flex>
        </Kort>
    );
};

interface VilkårKortProps {
    aktivPeriode: Tidslinjeperiode;
}

const VilkårKort = ({ aktivPeriode }: VilkårKortProps) => {
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id);

    if (!vedtaksperiode || !vedtaksperiode.fullstendig) return null;

    return (
        <Kort>
            <Korttittel>
                <StyledUndertekstBold>VILKÅR</StyledUndertekstBold>
            </Korttittel>
            <Vilkårsliste vedtaksperiode={vedtaksperiode} />
        </Kort>
    );
};

interface UtbetalingKortProps {
    beregningId: string;
    utbetalingsdagerTotalt: number;
    nettobeløp?: number;
    ikkeUtbetaltEnda: boolean;
    simulering?: Simulering;
    anonymiseringEnabled: boolean;
}

export const UtbetalingKort = ({
    beregningId,
    utbetalingsdagerTotalt,
    nettobeløp,
    ikkeUtbetaltEnda,
    simulering,
    anonymiseringEnabled,
}: UtbetalingKortProps) => {
    const sykepengegrunnlag = useSykepengegrunnlag(beregningId);
    const [simuleringÅpen, setSimuleringÅpen] = useState(false);
    return (
        <Kort>
            <Korttittel>
                <StyledUndertekstBold>TIL UTBETALING</StyledUndertekstBold>
            </Korttittel>
            <Flex justifyContent="space-between">
                <Normaltekst>Sykepengegrunnlag:</Normaltekst>
                <Normaltekst>{somPenger(sykepengegrunnlag?.sykepengegrunnlag)}</Normaltekst>
            </Flex>
            <Flex justifyContent="space-between">
                <Normaltekst>Totalt antall utbetalingdager:</Normaltekst>
                <Normaltekst>{utbetalingsdagerTotalt}</Normaltekst>
            </Flex>
            <Flex justifyContent="space-between">
                <Normaltekst>{ikkeUtbetaltEnda ? 'Til utbetaling nå:' : 'Utbetalt:'}</Normaltekst>
                <Normaltekst>{nettobeløp ?? 'Ukjent beløp'}</Normaltekst>
            </Flex>
            {simulering ? (
                <Lenke href="#" onClick={() => setSimuleringÅpen(true)}>
                    Simulering
                </Lenke>
            ) : (
                <Feilmelding>Mangler simulering</Feilmelding>
            )}
            {simulering && (
                <SimuleringsinfoModal
                    simulering={simulering}
                    åpenModal={simuleringÅpen}
                    lukkModal={() => setSimuleringÅpen(false)}
                    anonymiseringEnabled={anonymiseringEnabled}
                />
            )}
        </Kort>
    );
};

interface IkonOgTekstProps {
    Ikon: React.ReactNode;
    tekst: string;
}

const IkonOgTekst = ({ Ikon, tekst }: IkonOgTekstProps) => {
    return (
        <Flex alignItems={'center'}>
            {Ikon}
            <Normaltekst style={{ marginLeft: '1rem' }}>{tekst}</Normaltekst>
        </Flex>
    );
};

const Arbeidsflate = styled.section`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 340px;
    min-width: 19.5rem;
    padding: 2rem 1.5rem;
`;

export const VertikalStrek = styled.div`
    width: 1px;
    background: var(--navds-color-border);
    margin: 0;
`;

interface VenstreMenyProps {
    aktivPeriode: Tidslinjeperiode;
    arbeidsgivernavn: string;
    organisasjonsnummer: string;
    arbeidsforhold: Arbeidsforhold[];
    maksdato?: Dayjs;
    skjæringstidspunkt?: Dayjs;
    anonymiseringEnabled: boolean;
}

export const VenstreMeny = ({
    aktivPeriode,
    maksdato,
    arbeidsgivernavn,
    organisasjonsnummer,
    arbeidsforhold,
    anonymiseringEnabled,
    skjæringstidspunkt,
}: VenstreMenyProps) => {
    const gjenståendeDager = useGjenståendeDager(aktivPeriode.beregningId);
    const utbetalingsdagerTotalt = aktivPeriode.utbetalingstidslinje.filter((dag) => dag.type === Dagtype.Syk).length;
    const nettobeløp = useNettobeløp(aktivPeriode.beregningId);
    const ikkeUtbetaltEnda = harOppgave(aktivPeriode) || aktivPeriode.tilstand === Tidslinjetilstand.Venter;
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id);
    const simulering = vedtaksperiode?.simuleringsdata;
    const over67år = (vedtaksperiode?.vilkår?.alder.alderSisteSykedag ?? 0) >= 67;
    const månedsbeløp = vedtaksperiode.inntektsgrunnlag?.inntekter?.find(
        (it) => it.organisasjonsnummer === aktivPeriode.organisasjonsnummer
    )?.omregnetÅrsinntekt?.månedsbeløp;

    return (
        <Arbeidsflate>
            <PeriodeKort
                aktivPeriode={aktivPeriode}
                maksdato={maksdato?.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent maksdato'}
                skjæringstidspunkt={skjæringstidspunkt?.format(NORSK_DATOFORMAT) ?? 'Ukjent skjæringstidspunkt'}
                gjenståendeDager={gjenståendeDager}
                over67år={over67år}
            />
            <ArbeidsgiverKort
                arbeidsgivernavn={arbeidsgivernavn}
                organisasjonsnummer={organisasjonsnummer}
                arbeidsforhold={arbeidsforhold}
                anonymiseringEnabled={anonymiseringEnabled}
                månedsbeløp={månedsbeløp}
            />
            <VilkårKort aktivPeriode={aktivPeriode} />
            <UtbetalingKort
                beregningId={aktivPeriode.beregningId}
                ikkeUtbetaltEnda={ikkeUtbetaltEnda}
                utbetalingsdagerTotalt={utbetalingsdagerTotalt}
                nettobeløp={nettobeløp}
                simulering={simulering}
                anonymiseringEnabled={anonymiseringEnabled}
            />
            <Utbetaling aktivPeriode={aktivPeriode} />
        </Arbeidsflate>
    );
};

const titleCase = (str: string) => {
    return str.replace(/\w\S*/g, (t) => {
        return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
    });
};
