import React from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Undertekst } from 'nav-frontend-typografi';

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
const TimelineRow = ({ date, type, source, dagsats, showType, showDagsats }) => {
    return (
        <tr>
            <td>
                <div className="TimelineRow__date">{dayjs(date).format('DD.MM.YYYY')}</div>
                {type && (
                    <div className={`TimelineRow__type ${dayType(type).cssName}`}>
                        <span>{showType && dayType(type).text}</span>
                        {source && <Undertekst>{source}</Undertekst>}
                    </div>
                )}
            </td>
            {showDagsats && (
                <td>
                    <div className="TimelineRow__dagsats">
                        <span>{dagsats} kr</span>
                    </div>
                </td>
            )}
        </tr>
    );
};

TimelineRow.propTypes = {
    date: PropTypes.string,
    type: PropTypes.string,
    source: PropTypes.string,
    dagsats: PropTypes.number,
    showType: PropTypes.bool,
    showDagsats: PropTypes.bool
};

export default TimelineRow;
