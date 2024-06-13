import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { Bold } from '@components/Bold';
import { Kilde } from '@components/Kilde';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Clipboard } from '@components/clipboard';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import {
    ArbeidsgiverFragment,
    InntektFraAOrdningen,
    Inntektskilde,
    Inntektstype,
    Maybe,
    OmregnetArsinntekt,
    PersonFragment,
    VilkarsgrunnlagSpleis,
} from '@io/graphql';
import { getVilkårsgrunnlag } from '@person/utils';
import {
    useEndringerForPeriode,
    useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning,
    useLokaleRefusjonsopplysninger,
    useLokaltMånedsbeløp,
} from '@state/arbeidsgiver';
import { Refusjonsopplysning } from '@typer/overstyring';
import { DateString } from '@typer/shared';

import { Arbeidsgivernavn } from '../Arbeidsgivernavn';
import { OverstyrArbeidsforholdUtenSykdom } from '../overstyring/OverstyrArbeidsforholdUtenSykdom';
import { Refusjonsoversikt } from '../refusjon/Refusjonsoversikt';
import { EditableInntekt } from './EditableInntekt/EditableInntekt';
import { ReadOnlyInntekt } from './ReadOnlyInntekt';
import { RedigerGhostInntekt } from './RedigerGhostInntekt';
import { RedigerInntektOgRefusjon } from './RedigerInntektOgRefusjon/RedigerInntektOgRefusjon';
import { SisteTolvMånedersInntekt } from './SisteTolvMånedersInntekt';
import {
    endreInntektMedSykefraværBegrunnelser,
    endreInntektUtenSykefraværBegrunnelser,
    maybePeriodeTilGodkjenning,
    useArbeidsforholdKanOverstyres,
    useGhostInntektKanOverstyres,
    useInntektKanRevurderes,
} from './inntektOgRefusjonUtils';

import styles from './Inntekt.module.css';

interface InntektUtenSykefraværProps {
    person: PersonFragment;
    organisasjonsnummer: string;
    skjæringstidspunkt: DateString;
    erDeaktivert?: Maybe<boolean>;
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

    const arbeidsforholdKanOverstyres = useArbeidsforholdKanOverstyres(skjæringstidspunkt, organisasjonsnummer);
    const ghostInntektKanOverstyres = useGhostInntektKanOverstyres(skjæringstidspunkt, organisasjonsnummer);
    const { inntektsendringer } = useEndringerForPeriode(organisasjonsnummer);
    const kanRevurderes = useInntektKanRevurderes(skjæringstidspunkt);
    const lokaleRefusjonsopplysninger = useLokaleRefusjonsopplysninger(organisasjonsnummer, skjæringstidspunkt);
    const lokaltMånedsbeløp = useLokaltMånedsbeløp(organisasjonsnummer, skjæringstidspunkt);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning();

    const erRevurdering = maybePeriodeTilGodkjenning(person, skjæringstidspunkt) === null;
    const erInntektskildeAordningen = omregnetÅrsinntekt?.kilde === Inntektskilde.Aordningen;
    const skalVise12mnd828 =
        ((getVilkårsgrunnlag(person, vilkårsgrunnlagId) as VilkarsgrunnlagSpleis)?.avviksprosent ?? 0) > 25;

    return (
        <div
            className={classNames(styles.Inntekt, editingInntekt && styles.editing, erDeaktivert && styles.deaktivert)}
        >
            <div className={classNames(styles.Header, editingInntekt && styles.editing)}>
                <div className={styles.ArbeidsgiverHeader}>
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
                </div>
                {!harSykefravær && vilkårsgrunnlagId && !erDeaktivert && ghostInntektKanOverstyres && (
                    <RedigerGhostInntekt
                        erRevurdering={erRevurdering}
                        setEditing={setEditingInntekt}
                        editing={editingInntekt}
                    />
                )}
                {harSykefravær && vilkårsgrunnlagId && inntektstype ? (
                    kanRevurderes ? (
                        <RedigerInntektOgRefusjon
                            setEditing={setEditingInntekt}
                            editing={editingInntekt}
                            erRevurdering={erRevurdering}
                            skjæringstidspunkt={skjæringstidspunkt}
                            organisasjonsnummer={organisasjonsnummer}
                            arbeidsgiver={arbeidsgiver}
                        />
                    ) : (
                        <PopoverHjelpetekst ikon={<SortInfoikon />}>
                            <p>
                                {!erAktivPeriodeLikEllerFørPeriodeTilGodkjenning
                                    ? 'Perioden kan ikke overstyres fordi det finnes en oppgave på en tidligere periode'
                                    : 'Det er ikke mulig å endre inntekt i denne perioden'}
                            </p>
                        </PopoverHjelpetekst>
                    )
                ) : null}
            </div>
            <div className={styles.aligncenter}>
                <Bold>Beregnet månedsinntekt</Bold>
            </div>
            {/*TODO: Slå sammen EditableInntekt*/}
            {editingInntekt && !harSykefravær && omregnetÅrsinntekt ? (
                <EditableInntekt
                    omregnetÅrsinntekt={omregnetÅrsinntekt}
                    close={() => setEditingInntekt(false)}
                    onEndre={setEndret}
                    begrunnelser={endreInntektUtenSykefraværBegrunnelser}
                    organisasjonsnummer={organisasjonsnummer}
                    skjæringstidspunkt={skjæringstidspunkt}
                    person={person}
                />
            ) : editingInntekt && harSykefravær && omregnetÅrsinntekt ? (
                <EditableInntekt
                    omregnetÅrsinntekt={omregnetÅrsinntekt}
                    close={() => setEditingInntekt(false)}
                    onEndre={setEndret}
                    begrunnelser={endreInntektMedSykefraværBegrunnelser}
                    organisasjonsnummer={organisasjonsnummer}
                    skjæringstidspunkt={skjæringstidspunkt}
                    person={person}
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
                            ? omregnetÅrsinntekt?.inntektFraAOrdningen ?? inntektFraAOrdningen
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
