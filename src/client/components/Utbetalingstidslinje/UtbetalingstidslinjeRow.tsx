import React from 'react';
import dayjs from 'dayjs';
import { Utbetalingsdagtype } from '../../context/types';
import './UtbetalingstidslinjeRow.less';

interface Props {
    dato: string;
    type: Utbetalingsdagtype | string;
    dagsats?: number;
    showType?: boolean;
}

interface utbetalingsdag {
    label: string;
    css: string;
}

const displayDagtype = (type: Utbetalingsdagtype | string): utbetalingsdag => {
    switch (type) {
        case Utbetalingsdagtype.ARBEIDSGIVERPERIODE:
            return { label: 'Arbeidsgiverperiode', css: 'arbeidsgiverdag' };
        case Utbetalingsdagtype.NAVDAG:
            return { label: 'Sykepengedag', css: 'navdag' };
        case Utbetalingsdagtype.NAVHELG:
            return { label: 'Helg', css: 'navhelg-dag' };
        case Utbetalingsdagtype.ARBEIDSDAG:
            return { label: 'Arbeidsdag', css: 'arbeidsdag' };
        case Utbetalingsdagtype.FRIDAG:
            return { label: 'Fridag', css: 'fridag' };
        case Utbetalingsdagtype.UKJENTDAG:
            return { label: 'Ukjent', css: 'ukjent-dag' };
        case Utbetalingsdagtype.AVVISTDAG:
            return { label: 'Avvist', css: 'avvist-dag' };
        default:
            return { label: '', css: '' };
    }
};

const UtbetalingstidslinjeRow = ({ dato, type, dagsats, showType }: Props) => {
    const { label, css } = displayDagtype(type);
    return (
        <tr>
            <td>
                <div className="UtbetalingstidslinjeRow__date">
                    {dayjs(dato).format('DD.MM.YYYY')}
                </div>
                {type && (
                    <div className={`UtbetalingstidslinjeRow__type ${css}`}>
                        <span>{showType && label}</span>
                    </div>
                )}
            </td>
            <td>100%</td>
            <td>
                <div className="UtbetalingstidslinjeRow__dagsats">
                    {dagsats && <span>{dagsats} kr</span>}
                </div>
            </td>
        </tr>
    );
};

export default UtbetalingstidslinjeRow;
