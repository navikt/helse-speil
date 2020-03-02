import React from 'react';
import { guid } from 'nav-frontend-js-utils';
import { Vedtaksperiode, Utbetalingsdag } from '../../context/types';
import UtbetalingstidslinjeRow from './UtbetalingstidslinjeRow';
import 'nav-frontend-tabell-style';
import './Utbetalingstidslinje.less';

interface Props {
    vedtaksperiode: Vedtaksperiode;
}

const sumDagsatser = (utbetalingsdager: Utbetalingsdag[]) => {
    return utbetalingsdager.reduce(
        (sum, utbetalingsdag) => sum + (utbetalingsdag.utbetaling ?? 0),
        0
    );
};

const Utbetalingstidslinje = ({ vedtaksperiode }: Props) => {
    const dager = vedtaksperiode.utbetalingstidslinje;
    const dagsatserSummed: number = sumDagsatser(dager);

    return (
        <table className="Timeline tabell">
            <thead>
                <tr>
                    <th>Sykmeldingsperiode</th>
                    <th>Gradering</th>
                    <th>Utbetaling</th>
                </tr>
            </thead>
            <tbody>
                {dager
                    .map(item => ({ ...item, key: guid() }))
                    .map((item, i, array) => {
                        const showType = i === 0 || array[i - 1].type !== item.type;
                        return (
                            <UtbetalingstidslinjeRow
                                {...item}
                                key={item.key}
                                showType={showType}
                                dagsats={item.utbetaling}
                            />
                        );
                    })}
            </tbody>
            <tfoot>
                <tr>
                    <th>TOTAL</th>
                    <th />
                    <th>{`${dagsatserSummed} kr`}</th>
                </tr>
            </tfoot>
        </table>
    );
};

export default Utbetalingstidslinje;
