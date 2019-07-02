import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'nav-frontend-paneler';
import './Informasjonspanel.less';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import { toKronerOgØre } from '../../../utils/locale';
import Søylediagram from './SøyleDiagram/Søylediagram';

const InformasjonspanelLabelValue = ({ label, value, endret }) => (
    <span>
        {label && <Undertekst>{label}</Undertekst>}
        {value && <Undertekst>{value}</Undertekst>}
        <Undertekst>{endret && 'Endret'}</Undertekst>
    </span>
);

InformasjonspanelLabelValue.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    endret: PropTypes.bool
};

const withInformasjonsdata = Component => {
    return props => (
        <Component
            arbeidsgiver="Sykepleierhuset AS"
            arbeidsforhold="Ordinær"
            startdato="12.01.2017"
            sluttdato={null}
            lønnstype={null}
            yrkesbeskrivelse="Sykepleier"
            arbeidstidsordning="Ikke skift"
            stillingsprosent={60}
            beregnetInntekt={17000}
            gjennomsnittligInntekt={17328}
            omregnetÅrsinntekt={204000}
            sammenligningsgrunnlag={155691}
            {...props}
        />
    );
};

const Informasjonspanel = withInformasjonsdata(
    ({
        arbeidsgiver,
        arbeidsforhold,
        startdato,
        sluttdato,
        lønnstype,
        yrkesbeskrivelse,
        arbeidstidsordning,
        stillingsprosent,
        beregnetInntekt,
        gjennomsnittligInntekt,
        omregnetÅrsinntekt,
        sammenligningsgrunnlag
    }) => (
        <Panel border className="Informasjonspanel">
            <div className="Informasjonspanel__left">
                <div>
                    <div className="Ikon__arbeidsgiver" />
                    <Undertittel>{arbeidsgiver}</Undertittel>
                </div>
                <InformasjonspanelLabelValue
                    label="Arbeidsforhold"
                    value={arbeidsforhold}
                />
                <InformasjonspanelLabelValue
                    label="Startdato"
                    value={startdato || '-'}
                    endret
                />
                <InformasjonspanelLabelValue
                    label="Sluttdato"
                    value={sluttdato || '-'}
                />
                <InformasjonspanelLabelValue
                    label="Lønnstype"
                    value={lønnstype || '-'}
                />
                <InformasjonspanelLabelValue
                    label="Yrkesbeskrivelse"
                    value={yrkesbeskrivelse || '-'}
                />
                <InformasjonspanelLabelValue
                    label="Arbeidstidsordning"
                    value={arbeidstidsordning || '-'}
                />
                <InformasjonspanelLabelValue
                    label="Stillingsprosent"
                    value={`${stillingsprosent}%`}
                    endret
                />
            </div>
            <div className="Informasjonspanel__mid">
                <Undertittel>Mnd. inntekt siste 3 mnd</Undertittel>
                <InformasjonspanelLabelValue
                    label="Beregnet mnd. inntekt"
                    value={`${toKronerOgØre(beregnetInntekt)} kr`}
                />
                <InformasjonspanelLabelValue
                    label="Gj.snitt mnd. inntekt"
                    value={`${toKronerOgØre(gjennomsnittligInntekt)} kr`}
                />
                <InformasjonspanelLabelValue
                    label="Omregnet årsinntekt"
                    value={`${toKronerOgØre(omregnetÅrsinntekt)} kr`}
                />
                <InformasjonspanelLabelValue
                    label="Sammenligningsgrunnl."
                    value={`${toKronerOgØre(sammenligningsgrunnlag)} kr`}
                />
                <Undertekst>
                    Avvik:{' '}
                    {Math.floor(
                        (omregnetÅrsinntekt / sammenligningsgrunnlag - 1) * 100
                    )}
                    %
                </Undertekst>
            </div>
            <div className="Informasjonspanel__right">
                <Undertittel>Rapportert mnd. inntekt siste år</Undertittel>
                <Søylediagram />
                <Undertekst>Se detaljer</Undertekst>
            </div>
        </Panel>
    )
);

export default Informasjonspanel;
