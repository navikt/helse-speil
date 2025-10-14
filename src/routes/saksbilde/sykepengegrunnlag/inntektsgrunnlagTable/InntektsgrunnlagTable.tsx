import React, { Dispatch, SetStateAction } from 'react';

import { BodyShort, Detail, Table } from '@navikt/ds-react';

import { Arbeidsgiverinntekt, PersonFragment } from '@io/graphql';
import { somPenger } from '@utils/locale';

import { Inntektssammenligning } from './Inntektssammenligning';
import { TableCell } from './TableCell';

import styles from './SykepengegrunnlagPanel.module.css';

interface InntektsgrunnlagTableProps {
    person: PersonFragment;
    inntekter: Arbeidsgiverinntekt[];
    aktivInntektskilde?: Arbeidsgiverinntekt;
    setAktivInntektskilde: Dispatch<SetStateAction<Arbeidsgiverinntekt>>;
    omregnetÅrsinntekt?: number | null;
    sammenligningsgrunnlag?: number | null;
    skjønnsmessigFastsattÅrlig?: number | null;
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
                <HeaderCellBold text="Sammenligningsgr." />
                <HeaderCellBold text="Skjønnsfastsatt" />
            </Table.Row>
            <Table.Row>
                <HeaderCellText text="Inntektskilde" />
                <HeaderCellText text="Omregnet årsinntekt" />
                <HeaderCellText text="Rapportert årsinntekt" />
                <HeaderCellText text="Sykepengegrunnlag" />
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
                    <BodyShort weight="semibold">Total</BodyShort>
                </Table.DataCell>
                <TableCell content={<BodyShort weight="semibold">{somPenger(omregnetÅrsinntekt)}</BodyShort>} />
                <TableCell content={<BodyShort weight="semibold">{somPenger(sammenligningsgrunnlag)}</BodyShort>} />
                <TableCell content={<BodyShort weight="semibold">{somPenger(skjønnsmessigFastsattÅrlig)}</BodyShort>} />
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
            <BodyShort weight="semibold">{text}</BodyShort>
        </Table.HeaderCell>
    );

interface HeaderCellTextProps {
    text: string;
}

const HeaderCellText = ({ text }: HeaderCellTextProps) => (
    <Table.HeaderCell>
        <Detail textColor="subtle">{text}</Detail>
    </Table.HeaderCell>
);
