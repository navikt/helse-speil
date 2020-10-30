import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { PersonContext } from '../../../context/PersonContext';
import { NORSK_DATOFORMAT, NORSK_DATOFORMAT_KORT } from '../../../utils/date';
import { Arbeidsgiverikon } from '../../../components/ikoner/Arbeidsgiverikon';
import { Clipboard } from '../../../components/clipboard';
import { somPenger } from '../../../utils/locale';

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

const Vilkår = styled(Kort)`
    grid-area: vilkår;
    padding-bottom: 2rem;
    border-bottom: 1px solid #c6c2bf;
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

const Koffert = styled(Arbeidsgiverikon)`
    margin-right: 1rem;
`;

const ToKolonner = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const Utbetaling = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);

    if (!aktivVedtaksperiode) return null;

    const skjæringstidspunkt = aktivVedtaksperiode.vilkår?.dagerIgjen?.skjæringstidspunkt
        ? aktivVedtaksperiode.vilkår.dagerIgjen.skjæringstidspunkt.format(NORSK_DATOFORMAT)
        : 'Ukjent dato';

    const periodeFom = aktivVedtaksperiode?.fom.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent';
    const periodeTom = aktivVedtaksperiode?.tom.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent';
    const { organisasjonsnummer, månedsinntekt } = aktivVedtaksperiode.inntektskilder[0];

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
                <Korttittel>
                    <Koffert />
                    Arbeidsgiver
                </Korttittel>
                <Clipboard preserveWhitespace={false}>
                    <Normaltekst>{organisasjonsnummer}</Normaltekst>
                </Clipboard>
                <ToKolonner>
                    <Normaltekst>Månedsbeløp</Normaltekst>
                    <Normaltekst>{somPenger(månedsinntekt)}</Normaltekst>
                </ToKolonner>
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
