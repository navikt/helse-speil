import classNames from 'classnames';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Endringstrekant } from '@components/Endringstrekant';
import { Inntektskilde } from '@io/graphql';
import { somPenger } from '@utils/locale';

import styles from './InntektOgRefusjonSkjema.module.css';

interface OmregnetÅrsinntektProps {
    beløp: number;
    kilde: string;
    harEndringer: boolean;
}

export const OmregnetÅrsinntekt = ({ beløp, kilde, harEndringer }: OmregnetÅrsinntektProps) => (
    <div className={classNames(styles.Grid, styles.OmregnetTilÅrsinntekt, harEndringer && styles.harEndringer)}>
        <BodyShort>
            {kilde === Inntektskilde.Infotrygd ? 'Sykepengegrunnlag før 6G' : 'Omregnet til årsinntekt'}
        </BodyShort>
        <div>
            {harEndringer && <Endringstrekant />}
            <Bold>{somPenger(beløp)}</Bold>
        </div>
    </div>
);
