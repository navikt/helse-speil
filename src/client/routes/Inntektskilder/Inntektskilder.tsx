import React, { useContext } from 'react';
import Row from '../../components/Row';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../../hooks/useLinks';
import { PersonContext } from '../../context/PersonContext';
import { toKronerOgØre } from '../../utils/locale';
import { useTranslation } from 'react-i18next';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import './Inntektskilder.less';
import ListSeparator from '../../components/ListSeparator';
import IconRow from '../../components/IconRow/IconRow';
import Kildelenke from '../../components/Kildelenke';

// TODO: 2 kolonner
// TODO: Orgnr + ikon i topp

const Inntektskilder = () => {
    const { inntektskilder } = useContext(PersonContext).aktivVedtaksperiode!;
    const { t } = useTranslation();

    return (
        <Panel className="Inntektskilder tekstbolker">
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

            <ListSeparator />

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

            <NavigationButtons previous={pages.INNGANGSVILKÅR} next={pages.SYKEPENGEGRUNNLAG} />
        </Panel>
    );
};

export default Inntektskilder;
