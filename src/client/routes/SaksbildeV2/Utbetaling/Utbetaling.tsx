import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { PersonContext } from '../../../context/PersonContext';
import { NORSK_DATOFORMAT, NORSK_DATOFORMAT_KORT } from '../../../utils/date';

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
`;

const Vilkår = styled(Kort)`
    grid-area: vilkår;
`;

const UtbetalingSection = styled(Kort)`
    grid-area: utbetaling;
`;

const Utbetalingstabell = styled.article`
    grid-area: tabell;
    padding-left: 2rem;
    border-left: 1px solid #c6c2bf;
`;

const Korttittel = styled(Undertittel)`
    text-decoration-line: underline;
    font-size: 18px;
    margin-bottom: 0.5rem;
`;

export const Utbetaling = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);

    if (!aktivVedtaksperiode) return null;

    const skjæringstidspunkt = aktivVedtaksperiode.vilkår?.dagerIgjen?.skjæringstidspunkt
        ? aktivVedtaksperiode.vilkår.dagerIgjen.skjæringstidspunkt.format(NORSK_DATOFORMAT)
        : 'Ukjent dato';

    const periodeFom = aktivVedtaksperiode?.fom.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent';
    const periodeTom = aktivVedtaksperiode?.tom.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent';

    return (
        <Arbeidsflate>
            <Sykmeldingsperiode>
                <Korttittel>Sykmeldingsperiode</Korttittel>
                <Normaltekst>
                    Periode {periodeFom} - {periodeTom}
                </Normaltekst>
                <Normaltekst>Skjæringstidspunkt {skjæringstidspunkt}</Normaltekst>
            </Sykmeldingsperiode>
            <Arbeidsgiver>
                <Korttittel>Arbeidsgiver</Korttittel>
            </Arbeidsgiver>
            <Vilkår>
                <Korttittel>Vilår</Korttittel>
            </Vilkår>
            <UtbetalingSection>
                <Korttittel>Utbetaling</Korttittel>
            </UtbetalingSection>
            <Utbetalingstabell>
                <Korttittel>Utbetalingstabell</Korttittel>
            </Utbetalingstabell>
        </Arbeidsflate>
    );
};
