import { Kilde } from '@components/Kilde';

import { Kildetype } from '@io/graphql';
import React from 'react';

import { Hendelse } from './Hendelse';

const getKildetype = (dokumenttype: DokumenthendelseObject['dokumenttype']): Kildetype => {
    switch (dokumenttype) {
        case 'Inntektsmelding': {
            return Kildetype.Inntektsmelding;
        }
        case 'Sykmelding': {
            return Kildetype.Sykmelding;
        }
        case 'Søknad': {
            return Kildetype.Soknad;
        }
    }
};

const getKildetekst = (dokumenttype: DokumenthendelseObject['dokumenttype']): string => {
    switch (dokumenttype) {
        case 'Inntektsmelding': {
            return 'IM';
        }
        case 'Sykmelding': {
            return 'SM';
        }
        case 'Søknad': {
            return 'SØ';
        }
    }
};

interface DokumenthendelseProps extends Omit<DokumenthendelseObject, 'type' | 'id'> {}

export const Dokumenthendelse: React.FC<DokumenthendelseProps> = ({ dokumenttype, timestamp }) => {
    return (
        <Hendelse
            title={`${dokumenttype} mottatt`}
            timestamp={timestamp}
            icon={<Kilde type={getKildetype(dokumenttype)}>{getKildetekst(dokumenttype)}</Kilde>}
        />
    );
};
