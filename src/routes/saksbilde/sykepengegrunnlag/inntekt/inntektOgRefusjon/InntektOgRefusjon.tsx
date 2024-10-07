import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { PadlockUnlockedIcon, PersonPencilIcon } from '@navikt/aksel-icons';
import { Button, Label } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Clipboard } from '@components/clipboard';
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
import { RedigerInntektOgRefusjon } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/redigerInntektOgRefusjon/RedigerInntektOgRefusjon';
import { InntektOgRefusjonSkjema } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/InntektOgRefusjonSkjema';
import {
    useArbeidsgiver,
    useEndringerForPeriode,
    useLokaleRefusjonsopplysninger,
    useLokaltMånedsbeløp,
} from '@state/arbeidsgiver';
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
} from './inntektOgRefusjonUtils';

import styles from '../Inntekt.module.css';

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
    const ghostInntektKanOverstyres =
        useGhostInntektKanOverstyres(person, skjæringstidspunkt, organisasjonsnummer) && !erDeaktivert;
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
            {!harSykefravær && vilkårsgrunnlagId && !editingInntekt && ghostInntektKanOverstyres && (
                <Button
                    onClick={() => setEditingInntekt(true)}
                    icon={<PersonPencilIcon />}
                    size="xsmall"
                    variant="secondary"
                >
                    Overstyr
                </Button>
            )}
            {harSykefravær && vilkårsgrunnlagId && !editingInntekt && inntektstype && (
                <RedigerInntektOgRefusjon
                    person={person}
                    setEditing={setEditingInntekt}
                    skjæringstidspunkt={skjæringstidspunkt}
                    organisasjonsnummer={organisasjonsnummer}
                    arbeidsgiver={arbeidsgiver}
                />
            )}
            {editingInntekt && (
                <Button
                    onClick={() => setEditingInntekt(false)}
                    size="xsmall"
                    variant="tertiary"
                    icon={<PadlockUnlockedIcon />}
                >
                    Avbryt
                </Button>
            )}
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
