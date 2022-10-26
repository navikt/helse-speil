import classNames from 'classnames';
import React, { useState } from 'react';

import { Bold } from '@components/Bold';
import { Flex } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Inntektskilde, Inntektstype, Maybe, OmregnetArsinntekt, Utbetalingstatus } from '@io/graphql';
import {
    useCurrentArbeidsgiver,
    useEndringerForPeriode,
    usePeriodForSkjæringstidspunkt,
    useUtbetalingForSkjæringstidspunkt,
} from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { overstyrInntektEnabled } from '@utils/featureToggles';
import { kildeForkortelse } from '@utils/inntektskilde';
import { isBeregnetPeriode, isForkastetPeriode } from '@utils/typeguards';

import { BegrunnelseForOverstyring } from '../overstyring.types';
import { EditableInntekt } from './EditableInntekt';
import { EndringsloggButton } from './EndringsloggButton';
import { ReadOnlyInntekt } from './ReadOnlyInntekt';
import { RedigerInntekt } from './RedigerInntekt';

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

const endreInntektMedSykefraværBegrunnelser: BegrunnelseForOverstyring[] = [
    { id: '0', forklaring: 'Korrigert inntekt i inntektsmelding' },
    { id: '1', forklaring: 'Tariffendring i inntektsmelding' },
    { id: '2', forklaring: 'Innrapportert feil inntekt til A-ordningen' },
    { id: '3', forklaring: 'Annen kilde til endring' },
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

    const inntektForValgtArbeidsgiver = useCurrentArbeidsgiver()?.organisasjonsnummer === organisasjonsnummer;

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
                {inntektstype && vilkårsgrunnlagId && kanRevurderes && inntektForValgtArbeidsgiver && (
                    <RedigerInntekt
                        setEditing={setEditing}
                        editing={editing}
                        erRevurdering={erRevurdering}
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
