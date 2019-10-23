import React from 'react';
import PropTypes from 'prop-types';
import TimelineRow from './TimelineRow';
import { guid } from 'nav-frontend-js-utils';
import 'nav-frontend-tabell-style';
import './Timeline.less';

const Timeline = ({ person }) => {
    return person?.sykdomstidslinje ? (
        <table className="Timeline tabell">
            <thead>
                <tr>
                    <th>Sykmeldingsperiode</th>
                    <th>Gradering</th>
                </tr>
            </thead>
            <tbody>
                {person.sykdomstidslinje
                    .map(item => ({ ...item, key: guid() }))
                    .map((item, i, array) => {
                        const showType = i === 0 || array[i - 1].type !== item.type;
                        return <TimelineRow {...item} key={item.key} showType={showType} />;
                    })}
            </tbody>
        </table>
    ) : null;
};

Timeline.propTypes = {
    person: PropTypes.object
};

export default Timeline;
