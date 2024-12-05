import React from 'react';

import { Detail } from '@navikt/ds-react';

import { LovdataLenke } from '@components/LovdataLenke';
import { Maybe, Sykepengegrunnlagsgrense } from '@io/graphql';
import { somDato } from '@utils/date';
import { somPengerUtenDesimaler } from '@utils/locale';

import styles from './SykepengegrunnlagsgrenseView.module.css';

const getFormattedDate = (dato: string) => somDato(dato).locale('no').format('DD. MMM YYYY');

interface Props {
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    omregnetÅrsinntekt?: Maybe<number>;
}

export const SykepengegrunnlagsgrenseView = ({ sykepengegrunnlagsgrense, omregnetÅrsinntekt }: Props) => (
    <>
        {omregnetÅrsinntekt && omregnetÅrsinntekt > sykepengegrunnlagsgrense.grense && (
            <Detail className={styles.Detail}>
                {`Sykepengegrunnlaget er begrenset til 6G: ${somPengerUtenDesimaler(sykepengegrunnlagsgrense.grense)}`}
                <LovdataLenke paragraf="8-10">§ 8-10</LovdataLenke>
            </Detail>
        )}
        <Detail className={styles.Detail}>
            {`Grunnbeløp (G) ved skjæringstidspunkt: ${somPengerUtenDesimaler(sykepengegrunnlagsgrense.grunnbelop)}`}
            <br />({getFormattedDate(sykepengegrunnlagsgrense.virkningstidspunkt)})
        </Detail>
    </>
);
