import React, { useState } from 'react';

import { Events } from '@navikt/analytics-types';
import { VStack } from '@navikt/ds-react';

import { useSkjønnsfastsettelsesMaler } from '@external/sanity';
import {
    ApiArbeidsgiverinntekt,
    ApiBeregnetPeriode,
    ApiGhostPeriode,
    ApiSaksbildePerson,
    ApiSykepengegrunnlagsgrense,
    ApiSykepengegrunnlagskjonnsfastsetting,
} from '@io/rest/generated/spesialist.schemas';
import { sporHendelse } from '@observability/hendelser';
import { SykepengegrunnlagsgrenseView } from '@saksbilde/sykepengegrunnlag/inntektsgrunnlagTable/sykepengegrunnlagsgrenseView/SykepengegrunnlagsgrenseView';
import {
    useAtomEditingForVilkårsgrunnlag,
    useAtomSkjemaForVilkårsgrunnlag,
} from '@saksbilde/sykepengegrunnlag/skjonnsfastsetting/atoms';
import {
    SkjønnsfastsettingForm,
    finnAktiveInntekter,
} from '@saksbilde/sykepengegrunnlag/skjonnsfastsetting/form/skjønnsfastsettingForm/SkjønnsfastsettingForm';
import { useAktivtInntektsforhold, useSerPåTidligereBehandling } from '@state/inntektsforhold/inntektsforhold';
import { useOverstyringerForInntektsforhold } from '@state/overstyringer';
import { cn } from '@utils/tw';
import { isSykepengegrunnlagskjønnsfastsetting } from '@utils/typeguards';

import { SkjønnsfastsettingHeader } from './SkjønnsfastsettingHeader';
import { SkjønnsfastsettingSammendrag } from './SkjønnsfastsettingSammendrag';

import styles from './SkjønnsfastsettingSykepengegrunnlag.module.css';

interface SkjønnsfastsettingSykepengegrunnlagProps {
    person: ApiSaksbildePerson;
    periode: ApiBeregnetPeriode | ApiGhostPeriode;
    vilkårsgrunnlagId: string;
    sykepengegrunnlag: number;
    sykepengegrunnlagsgrense: ApiSykepengegrunnlagsgrense;
    omregnetÅrsinntekt: number;
    sammenligningsgrunnlag?: number | null;
    skjønnsmessigFastsattÅrlig?: number | null;
    inntekter: ApiArbeidsgiverinntekt[];
    avviksprosent: number;
    organisasjonsnummer: string;
}

export const SkjønnsfastsettingSykepengegrunnlag = ({
    person,
    periode,
    vilkårsgrunnlagId,
    sykepengegrunnlag,
    sykepengegrunnlagsgrense,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    skjønnsmessigFastsattÅrlig,
    inntekter,
    avviksprosent,
    organisasjonsnummer,
}: SkjønnsfastsettingSykepengegrunnlagProps) => {
    const [editingForVilkårsgrunnlag, setEditing] = useAtomEditingForVilkårsgrunnlag(vilkårsgrunnlagId);
    const kanSkjønnsfastsette = !useSerPåTidligereBehandling(person);
    const editing = editingForVilkårsgrunnlag && kanSkjønnsfastsette;
    const [formValues, setFormValues] = useAtomSkjemaForVilkårsgrunnlag(vilkårsgrunnlagId);
    const [endretSykepengegrunnlag, setEndretSykepengegrunnlag] = useState<number | null>(null);
    const aktiveArbeidsgivereMedOmregnetÅrsinntekt = finnAktiveInntekter(inntekter);
    const skalVise828andreLedd = Math.abs(avviksprosent) > 25;
    const overstyringer = useOverstyringerForInntektsforhold(useAktivtInntektsforhold(person));

    const { maler, error } = useSkjønnsfastsettelsesMaler(
        skalVise828andreLedd,
        (aktiveArbeidsgivereMedOmregnetÅrsinntekt?.length ?? 0) > 1,
    );

    const closeAndResetForm = () => {
        setEditing(false);
        setFormValues(null);
        setEndretSykepengegrunnlag(null);
    };

    const avbrytSkjema = () => {
        sporHendelse({ name: 'skjema avbrutt', properties: { skjemanavn: 'skjønnsfastsetting' } });
        closeAndResetForm();
    };

    const openForm = () => {
        sporHendelse({ name: Events.SKJEMA_APNET, properties: { skjemanavn: 'skjønnsfastsetting' } });
        setEditing(true);
        setEndretSykepengegrunnlag(null);
    };

    const sisteSkjønnsfastsettelse: ApiSykepengegrunnlagskjonnsfastsetting | null =
        overstyringer
            .filter(isSykepengegrunnlagskjønnsfastsetting)
            .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
            .pop() ?? null;

    return (
        <VStack gap="space-8">
            <div key={periode.skjaeringstidspunkt} className={cn(styles.formWrapper, editing && styles.redigerer)}>
                <SkjønnsfastsettingHeader
                    person={person}
                    sykepengegrunnlag={sykepengegrunnlag}
                    endretSykepengegrunnlag={endretSykepengegrunnlag}
                    sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                    editing={editing}
                    kanSkjønnsfastsette={kanSkjønnsfastsette}
                    openForm={openForm}
                    maler={maler}
                    malerError={error?.message ? 'Mangler tekster for skjønnsfastsetting' : undefined}
                    organisasjonsnummer={organisasjonsnummer}
                    closeAndResetForm={avbrytSkjema}
                />
                {!editing && skjønnsmessigFastsattÅrlig !== null && sisteSkjønnsfastsettelse && (
                    <SkjønnsfastsettingSammendrag sisteSkjønnsfastsetting={sisteSkjønnsfastsettelse} />
                )}
                {editing && maler && sammenligningsgrunnlag != null && (
                    <SkjønnsfastsettingForm
                        person={person}
                        periode={periode}
                        inntekter={inntekter}
                        omregnetÅrsinntekt={omregnetÅrsinntekt}
                        sammenligningsgrunnlag={sammenligningsgrunnlag}
                        sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                        onEndretSykepengegrunnlag={setEndretSykepengegrunnlag}
                        closeAndResetForm={closeAndResetForm}
                        avbryt={avbrytSkjema}
                        maler={maler}
                        sisteSkjønnsfastsettelse={sisteSkjønnsfastsettelse}
                        formValues={formValues}
                        setFormValues={setFormValues}
                    />
                )}
            </div>
            <SykepengegrunnlagsgrenseView
                sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                sykepengegrunnlagFørBegrensning={omregnetÅrsinntekt}
            />
        </VStack>
    );
};
