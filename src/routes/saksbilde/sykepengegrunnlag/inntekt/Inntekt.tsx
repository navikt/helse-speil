import cn from 'classnames';
import React, { ReactElement, useEffect, useState } from 'react';

import { Alert, Box } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Arbeidsgiverinntekt, Inntektskilde, PersonFragment, VilkarsgrunnlagSpleisV2 } from '@io/graphql';
import { InntektOgRefusjonHeader } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/InntektOgRefusjonHeader';
import {
    dedupliserteInntektsmeldingHendelser,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/arbeidsgiver';
import { finnArbeidsgiver } from '@state/arbeidsgiverHelpers';
import { mapOgSorterRefusjoner } from '@state/overstyring';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

import { useVilkårsgrunnlag } from '../useVilkårsgrunnlag';
import { InntektOgRefusjon } from './inntektOgRefusjon/InntektOgRefusjon';

import styles from './Inntekt.module.css';

interface InntektContainerProps {
    person: PersonFragment;
    inntekt: Arbeidsgiverinntekt;
}

const InntektContainer = ({ person, inntekt }: InntektContainerProps): ReactElement | null => {
    const [editing, setEditing] = useState(false);

    const aktivPeriode = useActivePeriod(person);
    const periodeForSkjæringstidspunktForArbeidsgiver = usePeriodForSkjæringstidspunktForArbeidsgiver(
        person,
        aktivPeriode?.skjaeringstidspunkt ?? null,
        inntekt.arbeidsgiver,
    );
    const arbeidsgiver = finnArbeidsgiver(person, inntekt.arbeidsgiver);
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, periodeForSkjæringstidspunktForArbeidsgiver);

    const vilkårsgrunnlagAktivPeriode = useVilkårsgrunnlag(person, aktivPeriode);
    const uberegnetAGfinnesIVilkårsgrunnlaget = vilkårsgrunnlagAktivPeriode?.inntekter.find(
        (it) => it.arbeidsgiver === arbeidsgiver?.organisasjonsnummer,
    );
    const arbeidsgiverrefusjon =
        vilkårsgrunnlag && isBeregnetPeriode(periodeForSkjæringstidspunktForArbeidsgiver)
            ? vilkårsgrunnlag.arbeidsgiverrefusjoner.find(
                  (arbeidsgiverrefusjon) => arbeidsgiverrefusjon.arbeidsgiver === arbeidsgiver?.organisasjonsnummer,
              )
            : isUberegnetPeriode(periodeForSkjæringstidspunktForArbeidsgiver) && uberegnetAGfinnesIVilkårsgrunnlaget
              ? vilkårsgrunnlagAktivPeriode?.arbeidsgiverrefusjoner.find(
                    (arbeidsgiverrefusjon) => arbeidsgiverrefusjon.arbeidsgiver === arbeidsgiver?.organisasjonsnummer,
                )
              : null;

    const vilkårsgrunnlagId = !isUberegnetPeriode(periodeForSkjæringstidspunktForArbeidsgiver)
        ? periodeForSkjæringstidspunktForArbeidsgiver?.vilkarsgrunnlagId
        : aktivPeriode !== null && !isUberegnetPeriode(aktivPeriode)
          ? aktivPeriode.vilkarsgrunnlagId
          : null;

    useEffect(() => {
        setEditing(false);
    }, [periodeForSkjæringstidspunktForArbeidsgiver?.id]);

    if (!aktivPeriode || !periodeForSkjæringstidspunktForArbeidsgiver || !vilkårsgrunnlagId) {
        return null;
    }

    const inntektsmeldinghendelser = dedupliserteInntektsmeldingHendelser(arbeidsgiver);
    const refusjon = mapOgSorterRefusjoner(inntektsmeldinghendelser, arbeidsgiverrefusjon?.refusjonsopplysninger ?? []);

    const inntekterForSammenligningsgrunnlag =
        Number((vilkårsgrunnlag as VilkarsgrunnlagSpleisV2)?.avviksvurdering?.avviksprosent ?? 0) > 25
            ? inntekt.sammenligningsgrunnlag?.inntektFraAOrdningen
            : [];

    return (
        <Box background={'surface-action-subtle'} className={cn(styles.inntekt, editing && styles.editing)}>
            {inntekt.omregnetArsinntekt != null && arbeidsgiver != null ? (
                <InntektOgRefusjon
                    person={person}
                    periode={periodeForSkjæringstidspunktForArbeidsgiver}
                    inntekt={inntekt}
                    vilkårsgrunnlagId={vilkårsgrunnlagId}
                    arbeidsgiver={arbeidsgiver}
                    refusjon={refusjon}
                    inntekterForSammenligningsgrunnlag={inntekterForSammenligningsgrunnlag}
                    editing={editing}
                    setEditing={setEditing}
                />
            ) : (
                <InntektOgRefusjonHeader
                    organisasjonsnummer={arbeidsgiver?.organisasjonsnummer ?? inntekt.arbeidsgiver}
                    arbeidsgivernavn={arbeidsgiver?.navn ?? 'Ukjent'}
                    kilde={Inntektskilde.Aordningen}
                />
            )}
        </Box>
    );
};

const InntektError = (): ReactElement => {
    return (
        <Alert variant="error" size="small" className={styles.Inntekt}>
            Det har skjedd en feil. Kunne ikke vise inntekt for denne perioden.
        </Alert>
    );
};

interface InntektProps {
    person: PersonFragment;
    inntekt: Arbeidsgiverinntekt;
}

export const Inntekt = ({ person, inntekt }: InntektProps): ReactElement => {
    return (
        <ErrorBoundary fallback={<InntektError />}>
            <InntektContainer person={person} inntekt={inntekt} />
        </ErrorBoundary>
    );
};
