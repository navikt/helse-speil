import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';

import { ArbeidsgiverFragment, NyttInntektsforholdPeriodeFragment, PersonFragment } from '@io/graphql';
import { EditableTilkommenAG } from '@saksbilde/tilkommenInntekt/tilkommen/EditableTilkommenAG';
import { TilkommenAGHeader } from '@saksbilde/tilkommenInntekt/tilkommen/TilkommenAGHeader';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';
import { toKronerOgØre } from '@utils/locale';

import styles from './TilkommenAG.module.scss';

interface TilkommenAGProps {
    person: PersonFragment;
    periode: NyttInntektsforholdPeriodeFragment;
    arbeidsgiver: ArbeidsgiverFragment;
}

export const TilkommenAG = ({ person, periode, arbeidsgiver }: TilkommenAGProps) => {
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

                {editing ? (
                    <EditableTilkommenAG
                        person={person}
                        arbeidsgiver={arbeidsgiver}
                        periode={periode}
                        close={() => setEditing(false)}
                        onEndre={setEndret}
                    />
                ) : (
                    <div className={styles.innhold}>
                        <BodyShort weight="semibold">Tilkommen inntekt</BodyShort>
                        <BodyShort>{toKronerOgØre(periode.manedligBelop ?? 0)} kr</BodyShort>
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
