import React, { useState } from 'react';
import classNames from 'classnames';

import { Flex } from '@components/Flex';
import { Bold } from '@components/Bold';
import { Kilde } from '@components/Kilde';
import { kildeForkortelse } from '@utils/inntektskilde';
import { isBeregnetPeriode, isForkastetPeriode } from '@utils/typeguards';
import { overstyrInntektEnabled } from '@utils/featureToggles';
import { useActivePeriod } from '@state/periode';
import {
    useEndringerForPeriode,
    usePeriodForSkjæringstidspunkt,
    useUtbetalingForSkjæringstidspunkt,
} from '@state/arbeidsgiver';
import { Inntektskilde, Inntektstype, Maybe, OmregnetArsinntekt, Utbetalingstatus } from '@io/graphql';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';

import { RedigerInntekt } from './RedigerInntekt';
import { EditableInntekt } from './EditableInntekt';
import { ReadOnlyInntekt } from './ReadOnlyInntekt';
import { EndringsloggButton } from './EndringsloggButton';

import styles from './Inntekt.module.css';

const useIsBeslutteroppgave = (): boolean => {
    const activePeriod = useActivePeriod();

    return isBeregnetPeriode(activePeriod) && activePeriod.erBeslutterOppgave;
};

const useInntektKanRevurderes = (skjæringstidspunkt: DateString): boolean => {
    const periodeVedSkjæringstidspunkt = usePeriodForSkjæringstidspunkt(skjæringstidspunkt);
    const isReadOnlyOppgave = useIsReadOnlyOppgave();
    const isBeslutteroppgave = useIsBeslutteroppgave();

    return (
        overstyrInntektEnabled &&
        !isForkastetPeriode(periodeVedSkjæringstidspunkt) &&
        !isReadOnlyOppgave &&
        !isBeslutteroppgave
    );
};

const endreInntektMedSykefraværBegrunnelser = [
    'Korrigert inntekt i inntektsmelding',
    'Tariffendring i inntektsmelding',
    'Innrapportert feil inntekt til A-ordningen',
    'Annen kilde til endring',
];

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

    const kanRevurderes = useInntektKanRevurderes(skjæringstidspunkt);

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
                {inntektstype && vilkårsgrunnlagId && kanRevurderes && (
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
                    begrunnelser={endreInntektMedSykefraværBegrunnelser}
                />
            ) : (
                <ReadOnlyInntekt omregnetÅrsinntekt={omregnetÅrsinntekt} deaktivert={erDeaktivert} />
            )}
        </div>
    );
};
