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
import { useRecoilValue } from 'recoil';
import { aktivVedtaksperiodeState } from '../../../state/vedtaksperiode';
import { usePerson } from '../../../state/person';

const Container = styled.section`
    padding: 2rem 0;
`;

const Arbeidsflate = styled(Container)`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 17.5rem;
`;

const VertikalStrek = styled.div`
    width: 1px;
    background: #c6c2bf;
    margin: 0 2rem;
`;

const Kort = styled.section`
    padding-bottom: 0;
    margin-bottom: 2rem;
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
    const aktivVedtaksperiode = useRecoilValue(aktivVedtaksperiodeState);
    const personTilBehandling = usePerson();

    if (!aktivVedtaksperiode || !personTilBehandling) return null;

    const skjæringstidspunkt = aktivVedtaksperiode.vilkår?.dagerIgjen?.skjæringstidspunkt
        ? aktivVedtaksperiode.vilkår.dagerIgjen.skjæringstidspunkt.format(NORSK_DATOFORMAT)
        : 'Ukjent dato';

    const periodeFom = aktivVedtaksperiode?.fom.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent';
    const periodeTom = aktivVedtaksperiode?.tom.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent';
    const { arbeidsgiver, organisasjonsnummer, månedsinntekt, arbeidsforhold } = aktivVedtaksperiode.inntektskilder[0];

    return (
        <AgurkErrorBoundary sidenavn="Utbetaling">
            <Flex>
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
                            <Normaltekst>{skjæringstidspunkt}</Normaltekst>
                        </Flex>
                    </Kort>
                    <Kort>
                        <Korttittel>
                            <Lenke to={`${personTilBehandling?.aktørId}/../sykepengegrunnlag`}>{arbeidsgiver}</Lenke>
                        </Korttittel>
                        <Clipboard preserveWhitespace={false}>
                            <Normaltekst>{organisasjonsnummer}</Normaltekst>
                        </Clipboard>
                        {arbeidsforhold?.[0] && <Arbeidsforhold {...arbeidsforhold[0]} />}
                        <Flex justifyContent="space-between">
                            <Normaltekst>Månedsbeløp</Normaltekst>
                            <Normaltekst>{somPenger(månedsinntekt)}</Normaltekst>
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
                <Container>
                    <Utbetalingsoversikt vedtaksperiode={aktivVedtaksperiode} />
                </Container>
            </Flex>
        </AgurkErrorBoundary>
    );
};
