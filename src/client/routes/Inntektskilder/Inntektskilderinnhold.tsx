import React from 'react';
import { useTranslation } from 'react-i18next';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Kildelenke from '../../components/Kildelenke';
import { toKronerOgØre } from '../../utils/locale';
import Row from '../../components/Row';
import ListSeparator from '../../components/ListSeparator';
import IconRow from '../../components/IconRow/IconRow';
import { Inntektskilder } from '../../context/types';
import Grid from '../../components/Grid';
import styled from '@emotion/styled';

interface InntektskilderinnholdProps {
    inntektskilder: Inntektskilder;
}

export const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: start;

    &:not(:last-child) {
        margin-right: 2.5rem;
    }
`;

const Inntektskilderinnhold = ({ inntektskilder }: InntektskilderinnholdProps) => {
    const { t } = useTranslation();

    return (
        <Grid kolonner={2}>
            <FlexColumn>
                <div className="Inntektskilder_flex">
                    <Element>{t('inntektskilder.inntekt')}</Element>
                    <Kildelenke label="IM" />
                </div>
                <div className="inntektskilder">
                    <div>
                        <Normaltekst>{t('inntektskilder.månedsinntekt')}</Normaltekst>
                        <Element>{`${toKronerOgØre(inntektskilder.månedsinntekt!)} kr`}</Element>
                    </div>
                    <div>
                        <Normaltekst>{t('inntektskilder.årsinntekt')}</Normaltekst>
                        <Element>{`${toKronerOgØre(inntektskilder.årsinntekt!)} kr`}</Element>
                    </div>
                </div>

                <br />
                <Element>{t('inntektskilder.inntektsmeldinger')}</Element>

                <div className="fraInntektsmelding">
                    <Row label={t('inntektskilder.refusjon')}>{inntektskilder.refusjon}</Row>
                    <Row label={t('inntektskilder.arbeidsgiverperiode')}>
                        {inntektskilder.forskuttering}
                    </Row>
                    <Row label={t('inntektskilder.relasjon')}>Ikke sjekket</Row>
                </div>
            </FlexColumn>

            <FlexColumn>
                <Element>{t('inntektskilder.kilder')}</Element>
                <IconRow label={t('inntektskilder.frilans')} iconType="advarsel" />
                <IconRow label={t('inntektskilder.næring')} iconType="advarsel" />

                <ListSeparator />
                <Element>{t('inntektskilder.sjekket_ytelser')}</Element>
                <IconRow label={t('inntektskilder.foreldrepenger')} iconType="ok" />
                <IconRow label={t('inntektskilder.svangerskapspenger')} iconType="ok" />

                <br />

                <Element>{t('inntektskilder.ikke_sjekket_ytelser')}</Element>
                <IconRow label={t('inntektskilder.aap')} iconType="advarsel" />
                <IconRow label={t('inntektskilder.dagpenger')} iconType="advarsel" />
                <IconRow label={t('inntektskilder.pleiepenger')} iconType="advarsel" />
            </FlexColumn>
        </Grid>
    );
};

export default Inntektskilderinnhold;
