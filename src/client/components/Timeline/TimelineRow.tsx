import React from 'react';
import dayjs from 'dayjs';
import { Undertekst } from 'nav-frontend-typografi';
import { Dagtype, Optional } from '../../context/types';
import { HendelsestypeUINavn } from './Timeline';

interface Props {
    date: string;
    type?: Dagtype | string;
    hendelse?: Optional<HendelsestypeUINavn | string>;
    dagsats?: number;
    showType?: boolean;
    showDagsats?: boolean;
}

const displayDagtype = (type: Dagtype | string) => {
    switch (type) {
        case Dagtype.SYKEDAG:
            return 'Sykedag';
        case Dagtype.FERIEDAG:
            return 'Feriedag';
        case Dagtype.STUDIEDAG:
            return 'Studiedag';
        case Dagtype.ARBEIDSDAG:
            return 'Arbeidsdag';
        case Dagtype.UBESTEMTDAG:
            return 'Ubestemtdag';
        case Dagtype.SYK_HELGEDAG:
            return 'Syk helgedag';
        case Dagtype.UTENLANDSDAG:
            return 'Utenlandsdag';
        case Dagtype.PERMISJONSDAG:
            return 'Permisjonsdag';
        case Dagtype.EGENMELDINGSDAG:
            return 'Egenmeldingsdag';
        default:
            return '';
    }
};

const cssDagtype = (type: Dagtype | string) => {
    switch (type) {
        case Dagtype.SYKEDAG:
            return 'sykedag';
        case Dagtype.FERIEDAG:
            return 'feriedag';
        case Dagtype.STUDIEDAG:
            return 'studiedag';
        case Dagtype.ARBEIDSDAG:
            return 'arbeidsdag';
        case Dagtype.UBESTEMTDAG:
            return 'ubestemtDag';
        case Dagtype.SYK_HELGEDAG:
            return 'sykHelgedag';
        case Dagtype.UTENLANDSDAG:
            return 'utenlandsdag';
        case Dagtype.PERMISJONSDAG:
            return 'permisjonsdag';
        case Dagtype.EGENMELDINGSDAG:
            return 'egenmeldingsdag';
        default:
            return '';
    }
};

const TimelineRow = ({ date, type, hendelse, dagsats, showType, showDagsats }: Props) => {
    return (
        <tr>
            <td>
                <div className="TimelineRow__date">{dayjs(date).format('DD.MM.YYYY')}</div>
                {type && (
                    <div className={`TimelineRow__type ${cssDagtype(type)}`}>
                        <span>{showType && displayDagtype(type)}</span>
                        {hendelse && <Undertekst>{hendelse}</Undertekst>}
                    </div>
                )}
            </td>
            {showDagsats && (
                <td>
                    <div className="TimelineRow__dagsats">
                        {dagsats && <span>{dagsats} kr</span>}
                    </div>
                </td>
            )}
        </tr>
    );
};

export default TimelineRow;
