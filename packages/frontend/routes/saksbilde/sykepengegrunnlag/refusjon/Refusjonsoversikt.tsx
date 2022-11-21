import React, { useState } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { EditButton } from '@components/EditButton';
import { Kilde } from '@components/Kilde';
import { Arbeidsgiverrefusjon, Kildetype } from '@io/graphql';

import { Refusjonslinje } from './Refusjonslinje';

import styles from './Refusjonsoversikt.module.css';

const canEditRefusjon = false;

interface RefusjonProps {
    refusjon: Arbeidsgiverrefusjon;
}

export const Refusjonsoversikt: React.FC<RefusjonProps> = ({ refusjon }) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className={styles.Refusjonsoversikt}>
            <div className={styles.Header}>
                <div className={styles.Tittel}>
                    <Bold>Refusjon</Bold>
                    <Kilde type={Kildetype.Inntektsmelding}>IM</Kilde>
                </div>
                {canEditRefusjon && (
                    <EditButton
                        isOpen={isEditing}
                        openText="Avbryt"
                        closedText="Revurder"
                        onOpen={() => setIsEditing(true)}
                        onClose={() => setIsEditing(false)}
                    />
                )}
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
                    {refusjon.refusjonsopplysninger.map((refusjonselement, i) => (
                        <Refusjonslinje key={i} dato={refusjonselement.fom} beløp={refusjonselement.belop} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
