import React from 'react';
import { useTranslation } from 'react-i18next';
import { Element, Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import { toKronerOgØre } from '../../../utils/locale';
import { Inntektskilde } from 'internal-types';
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
    margin: 0.5rem 0 4rem;
`;

const Innhold = styled(Grid)`
    grid-column-gap: 6rem;
`;

const Kolonnetittel = styled(Undertekst)`
    color: #3e3832;
`;

const Inntektskilderinnhold = ({ inntektskilder }: InntektskilderinnholdProps) => {
    const { t } = useTranslation();

    return (
        <Innhold kolonner={2}>
            <FlexColumn>
                <Arbeidsgivertittel>
                    <Arbeidsgiverikon />
                    <Tittel>
                        {inntektskilder[0].arbeidsgiver} ({inntektskilder[0].organisasjonsnummer})
                    </Tittel>
                    <Kilde>Aa</Kilde>
                </Arbeidsgivertittel>
                <HeaderContainer>
                    <Tittel tag="h3">{t('inntektskilder.inntekt')}</Tittel>
                    <Kilde>IM</Kilde>
                </HeaderContainer>
                <Tabell>
                    <Kolonnetittel>{t('inntektskilder.månedsinntekt')}</Kolonnetittel>
                    <Kolonnetittel>{t('inntektskilder.årsinntekt')}</Kolonnetittel>
                    <Element>{`${toKronerOgØre(inntektskilder[0].månedsinntekt!)} kr`}</Element>
                    <Element>{`${toKronerOgØre(inntektskilder[0].årsinntekt!)} kr`}</Element>
                </Tabell>
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
        </Innhold>
    );
};

export default Inntektskilderinnhold;
