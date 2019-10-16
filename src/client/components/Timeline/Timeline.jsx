import React from 'react';
import TimelineRow from './TimelineRow';
import { guid } from 'nav-frontend-js-utils';
import 'nav-frontend-tabell-style';
import './Timeline.less';

const PeriodeType = {
    EGENMELDING: 'egenmelding',
    SYK: 'syk',
    UBESTEMT: 'ubestemt',
    UTENLANDS: 'utenlands',
    HELG: 'helg',
    PERMISJON: 'permisjon',
    ARBEIDSDAG: 'arbeidsdag',
    UTDANNING: 'utdanning',
    ANNEN_INNTEKT: 'annen inntekt'
};

const PeriodeKilde = {
    SM: 'sm'
};

const mockData = {
    periode: [
        { date: '26.02.2019', type: PeriodeType.EGENMELDING, degree: 100, source: PeriodeKilde.SM },
        { date: '25.02.2019', type: PeriodeType.EGENMELDING, degree: 100, source: PeriodeKilde.SM },
        { date: '24.02.2019', type: PeriodeType.EGENMELDING, degree: 100, source: PeriodeKilde.SM },
        { date: '23.02.2019', type: PeriodeType.SYK, degree: 100, source: PeriodeKilde.SM },
        { date: '22.02.2019' },
        { date: '21.02.2019', type: PeriodeType.HELG },
        { date: '20.02.2019', type: PeriodeType.HELG },
        { date: '19.02.2019', type: PeriodeType.SYK, degree: 100, source: PeriodeKilde.SM },
        { date: '18.02.2019', type: PeriodeType.SYK, degree: 100, source: PeriodeKilde.SM },
        { date: '17.02.2019', type: PeriodeType.SYK, degree: 100, source: PeriodeKilde.SM },
        { date: '16.02.2019', type: PeriodeType.SYK, degree: 100, source: PeriodeKilde.SM },
        { date: '15.02.2019', type: PeriodeType.SYK, degree: 100, source: PeriodeKilde.SM },
        { date: '14.02.2019', type: PeriodeType.HELG },
        { date: '13.02.2019', type: PeriodeType.HELG },
        { date: '12.02.2019', type: PeriodeType.SYK, degree: 100, source: PeriodeKilde.SM },
        { date: '11.02.2019', type: PeriodeType.SYK, degree: 100, source: PeriodeKilde.SM },
        { date: '10.02.2019', type: PeriodeType.SYK, degree: 100, source: PeriodeKilde.SM },
        { date: '9.02.2019', type: PeriodeType.UBESTEMT, degree: 100, source: PeriodeKilde.SM },
        { date: '8.02.2019', type: PeriodeType.UBESTEMT, degree: 100, source: PeriodeKilde.SM },
        { date: '7.02.2019', type: PeriodeType.HELG },
        { date: '6.02.2019', type: PeriodeType.HELG },
        { date: '5.02.2019', type: PeriodeType.SYK, degree: 100, source: PeriodeKilde.SM },
        { date: '4.02.2019', type: PeriodeType.SYK, degree: 100, source: PeriodeKilde.SM },
        { date: '3.02.2019', type: PeriodeType.SYK, degree: 100, source: PeriodeKilde.SM },
        { date: '2.02.2019', type: PeriodeType.UTENLANDS, degree: 100, source: PeriodeKilde.SM },
        { date: '1.02.2019', type: PeriodeType.UTENLANDS, degree: 100, source: PeriodeKilde.SM },
        { date: '31.01.2019', type: PeriodeType.HELG },
        { date: '30.01.2019', type: PeriodeType.HELG },
        { date: '29.01.2019', type: PeriodeType.PERMISJON },
        { date: '28.01.2019', type: PeriodeType.ARBEIDSDAG },
        { date: '27.01.2019', type: PeriodeType.ANNEN_INNTEKT },
        { date: '26.01.2019', type: PeriodeType.UTDANNING }
    ].map(item => ({ ...item, key: guid() }))
};

const Timeline = () => {
    return (
        <table className="Timeline tabell">
            <thead>
                <tr>
                    <th>Sykemeldingsperiode</th>
                    <th>Gradering</th>
                </tr>
            </thead>
            <tbody>
                {mockData.periode.map((item, i, array) => {
                    const showType = i === 0 || array[i - 1].type !== item.type;
                    return <TimelineRow {...item} key={item.key} showType={showType} />;
                })}
            </tbody>
        </table>
    );
};

export default Timeline;
