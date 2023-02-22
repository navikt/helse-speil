import { harPeriodeTilBeslutterFor } from './InntektUtenSykefravær';
import { SisteTreMånedersInntekt } from './SisteTreMånedersInntekt';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';

import { Tooltip } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Flex } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Clipboard } from '@components/clipboard';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import {
    Arbeidsgiver,
    InntektFraAOrdningen,
    Inntektstype,
    Maybe,
    OmregnetArsinntekt,
    Utbetalingstatus,
} from '@io/graphql';
import { Refusjonsopplysning } from '@io/http';
import {
    useEndringerForPeriode,
    usePeriodForSkjæringstidspunkt,
    useUtbetalingForSkjæringstidspunkt,
} from '@state/arbeidsgiver';
import { useCurrentPerson } from '@state/person';
import { isForkastet } from '@state/selectors/period';
import { overstyrInntektEnabled } from '@utils/featureToggles';

import { BegrunnelseForOverstyring } from '../overstyring.types';
import { Refusjonsoversikt } from '../refusjon/Refusjonsoversikt';
import { EditableInntekt, inntektOgRefusjonState } from './EditableInntekt';
import { ReadOnlyInntekt } from './ReadOnlyInntekt';
import { RedigerInntektOgRefusjon } from './RedigerInntektOgRefusjon';

import styles from './Inntekt.module.css';

const useInntektKanRevurderes = (skjæringstidspunkt: DateString): boolean => {
    const person = useCurrentPerson();
    const periodeVedSkjæringstidspunkt = usePeriodForSkjæringstidspunkt(skjæringstidspunkt);
    const isReadOnlyOppgave = useIsReadOnlyOppgave();

    if (!person) return false;

    const harPeriodeTilBeslutter = harPeriodeTilBeslutterFor(person, skjæringstidspunkt);

    return (
        overstyrInntektEnabled &&
        !isForkastet(periodeVedSkjæringstidspunkt) &&
        !isReadOnlyOppgave &&
        !harPeriodeTilBeslutter
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
    const [lokaleInntektoverstyringer, setLokaleInntektoverstyringer] = useRecoilState(inntektOgRefusjonState);

    const erRevurdering = useUtbetalingForSkjæringstidspunkt(skjæringstidspunkt)?.status === Utbetalingstatus.Utbetalt;
    const { inntektsendringer } = useEndringerForPeriode(organisasjonsnummer);

    const kanRevurderes = useInntektKanRevurderes(skjæringstidspunkt);

    const lokaltMånedsbeløp =
        lokaleInntektoverstyringer.arbeidsgivere.filter((it) => it.organisasjonsnummer === organisasjonsnummer)?.[0]
            ?.månedligInntekt ?? null;

    return (
        <div className={classNames(styles.Inntekt, editing && styles.editing)}>
            <div className={classNames(styles.Header, editing && styles.editing)}>
                <div className={styles.ArbeidsgiverHeader}>
                    <Tooltip content="Arbeidsgiver">
                        <Arbeidsgiverikon alt="Arbeidsgiver" />
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
                {inntektstype && vilkårsgrunnlagId ? (
                    kanRevurderes ? (
                        <RedigerInntektOgRefusjon
                            setEditing={setEditing}
                            editing={editing}
                            erRevurdering={erRevurdering}
                            skjæringstidspunkt={skjæringstidspunkt}
                            organisasjonsnummer={organisasjonsnummer}
                            arbeidsgiver={arbeidsgiver}
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
            </Flex>
            {editing ? (
                <EditableInntekt
                    omregnetÅrsinntekt={omregnetÅrsinntekt!}
                    close={() => setEditing(false)}
                    onEndre={setEndret}
                    begrunnelser={endreInntektMedSykefraværBegrunnelser}
                    organisasjonsnummer={organisasjonsnummer}
                    skjæringstidspunkt={skjæringstidspunkt}
                />
            ) : (
                <ReadOnlyInntekt
                    omregnetÅrsinntekt={omregnetÅrsinntekt}
                    deaktivert={erDeaktivert}
                    lokaltMånedsbeløp={lokaltMånedsbeløp}
                    endret={endret}
                    inntektsendringer={inntektsendringer}
                />
            )}
            {refusjon && refusjon.length !== 0 && !editing && <Refusjonsoversikt refusjon={refusjon} />}
            {inntektFraAOrdningen && !editing && (
                <SisteTreMånedersInntekt inntektFraAOrdningen={inntektFraAOrdningen} />
            )}
        </div>
    );
};
