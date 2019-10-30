import React from 'react';
import PropTypes from 'prop-types';
import TimelineRow from './TimelineRow';
import { guid } from 'nav-frontend-js-utils';
import 'nav-frontend-tabell-style';
import './Timeline.less';

const hendelseTypeTilUiNavn = type => {
    switch (type) {
        case 'NySøknadMottatt':
            return 'SM';
        case 'SendtSøknadMottatt':
            return 'SØ';
        case 'InntektsmeldingMottatt':
            return 'IM';
        default:
            return type;
    }
};
const Timeline = ({ person }) => {
    if (!person?.arbeidsgivere) {
        return null;
    }
    const tidslinje = person.arbeidsgivere[0].saker[0].sykdomstidslinje;
    const hendelser = tidslinje.hendelser;
    const dager = tidslinje.dager.map(dag => {
        return {
            date: dag.dato,
            type: dag.type,
            source: hendelseTypeTilUiNavn(hendelser.find(h => h.hendelseId === dag.hendelseId).type)
        };
    });
    return (
        <table className="Timeline tabell">
            <thead>
                <tr>
                    <th>Sykmeldingsperiode</th>
                </tr>
            </thead>
            <tbody>
                {dager
                    .map(item => ({ ...item, key: guid() }))
                    .map((item, i, array) => {
                        const showType = i === 0 || array[i - 1].type !== item.type;
                        return <TimelineRow {...item} key={item.key} showType={showType} />;
                    })}
            </tbody>
        </table>
    );
};

Timeline.propTypes = {
    person: PropTypes.object
};

export default Timeline;
