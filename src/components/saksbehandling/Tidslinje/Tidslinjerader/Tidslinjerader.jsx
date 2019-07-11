import React, { useMemo, useRef } from 'react';
import Tidslinjerad from './Tidslinjerad';
import Årsmarkører from '../Årsmarkører/Årsmarkører';
import { useElementWidth } from '../../../../hooks/useElementWidth';
import { earliestDate, extractDates, latestDate, yearsBetween } from '../calc';
import { periodType } from '../types';
import './Tidslinjerader.css';

const Tidslinjerader = ({ periods }) => {
    const ref = useRef();
    const width = useElementWidth(ref);

    const [years, earliest, latest] = useMemo(() => {
        const dates = extractDates(periods);
        return [yearsBetween(dates), earliestDate(dates), latestDate(dates)];
    }, [periods]);

    return (
        <div className="Tidslinjerader" ref={ref}>
            {ref.current && (
                <>
                    <Årsmarkører
                        years={years}
                        startDate={earliest}
                        endDate={latest}
                        width={width}
                    />
                    {periods.map((period, i) => (
                        <Tidslinjerad
                            key={`perioderad-${i}`}
                            label={period.label}
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

Tidslinjerader.propTypes = periodType;

export default Tidslinjerader;
