import React, { Dispatch, SetStateAction } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Arbeidsgiverinntekt } from '@io/graphql';
import { erUtvikling } from '@utils/featureToggles';
import { somPenger } from '@utils/locale';

import { Inntektssammenligning } from './Inntektssammenligning';

import styles from './SykepengegrunnlagPanel.module.css';

interface InntektsgrunnlagTableProps {
    inntekter: Arbeidsgiverinntekt[];
    aktivInntektskilde?: Arbeidsgiverinntekt;
    setAktivInntektskilde: Dispatch<SetStateAction<Arbeidsgiverinntekt>>;
    omregnetÅrsinntekt?: Maybe<number>;
    sammenligningsgrunnlag?: Maybe<number>;
    skjønnsmessigFastsattInntekt?: Maybe<number>;
}

export const InntektsgrunnlagTable = ({
    inntekter,
    aktivInntektskilde,
    setAktivInntektskilde,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    skjønnsmessigFastsattInntekt,
}: InntektsgrunnlagTableProps) => {
    return (
        <table className={styles.Table}>
            <thead>
                <tr>
                    <th />
                    <th>
                        <Bold>Inntektsgrunnlag</Bold>
                    </th>
                    <th>
                        <Bold>Sammenligningsgrunnlag</Bold>
                    </th>
                    {erUtvikling() && (
                        <th>
                            <Bold>Skjønnsfastsatt</Bold>
                        </th>
                    )}
                </tr>
                <tr>
                    <th>
                        <BodyShort className={styles.ColumnTitle}>Inntektskilde</BodyShort>
                    </th>
                    <th>
                        <BodyShort className={styles.ColumnTitle}>Omregnet årsinntekt</BodyShort>
                    </th>
                    <th>
                        <BodyShort className={styles.ColumnTitle}>Rapportert årsinntekt</BodyShort>
                    </th>
                    {erUtvikling() && (
                        <th>
                            <BodyShort className={styles.ColumnTitle}>Sykepengegrunnlag</BodyShort>
                        </th>
                    )}
                </tr>
            </thead>
            <tbody className={styles.InntektsgrunnlagTableBody}>
                {inntekter.map((inntekt, index) => (
                    <Inntektssammenligning
                        key={index}
                        organisasjonsnummer={inntekt.arbeidsgiver}
                        omregnetÅrsinntekt={inntekt.omregnetArsinntekt}
                        sammenligningsgrunnlag={inntekt.sammenligningsgrunnlag}
                        arbeidsforholdErDeaktivert={inntekt.deaktivert}
                        erGjeldende={aktivInntektskilde?.arbeidsgiver == inntekt.arbeidsgiver}
                        onSetAktivInntektskilde={() => setAktivInntektskilde(inntekt)}
                    />
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td>
                        <Bold>Total</Bold>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '3.5rem' }}>
                        <Bold>{somPenger(omregnetÅrsinntekt)}</Bold>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '2.25rem' }}>
                        <Bold>{somPenger(sammenligningsgrunnlag)}</Bold>
                    </td>
                    {erUtvikling() && (
                        <td style={{ textAlign: 'right', paddingRight: '3.5rem' }}>
                            <Bold>{somPenger(skjønnsmessigFastsattInntekt)}</Bold>
                        </td>
                    )}
                </tr>
            </tfoot>
        </table>
    );
};
