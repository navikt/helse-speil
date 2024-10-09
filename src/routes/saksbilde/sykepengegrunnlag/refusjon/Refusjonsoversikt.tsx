import React, { ReactElement } from 'react';

import { BodyShort, Box, Label, Table } from '@navikt/ds-react';

import { Refusjonsopplysning } from '@typer/overstyring';

import { Refusjonslinje } from './Refusjonslinje';

import styles from './Refusjonsoversikt.module.css';

interface RefusjonProps {
    refusjon: Refusjonsopplysning[];
    lokaleRefusjonsopplysninger: Refusjonsopplysning[];
}

export const Refusjonsoversikt = ({ refusjon, lokaleRefusjonsopplysninger }: RefusjonProps): ReactElement => {
    const refusjonIVisning = lokaleRefusjonsopplysninger.length > 0 ? lokaleRefusjonsopplysninger : refusjon;
    return (
        <Box marginBlock="6">
            <Label size="small">Refusjon</Label>
            <Table className={styles.Table} size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>
                            <BodyShort>Fra og med dato</BodyShort>
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            <BodyShort>Til og med dato</BodyShort>
                        </Table.HeaderCell>
                        <Table.HeaderCell align="right">
                            <BodyShort>Refusjonsbeløp</BodyShort>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {refusjonIVisning.map((refusjonsopplysning, i) => (
                        <Refusjonslinje
                            key={i}
                            fom={refusjonsopplysning.fom}
                            tom={refusjonsopplysning.tom ?? undefined}
                            beløp={refusjonsopplysning.beløp}
                            kilde={refusjonsopplysning.kilde}
                            lokalEndring={
                                lokaleRefusjonsopplysninger.length > 0 &&
                                JSON.stringify(lokaleRefusjonsopplysninger[i]) !== JSON.stringify(refusjon[i])
                            }
                        />
                    ))}
                </Table.Body>
            </Table>
        </Box>
    );
};
