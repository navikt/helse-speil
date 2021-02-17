import React from 'react';
import { useTranslation } from 'react-i18next';
import { Element, Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import { somPenger } from '../../../utils/locale';
import { Arbeidsgiverinntekt, Inntektskildetype } from 'internal-types';
import styled from '@emotion/styled';
import { Grid } from '../../../components/Grid';
import { Arbeidsgiverikon } from '../../../components/ikoner/Arbeidsgiverikon';
import { Kilde } from '../../../components/Kilde';
import { Flex, FlexColumn } from '../../../components/Flex';
import { Clipboard } from '../../../components/clipboard';
import { Arbeidsforhold } from '../Arbeidsforhold';
import { TekstMedEllipsis } from '../../../components/TekstMedEllipsis';
import { Tooltip } from '../../../components/Tooltip';
import { kilde } from '../../../utils/inntektskilde';
import { getAnonymArbeidsgiverForOrgnr } from '../../../agurkdata';

const Arbeidsgivertittel = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    o > *:not(:last-child) {
        margin-right: 1rem;
    }
`;

const Bransjer = styled(Undertekst)`
    margin-bottom: 0.5rem;
    color: var(--navds-color-text-disabled);
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
    color: var(--navds-color-text-primary);

    ${({ maxwidth }: { maxwidth?: string }) => maxwidth && `max-width: ${maxwidth};`}
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
    color: var(--navds-color-text-primary);
`;

interface InntektskilderinnholdProps {
    inntektskilde: Arbeidsgiverinntekt;
    anonymiseringEnabled: boolean;
}

const Inntektskilderinnhold = ({ inntektskilde, anonymiseringEnabled }: InntektskilderinnholdProps) => {
    const { t } = useTranslation();
    const {
        arbeidsgivernavn,
        organisasjonsnummer,
        arbeidsforhold,
        bransjer,
        omregnetÅrsinntekt,
        refusjon,
        forskuttering,
    } = inntektskilde;

    return (
        <Innhold kolonner={2}>
            <FlexColumn>
                <Arbeidsgivertittel>
                    <Arbeidsgiverikon />
                    <Tittel maxwidth="500px">
                        <TekstMedEllipsis data-tip={arbeidsgivernavn}>
                            {anonymiseringEnabled
                                ? getAnonymArbeidsgiverForOrgnr(organisasjonsnummer).navn
                                : arbeidsgivernavn}
                        </TekstMedEllipsis>
                        <Flex style={{ margin: '0 4px' }}>
                            (
                            <Clipboard copyMessage="Organisasjonsnummer er kopiert">
                                {anonymiseringEnabled
                                    ? getAnonymArbeidsgiverForOrgnr(organisasjonsnummer).orgnr
                                    : organisasjonsnummer}
                            </Clipboard>
                            )
                        </Flex>
                    </Tittel>
                    <Kilde>Aa</Kilde>
                </Arbeidsgivertittel>
                <Bransjer>
                    {`BRANSJE${bransjer.length > 1 ? 'R' : ''}: `}
                    {anonymiseringEnabled ? 'Agurkifisert bransje' : bransjer.join(', ')}
                </Bransjer>
                <ArbeidsforholdTabell>
                    {arbeidsforhold?.[0] && (
                        <Arbeidsforhold anonymiseringEnabled={anonymiseringEnabled} {...arbeidsforhold[0]} />
                    )}
                </ArbeidsforholdTabell>
                <HeaderContainer>
                    <Tittel tag="h3">{t('inntektskilder.inntekt')}</Tittel>
                    <Kilde>{kilde(omregnetÅrsinntekt?.kilde)}</Kilde>
                </HeaderContainer>
                <Tabell>
                    <Kolonnetittel>{t('inntektskilder.månedsinntekt')}</Kolonnetittel>
                    <Kolonnetittel>
                        {omregnetÅrsinntekt?.kilde === Inntektskildetype.Infotrygd
                            ? t('inntektskilder.sykepengegrunnlag')
                            : t('inntektskilder.årsinntekt')}
                    </Kolonnetittel>
                    <Element>{somPenger(omregnetÅrsinntekt?.månedsbeløp)}</Element>
                    <Element>{somPenger(omregnetÅrsinntekt?.beløp)}</Element>
                </Tabell>
                {omregnetÅrsinntekt?.kilde === Inntektskildetype.Inntektsmelding && (
                    <>
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
                    </>
                )}
            </FlexColumn>
            <Tooltip />
        </Innhold>
    );
};

export default Inntektskilderinnhold;
