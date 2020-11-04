import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { PersonContext } from '../../../context/PersonContext';
import { NORSK_DATOFORMAT, NORSK_DATOFORMAT_KORT } from '../../../utils/date';
import { Arbeidsgiverikon } from '../../../components/ikoner/Arbeidsgiverikon';
import { Clipboard } from '../../../components/clipboard';
import { somPenger } from '../../../utils/locale';
import { Vilkårsliste } from './Vilkårsoversikt';
import Oppsummering from './Oppsummering/Oppsummering';
import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import { Link } from 'react-router-dom';
import { Flex } from '../../../components/Flex';
import { Utbetalingsoversikt } from './Utbetalingsoversikt';

const Arbeidsflate = styled.section`
    display: grid;
    grid-template-columns: 18rem auto;
    grid-column-gap: 1rem;
    grid-template-areas:
        'sykmeldingsperiode tabell'
        'arbeidsgiver       tabell'
        'vilkår             tabell'
        'utbetaling         tabell';
`;

const Kort = styled.section`
    margin-bottom: 1rem;
`;

const Sykmeldingsperiode = styled(Kort)`
    grid-area: sykmeldingsperiode;
    padding-bottom: 2rem;
    border-bottom: 1px solid #c6c2bf;
`;

const Arbeidsgiver = styled(Kort)`
    grid-area: arbeidsgiver;
    padding-bottom: 2rem;
    border-bottom: 1px solid #c6c2bf;
`;

const Vilkårkort = styled(Kort)`
    grid-area: vilkår;
    padding-bottom: 2rem;
    border-bottom: 1px solid #c6c2bf;
`;

const Utbetalingkort = styled(Kort)`
    grid-area: utbetaling;
`;

const Utbetalingstabell = styled.article`
    grid-area: tabell;
    padding-left: 2rem;
    border-left: 1px solid #c6c2bf;
`;

const Korttittel = styled(Undertittel)`
    display: flex;
    align-items: center;
    font-size: 18px;
    margin-bottom: 1rem;
    a {
        color: inherit;
        &:hover {
            text-decoration: none;
        }
        &:active,
        &:focus {
            outline: none;
            color: #fff;
            text-decoration: none;
            background-color: #254b6d;
            box-shadow: 0 0 0 2px #254b6d;
        }
    }
`;

const Koffert = styled(Arbeidsgiverikon)`
    margin-right: 1rem;
`;

const Lenke = styled(Link)`
    color: inherit;
    &:hover {
        text-decoration: none;
    }
    &:active,
    &:focus-visible {
        outline: none;
        color: #fff;
        text-decoration: none;
        background-color: #254b6d;
        box-shadow: 0 0 0 2px #254b6d;
    }
`;

export const Utbetaling = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);

    if (!aktivVedtaksperiode) return null;

    const skjæringstidspunkt = aktivVedtaksperiode.vilkår?.dagerIgjen?.skjæringstidspunkt
        ? aktivVedtaksperiode.vilkår.dagerIgjen.skjæringstidspunkt.format(NORSK_DATOFORMAT)
        : 'Ukjent dato';

    const periodeFom = aktivVedtaksperiode?.fom.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent';
    const periodeTom = aktivVedtaksperiode?.tom.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent';
    const { organisasjonsnummer, månedsinntekt } = aktivVedtaksperiode.inntektskilder[0];

    return (
        <Arbeidsflate>
            <AgurkErrorBoundary sidenavn="Utbetaling">
                <Sykmeldingsperiode>
                    <Korttittel>
                        <Lenke to={`${personTilBehandling?.aktørId}/../sykmeldingsperiode`}>Sykmeldingsperiode</Lenke>
                    </Korttittel>
                    <Flex justifyContent="space-between">
                        <Normaltekst>Periode</Normaltekst>
                        <Normaltekst>
                            {periodeFom} - {periodeTom}
                        </Normaltekst>
                    </Flex>
                    <Flex justifyContent="space-between">
                        <Normaltekst>Skjæringstidspunkt</Normaltekst>
                        <Normaltekst>{skjæringstidspunkt}</Normaltekst>
                    </Flex>
                </Sykmeldingsperiode>
                <Arbeidsgiver>
                    <Korttittel>
                        <Koffert height={20} />
                        <Lenke to={`${personTilBehandling?.aktørId}/../sykepengegrunnlag`}>Arbeidsgiver</Lenke>
                    </Korttittel>
                    <Clipboard preserveWhitespace={false}>
                        <Normaltekst>{organisasjonsnummer}</Normaltekst>
                    </Clipboard>
                    <Flex justifyContent="space-between">
                        <Normaltekst>Månedsbeløp</Normaltekst>
                        <Normaltekst>{somPenger(månedsinntekt)}</Normaltekst>
                    </Flex>
                </Arbeidsgiver>
                <Vilkårkort>
                    <Korttittel>
                        <Lenke to={`${personTilBehandling?.aktørId}/../vilkår`}>Vilkår</Lenke>
                    </Korttittel>
                    <Vilkårsliste vedtaksperiode={aktivVedtaksperiode} />
                </Vilkårkort>
                <Utbetalingkort>
                    <Korttittel>Utbetaling</Korttittel>
                    <Oppsummering />
                </Utbetalingkort>
                <Utbetalingstabell>
                    <Korttittel>Utbetaling</Korttittel>
                    <Utbetalingsoversikt />
                </Utbetalingstabell>
            </AgurkErrorBoundary>
        </Arbeidsflate>
    );
};
