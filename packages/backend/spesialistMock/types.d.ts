declare type Extension = {
    code: number;
    [field: string]: string | object | number;
};

declare type UUID = string;

declare type Oppgave = {
    id: string;
    erPåVent: boolean;
    tildelt?: Maybe<string>;
    totrinnsvurdering?: Maybe<Totrinnsvurdering>;
};

declare type Totrinnsvurdering = {
    saksbehandler?: Maybe<string>;
    beslutter?: Maybe<string>;
    erBeslutteroppgave: boolean;
    erRetur: boolean;
};
