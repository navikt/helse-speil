import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort, Table } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Arbeidsgiverinntekt, VilkarsgrunnlagInfotrygd } from '@io/graphql';
import { kildeForkortelse } from '@utils/inntektskilde';
import { somPenger } from '@utils/locale';

import styles from './SykepengegrunnlagFraInfotrygd.module.css';

interface SykepengegrunnlagInfotrygdProps {
    vilkårsgrunnlag: VilkarsgrunnlagInfotrygd;
    organisasjonsnummer: string;
    arbeidsgivernavn?: string;
}

export const SykepengegrunnlagInfotrygd = ({
    vilkårsgrunnlag,
    organisasjonsnummer,
    arbeidsgivernavn,
}: SykepengegrunnlagInfotrygdProps): ReactElement => {
    return (
        <div className={styles.sykepengegrunnlag}>
            <Table className={styles.table}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.ColumnHeader>
                            <BodyShort weight="semibold">Inntektsgrunnlag</BodyShort>
                        </Table.ColumnHeader>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>
                            <BodyShort className={styles.kolonnetittel}>Inntektskilde</BodyShort>
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            <BodyShort className={styles.kolonnetittel}>Sykepengegrunnlag før 6G</BodyShort>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {vilkårsgrunnlag.inntekter.map((inntekt, index) => (
                        <InfotrygdInntekt
                            key={index}
                            arbeidsgivernavn={arbeidsgivernavn}
                            aktivtOrgnummer={organisasjonsnummer}
                            inntekt={inntekt}
                        />
                    ))}
                </Table.Body>
                <tfoot>
                    <Table.Row>
                        <Table.DataCell>
                            <BodyShort weight="semibold">Total</BodyShort>
                        </Table.DataCell>
                        <Table.DataCell>
                            <BodyShort weight="semibold">{somPenger(vilkårsgrunnlag.omregnetArsinntekt)}</BodyShort>
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell>
                            <BodyShort weight="semibold">Sykepengegrunnlag</BodyShort>
                        </Table.DataCell>
                        <Table.DataCell>
                            <BodyShort weight="semibold">{somPenger(vilkårsgrunnlag.sykepengegrunnlag)}</BodyShort>
                        </Table.DataCell>
                    </Table.Row>
                </tfoot>
            </Table>
        </div>
    );
};

interface InfotrygdInntektProps {
    aktivtOrgnummer: string;
    arbeidsgivernavn?: string;
    inntekt: Arbeidsgiverinntekt;
}

const InfotrygdInntekt = ({ aktivtOrgnummer, arbeidsgivernavn, inntekt }: InfotrygdInntektProps): ReactElement => (
    <Table.Row
        className={classNames(styles.arbeidsgiverrad, aktivtOrgnummer === inntekt.arbeidsgiver && styles.ergjeldende)}
    >
        <Table.DataCell>
            <AnonymizableText>
                {arbeidsgivernavn?.toLowerCase() === 'ikke tilgjengelig'
                    ? inntekt.arbeidsgiver
                    : `${arbeidsgivernavn} (${inntekt.arbeidsgiver})`}
            </AnonymizableText>
        </Table.DataCell>
        <Table.DataCell>
            <div className={styles.inntekt}>
                <BodyShort>
                    {inntekt.omregnetArsinntekt ? somPenger(inntekt.omregnetArsinntekt.belop) : 'Ukjent'}
                </BodyShort>
                {inntekt.omregnetArsinntekt && (
                    <Kilde type={inntekt.omregnetArsinntekt.kilde}>
                        {kildeForkortelse(inntekt.omregnetArsinntekt.kilde)}
                    </Kilde>
                )}
            </div>
        </Table.DataCell>
    </Table.Row>
);
