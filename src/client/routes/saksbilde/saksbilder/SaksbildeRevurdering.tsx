import React from 'react';
import { Flex } from '../../../components/Flex';
import { Sakslinje } from '../sakslinje/Sakslinje';
import '@navikt/helse-frontend-logg/lib/main.css';
import { Tidslinjeperiode, useMaksdato } from '../../../modell/UtbetalingshistorikkElement';
import { useArbeidsgivernavn } from '../../../modell/Arbeidsgiver';
import { LoggHeader } from '../Saksbilde';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import styled from '@emotion/styled';
import { NORSK_DATOFORMAT_KORT } from '../../../utils/date';
import { Sykmeldingsperiodeikon } from '../../../components/ikoner/Sykmeldingsperiodeikon';
import { TilRevurderingIkon } from '../../../components/ikoner/Tidslinjeperiodeikoner';
import { Maksdatoikon } from '../../../components/ikoner/Maksdatoikon';
import { Dayjs } from 'dayjs';
import { Skjæringstidspunktikon } from '../../../components/ikoner/Skjæringstidspunktikon';

const Arbeidsflate = styled.section`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 17.5rem;
    padding: 2rem;
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

const FargetBoks = styled.div`
    border: 1px solid var(--navds-color-border);
    border-radius: 2px;
    background: #ecefcc;
    width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.5rem;
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
    const arbeidsgivernavn = useArbeidsgivernavn(aktivPeriode.organisasjonsnummer);
    const maksdato = useMaksdato(aktivPeriode.beregningId);
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
                    <VenstreMeny aktivPeriode={aktivPeriode} maksDato={maksdato} />
                    <VertikalStrek />
                </Flex>
            </AutoFlexContainer>
            <LoggHeader />
        </Flex>
    );
};

interface VenstreMenyProps {
    aktivPeriode: Tidslinjeperiode;
    maksDato?: Dayjs;
}

const VenstreMeny = ({ aktivPeriode, maksDato }: VenstreMenyProps) => {
    const periode = `${aktivPeriode.fom.format(NORSK_DATOFORMAT_KORT)} - ${aktivPeriode.tom.format(
        NORSK_DATOFORMAT_KORT
    )}`;
    const skjæringstidspunkt = 'Ukjent';
    const maksdato = maksDato ? maksDato.format(NORSK_DATOFORMAT_KORT) : 'Ukjent maksdato';

    return (
        <Arbeidsflate>
            <Kort>
                <Korttittel>
                    <FargetBoks>
                        <TilRevurderingIkon />
                    </FargetBoks>
                    REVURDERING
                </Korttittel>
                <IkonOgTekst tekst={periode} Ikon={<Sykmeldingsperiodeikon />} />
                <IkonOgTekst tekst={maksdato} Ikon={<Maksdatoikon />} />
                <IkonOgTekst tekst={skjæringstidspunkt} Ikon={<Skjæringstidspunktikon />} />
            </Kort>
        </Arbeidsflate>
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
