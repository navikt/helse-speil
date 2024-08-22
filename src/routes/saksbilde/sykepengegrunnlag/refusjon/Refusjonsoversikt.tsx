import React, { ReactElement } from 'react';

import { BodyShort, Table } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
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
        <div className={styles.Refusjonsoversikt}>
            <div className={styles.Header}>
                <div className={styles.Tittel}>
                    <Bold>Refusjon</Bold>
                </div>
            </div>
            <Table className={styles.Table}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>
                            <BodyShort size="small">Fra og med dato</BodyShort>
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            <BodyShort size="small">Månedlig refusjon</BodyShort>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {refusjonIVisning.map((refusjonsopplysning, i) => (
                        <Refusjonslinje
                            key={i}
                            dato={refusjonsopplysning.fom}
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
        </div>
    );
};
