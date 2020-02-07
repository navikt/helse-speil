import React from 'react';
import { guid } from 'nav-frontend-js-utils';
import { Person, Utbetalingsdag } from '../../context/types';
import 'nav-frontend-tabell-style';
import { enesteArbeidsgiver } from '../../context/mapper';
import TimelineRow from '../Timeline/TimelineRow';
import '../Timeline/Timeline.less';

interface Props {
    person: Person;
    showDagsats: boolean;
}

const sumDagsatser = (utbetalingsdager: Utbetalingsdag[]) => {
    return utbetalingsdager.reduce((sum, utbetalingsdag) => sum + utbetalingsdag.inntekt, 0); // TODO: Filtrer ut ikke-NavDager
};

const Utbetalingstidslinje = ({ person, showDagsats }: Props) => {
    const { utbetalingstidslinjer } = enesteArbeidsgiver(person);
    const dager = utbetalingstidslinjer[0].dager;
    const dagsatserSummed = showDagsats && sumDagsatser(dager);

    return (
        <table className="Timeline tabell">
            <thead>
                <tr>
                    <th>Utbetalingsoversikt</th>
                    <th>Dagsats</th>
                </tr>
            </thead>
            <tbody>
                {dager
                    .map(item => ({ ...item, key: guid() }))
                    .map(item => {
                        return (
                            <TimelineRow
                                {...item}
                                key={item.key}
                                showType={true}
                                showDagsats={true}
                            />
                        );
                    })}
            </tbody>
            {dagsatserSummed && (
                <tfoot>
                    <tr>
                        <th>SUM</th>
                        <th>{`${dagsatserSummed} kr`}</th>
                    </tr>
                </tfoot>
            )}
        </table>
    );
};

export default Utbetalingstidslinje;
