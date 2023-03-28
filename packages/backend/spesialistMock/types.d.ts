declare type Extension = {
    code: number;
    [field: string]: any;
};

declare type UUID = string;

declare type Oppgave = {
    id: string;
    erRetur: boolean;
    erPåVent: boolean;
    erBeslutter: boolean;
    tidligereSaksbehandler?: UUID;
    trengerTotrinnsvurdering: boolean;
    tildelt?: Maybe<string>;
};
