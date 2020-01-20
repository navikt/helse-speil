import React from 'react';
import './Avvikssammenligning.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { somPenger } from '../../utils/locale';
import ListSeparator from '../../components/ListSeparator';

interface Props {
    avvik: number;
    totalOmregnetÅrsinntekt: number;
    totalRapportertÅrsinntekt: number;
}

const Avvikssammenligning = ({
    avvik,
    totalOmregnetÅrsinntekt,
    totalRapportertÅrsinntekt
}: Props) => {
    return (
        <div className="avvikssammenligning">
            <Normaltekst>Total omregnet årsinntekt</Normaltekst>
            <Normaltekst>{somPenger(totalOmregnetÅrsinntekt)}</Normaltekst>
            <Normaltekst>Total rapportert årsinntekt</Normaltekst>
            <Normaltekst>{somPenger(totalRapportertÅrsinntekt)}</Normaltekst>
            <ListSeparator />
            <Element>Utregnet avvik</Element>
            <Element>{avvik}%</Element>
        </div>
    );
};

export default Avvikssammenligning;
