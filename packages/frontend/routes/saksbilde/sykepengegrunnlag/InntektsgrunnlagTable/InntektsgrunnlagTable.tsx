import React, { Dispatch, SetStateAction } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Arbeidsgiverinntekt } from '@io/graphql';
import { somPenger } from '@utils/locale';

import { Inntektssammenligning } from './Inntektssammenligning';
import { TableCell } from './TableCell';

import styles from './SykepengegrunnlagPanel.module.css';

interface InntektsgrunnlagTableProps {
    inntekter: Arbeidsgiverinntekt[];
    aktivInntektskilde?: Arbeidsgiverinntekt;
    setAktivInntektskilde: Dispatch<SetStateAction<Arbeidsgiverinntekt>>;
    omregnetÅrsinntekt?: Maybe<number>;
    sammenligningsgrunnlag?: Maybe<number>;
    skjønnsmessigFastsattÅrlig?: Maybe<number>;
}

export const InntektsgrunnlagTable = ({
    inntekter,
    aktivInntektskilde,
    setAktivInntektskilde,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    skjønnsmessigFastsattÅrlig,
}: InntektsgrunnlagTableProps) => (
    <table className={styles.Table}>
        <thead>
            <tr>
                <HeaderCellBold />
                <HeaderCellBold text="Inntektsgrunnlag" />
                <HeaderCellBold text="Sammenligningsgrunnlag" />
                <HeaderCellBold text="Skjønnsfastsatt" />
            </tr>
            <tr>
                <HeaderCellText text="Inntektskilde" />
                <HeaderCellText text="Omregnet årsinntekt" />
                <HeaderCellText text="Rapportert årsinntekt" />
                <HeaderCellText text="Skjønnsfastsatt årsinntekt" />
            </tr>
        </thead>
        <tbody className={styles.InntektsgrunnlagTableBody}>
            {inntekter.map((inntekt, index) => (
                <Inntektssammenligning
                    key={index}
                    organisasjonsnummer={inntekt.arbeidsgiver}
                    omregnetÅrsinntekt={inntekt.omregnetArsinntekt}
                    skjønnsmessigFastsatt={inntekt.skjonnsmessigFastsatt}
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
                <TableCell content={<Bold>{somPenger(omregnetÅrsinntekt)}</Bold>} />
                <TableCell content={<Bold>{somPenger(sammenligningsgrunnlag)}</Bold>} />
                <TableCell content={<Bold>{somPenger(skjønnsmessigFastsattÅrlig)}</Bold>} />
            </tr>
        </tfoot>
    </table>
);

interface HeaderCellBoldProps {
    text?: string;
}

const HeaderCellBold = ({ text = undefined }: HeaderCellBoldProps) =>
    text === undefined ? (
        <th />
    ) : (
        <th>
            <Bold>{text}</Bold>
        </th>
    );

interface HeaderCellTextProps {
    text: string;
}

const HeaderCellText = ({ text }: HeaderCellTextProps) => (
    <th>
        <BodyShort className={styles.ColumnTitle}>{text}</BodyShort>
    </th>
);
