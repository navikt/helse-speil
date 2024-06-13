import { atom } from 'recoil';

import { DokumenthendelseObject } from '@/routes/saksbilde/historikk/types';
import { Kildetype } from '@io/graphql';

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
    }
};

export const openedDocument = atom<ÅpnedeDokumenter[]>({
    key: 'openedDocuments',
    default: [],
});
