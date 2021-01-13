import React from 'react';
import { useTranslation } from 'react-i18next';
import { Element, Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import { somPenger, toKronerOgØre } from '../../../utils/locale';
import { Inntektskilde } from 'internal-types';
import styled from '@emotion/styled';
import { Grid } from '../../../components/Grid';
import { Arbeidsgiverikon } from '../../../components/ikoner/Arbeidsgiverikon';
import { Kilde } from '../../../components/Kilde';
import { FlexColumn } from '../../../components/Flex';
import { Clipboard } from '../../../components/clipboard';
import { Arbeidsforhold } from '../Arbeidsforhold';

const Arbeidsgivertittel = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    > *:not(:last-child) {
        margin-right: 1rem;
    }
`;

const Bransjer = styled(Undertekst)`
    margin-bottom: 0.5rem;
    color: #78706a;
`;

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;

    > *:not(:last-child) {
        margin-right: 1rem;
    }
`;

const Tittel = styled(Undertittel)`
    display: flex;
    align-items: center;
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

const ArbeidsforholdTabell = styled(Tabell)`
    margin-top: 0;
    margin-bottom: 2rem;
`;

const Innhold = styled(Grid)`
    grid-column-gap: 6rem;
`;

const Kolonnetittel = styled(Undertekst)`
    color: #3e3832;
`;

interface InntektskilderinnholdProps {
    inntektskilder: Inntektskilde[];
}

const Inntektskilderinnhold = ({ inntektskilder }: InntektskilderinnholdProps) => {
    const { t } = useTranslation();

    const {
        arbeidsgiver,
        organisasjonsnummer,
        arbeidsforhold,
        bransjer,
        månedsinntekt,
        årsinntekt,
        refusjon,
        forskuttering,
    } = inntektskilder[0];

    return (
        <Innhold kolonner={2}>
            <FlexColumn>
                <Arbeidsgivertittel>
                    <Arbeidsgiverikon />
                    <Tittel>
                        {arbeidsgiver} (<Clipboard>{organisasjonsnummer}</Clipboard>)
                    </Tittel>
                    <Kilde>Aa</Kilde>
                </Arbeidsgivertittel>
                <Bransjer>
                    {`BRANSJE${bransjer.length > 1 ? 'R' : ''}: `}
                    {bransjer.join(', ')}
                </Bransjer>
                <ArbeidsforholdTabell>
                    {arbeidsforhold?.[0] && <Arbeidsforhold {...arbeidsforhold[0]} />}
                </ArbeidsforholdTabell>
                <HeaderContainer>
                    <Tittel tag="h3">{t('inntektskilder.inntekt')}</Tittel>
                    <Kilde>IM</Kilde>
                </HeaderContainer>
                <Tabell>
                    <Kolonnetittel>{t('inntektskilder.månedsinntekt')}</Kolonnetittel>
                    <Kolonnetittel>{t('inntektskilder.årsinntekt')}</Kolonnetittel>
                    <Element>{somPenger(månedsinntekt)}</Element>
                    <Element>{somPenger(årsinntekt)}</Element>
                </Tabell>
                <HeaderContainer>
                    <Tittel>{t('inntektskilder.inntektsmeldinger')}</Tittel>
                </HeaderContainer>
                <Tabell>
                    <Normaltekst>{t('inntektskilder.refusjon')}</Normaltekst>
                    <Normaltekst>{refusjon ? 'Ja' : 'Nei'}</Normaltekst>
                    <Normaltekst>{t('inntektskilder.arbeidsgiverperiode')}</Normaltekst>
                    <Normaltekst>{forskuttering ? 'Ja' : 'Nei'}</Normaltekst>
                    <Normaltekst>{t('inntektskilder.relasjon')}</Normaltekst>
                    <Normaltekst>Ikke sjekket</Normaltekst>
                </Tabell>
            </FlexColumn>
        </Innhold>
    );
};

export default Inntektskilderinnhold;
