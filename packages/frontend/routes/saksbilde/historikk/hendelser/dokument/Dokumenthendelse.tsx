import React, { useEffect, useState } from 'react';

import { Kilde } from '@components/Kilde';
import { Kildetype } from '@io/graphql';
import { useCurrentPerson } from '@state/person';

import { ExpandableHistorikkContent } from '../ExpandableHistorikkContent';
import { Hendelse } from '../Hendelse';
import { HendelseDate } from '../HendelseDate';
import { Inntektsmeldingsinnhold } from './Inntektsmeldingsinnhold';
import { Søknadsinnhold } from './Søknadsinnhold';

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
    const [showDokumenter, setShowDokumenter] = useState(false);
    const [dokument, setDokument] = useState<React.ReactNode>(null);
    const fødselsnummer = useCurrentPerson()?.fodselsnummer;

    useEffect(() => {
        if (!showDokumenter || !fødselsnummer) return;

        if (dokumenttype === 'Søknad') {
            setDokument(<Søknadsinnhold dokumentId={dokumentId} fødselsnummer={fødselsnummer} />);
        }

        if (dokumenttype === 'Inntektsmelding') {
            setDokument(<Inntektsmeldingsinnhold dokumentId={dokumentId} fødselsnummer={fødselsnummer} />);
        }
    }, [showDokumenter]);

    return (
        <Hendelse
            title={`${dokumenttype} mottatt`}
            icon={<Kilde type={getKildetype(dokumenttype)}>{getKildetekst(dokumenttype)}</Kilde>}
        >
            {(dokumenttype === 'Søknad' || dokumenttype === 'Inntektsmelding') && (
                <ExpandableHistorikkContent onOpen={setShowDokumenter}>{dokument}</ExpandableHistorikkContent>
            )}
            <HendelseDate timestamp={timestamp} />
        </Hendelse>
    );
};
