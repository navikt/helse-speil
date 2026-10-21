import { ReactElement } from 'react';

import { ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { DokumenthendelseObject } from '@typer/historikk';

import { InntektHentetFraAordningenhendelse } from './InntektHentetFraAordningenhendelse';
import { InntektsmeldingMottatthendelse } from './InntektsmeldingMottatthendelse';
import { MeldingOmVedtakhendelse } from './MeldingOmVedtakhendelse';
import { SykmeldingMottatthendelse } from './SykmeldingMottatthendelse';
import { SøknadMottatthendelse } from './SøknadMottatthendelse';

interface DokumentHendelseProps {
    hendelse: DokumenthendelseObject;
    person: ApiSaksbildePerson;
}

export function DokumentHendelse({ hendelse, person }: DokumentHendelseProps): ReactElement | null {
    switch (hendelse.dokumenttype) {
        case 'Vedtak':
            return (
                <MeldingOmVedtakhendelse
                    dokumentId={hendelse.dokumentId ?? undefined}
                    fødselsnummer={person.fodselsnummer}
                    timestamp={hendelse.timestamp}
                />
            );
        case 'Søknad':
            return <SøknadMottatthendelse dokumentId={hendelse.dokumentId ?? ''} timestamp={hendelse.timestamp} />;
        case 'Inntektsmelding':
            return (
                <InntektsmeldingMottatthendelse
                    dokumentId={hendelse.dokumentId ?? ''}
                    person={person}
                    timestamp={hendelse.timestamp}
                />
            );
        case 'Sykmelding':
            return <SykmeldingMottatthendelse timestamp={hendelse.timestamp} />;
        case 'InntektHentetFraAordningen':
            return <InntektHentetFraAordningenhendelse timestamp={hendelse.timestamp} />;
        default:
            return null;
    }
}
