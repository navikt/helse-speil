import React from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';

import { Endringstrekant } from '@components/Endringstrekant';
import { Kilde } from '@components/Kilde';
import { ApiKildetype } from '@io/rest/generated/spesialist.schemas';

import styles from './RefusjonSkjema/RefusjonSkjema.module.scss';

interface RefusjonKildeProps {
    kilde: ApiKildetype;
    harLokaleOpplysninger: boolean;
    harEndringer: boolean;
}

export const RefusjonKilde = ({ kilde, harLokaleOpplysninger, harEndringer }: RefusjonKildeProps) => (
    <div className={styles.refusjonsopplysninger}>
        {kilde === ApiKildetype.INNTEKTSMELDING && <Kilde type="Inntektsmelding">IM</Kilde>}
        {kilde === ApiKildetype.SAKSBEHANDLER &&
            (harLokaleOpplysninger && harEndringer ? (
                <div style={{ position: 'relative', width: '20px' }}>
                    <Endringstrekant />
                </div>
            ) : (
                <Kilde type="Saksbehandler">
                    <PersonPencilFillIcon title="Saksbehandler ikon" height={12} width={12} />
                </Kilde>
            ))}
    </div>
);
