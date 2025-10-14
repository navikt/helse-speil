export type Extension = {
    code: number;
    [field: string]: string | object | number;
};

export type UUID = string;

export type Oppgave = {
    id: string;
    erPåVent: boolean;
    tildelt?: string | null;
    totrinnsvurdering?: Totrinnsvurdering | null;
};

export type Totrinnsvurdering = {
    saksbehandler?: string | null;
    beslutter?: string | null;
    erBeslutteroppgave: boolean;
    erRetur: boolean;
};
