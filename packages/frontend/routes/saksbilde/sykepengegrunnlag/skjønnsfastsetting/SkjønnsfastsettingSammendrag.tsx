import React from 'react';

import { Skjonnsfastsettingstype, Sykepengegrunnlagskjonnsfastsetting } from '@io/graphql';
import { useCurrentPerson } from '@state/person';
import { isSykepengegrunnlagskjønnsfastsetting } from '@utils/typeguards';

import styles from './SkjønnsfastsettingSammendrag.module.css';

export const SkjønnsfastsettingSammendrag = () => {
    const person = useCurrentPerson();
    const sisteSkjønnsfastsetting = person.arbeidsgivere[0].overstyringer.findLast(
        isSykepengegrunnlagskjønnsfastsetting,
    ) as Sykepengegrunnlagskjonnsfastsetting;

    if (!person || !sisteSkjønnsfastsetting) return <></>;

    return (
        <div className={styles.sammendrag}>
            <ul>
                <li>{sisteSkjønnsfastsetting.skjonnsfastsatt.arsak}</li>
                <li>
                    {sisteSkjønnsfastsetting.skjonnsfastsatt.type &&
                        tilType(sisteSkjønnsfastsetting.skjonnsfastsatt.type)}
                </li>
            </ul>
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
