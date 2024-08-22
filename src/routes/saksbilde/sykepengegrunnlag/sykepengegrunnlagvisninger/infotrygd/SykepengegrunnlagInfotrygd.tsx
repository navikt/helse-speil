import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort, Table } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Kilde } from '@components/Kilde';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Arbeidsgiverinntekt, VilkarsgrunnlagInfotrygd } from '@io/graphql';
import { useArbeidsgiver } from '@state/arbeidsgiver';
import { kildeForkortelse } from '@utils/inntektskilde';
import { somPenger } from '@utils/locale';

import styles from './SykepengegrunnlagFraInfotrygd.module.css';

interface SykepengegrunnlagInfotrygdProps {
    vilkårsgrunnlag: VilkarsgrunnlagInfotrygd;
    organisasjonsnummer: string;
}

export const SykepengegrunnlagInfotrygd = ({
    vilkårsgrunnlag,
    organisasjonsnummer,
}: SykepengegrunnlagInfotrygdProps): ReactElement => {
    return (
        <div className={styles.sykepengegrunnlag}>
            <Table className={styles.table}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.ColumnHeader>
                            <Bold>Inntektsgrunnlag</Bold>
                        </Table.ColumnHeader>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>
                            <BodyShort as="p" className={styles.kolonnetittel}>
                                Inntektskilde
                            </BodyShort>
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            <BodyShort as="p" className={styles.kolonnetittel}>
                                Sykepengegrunnlag før 6G
                            </BodyShort>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {vilkårsgrunnlag.inntekter.map((inntekt, index) => (
                        <InfotrygdInntekt key={index} aktivtOrgnummer={organisasjonsnummer} inntekt={inntekt} />
                    ))}
                </Table.Body>
                <tfoot>
                    <Table.Row>
                        <Table.DataCell>
                            <Bold>Total</Bold>
                        </Table.DataCell>
                        <Table.DataCell>
                            <Bold>{somPenger(vilkårsgrunnlag.omregnetArsinntekt)}</Bold>
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell>
                            <Bold>Sykepengegrunnlag</Bold>
                        </Table.DataCell>
                        <Table.DataCell>
                            <Bold>{somPenger(vilkårsgrunnlag.sykepengegrunnlag)}</Bold>
                        </Table.DataCell>
                    </Table.Row>
                </tfoot>
            </Table>
        </div>
    );
};

interface InfotrygdInntektProps {
    aktivtOrgnummer: string;
    inntekt: Arbeidsgiverinntekt;
}

const InfotrygdInntekt = ({ aktivtOrgnummer, inntekt }: InfotrygdInntektProps): ReactElement => {
    const arbeidsgivernavn = useArbeidsgiver(inntekt.arbeidsgiver)?.navn;
    return (
        <Table.Row
            className={classNames(
                styles.arbeidsgiverrad,
                aktivtOrgnummer === inntekt.arbeidsgiver && styles.ergjeldende,
            )}
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
};
