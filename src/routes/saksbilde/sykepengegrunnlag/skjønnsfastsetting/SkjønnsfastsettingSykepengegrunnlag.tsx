import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { erProd } from '@/env';
import { gql, useQuery } from '@apollo/client';
import { Arbeidsgiverinntekt, Sykepengegrunnlagsgrense } from '@io/graphql';

import { SykepengegrunnlagsgrenseView } from '../InntektsgrunnlagTable/SykepengegrunnlagsgrenseView/SykepengegrunnlagsgrenseView';
import { SkjønnsfastsettingHeader } from './SkjønnsfastsettingHeader';
import { SkjønnsfastsettingSammendrag } from './SkjønnsfastsettingSammendrag';
import { SkjønnsfastsettingForm } from './form/SkjønnsfastsettingForm/SkjønnsfastsettingForm';
import { useSkjønnsfastsettingDefaults } from './form/SkjønnsfastsettingForm/useSkjønnsfastsettingDefaults';
import { SkjønnsfastsettingMal, skjønnsfastsettingMaler } from './state';

import styles from './SkjønnsfastsettingSykepengegrunnlag.module.css';

interface SkjønnsfastsettingSykepengegrunnlagProps {
    sykepengegrunnlag: number;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    omregnetÅrsinntekt?: Maybe<number>;
    sammenligningsgrunnlag?: Maybe<number>;
    skjønnsmessigFastsattÅrlig?: Maybe<number>;
    inntekter: Arbeidsgiverinntekt[];
    avviksprosent: number;
}

export const SkjønnsfastsettingSykepengegrunnlag = ({
    sykepengegrunnlag,
    sykepengegrunnlagsgrense,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    skjønnsmessigFastsattÅrlig,
    inntekter,
    avviksprosent,
}: SkjønnsfastsettingSykepengegrunnlagProps) => {
    const [editing, setEditing] = useState(false);
    const setMaler = useSetRecoilState(skjønnsfastsettingMaler);
    const [endretSykepengegrunnlag, setEndretSykepengegrunnlag] = useState<Maybe<number>>(null);
    const { aktiveArbeidsgivere } = useSkjønnsfastsettingDefaults(inntekter);
    const arbeidsforholdMal = (aktiveArbeidsgivere?.length ?? 0) > 1 ? 'FLERE_ARBEIDSGIVERE' : 'EN_ARBEIDSGIVER';

    const { data, error, loading } = useQuery(
        gql`
            query SanityStuff($input: QueryPayload!) {
                sanity(input: $input)
                    @rest(type: "SanityFoo", endpoint: "sanity", path: "/", method: "POST", bodyKey: "input") {
                    result
                    query
                }
            }
        `,
        {
            variables: {
                input: { query: `*[_type == "skjonnsfastsettelseMal"]` },
            },
            onCompleted: (result) => {
                console.log('SETTING MALER');
                const mals =
                    result?.sanity?.result
                        ?.filter((it: SkjønnsfastsettingMal) =>
                            avviksprosent <= 25 ? it.lovhjemmel.ledd !== '2' : true,
                        )
                        ?.filter((it: SkjønnsfastsettingMal) => it.arbeidsforholdMal.includes(arbeidsforholdMal))
                        ?.filter((it: SkjønnsfastsettingMal) => (erProd ? it.iProd : true)) ?? [];

                console.log(mals);
                setMaler(mals);
            },
        },
    );

    console.log(data, error, loading);

    useEffect(() => {
        setEndretSykepengegrunnlag(null);
    }, [editing]);

    return (
        <div>
            <div className={classNames(styles.formWrapper, { [styles.redigerer]: editing })}>
                <SkjønnsfastsettingHeader
                    sykepengegrunnlag={sykepengegrunnlag}
                    endretSykepengegrunnlag={endretSykepengegrunnlag}
                    skjønnsmessigFastsattÅrlig={skjønnsmessigFastsattÅrlig}
                    sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                    editing={editing}
                    setEditing={setEditing}
                />
                {!editing && skjønnsmessigFastsattÅrlig !== null && <SkjønnsfastsettingSammendrag />}
                {editing && omregnetÅrsinntekt != null && sammenligningsgrunnlag != null && (
                    <SkjønnsfastsettingForm
                        inntekter={inntekter}
                        omregnetÅrsinntekt={omregnetÅrsinntekt}
                        sammenligningsgrunnlag={sammenligningsgrunnlag}
                        sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                        onEndretSykepengegrunnlag={setEndretSykepengegrunnlag}
                        setEditing={setEditing}
                    />
                )}
            </div>
            {omregnetÅrsinntekt != null && (
                <SykepengegrunnlagsgrenseView
                    sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                    omregnetÅrsinntekt={omregnetÅrsinntekt}
                />
            )}
        </div>
    );
};
