import React from 'react';
import { Panel } from 'nav-frontend-paneler';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import { toKroner } from '../../../utils/locale';
import Søylediagram from './SøyleDiagram/Søylediagram';
import InformasjonspanelItem from './InformasjonspanelItem';
import './Informasjonspanel.less';
import { IconType } from '../Icon/Icon';

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
                <InformasjonspanelItem
                    label="Arbeidsforhold"
                    value={arbeidsforhold}
                />
                <InformasjonspanelItem
                    label="Startdato"
                    value={startdato || '-'}
                    endret
                />
                <InformasjonspanelItem
                    label="Sluttdato"
                    value={sluttdato || '-'}
                />
                <InformasjonspanelItem
                    label="Lønnstype"
                    value={lønnstype || '-'}
                />
                <InformasjonspanelItem
                    label="Yrkesbeskrivelse"
                    value={yrkesbeskrivelse || '-'}
                />
                <InformasjonspanelItem
                    label="Arbeidstidsordning"
                    value={arbeidstidsordning || '-'}
                />
                <InformasjonspanelItem
                    label="Stillingsprosent"
                    value={`${stillingsprosent}%`}
                    endret
                />
            </div>
            <div className="Informasjonspanel__mid">
                <Undertittel>Mnd. inntekt siste 3 mnd</Undertittel>
                <InformasjonspanelItem
                    label="Beregnet mnd. inntekt"
                    value={`${toKroner(beregnetInntekt)} kr`}
                    iconType={IconType.INNTEKSTMELDING}
                />
                <InformasjonspanelItem
                    label="Gj.snitt mnd. inntekt"
                    value={`${toKroner(gjennomsnittligInntekt)} kr`}
                    iconType={IconType.AAREGISTERET}
                />
                <InformasjonspanelItem
                    label="Omregnet årsinntekt"
                    value={`${toKroner(omregnetÅrsinntekt)} kr`}
                />
                <InformasjonspanelItem
                    label="Sammenligningsgrunnl."
                    value={`${toKroner(sammenligningsgrunnlag)} kr`}
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
