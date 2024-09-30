import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { PadlockUnlockedIcon, PersonPencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Label, VStack } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Clipboard } from '@components/clipboard';
import {
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    InntektFraAOrdningen,
    Inntektskilde,
    Inntektstype,
    Maybe,
    OmregnetArsinntekt,
    PersonFragment,
    VilkarsgrunnlagSpleis,
} from '@io/graphql';
import { InntektOgRefusjonSkjema } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/InntektOgRefusjonSkjema';
import {
    useArbeidsgiver,
    useEndringerForPeriode,
    useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning,
    useLokaleRefusjonsopplysninger,
    useLokaltMånedsbeløp,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/arbeidsgiver';
import { isInCurrentGeneration } from '@state/selectors/period';
import { getVilkårsgrunnlag } from '@state/utils';
import { Refusjonsopplysning } from '@typer/overstyring';
import { DateString } from '@typer/shared';

import { Arbeidsgivernavn } from '../../Arbeidsgivernavn';
import { OverstyrArbeidsforholdUtenSykdom } from '../../overstyring/OverstyrArbeidsforholdUtenSykdom';
import { Refusjonsoversikt } from '../../refusjon/Refusjonsoversikt';
import { ReadOnlyInntekt } from './ReadOnlyInntekt';
import { SisteTolvMånedersInntekt } from './SisteTolvMånedersInntekt';
import {
    endreInntektMedSykefraværBegrunnelser,
    endreInntektUtenSykefraværBegrunnelser,
    useArbeidsforholdKanOverstyres,
    useGhostInntektKanOverstyres,
    useInntektKanRevurderes,
} from './inntektOgRefusjonUtils';

import styles from '../Inntekt.module.css';

interface OverstyrKnappProps {
    editingInntekt: boolean;
    setEditingInntekt: (isEditing: boolean) => void;
    kanOverstyres: boolean;
    periodeErIGernerasjon: boolean;
    erAktivPeriodeLikEllerFørPeriodeTilGodkjenning: boolean;
}

const OverstyrKnapp = ({
    editingInntekt,
    setEditingInntekt,
    kanOverstyres,
    periodeErIGernerasjon,
    erAktivPeriodeLikEllerFørPeriodeTilGodkjenning,
}: OverstyrKnappProps) => {
    return editingInntekt ? (
        <Button
            onClick={() => setEditingInntekt(false)}
            variant="tertiary"
            size="xsmall"
            icon={<PadlockUnlockedIcon />}
        >
            Avbryt
        </Button>
    ) : (
        <HStack gap="2">
            {kanOverstyres && (
                <Button
                    onClick={() => setEditingInntekt(true)}
                    variant="secondary"
                    size="xsmall"
                    icon={<PersonPencilIcon />}
                >
                    Overstyr
                </Button>
            )}
            {!kanOverstyres && (
                <BodyShort>
                    {!erAktivPeriodeLikEllerFørPeriodeTilGodkjenning
                        ? 'Perioden kan ikke overstyres fordi det finnes en oppgave på en tidligere periode'
                        : !periodeErIGernerasjon
                          ? 'Perioden kan ikke overstyres fordi den ikke finnes i generasjonen'
                          : 'Det er ikke mulig å endre inntekt i denne perioden'}
                </BodyShort>
            )}
        </HStack>
    );
};

interface InntektUtenSykefraværProps {
    person: PersonFragment;
    organisasjonsnummer: string;
    skjæringstidspunkt: DateString;
    erDeaktivert?: Maybe<boolean>;
    inntektFom: Maybe<string>;
    inntektTom: Maybe<string>;
    omregnetÅrsinntekt?: Maybe<OmregnetArsinntekt>;
    vilkårsgrunnlagId?: Maybe<string>;
    periodeId?: Maybe<string>;
    inntektstype?: Maybe<Inntektstype>;
    arbeidsgiver: ArbeidsgiverFragment;
    refusjon?: Maybe<Refusjonsopplysning[]>;
    harSykefravær: boolean;
    inntektFraAOrdningen?: Array<InntektFraAOrdningen>;
    erGhostperiode: boolean;
    inntekterForSammenligningsgrunnlag?: Array<InntektFraAOrdningen>;
}

export const InntektOgRefusjon = ({
    person,
    organisasjonsnummer,
    skjæringstidspunkt,
    erDeaktivert,
    inntektFom,
    inntektTom,
    omregnetÅrsinntekt,
    vilkårsgrunnlagId,
    periodeId,
    inntektstype,
    arbeidsgiver,
    refusjon,
    harSykefravær,
    inntektFraAOrdningen,
    erGhostperiode,
    inntekterForSammenligningsgrunnlag,
}: InntektUtenSykefraværProps) => {
    const [editingInntekt, setEditingInntekt] = useState(false);
    const [endret, setEndret] = useState(false);

    useEffect(() => {
        setEditingInntekt(false);
    }, [periodeId]);

    const arbeidsforholdKanOverstyres = useArbeidsforholdKanOverstyres(person, skjæringstidspunkt, organisasjonsnummer);
    const ghostInntektKanOverstyres = useGhostInntektKanOverstyres(person, skjæringstidspunkt, organisasjonsnummer);
    const endringer = useArbeidsgiver(person, organisasjonsnummer)?.overstyringer;
    const { inntektsendringer } = useEndringerForPeriode(endringer, person);
    const kanRevurderes = useInntektKanRevurderes(person, skjæringstidspunkt);
    const lokaleRefusjonsopplysninger = useLokaleRefusjonsopplysninger(organisasjonsnummer, skjæringstidspunkt);
    const lokaltMånedsbeløp = useLokaltMånedsbeløp(organisasjonsnummer, skjæringstidspunkt);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning(person);

    const erInntektskildeAordningen = omregnetÅrsinntekt?.kilde === Inntektskilde.Aordningen;
    const skalVise12mnd828 =
        ((getVilkårsgrunnlag(person, vilkårsgrunnlagId) as VilkarsgrunnlagSpleis)?.avviksprosent ?? 0) > 25;

    const periode = usePeriodForSkjæringstidspunktForArbeidsgiver(
        person,
        skjæringstidspunkt,
        organisasjonsnummer,
    ) as BeregnetPeriodeFragment;

    const periodeErIGernerasjon = isInCurrentGeneration(periode, arbeidsgiver);

    const kanOverstyres =
        (vilkårsgrunnlagId != null &&
            ((!erDeaktivert && ghostInntektKanOverstyres) ||
                (inntektstype && kanRevurderes && periodeErIGernerasjon))) ??
        false;

    return (
        <div
            className={classNames(styles.Inntekt, editingInntekt && styles.editing, erDeaktivert && styles.deaktivert)}
        >
            <VStack gap="4">
                <OverstyrKnapp
                    editingInntekt={editingInntekt}
                    setEditingInntekt={setEditingInntekt}
                    kanOverstyres={kanOverstyres}
                    periodeErIGernerasjon={periodeErIGernerasjon}
                    erAktivPeriodeLikEllerFørPeriodeTilGodkjenning={erAktivPeriodeLikEllerFørPeriodeTilGodkjenning}
                />
                <HStack gap="3" align="center" paddingBlock="0 6">
                    <Arbeidsgivernavn className={styles.Arbeidsgivernavn} arbeidsgivernavn={arbeidsgiver.navn} />
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
                </HStack>
            </VStack>
            <Label size="small">Beregnet månedsinntekt</Label>;
            {editingInntekt && omregnetÅrsinntekt ? (
                <InntektOgRefusjonSkjema
                    omregnetÅrsinntekt={omregnetÅrsinntekt}
                    close={() => setEditingInntekt(false)}
                    onEndre={setEndret}
                    begrunnelser={
                        harSykefravær ? endreInntektMedSykefraværBegrunnelser : endreInntektUtenSykefraværBegrunnelser
                    }
                    skjæringstidspunkt={skjæringstidspunkt}
                    person={person}
                    arbeidsgiver={arbeidsgiver}
                    inntektFom={inntektFom}
                    inntektTom={inntektTom}
                />
            ) : (
                <ReadOnlyInntekt
                    omregnetÅrsinntekt={omregnetÅrsinntekt}
                    lokaltMånedsbeløp={lokaltMånedsbeløp}
                    endret={endret}
                    inntektsendringer={inntektsendringer}
                />
            )}
            {refusjon && refusjon.length !== 0 && !editingInntekt && (
                <Refusjonsoversikt refusjon={refusjon} lokaleRefusjonsopplysninger={lokaleRefusjonsopplysninger} />
            )}
            {!editingInntekt && (
                <SisteTolvMånedersInntekt
                    skjæringstidspunkt={skjæringstidspunkt}
                    inntektFraAOrdningen={
                        erInntektskildeAordningen && !skalVise12mnd828
                            ? (omregnetÅrsinntekt?.inntektFraAOrdningen ?? inntektFraAOrdningen)
                            : inntektFraAOrdningen
                    }
                    erAktivGhost={erGhostperiode && !erDeaktivert}
                    inntekterForSammenligningsgrunnlag={inntekterForSammenligningsgrunnlag}
                />
            )}
            {!editingInntekt && arbeidsforholdKanOverstyres && !harSykefravær && (
                <OverstyrArbeidsforholdUtenSykdom
                    organisasjonsnummerAktivPeriode={organisasjonsnummer}
                    skjæringstidspunkt={skjæringstidspunkt}
                    arbeidsforholdErDeaktivert={erDeaktivert}
                    person={person}
                />
            )}
        </div>
    );
};
