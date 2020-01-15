import React from 'react';
import TimelineRow from './TimelineRow';
import { guid } from 'nav-frontend-js-utils';
import { listOfDatesBetween } from '../../utils/date';
import { Hendelsetype, Optional, Person, Utbetalingslinje } from '../../context/types';
import 'nav-frontend-tabell-style';
import './Timeline.less';

type DagsatsDict = { [key: string]: number };

export type HendelsestypeUINavn = 'SM' | 'SØ' | 'IM';

interface Props {
    person: Person;
    showDagsats: boolean;
}

const hendelseTypeTilUiNavn = (
    type?: Hendelsetype | string
): Optional<HendelsestypeUINavn | string> => {
    switch (type) {
        case 'NySøknad':
            return 'SM';
        case 'SendtSøknad':
            return 'SØ';
        case 'Inntektsmelding':
            return 'IM';
        default:
            return type;
    }
};

const buildDagsatserDictionary = (utbetalingslinjer: Utbetalingslinje[]): DagsatsDict => {
    const dagsatser: DagsatsDict = {};
    utbetalingslinjer
        .flatMap(periode =>
            listOfDatesBetween(periode.fom, periode.tom).map(dag => ({
                dag,
                dagsats: periode.dagsats
            }))
        )
        .forEach(d => (dagsatser[d.dag] = d.dagsats));
    return dagsatser;
};

const sumDagsatser = (dagsatser: DagsatsDict) => {
    return Object.values(dagsatser).reduce((sum, dagsats) => sum + dagsats, 0);
};

const Timeline = ({ person, showDagsats }: Props) => {
    const {
        sykdomstidslinje: tidslinje,
        utbetalingslinjer = []
    } = person.arbeidsgivere[0].saker[0];
    const hendelser = tidslinje.hendelser;
    const dagsatser = showDagsats ? buildDagsatserDictionary(utbetalingslinjer) : {};
    const dagsatserSummed = showDagsats && sumDagsatser(dagsatser);

    const dager = tidslinje.dager.map(dag => ({
        date: dag.dato,
        type: dag.type,
        hendelse: hendelseTypeTilUiNavn(hendelser.find(h => h.hendelseId === dag.hendelseId)?.type),
        dagsats: dagsatser?.[dag.dato]
    }));

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
            {dagsatserSummed && (
                <tfoot>
                    <tr>
                        <th>SUM</th>
                        <th>{`${dagsatserSummed} kr`}</th>
                    </tr>
                </tfoot>
            )}
        </table>
    );
};

export const _buildDagsatserDictionary = buildDagsatserDictionary;
export const _sumDagsatser = sumDagsatser;
export default Timeline;
