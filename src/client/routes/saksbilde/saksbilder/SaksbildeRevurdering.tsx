import React from 'react';
import { Flex } from '../../../components/Flex';
import { Sakslinje } from '../sakslinje/Sakslinje';
import '@navikt/helse-frontend-logg/lib/main.css';
import {
    Tidslinjeperiode,
    useGjenståendeDager,
    useMaksdato,
    useNettobeløp,
} from '../../../modell/UtbetalingshistorikkElement';
import { useArbeidsgivernavn } from '../../../modell/Arbeidsgiver';
import { LoggHeader } from '../Saksbilde';
import { Normaltekst, UndertekstBold, Undertittel } from 'nav-frontend-typografi';
import styled from '@emotion/styled';
import { NORSK_DATOFORMAT_KORT } from '../../../utils/date';
import { Sykmeldingsperiodeikon } from '../../../components/ikoner/Sykmeldingsperiodeikon';
import { Maksdatoikon } from '../../../components/ikoner/Maksdatoikon';
import { Dayjs } from 'dayjs';
import { Skjæringstidspunktikon } from '../../../components/ikoner/Skjæringstidspunktikon';
import { Clipboard } from '../../../components/clipboard';
import { useSykepengegrunnlag } from '../../../state/person';
import { somPenger } from '../../../utils/locale';
import { Dagtype } from 'internal-types';
import { Utbetalingsoversikt } from '../utbetaling/Utbetalingsoversikt';
import { RevurderingEtikett } from '../../oversikt/Oppgaveetikett';

const Arbeidsflate = styled.section`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 17.5rem;
    padding: 2rem;
    padding-right: 0;
`;

const VertikalStrek = styled.div`
    width: 1px;
    background: var(--navds-color-border);
    margin: 0 2rem;
`;

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

const AutoFlexContainer = styled.div`
    flex: auto;
`;

interface SaksbildeRevurderingProps {
    aktivPeriode: Tidslinjeperiode;
}

export const SaksbildeRevurdering = ({ aktivPeriode }: SaksbildeRevurderingProps) => {
    const arbeidsgivernavn = useArbeidsgivernavn(aktivPeriode.organisasjonsnummer) ?? 'Ukjent';
    const maksdato = useMaksdato(aktivPeriode.beregningId);
    const gjenståendeDager = useGjenståendeDager(aktivPeriode.beregningId);
    const periode = { fom: aktivPeriode.fom, tom: aktivPeriode.tom };
    const utbetalingstidslinje = aktivPeriode.utbetalingstidslinje;
    return (
        <Flex justifyContent="space-between" data-testid="saksbilde-revurdering">
            <AutoFlexContainer>
                <Sakslinje
                    aktivVedtaksperiode={false}
                    arbeidsgivernavn={arbeidsgivernavn}
                    arbeidsgiverOrgnr={aktivPeriode.organisasjonsnummer}
                    fom={aktivPeriode.fom}
                    tom={aktivPeriode.tom}
                    skjæringstidspunkt={undefined}
                    maksdato={maksdato}
                    over67År={undefined}
                />
                <Flex style={{ height: '100%' }}>
                    <VenstreMeny
                        aktivPeriode={aktivPeriode}
                        maksDato={maksdato}
                        arbeidsgivernavn={arbeidsgivernavn}
                        organisasjonsnummer={aktivPeriode.organisasjonsnummer}
                    />
                    <VertikalStrek />
                    <Utbetalingsoversikt
                        maksdato={maksdato}
                        gjenståendeDager={gjenståendeDager}
                        periode={periode}
                        utbetalingstidslinje={utbetalingstidslinje}
                    />
                </Flex>
            </AutoFlexContainer>
            <LoggHeader />
        </Flex>
    );
};

interface VenstreMenyProps {
    aktivPeriode: Tidslinjeperiode;
    maksDato?: Dayjs;
    arbeidsgivernavn: string;
    organisasjonsnummer: string;
}

