import React from 'react';

import { sortTimestampDesc } from '@components/endringslogg/endringsloggUtils';
import { Skjonnsfastsettingstype, Sykepengegrunnlagskjonnsfastsetting } from '@io/graphql';
import { useCurrentPerson } from '@person/query';
import { isSykepengegrunnlagskjønnsfastsetting } from '@utils/typeguards';

import styles from './SkjønnsfastsettingSammendrag.module.css';

export const SkjønnsfastsettingSammendrag = () => {
    const person = useCurrentPerson();
    const sisteSkjønnsfastsetting = person.arbeidsgivere[0].overstyringer
        .filter((it) => isSykepengegrunnlagskjønnsfastsetting(it))
        .sort((a, b) => sortTimestampDesc(a.timestamp, b.timestamp))
        .shift() as Sykepengegrunnlagskjonnsfastsetting;

    if (!person || !sisteSkjønnsfastsetting) return <></>;

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
