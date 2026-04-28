import { atom } from 'jotai';

export const valgtDialogAtom = atom<Dialog | null>(null);

export type Vedlegg = {
    navn: string;
    url: string;
};

export type Dialogmelding = {
    tittel: string;
    innehold: string;
    tid: Date;
    fraNav: boolean;
    vedlegg: Vedlegg[];
};

export type Dialog = {
    tittel: string;
    tid: Date;
    dialogmeldinger: Dialogmelding[];
};

export type BehandlerDialoger = {
    behandlernavn: string;
    dialoger: Dialog[];
};
