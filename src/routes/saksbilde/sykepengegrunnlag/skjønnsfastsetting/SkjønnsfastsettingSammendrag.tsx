import React from 'react';

import { Skjonnsfastsettingstype, Sykepengegrunnlagskjonnsfastsetting } from '@io/graphql';

import styles from './SkjønnsfastsettingSammendrag.module.css';

type Props = {
    sisteSkjønnsfastsetting: Sykepengegrunnlagskjonnsfastsetting;
};
export const SkjønnsfastsettingSammendrag = ({ sisteSkjønnsfastsetting }: Props) => (
    <div className={styles.sammendrag}>
        {sisteSkjønnsfastsetting.skjonnsfastsatt.arsak}
        <li>{sisteSkjønnsfastsetting.skjonnsfastsatt.type && tilType(sisteSkjønnsfastsetting.skjonnsfastsatt.type)}</li>
    </div>
);

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
