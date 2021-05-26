import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import { Dagtype, Periodetype } from 'internal-types';
import React from 'react';

import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import '@navikt/helse-frontend-logg/lib/main.css';

import { Flex } from '../../../components/Flex';
import { Clipboard } from '../../../components/clipboard';
import { Maksdatoikon } from '../../../components/ikoner/Maksdatoikon';
import { Skjæringstidspunktikon } from '../../../components/ikoner/Skjæringstidspunktikon';
import { Sykmeldingsperiodeikon } from '../../../components/ikoner/Sykmeldingsperiodeikon';
import { useArbeidsgivernavn } from '../../../modell/Arbeidsgiver';
import {
    Tidslinjeperiode,
    useGjenståendeDager,
    useMaksdato,
    useNettobeløp,
} from '../../../modell/UtbetalingshistorikkElement';
import { useSykepengegrunnlag } from '../../../state/person';
import { useOppgavereferanse } from '../../../state/tidslinje';
import { NORSK_DATOFORMAT_KORT } from '../../../utils/date';
import { somPenger } from '../../../utils/locale';

import { Oppgaveetikett } from '../../oversikt/Oppgaveetikett';
import { LoggHeader } from '../Saksbilde';
import { Sakslinje } from '../sakslinje/Sakslinje';
import { Utbetalingsdialog } from '../utbetaling/Oppsummering/utbetaling/Utbetalingsdialog';
import { Utbetalingsoversikt } from '../utbetaling/Utbetalingsoversikt';

const Arbeidsflate = styled.section`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 17.5rem;
    padding: 2rem 0 2rem 2rem;
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
    font-size: 14px;
    margin-bottom: 0.25rem;
    color: #59514b;

    > * {
        margin-right: 12px;
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
                        sykdomstidslinje={aktivPeriode.sykdomstidslinje}
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
    const oppgavereferanse = useOppgavereferanse(aktivPeriode.beregningId);

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
            <Utbetalingsdialog oppgavereferanse={oppgavereferanse} godkjenningsknappTekst={'Revurder'} />
        </Arbeidsflate>
    );
};

interface PeriodeKortProps {
    periode: string;
    maksdato: string;
    gjenståendeDager: number;
    skjæringstidspunkt: string;
}

const PeriodeKort = ({ periode, maksdato, skjæringstidspunkt, gjenståendeDager }: PeriodeKortProps) => {
    return (
        <Kort>
            <Korttittel>
                <Oppgaveetikett type={Periodetype.Revurdering} />
                REVURDERINGSPERIODE
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
            <Korttittel>{arbeidsgivernavn}</Korttittel>
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
            <Korttittel>TIL UTBETALING</Korttittel>
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
