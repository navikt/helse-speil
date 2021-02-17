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
import { useAktivVedtaksperiode } from '../../../state/vedtaksperiode';
import { usePerson, useSkalAnonymiserePerson } from '../../../state/person';
import { getAnonymArbeidsgiverForOrgnr } from '../../../agurkdata';

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

export const Utbetaling = () => {
    const aktivVedtaksperiode = useAktivVedtaksperiode();
    const personTilBehandling = usePerson();
    const anonymiseringEnabled = useSkalAnonymiserePerson();

    if (!aktivVedtaksperiode || !personTilBehandling) return null;

    const skjæringstidspunkt = aktivVedtaksperiode.vilkår?.dagerIgjen?.skjæringstidspunkt
        ? aktivVedtaksperiode.vilkår.dagerIgjen.skjæringstidspunkt.format(NORSK_DATOFORMAT)
        : 'Ukjent dato';

    const periodeFom = aktivVedtaksperiode?.fom.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent';
    const periodeTom = aktivVedtaksperiode?.tom.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent';
    const arbeidsgiverinntekt = aktivVedtaksperiode.inntektsgrunnlag.inntekter.find(
        (it) => it.organisasjonsnummer === aktivVedtaksperiode.inntektsgrunnlag.organisasjonsnummer
    );

    const { arbeidsgivernavn, organisasjonsnummer, omregnetÅrsinntekt, arbeidsforhold } = arbeidsgiverinntekt!;

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
                        {arbeidsforhold?.[0] && (
                            <Arbeidsforhold anonymiseringEnabled={anonymiseringEnabled} {...arbeidsforhold[0]} />
                        )}
                        <Flex justifyContent="space-between">
                            <Normaltekst>Månedsbeløp</Normaltekst>
                            <Normaltekst>{somPenger(omregnetÅrsinntekt?.månedsbeløp)}</Normaltekst>
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