const VenstreMeny = ({ aktivPeriode, maksDato, arbeidsgivernavn, organisasjonsnummer }: VenstreMenyProps) => {
    const periode = `${aktivPeriode.fom.format(NORSK_DATOFORMAT_KORT)} - ${aktivPeriode.tom.format(
        NORSK_DATOFORMAT_KORT
    )}`;
    const skjæringstidspunkt = 'Ukjent';
    const maksdato = maksDato ? maksDato.format(NORSK_DATOFORMAT_KORT) : 'Ukjent maksdato';
    const gjenståendeDager = useGjenståendeDager(aktivPeriode.beregningId);
    const utbetalingsdagerTotalt = aktivPeriode.utbetalingstidslinje.filter((dag) => dag.type === Dagtype.Syk).length;
    const nettobeløp = useNettobeløp(aktivPeriode.beregningId);

    return (
        <Arbeidsflate>
            <PeriodeKort
                periode={periode}
                maksdato={maksdato}
                skjæringstidspunkt={skjæringstidspunkt}
                gjenståendeDager={gjenståendeDager}
            />
            <ArbeidsgiverKort arbeidsgivernavn={arbeidsgivernavn} organisasjonsnummer={organisasjonsnummer} />
            <UtbetalingKort
                beregningId={aktivPeriode.beregningId}
                utbetalingsdagerTotalt={utbetalingsdagerTotalt}
                nettobeløp={nettobeløp}
            />
        </Arbeidsflate>
    );
};

interface PeriodeKortProps {
    periode: string;
    maksdato: string;
    gjenståendeDager: number;
    skjæringstidspunkt: string;
}

const StyledUndertekstBold = styled(UndertekstBold)`
    letter-spacing: 0.4px;
    color: #59514b;
`;

const PeriodeKort = ({ periode, maksdato, skjæringstidspunkt, gjenståendeDager }: PeriodeKortProps) => {
    return (
        <Kort>
            <Korttittel>
                <RevurderingEtikett medLabel label={<StyledUndertekstBold>REVURDERINGSPERIODE</StyledUndertekstBold>} />
            </Korttittel>
            <IkonOgTekst tekst={periode} Ikon={<Sykmeldingsperiodeikon />} />
            <IkonOgTekst tekst={`${maksdato} (${gjenståendeDager} dager igjen)`} Ikon={<Maksdatoikon />} />
            <IkonOgTekst tekst={skjæringstidspunkt} Ikon={<Skjæringstidspunktikon />} />
        </Kort>
    );
};

interface ArbeidsgiverKortProps {
    arbeidsgivernavn: string;
    organisasjonsnummer: string;
}

const ArbeidsgiverKort = ({ arbeidsgivernavn, organisasjonsnummer }: ArbeidsgiverKortProps) => {
    return (
        <Kort>
            <Korttittel>
                <StyledUndertekstBold>{arbeidsgivernavn}</StyledUndertekstBold>
            </Korttittel>
            <Clipboard preserveWhitespace={false} copyMessage="Organisasjonsnummer er kopiert">
                <Normaltekst>{organisasjonsnummer}</Normaltekst>
            </Clipboard>
        </Kort>
    );
};

interface UtbetalingKortProps {
    beregningId: string;
    utbetalingsdagerTotalt: number;
    nettobeløp: number;
}

const UtbetalingKort = ({ beregningId, utbetalingsdagerTotalt, nettobeløp }: UtbetalingKortProps) => {
    const sykepengegrunnlag = useSykepengegrunnlag(beregningId);
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
                <Normaltekst>Til utbetaling nå:</Normaltekst>
                <Normaltekst>{nettobeløp}</Normaltekst>
            </Flex>
        </Kort>
    );
};

interface IkonOgTekstProps {
    Ikon: React.ReactNode;
    tekst: string;
}

const IkonOgTekst = ({ Ikon, tekst }: IkonOgTekstProps) => {
    return (
        <Normaltekst>
            {Ikon} {'\u00A0'} {tekst}
        </Normaltekst>
    );
};
