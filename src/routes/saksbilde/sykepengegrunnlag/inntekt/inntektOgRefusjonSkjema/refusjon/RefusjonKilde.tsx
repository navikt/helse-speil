import React from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';

import { Endringstrekant } from '@components/Endringstrekant';
import { Kilde } from '@components/Kilde';
import { Kildetype } from '@io/graphql';

import styles from './RefusjonSkjema/RefusjonSkjema.module.scss';

interface RefusjonKildeProps {
    kilde: Kildetype;
    harLokaleOpplysninger: boolean;
    harEndringer: boolean;
}

export const RefusjonKilde = ({ kilde, harLokaleOpplysninger, harEndringer }: RefusjonKildeProps) => (
    <div className={styles.refusjonsopplysninger}>
        {kilde === Kildetype.Inntektsmelding && <Kilde type={kilde}>IM</Kilde>}
        {kilde === Kildetype.Saksbehandler &&
            (harLokaleOpplysninger && harEndringer ? (
                <div style={{ position: 'relative', width: '20px' }}>
                    <Endringstrekant />
                </div>
            ) : (
                <Kilde type={kilde}>
                    <PersonPencilFillIcon title="Saksbehandler ikon" height={12} width={12} />
                </Kilde>
            ))}
    </div>
);
