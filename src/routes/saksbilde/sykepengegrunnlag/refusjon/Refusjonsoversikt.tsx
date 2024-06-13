import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

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
            <table className={styles.Table}>
                <thead>
                    <tr>
                        <th>
                            <BodyShort size="small">Fra og med dato</BodyShort>
                        </th>
                        <th>
                            <BodyShort size="small">Månedlig refusjon</BodyShort>
                        </th>
                    </tr>
                </thead>
                <tbody>
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
                </tbody>
            </table>
        </div>
    );
};
