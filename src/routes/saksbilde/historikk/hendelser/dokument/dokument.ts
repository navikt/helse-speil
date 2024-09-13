import { useEffect } from 'react';
import { atom, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';

import { Kildetype } from '@io/graphql';
import { DokumenthendelseObject } from '@typer/historikk';

export const getKildetype = (dokumenttype: DokumenthendelseObject['dokumenttype']): Kildetype => {
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
        default:
            return Kildetype.Ukjent;
    }
};

export const getKildetekst = (dokumenttype: DokumenthendelseObject['dokumenttype']): string => {
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
        case 'Vedtak': {
            return 'MV';
        }
    }
};

export const useOpenedDocuments = () => useRecoilValue(openedDocument);

export const useAddOpenedDocument = () => {
    const setOpenedDocuments = useSetRecoilState(openedDocument);
    return (dokument: ÅpnedeDokumenter) => {
        setOpenedDocuments((åpnedeDokumenter) => [...åpnedeDokumenter, dokument]);
    };
};

export const useRemoveOpenedDocument = () => {
    const setOpenedDocuments = useSetRecoilState(openedDocument);
    return (dokumentId: string) => {
        setOpenedDocuments((prevState) => prevState.filter((item) => item.dokumentId !== dokumentId));
    };
};

export const useResetOpenedDocuments = () => {
    const resetOpenedDocuments = useResetRecoilState(openedDocument);
    useEffect(() => {
        resetOpenedDocuments();
    }, [resetOpenedDocuments]);
};

interface ÅpnedeDokumenter {
    dokumentId: string;
    fødselsnummer: string;
    dokumenttype: 'Inntektsmelding' | 'Sykmelding' | 'Søknad' | 'Vedtak';
    timestamp: string;
}

const openedDocument = atom<ÅpnedeDokumenter[]>({
    key: 'openedDocuments',
    default: [],
});
