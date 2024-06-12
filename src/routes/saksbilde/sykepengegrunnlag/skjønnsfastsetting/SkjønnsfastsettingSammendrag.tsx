import React from 'react';
import * as R from 'remeda';

import { sortTimestampDesc } from '@components/endringslogg/endringsloggUtils';
import { ArbeidsgiverFragment, Skjonnsfastsettingstype } from '@io/graphql';
import { isSykepengegrunnlagskjønnsfastsetting } from '@utils/typeguards';

import styles from './SkjønnsfastsettingSammendrag.module.css';

type Props = {
    arbeidsgivere: ArbeidsgiverFragment[];
};
export const SkjønnsfastsettingSammendrag = ({ arbeidsgivere }: Props) => {
    const sisteSkjønnsfastsetting = R.pipe(
        arbeidsgivere,
        R.first(),
        (it) => it?.overstyringer ?? [],
        R.filter(isSykepengegrunnlagskjønnsfastsetting),
        R.sort((a, b) => sortTimestampDesc(a.timestamp, b.timestamp)),
        R.first(),
    );

    if (!sisteSkjønnsfastsetting) return <></>;

    return (
        <div className={styles.sammendrag}>
            {sisteSkjønnsfastsetting.skjonnsfastsatt.arsak}
            <li>
                {sisteSkjønnsfastsetting.skjonnsfastsatt.type && tilType(sisteSkjønnsfastsetting.skjonnsfastsatt.type)}
            </li>
        </div>
    );
};

const tilType = (type: Skjonnsfastsettingstype) => {
    switch (type) {
        case Skjonnsfastsettingstype.Annet:
            return 'Skjønnsfastsatt til annet';
        case Skjonnsfastsettingstype.RapportertArsinntekt:
            return 'Skjønnsfastsatt til rapportert årsinntekt';
        case Skjonnsfastsettingstype.OmregnetArsinntekt:
            return 'Skjønnsfastsatt til omregnet årsinntekt';
    }
};
