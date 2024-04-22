import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { Arbeidsgiverinntekt, Inntektskilde, Sykepengegrunnlagsgrense } from '@io/graphql';
import { erProd } from '@utils/featureToggles';

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
    const harBlittSkjønnsmessigFastsatt =
        inntekter.find((aginntekt) => aginntekt.arbeidsgiver === aktiveArbeidsgivere?.[0].organisasjonsnummer)
            ?.skjonnsmessigFastsatt?.kilde === Inntektskilde.SkjonnsmessigFastsatt;

    useEffect(() => {
        const response = fetch('https://z9kr8ddn.api.sanity.io/v2023-08-01/data/query/production', {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ query: `*[_type == "skjonnsfastsettelseMal"]` }),
        });
        response
            .then((response) => response.json())
            .then((it) => {
                setMaler(
                    it.result
                        .filter((it: SkjønnsfastsettingMal) =>
                            avviksprosent <= 25 || harBlittSkjønnsmessigFastsatt ? it.lovhjemmel.ledd !== '2' : true,
                        )
                        .filter((it: SkjønnsfastsettingMal) => it.arbeidsforholdMal.includes(arbeidsforholdMal))
                        .filter((it: SkjønnsfastsettingMal) => (erProd() ? it.iProd : true)),
                );
            });
    }, []);

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
