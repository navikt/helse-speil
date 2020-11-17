import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { PersonContext } from '../../../context/PersonContext';
import { NORSK_DATOFORMAT, NORSK_DATOFORMAT_KORT } from '../../../utils/date';
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
    grid-template-columns: 18rem;
    grid-template-areas:
        'sykmeldingsperiode'
        'arbeidsgiver'
        'vilkår'
        'utbetaling';
    grid-template-rows: max-content max-content max-content;
    grid-row-gap: 2rem;
    height: 100%;
    margin-right: 1.5rem;
`;

const Kort = styled.section`
    padding-bottom: 0;
    &:first-of-type {
        margin-top: 2rem;
    }
`;

const Sykmeldingsperiode = styled(Kort)`
    grid-area: sykmeldingsperiode;
`;

const Arbeidsgiver = styled(Kort)`
    grid-area: arbeidsgiver;
`;

const Vilkårkort = styled(Kort)`
    grid-area: vilkår;
`;

const Utbetalingkort = styled(Kort)`
    grid-area: utbetaling;
`;

const Utbetalingstabell = styled.article`
    width: 100%;
    padding-left: 2.5rem;
    border-left: 1px solid #c6c2bf;
    padding-top: 2rem;
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
            color: #fff;
            text-decoration: none;
            background-color: #254b6d;
            box-shadow: 0 0 0 2px #254b6d;
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
        <AgurkErrorBoundary sidenavn="Utbetaling">
            <Flex>
                <Arbeidsflate>
                    <Sykmeldingsperiode>
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
                            <Normaltekst>{skjæringstidspunkt}</Normaltekst>
                        </Flex>
                    </Sykmeldingsperiode>
                    <Arbeidsgiver>
                        <Korttittel>
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
                </Arbeidsflate>

                <Utbetalingstabell>
                    <Utbetalingsoversikt />
                </Utbetalingstabell>
            </Flex>
        </AgurkErrorBoundary>
    );
};
