import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Arbeidsgiverinntekt, GhostPeriodeFragment, PersonFragment } from '@io/graphql';
import { TilkommenInntektHeader } from '@saksbilde/sykepengegrunnlag/tilkommen/TilkommenInntektHeader';
import { useArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';
import { toKronerOgØre } from '@utils/locale';

import styles from './TilkommenInntekt.module.scss';

interface TilkommenInntektProps {
    person: PersonFragment;
    inntekter: Arbeidsgiverinntekt[];
}

export const TilkommenInntekt = ({ person, inntekter }: TilkommenInntektProps) => {
    const [editing, setEditing] = useState(false);
    const aktivPeriode = useActivePeriod();
    const arbeidsgiver = useArbeidsgiver((aktivPeriode as GhostPeriodeFragment).organisasjonsnummer);
    const inntekt = inntekter.find((it) => it.arbeidsgiver === arbeidsgiver?.organisasjonsnummer);

    if (!aktivPeriode || !arbeidsgiver || !inntekt) return null;

    return (
        <div>
            <div>
                <div className={styles.heading}>
                    <div className={styles.ikon} />
                    <Heading size="small">
                        Tilkommen inntekt {dayjs(aktivPeriode.fom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)} –
                        {dayjs(aktivPeriode.tom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)}
                    </Heading>
                </div>
                <div className={classNames(styles.formWrapper, { [styles.redigerer]: editing })}>
                    <TilkommenInntektHeader
                        person={person}
                        arbeidsgiver={arbeidsgiver}
                        periode={aktivPeriode as GhostPeriodeFragment}
                        editing={editing}
                        setEditing={setEditing}
                    />
                    {!editing && (
                        <div className={styles.innhold}>
                            <Bold>Starttidspunkt</Bold>
                            <BodyShort>{dayjs(aktivPeriode.fom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)}</BodyShort>
                            <Bold>Tilkommen inntekt</Bold>
                            <BodyShort>{toKronerOgØre(inntekt.omregnetArsinntekt?.manedsbelop ?? 0)} kr</BodyShort>
                            <Bold>Maks utbetaling </Bold>
                            <BodyShort>-</BodyShort>
                            <Bold>Opprettholdt inntekt</Bold>
                            <BodyShort>-</BodyShort>
                            <Bold>Total grad</Bold>
                            <BodyShort>-</BodyShort>
                        </div>
                    )}
                </div>
                {/*{editing && (*/}
                {/*    <TilkommenInntektForm*/}
                {/*        inntekter={inntekter}*/}
                {/*        onEndretSykepengegrunnlag={setEndretSykepengegrunnlag}*/}
                {/*        setEditing={setEditing}*/}
                {/*    />*/}
                {/*)}*/}
            </div>
        </div>
    );
};
