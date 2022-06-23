declare type Extension = {
    code: number;
    field: string;
};

declare type UUID = string;

declare type Oppgave = {
    tildelt?: string;
    erRetur?: boolean;
    erPåVent?: boolean;
    erBeslutter?: boolean;
    tidligereSaksbehandler?: UUID;
};
