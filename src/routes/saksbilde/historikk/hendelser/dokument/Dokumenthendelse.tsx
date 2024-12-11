import React, { ReactElement } from 'react';

import { Kilde } from '@components/Kilde';
import { PersonFragment } from '@io/graphql';
import { EnkelHendelse } from '@saksbilde/historikk/hendelser/EnkelHendelse';
import { DokumenthendelseObject } from '@typer/historikk';

import { getKildetekst, getKildetype } from './dokument';

import styles from './Dokumenthendelse.module.scss';

type DokumenthendelseProps = Omit<DokumenthendelseObject, 'type' | 'id'> & {
    person: PersonFragment;
};

const dokumenttypetittel = (
    type: 'Inntektsmelding' | 'Sykmelding' | 'Søknad' | 'Vedtak' | 'InntektHentetFraAordningen',
) => {
    switch (type) {
        case 'Inntektsmelding':
        case 'Sykmelding':
        case 'Søknad':
        case 'Vedtak':
            return type + ' mottatt';
        case 'InntektHentetFraAordningen':
            return 'Inntekt hentet fra A-ordningen';
    }
};

export const Dokumenthendelse = ({ dokumenttype, timestamp }: DokumenthendelseProps): ReactElement => (
    <EnkelHendelse
        title={
            <span className={styles.header}>
                <span>{dokumenttypetittel(dokumenttype)}</span>
            </span>
        }
        icon={<Kilde type={getKildetype(dokumenttype)}>{getKildetekst(dokumenttype)}</Kilde>}
        timestamp={timestamp}
    />
);
