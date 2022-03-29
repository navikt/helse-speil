import React, { useState } from 'react';
import { BodyShort } from '@navikt/ds-react';

import { Kildetype, Refusjon } from '@io/graphql';
import { EditButton } from '@components/EditButton';
import { Kilde } from '@components/Kilde';
import { Bold } from '@components/Bold';

import { Refusjonslinje } from './Refusjonslinje';
import { useRefusjonsendringer } from './useRefusjonsendringer';

import styles from './Refusjonsoversikt.module.css';
import { NORSK_DATOFORMAT } from '@utils/date';
import styled from '@emotion/styled';

const canEditRefusjon = false;

const SisteRefusjonsdag = styled.div`
    margin-top: 12px;
    margin-bottom: 17px;
`;

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
                <SisteRefusjonsdag>
                    {`Siste dag med refusjon: ${dayjs(refusjon.sisteRefusjonsdag).format(NORSK_DATOFORMAT)}`}
                </SisteRefusjonsdag>
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
