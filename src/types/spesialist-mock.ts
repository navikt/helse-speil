import { Maybe } from '@io/graphql';

export type Extension = {
    code: number;
    [field: string]: string | object | number;
};

export type UUID = string;

export type Oppgave = {
    id: string;
    erPåVent: boolean;
    tildelt?: Maybe<string>;
    totrinnsvurdering?: Maybe<Totrinnsvurdering>;
};

export type Totrinnsvurdering = {
    saksbehandler?: Maybe<string>;
    beslutter?: Maybe<string>;
    erBeslutteroppgave: boolean;
    erRetur: boolean;
};
