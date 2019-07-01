import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { calculatePlacement } from '../calc';
import { toDate } from '../../../../utils/date';
import Period from '../Period/Period';

const PeriodRow = ({ dates, label, earliest, latest, width }) => {
    const mappedDates = useMemo(
        () =>
            width === 0
                ? []
                : dates.map(period => ({
                      ...period,
                      ...calculatePlacement(period, earliest, latest, width),
                      startDate: toDate(period.startDate),
                      endDate: toDate(period.endDate)
                  })),
        [dates, width]
    );

    return (
        <div className="PeriodRow">
            <div className="Periods">
                {mappedDates.map((date, i) => (
                    <Period
                        key={`period-${label}-${i}`}
                        xPos={date.x}
                        status={date.status}
                        label={`${label}: ${date.startDate} - ${date.endDate}, status: ${date.status}`}
                        width={date.width}
                        onClick={date.action}
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
            endDate: PropTypes.object.isRequired,
            status: PropTypes.string.isRequired
        })
    ),
    label: PropTypes.string.isRequired,
    earliest: PropTypes.object.isRequired,
    latest: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired
};

export default PeriodRow;
