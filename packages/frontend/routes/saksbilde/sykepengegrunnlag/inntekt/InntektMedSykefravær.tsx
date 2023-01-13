import { SisteTreMånedersInntekt } from './SisteTreMånedersInntekt';
import classNames from 'classnames';
import React, { useState } from 'react';

import { Bag } from '@navikt/ds-icons';
import { Tooltip } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Flex } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Clipboard } from '@components/clipboard';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import {
    Arbeidsgiver,
    InntektFraAOrdningen,
    Inntektskilde,
    Inntektstype,
    Maybe,
    OmregnetArsinntekt,
    Utbetalingstatus,
} from '@io/graphql';
import { Refusjonsopplysning } from '@io/http';
import {
    useCurrentArbeidsgiver,
    useEndringerForPeriode,
    usePeriodForSkjæringstidspunkt,
    useUtbetalingForSkjæringstidspunkt,
} from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { isForkastet } from '@state/selectors/period';
import { kanOverstyreRefusjonsopplysninger, overstyrInntektEnabled } from '@utils/featureToggles';
import { kildeForkortelse } from '@utils/inntektskilde';
import { isBeregnetPeriode } from '@utils/typeguards';

import { BegrunnelseForOverstyring } from '../overstyring.types';
import { Refusjonsoversikt } from '../refusjon/Refusjonsoversikt';
import { EditableInntekt } from './EditableInntekt';
import { EndringsloggButton } from './EndringsloggButton';
import { ReadOnlyInntekt } from './ReadOnlyInntekt';
import { RedigerInntekt } from './RedigerInntekt';

import styles from './Inntekt.module.css';

const useIsBeslutteroppgave = (): boolean => {
    const activePeriod = useActivePeriod();

    return isBeregnetPeriode(activePeriod) && (activePeriod.oppgave?.erBeslutter ?? false);
};

const useInntektKanRevurderes = (skjæringstidspunkt: DateString): boolean => {
    const periodeVedSkjæringstidspunkt = usePeriodForSkjæringstidspunkt(skjæringstidspunkt);
    const isReadOnlyOppgave = useIsReadOnlyOppgave();
    const isBeslutteroppgave = useIsBeslutteroppgave();

    return (
        overstyrInntektEnabled &&
        !isForkastet(periodeVedSkjæringstidspunkt) &&
        !isReadOnlyOppgave &&
        !isBeslutteroppgave
    );
};

const endreInntektMedSykefraværBegrunnelser: BegrunnelseForOverstyring[] = [
    { id: '0', forklaring: 'Korrigert inntekt i inntektsmelding' },
    { id: '1', forklaring: 'Tariffendring i inntektsmelding' },
    { id: '2', forklaring: 'Innrapportert feil inntekt til A-ordningen' },
    { id: '3', forklaring: 'Endring/opphør av refusjon' },
    { id: '4', forklaring: 'Annen kilde til endring' },
];

interface InntektMedSykefraværProps {
    skjæringstidspunkt: DateString;
    organisasjonsnummer: string;
    omregnetÅrsinntekt?: Maybe<OmregnetArsinntekt>;
    vilkårsgrunnlagId?: string;
    inntektstype?: Inntektstype;
    erDeaktivert?: Maybe<boolean>;
    arbeidsgiver: Arbeidsgiver;
    refusjon?: Maybe<Refusjonsopplysning[]>;
    inntektFraAOrdningen?: Array<InntektFraAOrdningen>;
}

export const InntektMedSykefravær = ({
    skjæringstidspunkt,
    omregnetÅrsinntekt,
    organisasjonsnummer,
    vilkårsgrunnlagId,
    inntektstype,
    erDeaktivert,
    arbeidsgiver,
    refusjon,
    inntektFraAOrdningen,
}: InntektMedSykefraværProps) => {
    const [editing, setEditing] = useState(false);
    const [endret, setEndret] = useState(false);

    const erRevurdering = useUtbetalingForSkjæringstidspunkt(skjæringstidspunkt)?.status === Utbetalingstatus.Utbetalt;
    const { inntektsendringer } = useEndringerForPeriode(organisasjonsnummer);

    const kanRevurderes = useInntektKanRevurderes(skjæringstidspunkt);

    const inntektGjelderValgtArbeidsgiver = useCurrentArbeidsgiver()?.organisasjonsnummer === organisasjonsnummer;

    return (
        <div className={classNames(styles.Inntekt, editing && styles.editing)}>
            <div className={classNames(styles.Header, editing && styles.editing)}>
                <div className={styles.ArbeidsgiverHeader}>
                    <Tooltip content="Arbeidsgiver">
                        <Bag title="Arbeidsgiver" />
                    </Tooltip>
                    <Tooltip content="Arbeidsgivernavn">
                        <div className={styles.Arbeidsgivernavn}>
                            <AnonymizableTextWithEllipsis>{arbeidsgiver.navn}</AnonymizableTextWithEllipsis>
                        </div>
                    </Tooltip>
                    <div className={styles.Organisasjonsnummer}>
                        (
                        <Clipboard
                            copyMessage="Organisasjonsnummer er kopiert"
                            tooltip={{ content: 'Kopier organisasjonsnummer' }}
                        >
                            <AnonymizableContainer>{arbeidsgiver.organisasjonsnummer}</AnonymizableContainer>
                        </Clipboard>
                        )
                    </div>
                    <Kilde type="AINNTEKT">AA</Kilde>
                </div>
                {inntektstype && vilkårsgrunnlagId && inntektGjelderValgtArbeidsgiver ? (
                    kanRevurderes ? (
                        <RedigerInntekt
                            setEditing={setEditing}
                            editing={editing}
                            erRevurdering={erRevurdering}
                            vilkårsgrunnlagId={vilkårsgrunnlagId}
                        />
                    ) : (
                        <PopoverHjelpetekst ikon={<SortInfoikon />}>
                            <p>Det er ikke mulig å endre inntekt i denne perioden </p>
                        </PopoverHjelpetekst>
                    )
                ) : null}
            </div>
            <Flex alignItems="center">
                <Bold>Beregnet månedsinntekt</Bold>
                {endret || omregnetÅrsinntekt?.kilde === Inntektskilde.Saksbehandler ? (
                    <EndringsloggButton endringer={inntektsendringer} />
                ) : (
                    <Kilde type={omregnetÅrsinntekt?.kilde}>{kildeForkortelse(omregnetÅrsinntekt?.kilde)}</Kilde>
                )}
            </Flex>
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
            {refusjon &&
                refusjon.length !== 0 &&
                ((kanOverstyreRefusjonsopplysninger && !editing) || !kanOverstyreRefusjonsopplysninger) && (
                    <Refusjonsoversikt refusjon={refusjon} />
                )}
            {inntektFraAOrdningen && !editing && (
                <SisteTreMånedersInntekt inntektFraAOrdningen={inntektFraAOrdningen} />
            )}
        </div>
    );
};
