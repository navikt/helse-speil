import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Undertekst } from 'nav-frontend-typografi';
import { calculateYearPinPlacement } from '../calc';
import moment from 'moment';
import './YearLabels.css';

const YearLabels = ({ years, startDate, endDate, width }) => {
    const mappedYears = useMemo(
        () =>
            years.map(year => ({
                label: year,
                x: calculateYearPinPlacement(
                    moment(year, 'YYYY'),
                    startDate,
                    endDate,
                    width
                )
            })),
        [years, width]
    );

    return (
        <div className="YearLabels">
            {mappedYears.map(year => (
                <div
                    key={`year-${year.label}`}
                    className="YearLabels__label"
                    style={{
                        left: `${year.x}px`
                    }}
                >
                    <Undertekst>{year.label}</Undertekst>
                    <div className="YearLabels__label-pin" />
                </div>
            ))}
        </div>
    );
};

YearLabels.propTypes = {
    years: PropTypes.arrayOf(PropTypes.number).isRequired,
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired
};

export default YearLabels;
