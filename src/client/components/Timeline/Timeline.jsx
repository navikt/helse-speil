import React from 'react';
import PropTypes from 'prop-types';
import TimelineRow from './TimelineRow';
import { guid } from 'nav-frontend-js-utils';
import 'nav-frontend-tabell-style';
import './Timeline.less';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

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

const findDagsats = (date, utbetalingsperioder) =>
    utbetalingsperioder.find(utbetalingsperiode => {
        return dayjs(date).isBetween(utbetalingsperiode.fom, utbetalingsperiode.tom, 'day', '[]');
    })?.dagsats || 0;

const Timeline = ({ person, showDagsats }) => {
    if (!person?.arbeidsgivere) {
        return null;
    }
    const { sykdomstidslinje: tidslinje, utbetalingsperioder } = person.arbeidsgivere[0].saker[0];
    const hendelser = tidslinje.hendelser;
    const dager = tidslinje.dager.map(dag => {
        return {
            date: dag.dato,
            type: dag.type,
            source: hendelseTypeTilUiNavn(
                hendelser.find(h => h.hendelseId === dag.hendelseId).type
            ),
            dagsats: findDagsats(dag.dato, utbetalingsperioder)
        };
    });
    return (
        <table className="Timeline tabell">
            <thead>
                <tr>
                    <th>Sykmeldingsperiode</th>
                    {showDagsats && <th>Dagsats</th>}
                </tr>
            </thead>
            <tbody>
                {dager
                    .map(item => ({ ...item, key: guid() }))
                    .map((item, i, array) => {
                        const showType = i === 0 || array[i - 1].type !== item.type;
                        return (
                            <TimelineRow
                                {...item}
                                key={item.key}
                                showType={showType}
                                showDagsats={showDagsats}
                            />
                        );
                    })}
            </tbody>
        </table>
    );
};

Timeline.propTypes = {
    person: PropTypes.object,
    showDagsats: PropTypes.bool
};

export const _findDagsats = findDagsats;
export default Timeline;
