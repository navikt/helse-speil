export type Vedlegg = {
    navn: string;
    url: string;
};

export type Dialogmelding = {
    tittel: string;
    innehold: string;
    tid: string;
    fraNav: boolean;
    vedlegg: Vedlegg[];
};

export type Dialog = {
    id: string;
    tittel: string;
    tid: string;
    dialogmeldinger: Dialogmelding[];
};

export type BehandlerDialoger = {
    behandlernavn: string;
    dialoger: Dialog[];
};
