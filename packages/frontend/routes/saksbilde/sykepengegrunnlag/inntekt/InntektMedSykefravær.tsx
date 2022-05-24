import React, { useState } from 'react';
import classNames from 'classnames';

import { Flex } from '@components/Flex';
import { Bold } from '@components/Bold';
import { Kilde } from '@components/Kilde';
import { kildeForkortelse } from '@utils/inntektskilde';
import { overstyrInntektEnabled } from '@utils/featureToggles';
import { useEndringerForPeriode, useUtbetalingForSkjæringstidspunkt } from '@state/arbeidsgiver';
import { Inntektskilde, Inntektstype, Maybe, OmregnetArsinntekt, Utbetalingstatus } from '@io/graphql';
import { useBeslutterOppgaveIsEnabled } from '@hooks/useBeslutterOppgaveIsEnabled';
import { useErBeslutteroppgaveOgErTidligereSaksbehandler } from '@hooks/useErBeslutteroppgaveOgErTidligereSaksbehandler';

import { RedigerInntekt } from './RedigerInntekt';
import { EditableInntekt } from './EditableInntekt';
import { ReadOnlyInntekt } from './ReadOnlyInntekt';
import { EndringsloggButton } from './EndringsloggButton';

import styles from './Inntekt.module.css';

interface InntektMedSykefraværProps {
    skjæringstidspunkt: DateString;
    organisasjonsnummer: string;
    omregnetÅrsinntekt?: Maybe<OmregnetArsinntekt>;
    vilkårsgrunnlagId?: string;
    inntektstype?: Inntektstype;
    erDeaktivert?: Maybe<boolean>;
}

export const InntektMedSykefravær = ({
    skjæringstidspunkt,
    omregnetÅrsinntekt,
    organisasjonsnummer,
    vilkårsgrunnlagId,
    inntektstype,
    erDeaktivert,
}: InntektMedSykefraværProps) => {
    const [editing, setEditing] = useState(false);
    const [endret, setEndret] = useState(false);

    const erRevurdering = useUtbetalingForSkjæringstidspunkt(skjæringstidspunkt)?.status === Utbetalingstatus.Utbetalt;
    const { inntektsendringer } = useEndringerForPeriode(organisasjonsnummer);
    const isBeslutterOppgave = useBeslutterOppgaveIsEnabled();
    const erBeslutteroppgaveOgErTidligereSaksbehandler = useErBeslutteroppgaveOgErTidligereSaksbehandler();

    return (
        <div className={classNames(styles.Inntekt, editing && styles.editing)}>
            <div className={classNames(styles.Header, editing && styles.editing)}>
                <Flex alignItems="center">
                    <Bold>Beregnet månedsinntekt</Bold>
                    {endret || omregnetÅrsinntekt?.kilde === Inntektskilde.Saksbehandler ? (
                        <EndringsloggButton endringer={inntektsendringer} />
                    ) : (
                        <Kilde type={omregnetÅrsinntekt?.kilde}>{kildeForkortelse(omregnetÅrsinntekt?.kilde)}</Kilde>
                    )}
                </Flex>
                {overstyrInntektEnabled &&
                    inntektstype &&
                    vilkårsgrunnlagId &&
                    !isBeslutterOppgave &&
                    !erBeslutteroppgaveOgErTidligereSaksbehandler && (
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
            {editing ? (
                <EditableInntekt
                    omregnetÅrsinntekt={omregnetÅrsinntekt!}
                    close={() => setEditing(false)}
                    onEndre={setEndret}
                />
            ) : (
                <ReadOnlyInntekt omregnetÅrsinntekt={omregnetÅrsinntekt} deaktivert={erDeaktivert} />
            )}
        </div>
    );
};
