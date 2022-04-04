import React, { useState } from 'react';
import classNames from 'classnames';

import { Flex } from '@components/Flex';
import { Bold } from '@components/Bold';
import { Kilde } from '@components/Kilde';
import { kildeForkortelse } from '@utils/inntektskilde';
import { overstyrInntektEnabled } from '@utils/featureToggles';
import { useEndringerForPeriode, useUtbetalingForSkjæringstidspunkt } from '@state/arbeidsgiverState';
import { Inntektskilde as GraphQLInntektskilde, Inntektstype, OmregnetArsinntekt, Utbetalingstatus } from '@io/graphql';

import { RedigerInntekt } from './RedigerInntekt';
import { EditableInntekt } from './EditableInntekt';
import { ReadOnlyInntekt } from './ReadOnlyInntekt';
import { EndringsloggButton } from './EndringsloggButton';

import styles from './Inntekt.module.css';

interface InntektBeregnetPeriodeProps {
    skjæringstidspunkt: DateString;
    omregnetÅrsinntekt?: OmregnetArsinntekt | null;
    organisasjonsnummer: string;
    vilkårsgrunnlagId: string;
    inntektstype: Inntektstype;
}

export const InntektBeregnetPeriode = ({
    skjæringstidspunkt,
    omregnetÅrsinntekt,
    organisasjonsnummer,
    vilkårsgrunnlagId,
    inntektstype,
}: InntektBeregnetPeriodeProps) => {
    const [editing, setEditing] = useState(false);
    const [endret, setEndret] = useState(false);

    const erRevurdering = useUtbetalingForSkjæringstidspunkt(skjæringstidspunkt)?.status === Utbetalingstatus.Utbetalt;
    const { inntektsendringer } = useEndringerForPeriode(organisasjonsnummer);

    return (
        <div className={classNames(styles.Inntekt, editing && styles.editing)}>
            <div className={classNames(styles.Header, editing && styles.editing)}>
                <Flex alignItems="center">
                    <Bold>Beregnet månedsinntekt</Bold>
                    {endret || omregnetÅrsinntekt?.kilde === GraphQLInntektskilde.Saksbehandler ? (
                        <EndringsloggButton endringer={inntektsendringer} />
                    ) : (
                        <Kilde type={omregnetÅrsinntekt?.kilde}>{kildeForkortelse(omregnetÅrsinntekt?.kilde)}</Kilde>
                    )}
                </Flex>
                {overstyrInntektEnabled && (
                    <RedigerInntekt
                        setEditing={setEditing}
                        editing={editing}
                        erRevurdering={erRevurdering}
                        inntektstype={inntektstype}
                        skjæringstidspunkt={skjæringstidspunkt}
                        vilkårsgrunnlagId={vilkårsgrunnlagId}
                    />
                )}
            </div>
            <div className={styles.InntektContainer}>
                {editing ? (
                    <EditableInntekt
                        omregnetÅrsinntekt={omregnetÅrsinntekt!}
                        close={() => setEditing(false)}
                        onEndre={setEndret}
                    />
                ) : (
                    <ReadOnlyInntekt omregnetÅrsinntekt={omregnetÅrsinntekt} />
                )}
            </div>
        </div>
    );
};
