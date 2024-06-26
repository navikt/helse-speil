import { useEffect } from 'react';
import { atom, useResetRecoilState } from 'recoil';

import { Kildetype } from '@io/graphql';
import { DokumenthendelseObject } from '@typer/historikk';

import { ÅpnedeDokumenter } from './Dokumenthendelse';

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

export const openedDocument = atom<ÅpnedeDokumenter[]>({
    key: 'openedDocuments',
    default: [],
});

export const useResetOpenedDocuments = () => {
    const resetOpenedDocuments = useResetRecoilState(openedDocument);
    useEffect(() => {
        resetOpenedDocuments();
    }, [resetOpenedDocuments]);
};
