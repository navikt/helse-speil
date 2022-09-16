declare type Extension = {
    code: number;
    field: string;
};

declare type UUID = string;

declare type Oppgave = {
    tildelt?: Maybe<string>;
    erRetur?: boolean;
    erPåVent?: boolean;
    erBeslutter?: boolean;
    tidligereSaksbehandler?: UUID;
};
