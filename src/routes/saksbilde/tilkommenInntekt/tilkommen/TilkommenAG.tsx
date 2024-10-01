import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';

import {
    ArbeidsgiverFragment,
    Arbeidsgiverinntekt,
    NyttInntektsforholdPeriodeFragment,
    PersonFragment,
} from '@io/graphql';
import { EditableTilkommenAG } from '@saksbilde/tilkommenInntekt/tilkommen/EditableTilkommenAG';
import { TilkommenAGHeader } from '@saksbilde/tilkommenInntekt/tilkommen/TilkommenAGHeader';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';
import { toKronerOgØre } from '@utils/locale';

import styles from './TilkommenAG.module.scss';

interface TilkommenAGProps {
    person: PersonFragment;
    inntekt: Arbeidsgiverinntekt;
    periode: NyttInntektsforholdPeriodeFragment;
    arbeidsgiver: ArbeidsgiverFragment;
}

export const TilkommenAG = ({ person, inntekt, periode, arbeidsgiver }: TilkommenAGProps) => {
    const [editing, setEditing] = useState(false);
    const [endret, setEndret] = useState(false);

    return (
        <div className={styles.tilkommenAG}>
            <Heading size="small">
                Tilkommen inntekt {dayjs(periode.fom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)} –
                {dayjs(periode.tom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)}
            </Heading>
            <div
                className={classNames(
                    styles.formWrapper,
                    // { [styles.deaktivert]: periode.deaktivert },
                    { [styles.redigerer]: editing },
                )}
            >
                <TilkommenAGHeader
                    person={person}
                    arbeidsgiver={arbeidsgiver}
                    periode={periode}
                    editing={editing}
                    setEditing={setEditing}
                />

                {editing && inntekt.omregnetArsinntekt ? (
                    <EditableTilkommenAG
                        person={person}
                        arbeidsgiver={arbeidsgiver}
                        periode={periode}
                        omregnetÅrsinntekt={inntekt.omregnetArsinntekt}
                        fom={inntekt.fom}
                        tom={inntekt.tom}
                        close={() => setEditing(false)}
                        onEndre={setEndret}
                    />
                ) : (
                    <div className={styles.innhold}>
                        <BodyShort weight="semibold">Tilkommen inntekt</BodyShort>
                        <BodyShort>{toKronerOgØre(inntekt.omregnetArsinntekt?.manedsbelop ?? 0)} kr</BodyShort>
                        {/*<OverstyrArbeidsforholdUtenSykdom*/}
                        {/*    organisasjonsnummerAktivPeriode={arbeidsgiver.organisasjonsnummer}*/}
                        {/*    skjæringstidspunkt={skjæringstidspunkt}*/}
                        {/*    arbeidsforholdErDeaktivert={periode.deaktivert}*/}
                        {/*    person={person}*/}
                        {/*/>*/}
                    </div>
                )}
            </div>
        </div>
    );
};
