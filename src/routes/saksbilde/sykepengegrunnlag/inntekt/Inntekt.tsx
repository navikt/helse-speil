import React, { ReactElement, useRef, useState } from 'react';

import { Alert, Box } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import {
    Arbeidsgiverinntekt,
    Inntektskilde,
    PersonFragment,
    VilkarsgrunnlagInfotrygdV2,
    VilkarsgrunnlagSpleisV2,
} from '@io/graphql';
import { InntektOgRefusjonHeader } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/InntektOgRefusjonHeader';
import {
    dedupliserteInntektsmeldingHendelser,
    finnArbeidsgiverMedOrganisasjonsnummer,
} from '@state/inntektsforhold/arbeidsgiver';
import { lagArbeidsgiverReferanse } from '@state/inntektsforhold/inntektsforhold';
import { mapOgSorterRefusjoner } from '@state/overstyring';
import { cn } from '@utils/tw';

import { InntektOgRefusjon } from './inntektOgRefusjon/InntektOgRefusjon';

import styles from './Inntekt.module.css';

interface InntektContainerProps {
    person: PersonFragment;
    inntekt: Arbeidsgiverinntekt;
    vilkårsgrunnlag: VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2;
}

const InntektContainer = ({ person, inntekt, vilkårsgrunnlag }: InntektContainerProps): ReactElement => {
    const [editing, setEditing] = useState(false);
    const previousOrganisasjonsnummerRef = useRef<string | undefined>(undefined);

    if (previousOrganisasjonsnummerRef.current !== inntekt.arbeidsgiver) {
        previousOrganisasjonsnummerRef.current = inntekt.arbeidsgiver;
        if (editing) {
            setEditing(false);
        }
    }

    const arbeidsgiver = finnArbeidsgiverMedOrganisasjonsnummer(person, inntekt.arbeidsgiver);

    const arbeidsgiverrefusjon = vilkårsgrunnlag.arbeidsgiverrefusjoner.find(
        (arbeidsgiverrefusjon) => arbeidsgiverrefusjon.arbeidsgiver === inntekt.arbeidsgiver,
    );

    const inntektsmeldinghendelser = dedupliserteInntektsmeldingHendelser(arbeidsgiver);
    const refusjon = mapOgSorterRefusjoner(inntektsmeldinghendelser, arbeidsgiverrefusjon?.refusjonsopplysninger ?? []);

    const inntekterForSammenligningsgrunnlag =
        Number(
            vilkårsgrunnlag.__typename === 'VilkarsgrunnlagSpleisV2'
                ? (vilkårsgrunnlag.avviksvurdering?.avviksprosent ?? 0)
                : 0,
        ) > 25
            ? inntekt.sammenligningsgrunnlag?.inntektFraAOrdningen
            : [];

    return (
        <Box background="accent-soft" className={cn(styles.inntekt, editing && styles.editing)}>
            {inntekt.omregnetArsinntekt != null && arbeidsgiver != null ? (
                <InntektOgRefusjon
                    person={person}
                    skjæringstidspunkt={vilkårsgrunnlag.skjaeringstidspunkt}
                    inntekt={inntekt}
                    vilkårsgrunnlagId={vilkårsgrunnlag.id}
                    arbeidsgiver={arbeidsgiver}
                    refusjon={refusjon}
                    inntekterForSammenligningsgrunnlag={inntekterForSammenligningsgrunnlag}
                    editing={editing}
                    setEditing={setEditing}
                />
            ) : (
                <InntektOgRefusjonHeader
                    arbeidsgiverReferanse={lagArbeidsgiverReferanse(inntekt.arbeidsgiver, arbeidsgiver?.navn)}
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
    vilkårsgrunnlag: VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2;
}

export const Inntekt = ({ person, inntekt, vilkårsgrunnlag }: InntektProps): ReactElement => {
    return (
        <ErrorBoundary fallback={<InntektError />}>
            <InntektContainer person={person} inntekt={inntekt} vilkårsgrunnlag={vilkårsgrunnlag} />
        </ErrorBoundary>
    );
};
