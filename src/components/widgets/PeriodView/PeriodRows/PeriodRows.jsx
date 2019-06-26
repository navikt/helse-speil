import YearLabels from '../YearLabels/YearLabels';
import React, { useMemo, useRef } from 'react';
import { useElementWidth } from '../../../../hooks/useElementWidth';
import { earliestDate, extractDates, latestDate, yearsBetween } from '../calc';
import { periodType } from '../types';
import PeriodRow from './PeriodRow';
import './PeriodRows.css';

const PeriodRows = ({ periods }) => {
    const ref = useRef();
    const width = useElementWidth(ref);

    const [years, earliest, latest] = useMemo(() => {
        const dates = extractDates(periods);
        return [yearsBetween(dates), earliestDate(dates), latestDate(dates)];
    }, [periods]);

    return (
        <div className="PeriodView__rows" ref={ref}>
            {ref.current && (
                <>
                    <YearLabels
                        years={years}
                        startDate={earliest}
                        endDate={latest}
                        width={width}
                    />
                    {periods.map((period, i) => (
                        <PeriodRow
                            key={`period-row-${i}`}
                            dates={period.periods}
                            earliest={earliest}
                            latest={latest}
                            width={width}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

PeriodRows.propTypes = periodType;

export default PeriodRows;
