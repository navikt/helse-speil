import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { Label } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Clipboard } from '@components/clipboard';
import {
    ArbeidsgiverFragment,
    Arbeidsgiverinntekt,
    BeregnetPeriodeFragment,
    InntektFraAOrdningen,
    Inntektskilde,
    Inntektstype,
    Maybe,
    PersonFragment,
    VilkarsgrunnlagSpleis,
} from '@io/graphql';
import { ToggleOverstyring } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/ToggleOverstyring';
import { InntektOgRefusjonSkjema } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/InntektOgRefusjonSkjema';
import {
    useArbeidsgiver,
    useEndringerForPeriode,
    useLokaleRefusjonsopplysninger,
    useLokaltMånedsbeløp,
} from '@state/arbeidsgiver';
import { getVilkårsgrunnlag } from '@state/utils';
import { Refusjonsopplysning } from '@typer/overstyring';
import { ActivePeriod } from '@typer/shared';
import { isGhostPeriode } from '@utils/typeguards';

import { Arbeidsgivernavn } from '../../Arbeidsgivernavn';
import { OverstyrArbeidsforholdUtenSykdom } from '../../overstyring/OverstyrArbeidsforholdUtenSykdom';
import { Refusjonsoversikt } from '../../refusjon/Refusjonsoversikt';
import { ReadOnlyInntekt } from './ReadOnlyInntekt';
import { SisteTolvMånedersInntekt } from './SisteTolvMånedersInntekt';
import {
    endreInntektMedSykefraværBegrunnelser,
    endreInntektUtenSykefraværBegrunnelser,
    useArbeidsforholdKanOverstyres,
} from './inntektOgRefusjonUtils';

import styles from '../Inntekt.module.css';

interface InntektUtenSykefraværProps {
    person: PersonFragment;
    periode: ActivePeriod;
    inntekt: Arbeidsgiverinntekt;
    vilkårsgrunnlagId?: Maybe<string>;
    periodeId?: Maybe<string>;
    inntektstype?: Maybe<Inntektstype>;
    arbeidsgiver: ArbeidsgiverFragment;
    refusjon?: Maybe<Refusjonsopplysning[]>;
    harSykefravær: boolean;
    inntektFraAOrdningen?: Array<InntektFraAOrdningen>;
    inntekterForSammenligningsgrunnlag?: Array<InntektFraAOrdningen>;
}

export const InntektOgRefusjon = ({
    person,
    periode,
    inntekt,
    vilkårsgrunnlagId,
    arbeidsgiver,
    refusjon,
    harSykefravær,
    inntektFraAOrdningen,
    inntekterForSammenligningsgrunnlag,
}: InntektUtenSykefraværProps) => {
    const [editingInntekt, setEditingInntekt] = useState(false);
    const [endret, setEndret] = useState(false);

    const {
        omregnetArsinntekt: omregnetÅrsinntekt,
        arbeidsgiver: organisasjonsnummer,
        deaktivert: erDeaktivert,
        fom: inntektFom,
        tom: inntektTom,
    } = inntekt;

    const { skjaeringstidspunkt: skjæringstidspunkt, id: periodeId, inntektstype } = periode as BeregnetPeriodeFragment;
    const erGhostperiode = isGhostPeriode(periode);

    useEffect(() => {
        setEditingInntekt(false);
    }, [periodeId]);

    const arbeidsforholdKanOverstyres = useArbeidsforholdKanOverstyres(person, skjæringstidspunkt, organisasjonsnummer);
    const endringer = useArbeidsgiver(person, organisasjonsnummer)?.overstyringer;
    const { inntektsendringer } = useEndringerForPeriode(endringer, person);
    const lokaleRefusjonsopplysninger = useLokaleRefusjonsopplysninger(organisasjonsnummer, skjæringstidspunkt);
    const lokaltMånedsbeløp = useLokaltMånedsbeløp(organisasjonsnummer, skjæringstidspunkt);

    const erInntektskildeAordningen = omregnetÅrsinntekt?.kilde === Inntektskilde.Aordningen;
    const skalVise12mnd828 =
        ((getVilkårsgrunnlag(person, vilkårsgrunnlagId) as VilkarsgrunnlagSpleis)?.avviksprosent ?? 0) > 25;

    return (
        <div
            className={classNames(styles.Inntekt, editingInntekt && styles.editing, erDeaktivert && styles.deaktivert)}
        >
            <ToggleOverstyring
                person={person}
                arbeidsgiver={arbeidsgiver}
                periode={periode}
                vilkårsgrunnlagId={vilkårsgrunnlagId}
                skjæringstidspunkt={skjæringstidspunkt}
                organisasjonsnummer={organisasjonsnummer}
                erDeaktivert={erDeaktivert ?? false}
                editing={editingInntekt}
                setEditing={setEditingInntekt}
            />
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
            </div>
            <Label size="small">Beregnet månedsinntekt</Label>
            {editingInntekt && omregnetÅrsinntekt ? (
                <InntektOgRefusjonSkjema
                    omregnetÅrsinntekt={omregnetÅrsinntekt}
                    close={() => setEditingInntekt(false)}
                    harEndring={setEndret}
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
