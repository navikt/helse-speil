import React from 'react';
import PropTypes from 'prop-types';
import SourceLink from './SourceLink';

const dayTypes = {
    ARBEIDSDAG: {
        cssName: 'arbeidsdag',
        text: 'Arbeidsdag'
    },
    EGENMELDINGSDAG: {
        cssName: 'egenmeldingsdag',
        text: 'Egenmeldingsdag'
    },
    FERIEDAG: {
        cssName: 'feriedag',
        text: 'Feriedag'
    },
    PERMISJONSDAG: {
        cssName: 'permisjonsdag',
        text: 'Permisjonsdag'
    },
    STUDIEDAG: {
        cssName: 'studiedag',
        text: 'Studiedag'
    },
    SYKEDAG: {
        cssName: 'sykedag',
        text: 'Sykedag'
    },
    SYK_HELGEDAG: {
        cssName: 'sykHelgedag',
        text: 'Syk helgedag'
    },
    UBESTEMTDAG: {
        cssName: 'ubestemtdag',
        text: 'Ubestemt dag'
    },
    UTENLANDSDAG: {
        cssName: 'utenlandsdag',
        text: 'Utenlandsdag'
    }
};

const dayType = type => {
    const dayType = dayTypes[type];
    return (
        dayType || {
            cssName: 'default',
            text: type
        }
    );
};
const TimelineRow = ({ date, type, source, showType }) => {
    return (
        <tr>
            <td>
                <div className="TimelineRow__date">{date}</div>
                {type && (
                    <div className={`TimelineRow__type ${dayType(type).cssName}`}>
                        <span>{showType && dayType(type).text}</span>
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
