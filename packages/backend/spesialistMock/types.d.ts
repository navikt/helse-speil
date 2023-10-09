declare type Extension = {
    code: number;
    [field: string]: any;
};

declare type UUID = string;

declare type Oppgave = {
    id: string;
    erPåVent: boolean;
    tildelt?: Maybe<string>;
    kanAvvises: boolean;
    totrinnsvurdering?: Maybe<Totrinnsvurdering>;
};

declare type Totrinnsvurdering = {
    saksbehandler?: Maybe<string>;
    beslutter?: Maybe<string>;
    erBeslutteroppgave: boolean;
    erRetur: boolean;
};
