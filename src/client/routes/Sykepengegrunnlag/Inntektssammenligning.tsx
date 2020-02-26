import './Inntektssammenligning.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import ListSeparator from '../../components/ListSeparator';
import { somPenger } from '../../utils/locale';
import Kildelenke from '../../components/Kildelenke';
import { Kildetype } from '../../components/Kildelenke/Kildelenke';

interface Props {
    inntektskilde: string;
    årsinntektAordning?: number;
    årsinntektInntektsmelding?: number;
}

const Inntektssammenligning = ({
    inntektskilde,
    årsinntektAordning,
    årsinntektInntektsmelding
}: Props) => {
    return (
        <div className="inntektssammenligning">
            <div />
            <Element>Inntektsgrunnlag</Element>
            <Element>Sammenligningsgrunnlag</Element>
            <Normaltekst>Inntektskilde</Normaltekst>
            <Normaltekst>Omregnet årsinntekt</Normaltekst>
            <Normaltekst>Rapportert årsinntekt</Normaltekst>
            <Normaltekst>{inntektskilde}</Normaltekst>
            <div className="inntektssammenligning__flex">
                <Normaltekst>{somPenger(årsinntektInntektsmelding)}</Normaltekst>
                <Kildelenke label={Kildetype.inntektsmelding} />
            </div>
            <div className="inntektssammenligning__flex">
                <Normaltekst>{somPenger(årsinntektAordning)}</Normaltekst>
                <Kildelenke label={Kildetype.aordningen} />
            </div>
            <ListSeparator />
            <Element>Total</Element>
            <Element>{somPenger(årsinntektInntektsmelding)}</Element>
            <Element>{somPenger(årsinntektAordning)}</Element>
        </div>
    );
};

export default Inntektssammenligning;
