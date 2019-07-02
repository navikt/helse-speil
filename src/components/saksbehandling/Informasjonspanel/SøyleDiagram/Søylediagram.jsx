import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Undertekst } from 'nav-frontend-typografi';
import { toKronerOgØre } from '../../../../utils/locale';
import './Søylediagram.less';

const sortedMonths = () => {
    const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    const currentMonth = moment().month();
    return [...months.slice(currentMonth), ...months.slice(0, currentMonth)];
};

const calculateYearPinPosition = maxWidth => {
    const currentMonth = moment().month();
    const ratio = maxWidth / 12.0;
    return currentMonth * ratio;
};

const months = sortedMonths();

const incomeToHeight = (income, maxIncome, maxHeight) => {
    const ratio = maxHeight / maxIncome;
    return ratio * income;
};

const useElementSize = ref => {
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.offsetHeight);
            setWidth(ref.current.offsetWidth);
        }
    }, [ref.current]);

    return [height, width];
};

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
                <Undertekst>{toKronerOgØre(min)}</Undertekst>
            </div>
            <div className="max">
                <div className="pin" />
                <Undertekst>{toKronerOgØre(max)}</Undertekst>
            </div>
        </div>
    );
});

Søylediagram.propTypes = {
    incomes: PropTypes.arrayOf(PropTypes.number).isRequired
};

export default Søylediagram;
