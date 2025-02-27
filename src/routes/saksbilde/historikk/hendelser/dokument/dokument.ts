import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { DokumenthendelseObject } from '@typer/historikk';

export type Kildetype =
    | 'InntektHentetFraAordningen'
    | 'Inntektsmelding'
    | 'Sykmelding'
    | 'Soknad'
    | 'Saksbehandler'
    | 'Ukjent';

export const getKildetype = (dokumenttype: DokumenthendelseObject['dokumenttype']): Kildetype => {
    switch (dokumenttype) {
        case 'InntektHentetFraAordningen':
            return 'InntektHentetFraAordningen';
        case 'Inntektsmelding':
            return 'Inntektsmelding';
        case 'Sykmelding':
            return 'Sykmelding';
        case 'Søknad':
            return 'Soknad';
        default:
            return 'Ukjent';
    }
};

export const getKildetekst = (dokumenttype: DokumenthendelseObject['dokumenttype']): string => {
    switch (dokumenttype) {
        case 'InntektHentetFraAordningen':
            return 'AO';
        case 'Inntektsmelding':
            return 'IM';
        case 'Sykmelding':
            return 'SM';
        case 'Søknad':
            return 'SØ';
        case 'Vedtak':
            return 'MV';
    }
};

export const useOpenedDocuments = () => useAtomValue(openedDocumentState);

export const useAddOpenedDocument = () => {
    const setOpenedDocuments = useSetAtom(openedDocumentState);
    return (dokument: Dokument) => {
        setOpenedDocuments((åpnedeDokumenter) => [...åpnedeDokumenter, dokument]);
    };
};

export const useRemoveOpenedDocument = () => {
    const setOpenedDocuments = useSetAtom(openedDocumentState);
    return (dokumentId: string) => {
        setOpenedDocuments((prevState) => prevState.filter((item) => item.dokumentId !== dokumentId));
    };
};

export const useResetOpenedDocuments = () => {
    const setOpenedDocuments = useSetAtom(openedDocumentState);
    useEffect(() => {
        setOpenedDocuments([]);
    }, [setOpenedDocuments]);
};

interface Dokument {
    dokumentId: string;
    fødselsnummer: string;
    dokumenttype: 'Inntektsmelding' | 'Sykmelding' | 'Søknad' | 'Vedtak' | 'InntektHentetFraAordningen';
    timestamp: string;
}

const openedDocumentState = atom<Dokument[]>([]);
