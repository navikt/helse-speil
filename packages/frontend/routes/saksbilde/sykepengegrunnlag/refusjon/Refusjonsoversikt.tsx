import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Refusjonsopplysning } from '@io/http';

import { Refusjonslinje } from './Refusjonslinje';

import styles from './Refusjonsoversikt.module.css';

interface RefusjonProps {
    refusjon: Refusjonsopplysning[];
}

export const Refusjonsoversikt: React.FC<RefusjonProps> = ({ refusjon }) => {
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
                            <BodyShort size="small">Refusjonsbeløp</BodyShort>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {refusjon.map((refusjonsopplysning, i) => (
                        <Refusjonslinje
                            key={i}
                            dato={refusjonsopplysning.fom}
                            beløp={refusjonsopplysning.beløp}
                            kilde={refusjonsopplysning.kilde}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
