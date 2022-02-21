import React, { useState } from 'react';
import dayjs from 'dayjs';
import { BodyShort } from '@navikt/ds-react';

import { Refusjon, Refusjonsperiode } from '@io/graphql';
import { EditButton } from '@components/EditButton';
import { Kilde } from '@components/Kilde';
import { Bold } from '@components/Bold';

import { Refusjonslinje } from './Refusjonslinje';
import { useRefusjonsendringer } from './useRefusjonsendringer';

import styles from './Refusjonsoversikt.module.css';

const canEditRefusjon = false;

interface RefusjonProps {
    refusjon: Refusjon;
}

export const Refusjonsoversikt: React.VFC<RefusjonProps> = ({ refusjon }) => {
    const [isEditing, setIsEditing] = useState(false);

    const sorterteEndringer = useRefusjonsendringer(refusjon);

    return (
        <div className={styles.Refusjonsoversikt}>
            <div className={styles.Header}>
                <div className={styles.Tittel}>
                    <Bold>Refusjon</Bold>
                    <Kilde type="Inntektsmelding">IM</Kilde>
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
                    {refusjon.sisteRefusjonsdag && <Refusjonslinje dato={refusjon.sisteRefusjonsdag} />}
                    {sorterteEndringer.map((endring, i) => (
                        <Refusjonslinje key={i} dato={endring.dato} beløp={endring.belop} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
