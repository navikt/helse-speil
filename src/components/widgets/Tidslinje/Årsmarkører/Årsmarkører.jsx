import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Undertekst } from 'nav-frontend-typografi';
import { calculateYearPinPlacement } from '../calc';
import moment from 'moment';
import './Årsmarkører.css';

const Årsmarkører = ({ years, startDate, endDate, width }) => {
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
        <div className="Årsmarkører">
            {mappedYears.map(year => (
                <div
                    key={`år-${year.label}`}
                    className="Årsmarkør"
                    style={{
                        left: `${year.x}px`
                    }}
                >
                    <Undertekst>{year.label}</Undertekst>
                    <div className="Årsmarkør__pin" />
                </div>
            ))}
        </div>
    );
};

Årsmarkører.propTypes = {
    years: PropTypes.arrayOf(PropTypes.number).isRequired,
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired
};

export default Årsmarkører;
