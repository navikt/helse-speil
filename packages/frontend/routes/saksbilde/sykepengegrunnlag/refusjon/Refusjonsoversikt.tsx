import React, { useState } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { EditButton } from '@components/EditButton';
import { Kilde } from '@components/Kilde';
import { Kildetype, Refusjon } from '@io/graphql';
import { getFormattedDateString } from '@utils/date';

import { Refusjonslinje } from './Refusjonslinje';
import { useRefusjonsendringer } from './useRefusjonsendringer';

import styles from './Refusjonsoversikt.module.css';

const canEditRefusjon = false;

interface RefusjonProps {
    refusjon: Refusjon;
}

export const Refusjonsoversikt: React.FC<RefusjonProps> = ({ refusjon }) => {
    const [isEditing, setIsEditing] = useState(false);

    const sorterteEndringer = useRefusjonsendringer(refusjon);

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
            {refusjon.sisteRefusjonsdag && (
                <div className={styles.SisteRefusjonsdag}>
                    {`Siste dag med refusjon: ${getFormattedDateString(refusjon.sisteRefusjonsdag)}`}
                </div>
            )}
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
                    {sorterteEndringer.map((endring, i) => (
                        <Refusjonslinje key={i} dato={endring.dato} beløp={endring.belop} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
