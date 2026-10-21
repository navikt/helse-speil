import React from 'react';

import {
    ApiSkjonnsfastsettingstype,
    ApiSykepengegrunnlagskjonnsfastsetting,
} from '@io/rest/generated/spesialist.schemas';

import styles from './SkjønnsfastsettingSammendrag.module.css';

type Props = {
    sisteSkjønnsfastsetting: ApiSykepengegrunnlagskjonnsfastsetting;
};
export const SkjønnsfastsettingSammendrag = ({ sisteSkjønnsfastsetting }: Props) => (
    <div className={styles.sammendrag}>
        {sisteSkjønnsfastsetting.skjonnsfastsatt.arsak}
        <li>{sisteSkjønnsfastsetting.skjonnsfastsatt.type && tilType(sisteSkjønnsfastsetting.skjonnsfastsatt.type)}</li>
    </div>
);

const tilType = (type: ApiSkjonnsfastsettingstype) => {
    switch (type) {
        case ApiSkjonnsfastsettingstype.ANNET:
            return 'Skjønnsfastsatt til annet';
        case ApiSkjonnsfastsettingstype.RAPPORTERT_ARSINNTEKT:
            return 'Skjønnsfastsatt til rapportert årsinntekt';
        case ApiSkjonnsfastsettingstype.OMREGNET_ARSINNTEKT:
            return 'Skjønnsfastsatt til omregnet årsinntekt';
    }
};
