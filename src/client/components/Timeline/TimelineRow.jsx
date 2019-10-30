import React from 'react';
import PropTypes from 'prop-types';
import SourceLink from './SourceLink';

const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

const TimelineRow = ({ date, type, source, showType }) => {
    return (
        <tr>
            <td>
                <div className="TimelineRow__date">{date}</div>
                {type && (
                    <div className={`TimelineRow__type ${type}`}>
                        <span>{showType && capitalize(type)}</span>
                        {source && <SourceLink label={source} />}
                    </div>
                )}
            </td>
        </tr>
    );
};

TimelineRow.propTypes = {
    date: PropTypes.string,
    type: PropTypes.string,
    source: PropTypes.string,
    showType: PropTypes.bool
};

export default TimelineRow;
