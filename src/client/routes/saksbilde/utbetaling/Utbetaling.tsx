import React from 'react';
import styled from '@emotion/styled';
import Oppsummering from './Oppsummering/Oppsummering';
import { Link } from 'react-router-dom';
import { Flex } from '../../../components/Flex';
import { Clipboard } from '../../../components/clipboard';
import { somPenger } from '../../../utils/locale';
import { Vilkårsliste } from './Vilkårsoversikt';
import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import { Utbetalingsoversikt } from './Utbetalingsoversikt';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { NORSK_DATOFORMAT, NORSK_DATOFORMAT_KORT } from '../../../utils/date';
import { Arbeidsforhold } from '../Arbeidsforhold';
import { Arbeidsforhold as ArbeidsforholdListe, Periode, Sykdomsdag, Utbetalingsdag } from 'internal-types';
import { usePerson, useSkalAnonymiserePerson } from '../../../state/person';
import { getAnonymArbeidsgiverForOrgnr } from '../../../agurkdata';
import { useAktivVedtaksperiode } from '../../../state/tidslinje';
import { Dayjs } from 'dayjs';

const Arbeidsflate = styled.section`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 17.5rem;
    padding: 2rem 0;
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

const Lenke = styled(Link)`
    color: inherit;

    &:hover {
        text-decoration: none;
    }

    &:active,
    &:focus-visible {
        outline: none;
        color: var(--navds-color-text-inverse);
        text-decoration: none;
        background-color: var(--navds-text-focus);
        box-shadow: 0 0 0 2px var(--navds-text-focus);
    }
`;

export interface UtbetalingProps {
    skjæringstidspunkt?: Dayjs;
    gjenståendeDager?: number;
    maksdato?: Dayjs;
    periode: Periode;
    utbetalingstidslinje: Utbetalingsdag[];
    sykdomstidslinje: Sykdomsdag[];
    organisasjonsnummer: string;
    arbeidsgivernavn: string;
    arbeidsforhold: ArbeidsforholdListe[];
    månedsbeløp?: number;
}

export const Utbetaling = ({
    skjæringstidspunkt,
    gjenståendeDager,
    maksdato,
    periode,
    utbetalingstidslinje,
    sykdomstidslinje,
    arbeidsforhold,
    organisasjonsnummer,
    arbeidsgivernavn,
    månedsbeløp,
}: UtbetalingProps) => {
    const aktivVedtaksperiode = useAktivVedtaksperiode();
    const personTilBehandling = usePerson();
    const anonymiseringEnabled = useSkalAnonymiserePerson();

    if (!aktivVedtaksperiode || !personTilBehandling) return null;

    const skjæringstidspunktForVisning = skjæringstidspunkt?.format(NORSK_DATOFORMAT) ?? 'Ukjent dato';

    const periodeFom = periode.fom.format(NORSK_DATOFORMAT_KORT);
    const periodeTom = periode.tom.format(NORSK_DATOFORMAT_KORT);

    return (
        <AgurkErrorBoundary sidenavn="Utbetaling">
            <Flex style={{ height: '100%' }}>
                <Arbeidsflate>
                    <Kort>
                        <Korttittel>
                            <Lenke to={`${personTilBehandling?.aktørId}/../sykmeldingsperiode`}>
                                Sykmeldingsperiode
                            </Lenke>
                        </Korttittel>
                        <Flex justifyContent="space-between">
                            <Normaltekst>Periode</Normaltekst>
                            <Normaltekst>
                                {periodeFom} - {periodeTom}
                            </Normaltekst>
                        </Flex>
                        <Flex justifyContent="space-between">
                            <Normaltekst>Skjæringstidspunkt</Normaltekst>
                            <Normaltekst>{skjæringstidspunktForVisning}</Normaltekst>
                        </Flex>
                    </Kort>
                    <Kort>
                        <Korttittel>
                            <Lenke to={`${personTilBehandling?.aktørId}/../sykepengegrunnlag`}>
                                {anonymiseringEnabled
                                    ? getAnonymArbeidsgiverForOrgnr(organisasjonsnummer).navn
                                    : arbeidsgivernavn}
                            </Lenke>
                        </Korttittel>
                        <Clipboard preserveWhitespace={false} copyMessage="Organisasjonsnummer er kopiert">
                            <Normaltekst>
                                {anonymiseringEnabled
                                    ? getAnonymArbeidsgiverForOrgnr(organisasjonsnummer).orgnr
                                    : organisasjonsnummer}
                            </Normaltekst>
                        </Clipboard>
                        {arbeidsforhold.map((it) => (
                            <Arbeidsforhold anonymiseringEnabled={anonymiseringEnabled} {...it} />
                        ))}
                        <Flex justifyContent="space-between">
                            <Normaltekst>Månedsbeløp</Normaltekst>
                            <Normaltekst>{somPenger(månedsbeløp)}</Normaltekst>
                        </Flex>
                    </Kort>
                    <Kort>
                        <Korttittel>
                            <Lenke to={`${personTilBehandling?.aktørId}/../vilkår`}>Vilkår</Lenke>
                        </Korttittel>
                        <Vilkårsliste vedtaksperiode={aktivVedtaksperiode} />
                    </Kort>
                    <Kort>
                        <Korttittel>Utbetaling</Korttittel>
                        <Oppsummering />
                    </Kort>
                </Arbeidsflate>
                <VertikalStrek />
                <Utbetalingsoversikt
                    maksdato={maksdato}
                    gjenståendeDager={gjenståendeDager}
                    periode={periode}
                    utbetalingstidslinje={utbetalingstidslinje}
                    sykdomstidslinje={sykdomstidslinje}
                />
            </Flex>
        </AgurkErrorBoundary>
    );
};
