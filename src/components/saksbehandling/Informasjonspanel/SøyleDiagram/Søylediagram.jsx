import React, { useEffect, useRef, useState } from 'react';
import { Undertekst } from 'nav-frontend-typografi';
import { toKroner } from '../../../../utils/locale';
import { useElementSize } from '../../../../hooks/useElementSize';
import './Søylediagram.less';
import {
    calculateYearPinPosition,
    incomeToHeight,
    lastTwelveMonths
} from './calc';

const months = lastTwelveMonths();

const withDiagramdata = Component => {
    const randomIncome = (low, high) => {
        const offset = Math.random() * Math.abs(low - high);
        return Math.floor(low) + Math.floor(offset);
    };

    const incomes = new Array(12).fill(0).map(() => randomIncome(20000, 35000));
    return props => <Component incomes={incomes} {...props} />;
};

/* Viser et søylediagram over rapportert inntekt de siste 12 mnd.
 */
const Søylediagram = withDiagramdata(({ incomes }) => {
    const ref = useRef();
    const [maxHeight, maxWidth] = useElementSize(ref);
    const [heights, setHeights] = useState([]);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

    useEffect(() => {
        if (maxHeight > 0 && max > 0) {
            setHeights(
                incomes.map(income => incomeToHeight(income, max, maxHeight))
            );
        }
    }, [maxHeight, max]);

    useEffect(() => {
        setMin(incomes.reduce((prev, curr) => Math.min(prev, curr)));
        setMax(incomes.reduce((prev, curr) => Math.max(prev, curr)));
    }, [incomes]);

    return (
        <div className="Søylediagram" ref={ref}>
            <div className="søyler">
                {heights.map((height, i) => (
                    <div
                        key={`søyle-${i}`}
                        className="søyle"
                        style={{ height: `${height}px` }}
                    />
                ))}
            </div>
            <div className="months">
                {months.map((month, i) => (
                    <Undertekst key={`month-${i}`}>{month}</Undertekst>
                ))}
            </div>
            <div
                className="year"
                style={{ left: `${calculateYearPinPosition(maxWidth)}px` }}
            >
                <Undertekst>2019</Undertekst>
                <div className="pin" />
            </div>
            <div
                className="min"
                style={{ bottom: `${incomeToHeight(min, max, maxHeight)}px` }}
            >
                <div className="pin" />
                <Undertekst>{toKroner(min)}</Undertekst>
            </div>
            <div className="max">
                <div className="pin" />
                <Undertekst>{toKroner(max)}</Undertekst>
            </div>
        </div>
    );
});

export default Søylediagram;
