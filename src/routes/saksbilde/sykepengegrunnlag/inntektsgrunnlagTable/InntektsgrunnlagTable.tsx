import React, { Dispatch, SetStateAction } from 'react';

import { BodyShort, Table } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Arbeidsgiverinntekt, Maybe, PersonFragment } from '@io/graphql';
import { somPenger } from '@utils/locale';

import { Inntektssammenligning } from './Inntektssammenligning';
import { TableCell } from './TableCell';

import styles from './SykepengegrunnlagPanel.module.css';

interface InntektsgrunnlagTableProps {
    person: PersonFragment;
    inntekter: Arbeidsgiverinntekt[];
    aktivInntektskilde?: Arbeidsgiverinntekt;
    setAktivInntektskilde: Dispatch<SetStateAction<Arbeidsgiverinntekt>>;
    omregnetÅrsinntekt?: Maybe<number>;
    sammenligningsgrunnlag?: Maybe<number>;
    skjønnsmessigFastsattÅrlig?: Maybe<number>;
}

export const InntektsgrunnlagTable = ({
    person,
    inntekter,
    aktivInntektskilde,
    setAktivInntektskilde,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    skjønnsmessigFastsattÅrlig,
}: InntektsgrunnlagTableProps) => (
    <Table className={styles.Table}>
        <Table.Header>
            <Table.Row>
                <HeaderCellBold />
                <HeaderCellBold text="Inntektsgrunnlag" />
                <HeaderCellBold text="Sammenligningsgrunnlag" />
                <HeaderCellBold text="Skjønnsfastsatt" />
            </Table.Row>
            <Table.Row>
                <HeaderCellText text="Inntektskilde" />
                <HeaderCellText text="Omregnet årsinntekt" />
                <HeaderCellText text="Rapportert årsinntekt" />
                <HeaderCellText text="Skjønnsfastsatt årsinntekt" />
            </Table.Row>
        </Table.Header>
        <Table.Body className={styles.InntektsgrunnlagTableBody}>
            {inntekter.map((inntekt, index) => (
                <Inntektssammenligning
                    key={index}
                    person={person}
                    organisasjonsnummer={inntekt.arbeidsgiver}
                    omregnetÅrsinntekt={inntekt.omregnetArsinntekt}
                    skjønnsmessigFastsatt={inntekt.skjonnsmessigFastsatt}
                    sammenligningsgrunnlag={inntekt.sammenligningsgrunnlag}
                    arbeidsforholdErDeaktivert={inntekt.deaktivert}
                    erGjeldende={aktivInntektskilde?.arbeidsgiver == inntekt.arbeidsgiver}
                    onSetAktivInntektskilde={() => setAktivInntektskilde(inntekt)}
                />
            ))}
        </Table.Body>
        <tfoot>
            <Table.Row>
                <Table.DataCell>
                    <Bold>Total</Bold>
                </Table.DataCell>
                <TableCell content={<Bold>{somPenger(omregnetÅrsinntekt)}</Bold>} />
                <TableCell content={<Bold>{somPenger(sammenligningsgrunnlag)}</Bold>} />
                <TableCell content={<Bold>{somPenger(skjønnsmessigFastsattÅrlig)}</Bold>} />
            </Table.Row>
        </tfoot>
    </Table>
);

interface HeaderCellBoldProps {
    text?: string;
}

const HeaderCellBold = ({ text = undefined }: HeaderCellBoldProps) =>
    text === undefined ? (
        <Table.HeaderCell />
    ) : (
        <Table.HeaderCell>
            <Bold>{text}</Bold>
        </Table.HeaderCell>
    );

interface HeaderCellTextProps {
    text: string;
}

const HeaderCellText = ({ text }: HeaderCellTextProps) => (
    <Table.HeaderCell>
        <BodyShort className={styles.ColumnTitle}>{text}</BodyShort>
    </Table.HeaderCell>
);
