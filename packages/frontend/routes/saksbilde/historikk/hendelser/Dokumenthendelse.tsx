import React from 'react';

import { Kilde } from '@components/Kilde';
import { Kildetype } from '@io/graphql';
import { skalViseDokumenter } from '@utils/featureToggles';

import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';
import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';

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

type DokumenthendelseProps = Omit<DokumenthendelseObject, 'type' | 'id'>;

export const Dokumenthendelse: React.FC<DokumenthendelseProps> = ({ dokumenttype, timestamp, dokumentId }) => {
    return (
        <Hendelse
            title={`${dokumenttype} mottatt`}
            icon={<Kilde type={getKildetype(dokumenttype)}>{getKildetekst(dokumenttype)}</Kilde>}
        >
            {skalViseDokumenter && dokumenttype === 'Søknad' && (
                <ExpandableHistorikkContent>
                    <p>Her kan du se søknaden som ble sendt inn: {dokumentId}.</p>
                </ExpandableHistorikkContent>
            )}
            <HendelseDate timestamp={timestamp} />
        </Hendelse>
    );
};
