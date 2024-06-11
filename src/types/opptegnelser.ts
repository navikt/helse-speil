export type OpptegnelseType =
    | 'UTBETALING_ANNULLERING_FEILET'
    | 'FERDIGBEHANDLET_GODKJENNINGSBEHOV'
    | 'UTBETALING_ANNULLERING_OK'
    | 'NY_SAKSBEHANDLEROPPGAVE'
    | 'REVURDERING_FERDIGBEHANDLET'
    | 'REVURDERING_AVVIST'
    | 'PERSONDATA_OPPDATERT';

export type Opptegnelse = {
    aktørId: number;
    sekvensnummer: number;
    type: OpptegnelseType;
    payload: string;
};
