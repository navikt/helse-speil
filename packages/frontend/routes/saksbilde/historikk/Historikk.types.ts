import { ReactNode } from 'react';

export enum Hendelsetype {
    Dokument,
    Historikk,
}

export type Hendelse = {
    id: string;
    title: ReactNode;
    type: Hendelsetype;
    timestamp?: DateString;
    body?: ReactNode;
    icon?: ReactNode;
};

export type Filter = (hendelse: Hendelse) => boolean;
