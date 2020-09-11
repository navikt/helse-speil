import React from 'react';
import { useTranslation } from 'react-i18next';
import { Element, Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import { toKronerOgØre } from '../../../utils/locale';
import Ikonrad from '../../../components/Ikonrad';
import { Inntektskilde } from '../../../context/types.internal';
import styled from '@emotion/styled';
import { Grid } from '../../../components/Grid';
import { Arbeidsgiverikon } from '../../../components/ikoner/Arbeidsgiverikon';
import { Kilde } from '../../../components/Kilde';
import { FlexColumn } from '../../../components/Flex';

export interface InntektskilderinnholdProps {
    inntektskilder: Inntektskilde[];
}

const Arbeidsgivertittel = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    > *:not(:last-child) {
        margin-right: 1rem;
    }
`;

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;

    > *:not(:last-child) {
        margin-right: 1rem;
    }
`;

const Tittel = styled(Undertittel)`
    font-size: 18px;
    color: #3e3832;
`;

const Tabell = styled.div`
    display: grid;
    grid-template-columns: 200px auto;
    grid-column-gap: 1rem;
    grid-row-gap: 0.5rem;
    margin: 0.5rem 0 2rem;
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid #e7e9e9;
    margin: 0 0 2rem 0;
`;

const Liste = styled.ul`
    margin: 0.5rem 0 2rem;
`;

const Innhold = styled(Grid)`
    margin-top: 2rem;
    grid-column-gap: 6rem;
`;

const Inntektskilderinnhold = ({ inntektskilder }: InntektskilderinnholdProps) => {
    const { t } = useTranslation();

    return (
        <Innhold kolonner={2}>
            <FlexColumn>
                <Arbeidsgivertittel>
                    <Arbeidsgiverikon />
                    <Tittel>Arbeidsgiver ({inntektskilder[0].organisasjonsnummer})</Tittel>
                    <Kilde>Aa</Kilde>
                </Arbeidsgivertittel>
                <HeaderContainer>
                    <Tittel tag="h3">{t('inntektskilder.inntekt')}</Tittel>
                    <Kilde>IM</Kilde>
                </HeaderContainer>
                <Tabell>
                    <Undertekst>{t('inntektskilder.månedsinntekt')}</Undertekst>
                    <Undertekst>{t('inntektskilder.årsinntekt')}</Undertekst>
                    <Element>{`${toKronerOgØre(inntektskilder[0].månedsinntekt!)} kr`}</Element>
                    <Element>{`${toKronerOgØre(inntektskilder[0].årsinntekt!)} kr`}</Element>
                </Tabell>
                <Divider />
                <HeaderContainer>
                    <Tittel>{t('inntektskilder.inntektsmeldinger')}</Tittel>
                </HeaderContainer>
                <Tabell>
                    <Normaltekst>{t('inntektskilder.refusjon')}</Normaltekst>
                    <Normaltekst>{inntektskilder[0].refusjon ? 'Ja' : 'Nei'}</Normaltekst>
                    <Normaltekst>{t('inntektskilder.arbeidsgiverperiode')}</Normaltekst>
                    <Normaltekst>{inntektskilder[0].forskuttering ? 'Ja' : 'Nei'}</Normaltekst>
                    <Normaltekst>{t('inntektskilder.relasjon')}</Normaltekst>
                    <Normaltekst>Ikke sjekket</Normaltekst>
                </Tabell>
            </FlexColumn>
            <FlexColumn>
                <Tittel tag="h3">{t('inntektskilder.kilder')}</Tittel>
                <Liste>
                    <Ikonrad tekst={t('inntektskilder.frilans')} ikontype="advarsel" />
                    <Ikonrad tekst={t('inntektskilder.næring')} ikontype="advarsel" />
                </Liste>
                <Divider />
                <Tittel tag="h3">{t('inntektskilder.sjekket_ytelser')}</Tittel>
                <Liste>
                    <Ikonrad tekst={t('inntektskilder.aap')} ikontype="ok" />
                    <Ikonrad tekst={t('inntektskilder.dagpenger')} ikontype="ok" />
                    <Ikonrad tekst={t('inntektskilder.foreldrepenger')} ikontype="ok" />
                    <Ikonrad tekst={t('inntektskilder.svangerskapspenger')} ikontype="ok" />
                </Liste>

                <Tittel tag="h3">{t('inntektskilder.ikke_sjekket_ytelser')}</Tittel>
                <Liste>
                    <Ikonrad tekst={t('inntektskilder.pleiepenger')} ikontype="advarsel" />
                </Liste>
            </FlexColumn>
        </Innhold>
    );
};

export default Inntektskilderinnhold;
