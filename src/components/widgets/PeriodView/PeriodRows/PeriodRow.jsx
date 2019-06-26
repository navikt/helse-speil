import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { calculatePlacement } from '../calc';

const PeriodRow = ({ dates, earliest, latest, width }) => {
    const mappedDates = useMemo(
        () =>
            width === 0
                ? []
                : dates.map(period => ({
                      ...period,
                      ...calculatePlacement(period, earliest, latest, width)
                  })),
        [dates, width]
    );

    return (
        <div className="PeriodRow">
            <div className="Periods">
                {mappedDates.map((dates, i) => (
                    <div
                        key={`periode-${i}`}
                        className="Period"
                        style={{
                            left: dates.x,
                            width: `${dates.width}px`
                        }}
                        tabIndex="0"
                    />
                ))}
            </div>
            <hr className="PeriodView__bar" />
        </div>
    );
};

PeriodRow.propTypes = {
    dates: PropTypes.arrayOf(
        PropTypes.shape({
            startDate: PropTypes.object.isRequired,
            endDate: PropTypes.object.isRequired
        })
    ),
    earliest: PropTypes.object.isRequired,
    latest: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired
};

export default PeriodRow;
